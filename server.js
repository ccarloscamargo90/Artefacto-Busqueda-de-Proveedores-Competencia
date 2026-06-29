// Servidor de producción para Render (u otro host de servidor persistente).
// Sirve el frontend compilado (dist/) y expone /api/anthropic como proxy que
// inyecta la API key desde la variable de entorno ANTHROPIC_API_KEY.
// Endurecido contra abuso del proxy: allowlist de modelo, tope de max_tokens,
// rate limit por IP y autenticación opcional (HTTP Basic) si defines APP_PASSWORD.
import express from "express";
import path from "path";
import crypto from "crypto";
import pg from "pg";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set("trust proxy", 1); // Render va detrás de un proxy: usar la IP real (X-Forwarded-For)

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const APP_PASSWORD = process.env.APP_PASSWORD;        // si se define, exige login en toda la app
const APP_USER = process.env.APP_USER || "equipo";    // usuario para el login (opcional)
const ALLOWED_MODELS = ["claude-sonnet-4-6"];         // modelos permitidos vía el proxy
const MAX_TOKENS_CAP = 8000;                          // tope de tokens de salida por request

// Cabeceras básicas de seguridad
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// Autenticación opcional (HTTP Basic): si APP_PASSWORD está definida, protege TODO
// (la app y el proxy). El navegador pedirá usuario/contraseña una vez.
function safeEq(a, b) {
  const ba = Buffer.from(String(a)), bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}
if (APP_PASSWORD) {
  app.use((req, res, next) => {
    const m = (req.headers.authorization || "").match(/^Basic (.+)$/);
    if (m) {
      const idx = Buffer.from(m[1], "base64").toString().indexOf(":");
      const u = Buffer.from(m[1], "base64").toString().slice(0, idx);
      const p = Buffer.from(m[1], "base64").toString().slice(idx + 1);
      if (safeEq(u, APP_USER) && safeEq(p, APP_PASSWORD)) return next();
    }
    res.setHeader("WWW-Authenticate", 'Basic realm="Supplier Scout"');
    return res.status(401).send("Autenticación requerida.");
  });
}

// Rate limit simple en memoria, por IP, para el proxy
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 40;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) { hits.set(ip, { count: 1, reset: now + WINDOW_MS }); return false; }
  rec.count++;
  return rec.count > MAX_HITS;
}

// Proxy a la API de Anthropic (con allowlist de modelo y tope de max_tokens)
app.post("/api/anthropic", express.json({ limit: "1mb" }), async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ type: "error", error: { message: "Falta ANTHROPIC_API_KEY en las variables de entorno del servidor." } });
  }
  if (rateLimited(req.ip)) {
    return res.status(429).json({ type: "error", error: { message: "Demasiadas solicitudes. Espera unos minutos." } });
  }
  const body = req.body && typeof req.body === "object" ? req.body : {};
  if (!ALLOWED_MODELS.includes(body.model)) body.model = ALLOWED_MODELS[0];
  const mt = Number(body.max_tokens);
  body.max_tokens = !Number.isFinite(mt) || mt <= 0 ? MAX_TOKENS_CAP : Math.min(mt, MAX_TOKENS_CAP);
  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    if (!upstream.ok) {
      console.error("Anthropic upstream error", upstream.status, text.slice(0, 500));
      const msg = upstream.status === 429 ? "Demasiadas solicitudes a la IA. Espera un momento." : "La API de IA devolvió un error. Reintenta.";
      return res.status(upstream.status).json({ type: "error", error: { message: msg } });
    }
    res.status(upstream.status).type("application/json").send(text);
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(502).json({ type: "error", error: { message: "No se pudo contactar la API de Anthropic." } });
  }
});

// --- Almacenamiento compartido opcional (Postgres) ---
// Si DATABASE_URL está definida, el repositorio/competencia se guarda en la base
// de datos y lo comparte todo el equipo. Si no, el cliente usa localStorage.
let pool = null, dbReady = false;
const KV_KEY_RE = /^intergranel-[a-z0-9-]+$/; // solo las claves de la app
async function initDb() {
  if (!process.env.DATABASE_URL) return;
  pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 5 });
  pool.on("error", (e) => { console.error("pg pool idle error:", e.message); dbReady = false; });
  try {
    await pool.query("CREATE TABLE IF NOT EXISTS kv (key text PRIMARY KEY, value text NOT NULL, updated_at timestamptz DEFAULT now())");
    dbReady = true;
    console.log("Base de datos conectada: almacenamiento compartido ACTIVO.");
  } catch (e) {
    dbReady = false;
    console.error("No se pudo inicializar la base de datos; se usará localStorage por navegador:", e.message);
  }
}
initDb();

app.get("/api/kv/:key", async (req, res) => {
  if (!dbReady) return res.json({ shared: false });
  if (!KV_KEY_RE.test(req.params.key)) return res.status(400).json({ shared: false, error: "clave no permitida" });
  try {
    const r = await pool.query("SELECT value FROM kv WHERE key=$1", [req.params.key]);
    res.json({ shared: true, value: r.rows[0] ? r.rows[0].value : null });
  } catch (e) { console.error("kv get:", e.message); res.json({ shared: false }); }
});
app.put("/api/kv/:key", express.json({ limit: "6mb" }), async (req, res) => {
  if (!dbReady) return res.json({ shared: false });
  if (!KV_KEY_RE.test(req.params.key)) return res.status(400).json({ shared: false, error: "clave no permitida" });
  const value = req.body && typeof req.body.value === "string" ? req.body.value : null;
  if (value == null) return res.status(400).json({ shared: false, error: "value requerido" });
  try {
    await pool.query("INSERT INTO kv(key,value,updated_at) VALUES($1,$2,now()) ON CONFLICT(key) DO UPDATE SET value=$2, updated_at=now()", [req.params.key, value]);
    res.json({ shared: true });
  } catch (e) { console.error("kv put:", e.message); res.json({ shared: false }); }
});

// Frontend compilado + fallback SPA
const distDir = path.join(__dirname, "dist");
app.get("/favicon.ico", (_req, res) => res.status(204).end());
app.use(express.static(distDir));
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

app.listen(PORT, () => {
  console.log(`Supplier Scout escuchando en http://localhost:${PORT}`);
  if (!APP_PASSWORD && API_KEY) console.warn("ADVERTENCIA: sin APP_PASSWORD la app y el proxy /api/anthropic quedan ABIERTOS (cualquiera puede gastar tu API key). Define APP_PASSWORD para exigir login.");
});
