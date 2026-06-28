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

## Cómo seguir desarrollándolo

Tal cual, este archivo es un componente de artefacto de Claude. Para convertirlo en una
app que corra por tu cuenta hay que adaptar dos cosas que el entorno de artefactos provee
de forma automática:

1. **Almacenamiento** — reemplazar `window.storage.get/set` por `localStorage`
   (o un backend) para que el repositorio persista fuera del artefacto.
2. **Llamadas a la IA** — la función `callClaude` hace `fetch` directo a
   `https://api.anthropic.com/v1/messages` *sin* clave de API (el entorno de artefactos lo
   autentica solo). Fuera de ahí necesitas una **API key de Anthropic** y, por seguridad,
   un pequeño backend/proxy que la guarde (no exponer la clave en el navegador).

Si quieres, el siguiente paso es montar el proyecto como una app Vite + React + Tailwind
lista para correr (`npm install` / `npm run dev`) con esas dos adaptaciones ya hechas.

## Estructura

```
src/SupplierScout.tsx   Componente principal (export default SupplierScout)
README.md               Este archivo
```
