// Capa de almacenamiento.
// - Dentro del artefacto de Claude.ai, window.storage ya existe → no se toca.
// - Self-hosteado (local/Render): si el servidor tiene base de datos (DATABASE_URL),
//   guarda ahí y lo comparte todo el equipo; si no, usa localStorage del navegador.
const SELF_HOSTED = typeof __SELF_HOSTED__ !== "undefined" && __SELF_HOSTED__;

const localGet = (key: string) => { const v = localStorage.getItem(key); return v == null ? null : { value: v }; };
const localSet = (key: string, value: string) => { localStorage.setItem(key, value); };

if (typeof window !== "undefined" && !(window as any).storage) {
  (window as any).storage = {
    get: async (key: string) => {
      if (SELF_HOSTED) {
        try {
          const r = await fetch(`/api/kv/${encodeURIComponent(key)}`);
          if (r.ok) { const j = await r.json(); if (j && j.shared) return j.value == null ? null : { value: j.value }; }
        } catch (_) {}
      }
      return localGet(key);
    },
    set: async (key: string, value: string) => {
      if (SELF_HOSTED) {
        try {
          const r = await fetch(`/api/kv/${encodeURIComponent(key)}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ value }),
          });
          if (r.ok) { const j = await r.json(); if (j && j.shared) return; }
        } catch (_) {}
      }
      localSet(key, value);
    },
  };
}

export {};
