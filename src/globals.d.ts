// Declaraciones de ambiente para el typecheck (tsc). No afectan el runtime.

// Bandera inyectada en build por Vite (define). Dentro del artefacto de Claude.ai no
// existe; por eso el código siempre la consulta con `typeof __SELF_HOSTED__ !== "undefined"`.
declare const __SELF_HOSTED__: boolean;

// Almacenamiento que provee el artefacto de Claude.ai (o el shim en self-hosted).
interface Window {
  storage?: {
    get: (key: string) => Promise<{ value: string } | null>;
    set: (key: string, value: string) => Promise<unknown>;
  };
}
