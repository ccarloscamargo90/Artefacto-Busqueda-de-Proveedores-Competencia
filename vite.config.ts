import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Proxy de desarrollo: el navegador llama a /api/anthropic (mismo origen, sin CORS),
// y este middleware reenvía a la API de Anthropic inyectando tu ANTHROPIC_API_KEY
// desde el archivo .env. Así la clave nunca queda expuesta en el navegador.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      {
        name: "anthropic-proxy",
        configureServer(server) {
          server.middlewares.use("/api/anthropic", (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end("Method Not Allowed");
              return;
            }
            const key = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
            if (!key) {
              res.statusCode = 500;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ type: "error", error: { message: "Falta ANTHROPIC_API_KEY. Copia .env.example a .env y pon tu clave." } }));
              return;
            }
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
              try {
                const upstream = await fetch("https://api.anthropic.com/v1/messages", {
                  method: "POST",
                  headers: {
                    "content-type": "application/json",
                    "x-api-key": key,
                    "anthropic-version": "2023-06-01",
                  },
                  body,
                });
                const text = await upstream.text();
                res.statusCode = upstream.status;
                res.setHeader("content-type", "application/json");
                res.end(text);
              } catch (e) {
                res.statusCode = 502;
                res.setHeader("content-type", "application/json");
                res.end(JSON.stringify({ type: "error", error: { message: "No se pudo contactar la API de Anthropic: " + String(e) } }));
              }
            });
          });
        },
      },
    ],
  };
});
