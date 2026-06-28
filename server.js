// Servidor de producción para Render (u otro host de servidor persistente).
// Sirve el frontend compilado (dist/) y expone /api/anthropic como proxy que
// inyecta la API key desde la variable de entorno ANTHROPIC_API_KEY.
// Así la clave vive en el servidor y nunca llega al navegador.
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

// Proxy a la API de Anthropic
app.post("/api/anthropic", express.json({ limit: "4mb" }), async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      type: "error",
      error: { message: "Falta ANTHROPIC_API_KEY en las variables de entorno del servidor." },
    });
  }
  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const text = await upstream.text();
    res.status(upstream.status).type("application/json").send(text);
  } catch (e) {
    res.status(502).json({
      type: "error",
      error: { message: "No se pudo contactar la API de Anthropic: " + String(e) },
    });
  }
});

// Frontend compilado + fallback SPA
const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

app.listen(PORT, () => console.log(`Supplier Scout escuchando en http://localhost:${PORT}`));
