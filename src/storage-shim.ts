// Reemplazo de window.storage (que Claude.ai provee dentro del artefacto) por localStorage,
// para que el repositorio de proveedores y competidores persista al correr en local.
// Si window.storage ya existe (entorno de artefacto), no se toca nada.
if (typeof window !== "undefined" && !(window as any).storage) {
  (window as any).storage = {
    get: async (key: string) => {
      const value = localStorage.getItem(key);
      return value == null ? null : { value };
    },
    set: async (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
  };
}

export {};
