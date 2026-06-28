# Supplier Scout · TIPAT

Artefacto de **Megacostales / Ganaplus** para abastecimiento (sourcing), repositorio de
proveedores e inteligencia de competencia en el mercado mexicano de costalería y sacos
de polipropileno (PP).

El código fuente original fue creado como artefacto en una conversación de Claude.ai.
Este repositorio es ahora su **hogar permanente**: aquí no hay límite de longitud de
conversación, así que puedes seguir iterándolo sin riesgo de perderlo.

## Qué hace

Componente React (`src/SupplierScout.tsx`) con tres módulos en pestañas:

1. **Buscar** — encuentra fabricantes reales de los 12 países del TIPAT/CPTPP
   (saco PP tejido, big bag/FIBC, tela PP, resina PP), con búsqueda web en tiempo real,
   filtros por país/specs/MOQ/certificaciones, y comparación contra un *benchmark*
   (tu proveedor actual): deltas de precio, origen y logística.
   - **Mapa mundial** (vista Lista/Mapa): ubica a cada proveedor sobre el mapa,
     coloreado por país y dimensionado por score.
   - **Puerto más cercano**: para cada proveedor se calcula el puerto de exportación
     más cercano (base curada de puertos del bloque TIPAT) con su distancia en km;
     en el mapa se dibuja una línea al puerto. Se incluye en la tarjeta y en el CSV.
2. **Repositorio** — guarda proveedores, marca potencial/contactado, añade notas y
   exporta a CSV (con puerto cercano, distancia y coordenadas). Persiste en el
   almacenamiento del artefacto.
3. **Competencia MX** — busca y evalúa competidores mexicanos con un *Índice de Fuerza
   Competitiva* (tamaño, alcance, integración, catálogo, web, sofisticación), los clasifica
   en Tiers A/B/C, los muestra en lista o sobre un mapa de México y exporta a CSV.
   - **Más resultados y teléfonos**: hasta 8 empresas por búsqueda, con prioridad
     máxima en extraer el teléfono de contacto.
   - **Distancias a tu planta**: eliges tu estado/planta y se calcula la distancia de
     cada competidor; el mapa marca tu planta con anillos de 250/500/1000 km.
   - **Filtros y exportación**: filtro "solo con teléfono" + tier/segmento/estado, y
     CSV con la columna de distancia a tu planta.

## ⚠️ Importante: tus datos guardados NO están en este código

El código (lo que ves aquí) es solo la aplicación. **Los proveedores y competidores que
guardaste dentro del artefacto** viven en el almacenamiento del navegador donde corría el
artefacto (`window.storage`, claves `intergranel-supplier-repo-v1` e
`intergranel-competitors-mx-v1`). Copiar el código **no** mueve esos datos.

Antes de dejar de usar el artefacto original, **exporta tus datos** desde la propia app
con los botones **CSV** que ya tiene:

- Pestaña **Repositorio** → botón **CSV** (`repositorio_proveedores_tipat.csv`)
- Pestaña **Competencia MX** → botón **CSV** (`competencia_mx_scoring.csv`)
- Pestaña **Buscar** → botón **CSV** exporta los resultados de la búsqueda actual

Guarda esos archivos en un lugar seguro (o en este repo). Así no pierdes el trabajo
acumulado aunque el artefacto original deje de estar disponible.

## Cómo correrlo en local

Ya está montado como app **Vite + React + Tailwind**. Para correrlo en tu máquina:

1. Instala [Node.js](https://nodejs.org) 18 o superior.
2. En la carpeta del proyecto:
   ```bash
   npm install
   ```
3. Crea tu archivo de clave: copia `.env.example` a `.env` y pega tu **API key de
   Anthropic** (la sacas en https://console.anthropic.com → Settings → API Keys):
   ```bash
   cp .env.example .env
   # luego edita .env y pon: ANTHROPIC_API_KEY=sk-ant-...
   ```
   El `.env` está en `.gitignore`, así que tu clave **no** se sube al repo.
4. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre la URL que imprime (normalmente http://localhost:5173).

> Las búsquedas usan tu API key de Anthropic, así que **tienen un costo por uso** de la API
> (es de pago por tokens). Revisa tus límites/saldo en la consola de Anthropic.

### Cómo funciona (las dos piezas que Claude.ai daba gratis)

- **Almacenamiento:** `src/storage-shim.ts` reemplaza `window.storage` por `localStorage`,
  así tu repositorio y competidores persisten en el navegador. (Si pegas el archivo de vuelta
  en un artefacto de Claude.ai, el shim no se activa y usa el almacenamiento del artefacto.)
- **Llamadas a la IA:** en `localhost`, `callClaude` llama a `/api/anthropic`, un proxy del
  servidor de desarrollo (`vite.config.ts`) que reenvía a la API de Anthropic inyectando tu
  `ANTHROPIC_API_KEY`. Así la clave nunca queda expuesta en el navegador. Fuera de localhost
  (p. ej. dentro de un artefacto de Claude.ai) llama directo, como antes.

### Build / despliegue

`npm run build` genera la carpeta `dist/` lista para servir. **Ojo:** el proxy `/api/anthropic`
solo existe en el servidor de desarrollo. Para publicarlo en internet (Vercel/Netlify) hay que
crear una *serverless function* que haga ese mismo reenvío con la API key — dímelo y lo armo.

## Estructura

```
index.html              Punto de entrada HTML
src/main.tsx            Arranque de React (carga el shim de storage)
src/SupplierScout.tsx   Componente principal (export default SupplierScout)
src/storage-shim.ts     window.storage → localStorage (para correr fuera del artefacto)
src/index.css           Directivas de Tailwind
vite.config.ts          Config de Vite + proxy /api/anthropic (inyecta la API key)
tailwind.config.js      Config de Tailwind
.env.example            Plantilla para tu ANTHROPIC_API_KEY (copiar a .env)
README.md               Este archivo
```
