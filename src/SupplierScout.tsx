import { useState, useEffect, useRef } from "react";
import { Search, Package, MapPin, Globe, Mail, Phone, ExternalLink, Download, Check, Loader2, AlertTriangle, Anchor, ShieldCheck, Building2, ChevronDown, Factory, Target, TrendingDown, TrendingUp, RotateCw, FileBadge, Bookmark, BookmarkCheck, Trash2, Database, Inbox, Swords, Tag, Map, List, Gauge, Navigation, Crosshair, Upload, Sparkles, X, Copy, Wand2, Plus } from "lucide-react";

const PRODUCT_TYPES = [
  { id: "saco_pp", label: "Saco PP tejido", query: "polypropylene woven bags / PP sacks manufacturer" },
  { id: "fibc", label: "Big Bag (FIBC)", query: "FIBC big bags / jumbo bags manufacturer" },
  { id: "tela_pp", label: "Tela PP", query: "PP woven fabric / tarpaulin manufacturer" },
  { id: "resina_pp", label: "Resina PP", query: "polypropylene resin / PP granules supplier" },
];
const COUNTRIES = [
  { id: "all", label: "Todos (TIPAT)" }, { id: "vietnam", label: "Vietnam" }, { id: "malaysia", label: "Malasia" },
  { id: "mexico", label: "México" }, { id: "peru", label: "Perú" }, { id: "chile", label: "Chile" },
  { id: "japan", label: "Japón" }, { id: "singapore", label: "Singapur" }, { id: "australia", label: "Australia" },
  { id: "newzealand", label: "Nueva Zelanda" }, { id: "canada", label: "Canadá" }, { id: "uk", label: "Reino Unido" }, { id: "brunei", label: "Brunéi" },
];
const ALL_TIPAT = "Australia, Brunéi, Canadá, Chile, Japón, Malasia, México, Nueva Zelanda, Perú, Singapur, Reino Unido, Vietnam";
const CERTS = ["Origen TIPAT", "ISO 9001", "ISO 14001", "BRC", "FSC", "SGS", "FDA"];
const STORAGE_KEY = "intergranel-supplier-repo-v1";
const KEY_COMP = "intergranel-competitors-mx-v1";

const MX_STATES = [
  { n: "Aguascalientes", lat: 21.88, lng: -102.29, a: ["aguascalientes"] },
  { n: "Baja California Sur", lat: 25.0, lng: -111.7, a: ["baja california sur", "bcs", "la paz", "los cabos"] },
  { n: "Baja California", lat: 30.4, lng: -115.5, a: ["baja california", "tijuana", "mexicali", "ensenada"] },
  { n: "Campeche", lat: 19.0, lng: -90.5, a: ["campeche"] },
  { n: "Chiapas", lat: 16.5, lng: -92.5, a: ["chiapas", "tuxtla"] },
  { n: "Chihuahua", lat: 28.6, lng: -106.0, a: ["chihuahua", "ciudad juarez", "juarez"] },
  { n: "Coahuila", lat: 27.3, lng: -101.7, a: ["coahuila", "saltillo", "torreon"] },
  { n: "Colima", lat: 19.1, lng: -103.9, a: ["colima", "manzanillo"] },
  { n: "Ciudad de México", lat: 19.43, lng: -99.13, a: ["ciudad de mexico", "cdmx", "distrito federal", "mexico city"] },
  { n: "Durango", lat: 24.5, lng: -104.7, a: ["durango"] },
  { n: "Guanajuato", lat: 21.0, lng: -101.2, a: ["guanajuato", "leon", "irapuato", "celaya", "acambaro", "salamanca", "silao"] },
  { n: "Guerrero", lat: 17.6, lng: -99.6, a: ["guerrero", "acapulco", "chilpancingo"] },
  { n: "Hidalgo", lat: 20.5, lng: -98.7, a: ["hidalgo", "pachuca"] },
  { n: "Jalisco", lat: 20.6, lng: -103.5, a: ["jalisco", "guadalajara", "zapopan", "tlaquepaque", "tlajomulco", "el salto"] },
  { n: "Estado de México", lat: 19.35, lng: -99.7, a: ["estado de mexico", "edomex", "edo mex", "toluca", "ecatepec", "naucalpan", "tlalnepantla", "cuautitlan"] },
  { n: "Michoacán", lat: 19.4, lng: -101.7, a: ["michoacan", "morelia", "uruapan"] },
  { n: "Morelos", lat: 18.7, lng: -99.1, a: ["morelos", "cuernavaca", "jiutepec"] },
  { n: "Nayarit", lat: 21.7, lng: -104.9, a: ["nayarit", "tepic"] },
  { n: "Nuevo León", lat: 25.65, lng: -100.2, a: ["nuevo leon", "monterrey", "san pedro", "apodaca", "guadalupe", "santa catarina", "garcia"] },
  { n: "Oaxaca", lat: 17.0, lng: -96.7, a: ["oaxaca"] },
  { n: "Puebla", lat: 19.0, lng: -97.9, a: ["puebla"] },
  { n: "Querétaro", lat: 20.6, lng: -100.4, a: ["queretaro", "el marques"] },
  { n: "Quintana Roo", lat: 19.6, lng: -88.3, a: ["quintana roo", "cancun", "chetumal", "playa del carmen"] },
  { n: "San Luis Potosí", lat: 22.5, lng: -100.6, a: ["san luis potosi", "slp"] },
  { n: "Sinaloa", lat: 25.0, lng: -107.5, a: ["sinaloa", "culiacan", "mazatlan", "los mochis"] },
  { n: "Sonora", lat: 29.3, lng: -110.9, a: ["sonora", "hermosillo", "obregon", "nogales"] },
  { n: "Tabasco", lat: 18.0, lng: -92.9, a: ["tabasco", "villahermosa"] },
  { n: "Tamaulipas", lat: 24.5, lng: -98.6, a: ["tamaulipas", "reynosa", "matamoros", "tampico", "nuevo laredo", "altamira"] },
  { n: "Tlaxcala", lat: 19.4, lng: -98.2, a: ["tlaxcala"] },
  { n: "Veracruz", lat: 19.4, lng: -96.6, a: ["veracruz", "xalapa", "jalapa", "coatzacoalcos", "cordoba", "orizaba"] },
  { n: "Yucatán", lat: 20.8, lng: -89.0, a: ["yucatan", "merida"] },
  { n: "Zacatecas", lat: 23.0, lng: -102.6, a: ["zacatecas", "fresnillo"] },
];
const SEG_COLORS = [
  { key: "fabric", label: "Fabricante", color: "#ef4444" },
  { key: "import", label: "Importador", color: "#f59e0b" },
  { key: "distrib", label: "Distribuidor", color: "#0ea5e9" },
  { key: "comerc", label: "Comercializador", color: "#a3a3a3" },
  { key: "other", label: "Otro", color: "#737373" },
];
const MX_MAINLAND = [[32.62, -114.72], [31.33, -111.07], [31.78, -106.48], [29.30, -100.90], [27.50, -99.51], [25.84, -97.50], [22.27, -97.86], [19.20, -96.14], [18.15, -94.43], [18.65, -91.80], [19.85, -90.53], [21.30, -89.66], [21.62, -87.08], [19.60, -87.45], [18.51, -88.30], [17.82, -89.14], [16.07, -90.44], [14.54, -92.23], [15.86, -95.20], [16.86, -99.89], [17.96, -102.20], [19.06, -104.32], [20.62, -105.23], [23.19, -106.42], [25.79, -109.04], [27.92, -110.90], [31.30, -113.55]];
const MX_BAJA = [[32.53, -117.12], [31.86, -116.62], [29.95, -115.80], [27.50, -114.50], [24.50, -111.80], [22.89, -109.92], [24.16, -110.31], [25.50, -111.10], [28.00, -112.90], [30.50, -114.20], [31.80, -114.80]];

// Puertos de exportación relevantes en los países del TIPAT/CPTPP (para "puerto más cercano")
const PORTS = [
  { name: "Haiphong", country: "Vietnam", lat: 20.86, lng: 106.68 },
  { name: "Cat Lai (HCMC)", country: "Vietnam", lat: 10.76, lng: 106.79 },
  { name: "Cai Mep", country: "Vietnam", lat: 10.52, lng: 107.02 },
  { name: "Da Nang", country: "Vietnam", lat: 16.07, lng: 108.22 },
  { name: "Port Klang", country: "Malasia", lat: 3.00, lng: 101.39 },
  { name: "Tanjung Pelepas", country: "Malasia", lat: 1.36, lng: 103.55 },
  { name: "Penang", country: "Malasia", lat: 5.41, lng: 100.34 },
  { name: "Singapur", country: "Singapur", lat: 1.26, lng: 103.83 },
  { name: "Tokio", country: "Japón", lat: 35.62, lng: 139.78 },
  { name: "Yokohama", country: "Japón", lat: 35.45, lng: 139.66 },
  { name: "Kobe", country: "Japón", lat: 34.68, lng: 135.21 },
  { name: "Nagoya", country: "Japón", lat: 35.05, lng: 136.86 },
  { name: "Sídney", country: "Australia", lat: -33.85, lng: 151.21 },
  { name: "Melbourne", country: "Australia", lat: -37.84, lng: 144.92 },
  { name: "Brisbane", country: "Australia", lat: -27.38, lng: 153.17 },
  { name: "Fremantle", country: "Australia", lat: -32.05, lng: 115.74 },
  { name: "Auckland", country: "Nueva Zelanda", lat: -36.84, lng: 174.77 },
  { name: "Tauranga", country: "Nueva Zelanda", lat: -37.64, lng: 176.18 },
  { name: "Lyttelton", country: "Nueva Zelanda", lat: -43.60, lng: 172.72 },
  { name: "Vancouver", country: "Canadá", lat: 49.29, lng: -123.11 },
  { name: "Prince Rupert", country: "Canadá", lat: 54.31, lng: -130.32 },
  { name: "Montreal", country: "Canadá", lat: 45.50, lng: -73.55 },
  { name: "Halifax", country: "Canadá", lat: 44.65, lng: -63.57 },
  { name: "Manzanillo", country: "México", lat: 19.05, lng: -104.31 },
  { name: "Lázaro Cárdenas", country: "México", lat: 17.96, lng: -102.17 },
  { name: "Veracruz", country: "México", lat: 19.20, lng: -96.13 },
  { name: "Altamira", country: "México", lat: 22.50, lng: -97.91 },
  { name: "Ensenada", country: "México", lat: 31.85, lng: -116.62 },
  { name: "Callao", country: "Perú", lat: -12.05, lng: -77.14 },
  { name: "Paita", country: "Perú", lat: -5.09, lng: -81.11 },
  { name: "San Antonio", country: "Chile", lat: -33.59, lng: -71.61 },
  { name: "Valparaíso", country: "Chile", lat: -33.04, lng: -71.63 },
  { name: "San Vicente", country: "Chile", lat: -36.73, lng: -73.12 },
  { name: "Felixstowe", country: "Reino Unido", lat: 51.96, lng: 1.33 },
  { name: "Southampton", country: "Reino Unido", lat: 50.90, lng: -1.40 },
  { name: "London Gateway", country: "Reino Unido", lat: 51.51, lng: 0.43 },
  { name: "Muara", country: "Brunéi", lat: 5.02, lng: 115.07 },
];
const COUNTRY_META = {
  vietnam: { label: "Vietnam", lat: 16.2, lng: 107.9, color: "#ef4444" },
  malaysia: { label: "Malasia", lat: 3.6, lng: 101.9, color: "#f59e0b" },
  mexico: { label: "México", lat: 23.6, lng: -102.5, color: "#10b981" },
  peru: { label: "Perú", lat: -9.2, lng: -75.0, color: "#06b6d4" },
  chile: { label: "Chile", lat: -35.0, lng: -71.0, color: "#3b82f6" },
  japan: { label: "Japón", lat: 36.5, lng: 138.2, color: "#a855f7" },
  singapore: { label: "Singapur", lat: 1.35, lng: 103.8, color: "#ec4899" },
  australia: { label: "Australia", lat: -25.3, lng: 133.8, color: "#eab308" },
  newzealand: { label: "N. Zelanda", lat: -41.5, lng: 172.5, color: "#14b8a6" },
  canada: { label: "Canadá", lat: 58.0, lng: -106.0, color: "#f97316" },
  uk: { label: "Reino Unido", lat: 54.0, lng: -2.5, color: "#8b5cf6" },
  brunei: { label: "Brunéi", lat: 4.5, lng: 114.7, color: "#84cc16" },
};
// Contornos simplificados de continentes (lat,lng) para el mapa mundial — referencia visual aproximada
const WORLD_LAND = [
  [[70,-141],[69,-128],[71,-117],[68,-95],[70,-85],[64,-78],[60,-94],[57,-92],[51,-80],[55,-79],[62,-78],[58,-68],[53,-79],[49,-67],[45,-60],[43,-66],[40,-74],[35,-76],[30,-81],[25,-80],[28,-83],[30,-88],[29,-95],[26,-97],[21,-97],[18,-94],[16,-95],[20,-106],[23,-110],[27,-114],[31,-117],[34,-120],[40,-124],[46,-124],[49,-125],[54,-130],[58,-137],[60,-141]],
  [[12,-71],[11,-64],[8,-60],[5,-52],[0,-50],[-2,-44],[-8,-35],[-13,-38],[-18,-39],[-23,-41],[-27,-48],[-33,-53],[-38,-58],[-41,-63],[-46,-67],[-50,-69],[-53,-68],[-55,-66],[-54,-72],[-48,-75],[-42,-74],[-37,-73],[-30,-71],[-23,-70],[-18,-70],[-14,-76],[-6,-81],[-2,-80],[2,-78],[7,-77],[9,-76],[11,-72]],
  [[37,-6],[37,10],[33,11],[31,20],[31,25],[30,32],[22,37],[12,43],[11,51],[2,46],[-5,40],[-15,40],[-22,35],[-26,33],[-34,26],[-34,18],[-29,16],[-22,14],[-15,12],[-6,12],[0,9],[4,9],[5,-2],[5,-8],[10,-15],[15,-17],[21,-17],[28,-13],[33,-9],[36,-6]],
  [[71,28],[70,20],[63,5],[58,5],[57,8],[54,8],[53,4],[51,3],[49,-2],[48,-5],[46,-2],[43,-2],[43,-9],[40,-9],[37,-9],[36,-6],[38,-1],[41,3],[43,7],[44,10],[40,18],[42,19],[40,24],[41,28],[45,29],[46,31],[47,38],[50,40],[60,40],[66,33],[69,30]],
  [[58,-5],[57,-2],[56,-3],[55,-1],[54,0],[52,2],[51,1],[51,-1],[50,-5],[51,-5],[53,-5],[54,-4],[55,-5],[56,-6]],
  [[66,33],[73,75],[75,105],[70,135],[66,178],[60,165],[55,160],[50,158],[55,140],[50,142],[45,135],[40,128],[35,126],[34,122],[31,122],[30,121],[25,119],[22,114],[20,109],[16,108],[10,106],[9,104],[8,100],[6,100],[2,103],[6,98],[10,98],[14,98],[16,94],[21,92],[22,89],[20,86],[15,80],[10,80],[8,77],[12,75],[19,73],[23,68],[25,66],[27,57],[26,53],[30,48],[37,49],[42,48],[40,41],[44,35],[48,40],[55,40],[60,40]],
  [[45,142],[43,145],[41,141],[38,141],[35,140],[34,136],[33,132],[31,130],[33,129],[35,133],[36,137],[38,138],[41,140],[43,141]],
  [[-11,142],[-14,145],[-18,146],[-24,153],[-28,153],[-34,151],[-38,147],[-39,144],[-38,140],[-35,137],[-32,134],[-34,123],[-35,118],[-33,115],[-28,114],[-22,114],[-18,122],[-15,125],[-14,130],[-12,131],[-11,136],[-13,141]],
  [[-34,173],[-37,175],[-39,177],[-41,175],[-39,174],[-37,174],[-35,173]],
  [[-40,172],[-43,173],[-46,170],[-46,167],[-44,168],[-41,171]],
  [[7,117],[4,118],[1,118],[-2,116],[-4,114],[-3,110],[1,109],[4,109]],
  [[6,95],[3,98],[-1,101],[-5,104],[-6,105],[-3,101],[0,98],[4,96]],
];
function haversineKm(lat1, lng1, lat2, lng2) { const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLng = (lng2 - lng1) * Math.PI / 180; const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.min(1, Math.sqrt(a))); }
function countryKey(c) { const n = norm(c); if (!n) return null; if (n.includes("vietnam")) return "vietnam"; if (n.includes("malasia") || n.includes("malaysia")) return "malaysia"; if (n.includes("mexico")) return "mexico"; if (n.includes("peru")) return "peru"; if (n.includes("chile")) return "chile"; if (n.includes("japon") || n.includes("japan")) return "japan"; if (n.includes("singap")) return "singapore"; if (n.includes("australia")) return "australia"; if (n.includes("zeland") || n.includes("zelanda")) return "newzealand"; if (n.includes("canad")) return "canada"; if (n.includes("reino unido") || n.includes("united kingdom") || n === "uk" || n.includes("britain") || n.includes("ingla")) return "uk"; if (n.includes("brunei")) return "brunei"; return null; }
function getSupplierCoords(s) { const la = num(s.lat), ln = num(s.lng); if (la !== null && ln !== null && !(la === 0 && ln === 0) && la >= -60 && la <= 75 && ln >= -180 && ln <= 180) return { lat: la, lng: ln, approx: false }; const k = countryKey(s.country); if (k && COUNTRY_META[k]) return { lat: COUNTRY_META[k].lat, lng: COUNTRY_META[k].lng, approx: true }; return null; }
function nearestPortOf(lat, lng) { let best = null; for (const p of PORTS) { const d = haversineKm(lat, lng, p.lat, p.lng); if (!best || d < best.dist) best = { port: p, dist: d }; } return best; }
function supplierNearestPort(s) { const co = getSupplierCoords(s); if (!co) return null; const np = nearestPortOf(co.lat, co.lng); return np ? { ...np, approx: co.approx } : null; }

// MEMORIA DEL AGENTE — industrias y productos objetivo (saco de polipropileno) para
// ENFOCAR las búsquedas y evaluaciones. Fuente única de verdad (reutilizable en UI).
const INDUSTRIES = [
  { name: "Agricultura y granos", products: "granos y semillas, café/cacao, frutas y hortalizas" },
  { name: "Fertilizantes y agroquímicos", products: "fertilizante granulado, abonos, agroquímicos sólidos" },
  { name: "Construcción", products: "cemento/mortero, cal/yeso, agregados, escombro" },
  { name: "Alimentos (consumo humano)", products: "azúcar/sal, harinas/cereales, legumbres/arroz" },
  { name: "Alimento balanceado y pecuario", products: "ganado/aves/cerdos, pet food, acuacultura" },
  { name: "Minería y químicos", products: "minerales/concentrados, sal industrial, químicos en polvo/granulado" },
  { name: "Reciclaje y manejo de materiales", products: "acopio, plásticos/PET/scrap" },
  { name: "Empaque a granel (Big Bag / FIBC)", products: "big bags estándar y especiales (liner, baffle, ventilado, antiestático)" },
  { name: "Tela, rafia y cubiertas PP", products: "tela PP en rollo, lonas/tarpaulin, rafia/hilo" },
];
const PRODUCT_FORMS = "saco PP tejido, laminado/BOPP, con válvula, boca abierta, leno/malla (raschel), Big Bag/FIBC, tela PP en rollo, rafia/hilo, lona/tarpaulin";
const FOCUS_PROMPT = `ENFOQUE DE NEGOCIO (Megacostales / Ganaplus): el producto eje es el SACO DE POLIPROPILENO (PP) para múltiples industrias. Industrias y aplicaciones objetivo — ${INDUSTRIES.map((i) => `${i.name}: ${i.products}`).join("; ")}. Formatos de producto: ${PRODUCT_FORMS}. Usa SIEMPRE estas industrias y formatos para ENFOCAR la búsqueda y la evaluación, e identifica a qué industrias/segmentos de esta lista sirve cada empresa.`;

const SYSTEM_PROMPT = `Eres un investigador de abastecimiento (sourcing) industrial especializado en proveedores de los países miembros del TIPAT/CPTPP. Encuentras FABRICANTES REALES y verificables usando la herramienta de búsqueda web.

${FOCUS_PROMPT}

REGLA ABSOLUTA ANTI-ALUCINACIÓN:
- Solo incluye un proveedor si encontraste evidencia web real con URL verificable de tus búsquedas.
- NUNCA inventes empresas, contactos, capacidades, precios ni URLs.
- Si un dato no aparece en las fuentes, escribe "no disponible". No supongas.
- Cada proveedor DEBE tener sourceUrl con URL real.
- indicativeFobUsd: precio FOB por unidad en USD SOLO si aparece en fuente pública. Si no, "no disponible". Jamás estimes precios.

country: país del fabricante; DEBE ser uno de los 12 miembros del TIPAT/CPTPP (${ALL_TIPAT}).
lat, lng: coordenadas decimales aproximadas de la fábrica o ciudad del fabricante (lng negativo en América; p.ej. Haiphong lat 20.86 lng 106.68). Si no las sabes con certeza, usa las de la ciudad o el país. Si aun así no, 0.
cptppOrigin: "sí" si hay indicio de exportación bajo preferencia CPTPP o elegibilidad de origen CPTPP; "no" si no; "desconocido" si no hay info.
affinityScore entero (0-100) según coincidencia con: producto, país, specs, MOQ y certificaciones.

IMPORTANTE: Responde un JSON CORTO. Máximo 8 proveedores. Solo el objeto JSON, sin markdown. Estructura:
{"suppliers":[{"company":"","country":"","city":"","province":"","lat":0,"lng":0,"nearestPort":"","products":[""],"estimatedCapacity":"","certifications":[""],"cptppOrigin":"","indicativeFobUsd":"","website":"","email":"","phone":"","sourceUrl":"","affinityScore":0,"scoreRationale":""}],"searchSummary":""}

Devuelve hasta 8 proveedores reales. Si país específico, todos de ese país. Si "todos", prioriza variedad y hubs de PP (Vietnam, Malasia, México). Sé conciso.`;

const COMP_SYSTEM_PROMPT = `Eres un analista de inteligencia competitiva del mercado MEXICANO de costales y sacos de polipropileno (PP). Encuentras y EVALÚAS empresas mexicanas reales que compiten en ese mercado, usando la herramienta de búsqueda web.

${FOCUS_PROMPT}

REGLA ABSOLUTA ANTI-ALUCINACIÓN:
- Solo incluye una empresa si hay evidencia web real con URL verificable.
- NUNCA inventes empresas, teléfonos, contactos, precios, coordenadas ni URLs.
- Si un dato no aparece, escribe "no disponible". No supongas.
- Cada empresa DEBE tener sourceUrl con URL real. PRIORIDAD MÁXIMA: EXTRAER EL TELÉFONO de contacto (busca en su sitio, directorios, Google Maps, redes). Devuelve el teléfono en formato local con lada.
- priceNote: precio público por costal/saco SOLO si aparece en fuente. Si no, "no disponible".

segment: "fabricante", "importador", "distribuidor" o "comercializador". state: estado de México. city: ciudad.
lat, lng: coordenadas decimales aproximadas en México (lng negativo, p.ej. lat 25.67 lng -100.31 Monterrey). Si no tienes certeza usa las del estado/ciudad; si no sabes, 0.

EVALUACIÓN — califica cada dimensión de 0 a 100 con base en la EVIDENCIA WEB. Si no hay evidencia suficiente, asigna un valor conservador (bajo), NO inventes alto:
- scaleSize: tamaño/escala (presencia, capacidad aparente, plantas/sucursales, antigüedad, menciones).
- webQuality: calidad y profesionalismo del sitio (completitud, diseño, info de producto, actualización).
- catalogBreadth: amplitud del catálogo/portafolio.
- geoReach: alcance geográfico (local≈20, regional≈45, nacional≈75, exportador≈95).
- commercialSoph: sofisticación comercial (tienda en línea, cotización web, marketplaces, redes).
scoreNote: 1 frase justificando la evaluación.

IMPORTANTE: JSON CORTO. Máximo 8 empresas. Solo el objeto JSON, sin markdown. Estructura:
{"competitors":[{"company":"","segment":"","state":"","city":"","lat":0,"lng":0,"phone":"","website":"","email":"","products":[""],"priceNote":"","scaleSize":0,"webQuality":0,"catalogBreadth":0,"geoReach":0,"commercialSoph":0,"scoreNote":"","sourceUrl":"","note":""}],"searchSummary":""}

Devuelve hasta 8 empresas mexicanas reales. Evalúa con honestidad sobre evidencia. Sé conciso.`;

const OUTREACH_SYSTEM_PROMPT = `Eres un asistente de compras industriales. Redactas correos de contacto y solicitud de cotización (RFQ) a proveedores: profesionales, claros, concisos y listos para enviar. No inventes datos del proveedor ni del remitente más allá de lo dado. Devuelve SOLO un objeto JSON {"subject":"","body":""} sin markdown; el "body" usa saltos de línea reales y un cierre cordial con firma genérica.`;

const ENRICH_SYSTEM_PROMPT = `Eres un investigador de abastecimiento. Usando la herramienta de búsqueda web, ENRIQUECES la ficha de UN proveedor real: buscas contactos adicionales (email, teléfono, WhatsApp, persona de contacto, dirección), validas el sitio web oficial, y resumes capacidades, productos y certificaciones.
REGLA ABSOLUTA ANTI-ALUCINACIÓN: solo incluye datos con evidencia web real y verificable. Lo que no encuentres = "no disponible". NUNCA inventes contactos ni URLs. Incluye sourceUrl real.
Devuelve SOLO este JSON, sin markdown: {"email":"","phone":"","whatsapp":"","contactPerson":"","address":"","website":"","capabilities":"","products":[""],"certifications":[""],"sourceUrl":"","notes":""}`;

function scoreColor(s) { const n = Number(s) || 0; if (n >= 80) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"; if (n >= 60) return "bg-amber-500/15 text-amber-300 border-amber-500/30"; return "bg-neutral-500/15 text-neutral-300 border-neutral-600/40"; }
function originStyle(v) { const val = (v || "").toString().toLowerCase(); if (val.startsWith("s") || val === "yes") return { label: "Elegible TIPAT", icon: true, cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" }; if (val.startsWith("n") || val === "no") return { label: "Sin preferencia TIPAT", icon: false, cls: "bg-red-500/15 text-red-300 border-red-500/30" }; return { label: "TIPAT por confirmar", icon: false, cls: "bg-neutral-700/40 text-neutral-400 border-neutral-600/40" }; }
function segmentStyle(seg) { const s = (seg || "").toLowerCase(); if (s.includes("fabric")) return { label: "Fabricante", cls: "bg-red-500/15 text-red-300 border-red-500/30" }; if (s.includes("import")) return { label: "Importador", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" }; if (s.includes("distrib")) return { label: "Distribuidor", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" }; if (s.includes("comerc")) return { label: "Comercializador", cls: "bg-neutral-600/30 text-neutral-300 border-neutral-600/40" }; return { label: seg || "—", cls: "bg-neutral-700/40 text-neutral-400 border-neutral-600/40" }; }
function segKey(seg) { const s = (seg || "").toLowerCase(); if (s.includes("fabric")) return "fabric"; if (s.includes("import")) return "import"; if (s.includes("distrib")) return "distrib"; if (s.includes("comerc")) return "comerc"; return "other"; }
const isEmpty = (v) => !v || /^(no disponible|n\/a|null|desconocido)$/i.test(String(v).trim());
function normalizeUrl(u) { if (isEmpty(u)) return null; const s = String(u).trim(); return /^https?:\/\//i.test(s) ? s : `https://${s}`; }
function telHref(phone) { if (isEmpty(phone)) return null; const d = String(phone).replace(/[^\d+]/g, ""); return d ? `tel:${d}` : null; }
// Enlace a Google Maps con el lugar SEÑALADO (pin). Usa las coordenadas REALES del
// registro (o.lat/o.lng) — NUNCA el centroide del país/estado, que dejaría el pin en
// medio del país. Si no hay coordenadas, cae a una búsqueda por nombre + ubicación.
function gmapsUrl(o) {
  if (!o) return null;
  const la = num(o.lat), ln = num(o.lng);
  if (la !== null && ln !== null && !(la === 0 && ln === 0) && la >= -90 && la <= 90 && ln >= -180 && ln <= 180)
    return `https://www.google.com/maps/search/?api=1&query=${la},${ln}`;
  const q = [o.company, o.city, o.state, o.province, o.country].filter((x) => !isEmpty(x)).join(", ");
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
}
function openGmaps(o) { const u = gmapsUrl(o); if (u) window.open(u, "_blank", "noopener,noreferrer"); }
function firstNum(str) { const m = String(str || "").match(/[\d.]+/); return m ? parseFloat(m[0]) : null; }
function num(v) { const n = parseFloat(v); return Number.isFinite(n) ? n : null; }
function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); }
function portMatch(a, b) { if (!b || isEmpty(a)) return null; const k = b.toLowerCase().split(/[\s(/]/)[0].trim(); return k ? a.toLowerCase().includes(k) : null; }
function sameCountryAs(a, b) { if (isEmpty(a) || isEmpty(b)) return null; const k = b.toLowerCase().split(/[\s(/]/)[0].trim(); return k ? a.toLowerCase().includes(k) : null; }
function certMechanismFor(country) { if (isEmpty(country)) return null; if (country.toLowerCase().includes("vietnam")) return "Cert. emitido por autoridad (eCoSys/VCCI)"; return "Auto-certificación (exportador)"; }
function makeId(s) { const loc = (norm(isEmpty(s.country) ? "" : s.country) || norm(isEmpty(s.state) ? "" : s.state)); return `${norm(s.company).replace(/\s+/g, " ")}|${loc}`; }
// Separa marcadores que caen sobre (casi) el mismo píxel —típico cuando varios
// proveedores comparten el centroide de su país— abriéndolos en un anillo alrededor
// del punto común, para que no se encimen. Muta cada item.p (en píxeles proyectados).
function spreadOverlaps(placed, cell = 11) {
  const groups = {};
  placed.forEach((m) => { const k = Math.round(m.p[0] / cell) + "," + Math.round(m.p[1] / cell); (groups[k] || (groups[k] = [])).push(m); });
  Object.keys(groups).forEach((k) => {
    const g = groups[k];
    if (g.length < 2) return;
    const cx = g.reduce((s, m) => s + m.p[0], 0) / g.length;
    const cy = g.reduce((s, m) => s + m.p[1], 0) / g.length;
    const rmax = g.reduce((s, m) => Math.max(s, m.r || 4), 0);
    const R = rmax + 5 + g.length * 2.8; // radio del anillo: más separación para que no se toquen
    g.forEach((m, i) => { const a = (i / g.length) * 2 * Math.PI - Math.PI / 2; m.p = [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
  });
  return placed;
}
function getCoords(c) {
  const la = num(c.lat), ln = num(c.lng);
  if (la !== null && ln !== null && la > 10 && la < 35 && ln > -120 && ln < -85) return { lat: la, lng: ln, approx: false };
  const hay = norm(`${c.state || ""} ${c.city || ""}`);
  if (hay) { let best = null; for (const st of MX_STATES) for (const al of st.a) { if (hay.includes(al) && (!best || al.length > best.len)) best = { lat: st.lat, lng: st.lng, len: al.length }; } if (best) return { lat: best.lat, lng: best.lng, approx: true }; }
  return null;
}
function clamp100(v) { const n = Number(v); return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0; }
function verticalScore(seg) { const k = segKey(seg); return k === "fabric" ? 100 : k === "import" ? 70 : k === "distrib" ? 45 : k === "comerc" ? 35 : 40; }
function hasScores(c) { return ["scaleSize", "webQuality", "catalogBreadth", "geoReach", "commercialSoph"].some((k) => c[k] !== undefined && c[k] !== null && c[k] !== ""); }
function compositeScore(c) { const scale = clamp100(c.scaleSize), web = clamp100(c.webQuality), cat = clamp100(c.catalogBreadth), geo = clamp100(c.geoReach), comm = clamp100(c.commercialSoph), vert = verticalScore(c.segment); return Math.round(0.25 * scale + 0.20 * geo + 0.15 * vert + 0.15 * cat + 0.15 * web + 0.10 * comm); }
function tierOf(score) { if (score >= 70) return { key: "A", label: "Tier A · Amenaza alta", cls: "bg-red-500/15 text-red-300 border-red-500/30" }; if (score >= 45) return { key: "B", label: "Tier B · Sólido", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" }; return { key: "C", label: "Tier C · Menor", cls: "bg-neutral-600/30 text-neutral-300 border-neutral-600/40" }; }
function dimsOf(c) { return [{ label: "Tamaño", val: clamp100(c.scaleSize) }, { label: "Alcance", val: clamp100(c.geoReach) }, { label: "Integración", val: verticalScore(c.segment) }, { label: "Catálogo", val: clamp100(c.catalogBreadth) }, { label: "Web", val: clamp100(c.webQuality) }, { label: "Comercial", val: clamp100(c.commercialSoph) }]; }

function recoverArray(s, arrKey) {
  const key = s.indexOf(`"${arrKey}"`);
  if (key === -1) return null;
  const arrStart = s.indexOf("[", key);
  if (arrStart === -1) return null;
  const objs = []; let depth = 0, inStr = false, esc = false, objStart = -1;
  for (let i = arrStart + 1; i < s.length; i++) {
    const ch = s[i];
    if (inStr) { if (esc) esc = false; else if (ch === "\\") esc = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') { inStr = true; continue; }
    if (ch === "{") { if (depth === 0) objStart = i; depth++; }
    else if (ch === "}") { depth--; if (depth === 0 && objStart !== -1) { try { objs.push(JSON.parse(s.slice(objStart, i + 1))); } catch (_) {} objStart = -1; } }
    else if (ch === "]" && depth === 0) break;
  }
  if (objs.length === 0) return null;
  let summary = ""; const m = s.match(/"searchSummary"\s*:\s*"([^"]*)"/); if (m) summary = m[1];
  return { [arrKey]: objs, searchSummary: summary };
}
function robustParse(text, arrKey) {
  let s = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = s.indexOf("{"); if (start === -1) return null; s = s.slice(start);
  try { const end = s.lastIndexOf("}"); if (end !== -1) return JSON.parse(s.slice(0, end + 1)); } catch (_) {}
  return recoverArray(s, arrKey);
}
// En la app self-hosteada (local con Vite, o en Render/Vercel/etc.) __SELF_HOSTED__ se define en build
// y la llamada pasa por el proxy /api/anthropic, que inyecta la API key desde el servidor.
// Dentro del artefacto de Claude.ai esa bandera no existe, así que se llama directo, sin key, como antes.
const SELF_HOSTED = typeof __SELF_HOSTED__ !== "undefined" && __SELF_HOSTED__;
const ANTHROPIC_API_URL = SELF_HOSTED ? "/api/anthropic" : "https://api.anthropic.com/v1/messages";
// Mapea cada lista a su colección en el servidor (sincronización por-registro).
const COLL = { [STORAGE_KEY]: "repo", [KEY_COMP]: "competitors" };
// Lee la colección compartida del servidor. Devuelve { shared, records } o { shared:false }.
async function fetchCollection(name) {
  if (!SELF_HOSTED) return { shared: false };
  try {
    const r = await fetch(`/api/collection/${name}`);
    if (r.ok) { const j = await r.json(); if (j && j.shared) return { shared: true, records: Array.isArray(j.records) ? j.records : [] }; }
  } catch (_) {}
  return { shared: false };
}
// Envía upserts (registros tocados) y deletes (ids borrados) al servidor; fusión por id.
function syncCollection(name, upserts, deletes) {
  if (!SELF_HOSTED) return;
  if ((!upserts || !upserts.length) && (!deletes || !deletes.length)) return;
  fetch(`/api/collection/${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ upserts: upserts || [], deletes: deletes || [] }) }).catch(() => {});
}
// Diff entre el array previo y el nuevo: registros nuevos/cambiados y ids eliminados.
// Nota: `Map` está importado de lucide-react (el ícono) y NO es el Map global, así que
// aquí se usan un objeto plano y Set (que sí es global) para indexar por id.
function diffRecords(prev, next) {
  const prevById = Object.create(null);
  prev.forEach((r) => { if (r && r.id != null) prevById[r.id] = r; });
  const nextIds = new Set(next.map((r) => r.id));
  const upserts = next.filter((r) => { const p = prevById[r.id]; return !p || JSON.stringify(p) !== JSON.stringify(r); });
  const deletes = prev.filter((r) => !nextIds.has(r.id)).map((r) => r.id);
  return { upserts, deletes };
}
async function callClaude(systemPrompt, userPrompt, arrKey, maxTokens = 4000) {
  const res = await fetch(ANTHROPIC_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, system: systemPrompt, messages: [{ role: "user", content: userPrompt }], tools: [{ type: "web_search_20260209", name: "web_search" }] }) });
  let data; try { data = await res.json(); } catch (_) { throw new Error(`La API respondió ${res.status} y no se pudo leer. Reintenta.`); }
  if (data && (data.type === "error" || data.error)) throw new Error(data.error?.message || "La API devolvió un error. Reintenta.");
  if (!data || !Array.isArray(data.content)) throw new Error("Respuesta inesperada de la API. Reintenta.");
  const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  if (!text.trim()) throw new Error("La búsqueda no devolvió texto (tardó demasiado). Reintenta.");
  const parsed = robustParse(text, arrKey); const list = (parsed && parsed[arrKey]) || [];
  if (list.length === 0) throw new Error("La respuesta llegó incompleta o vacía. Reintenta o acota los criterios.");
  return { list, summary: (parsed && parsed.searchSummary) || "" };
}
async function callClaudeText(systemPrompt, userPrompt, maxTokens = 1500, useSearch = false) {
  const payload: any = { model: "claude-sonnet-4-6", max_tokens: maxTokens, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] };
  if (useSearch) payload.tools = [{ type: "web_search_20260209", name: "web_search" }];
  const res = await fetch(ANTHROPIC_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  let data; try { data = await res.json(); } catch (_) { throw new Error(`La API respondió ${res.status} y no se pudo leer. Reintenta.`); }
  if (data && (data.type === "error" || data.error)) throw new Error(data.error?.message || "La API devolvió un error. Reintenta.");
  if (!data || !Array.isArray(data.content)) throw new Error("Respuesta inesperada de la API. Reintenta.");
  const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  if (!text.trim()) throw new Error("La IA no devolvió texto. Reintenta.");
  return text;
}
function downloadCsv(rows, name) {
  const esc = (v) => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

// --- Importación de CSV (para rescatar datos exportados desde el artefacto) ---
function parseCsv(text) {
  if (text && text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const rows = []; let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else if (c !== "\r") field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => String(f).trim() !== ""));
}
function csvToObjects(text) {
  const rows = parseCsv(text); if (rows.length < 2) return [];
  const head = rows[0].map((h) => norm(h));
  return rows.slice(1).map((r) => { const o = {}; head.forEach((h, i) => { o[h] = r[i] != null ? String(r[i]).trim() : ""; }); return o; });
}
const splitList = (v) => String(v || "").split(/[;|]/).map((s) => s.trim()).filter(Boolean);
function mapRepoCsvRow(o) {
  return {
    company: o["empresa"] || "", country: o["pais"] || "", city: o["ciudad"] || "", province: o["provincia"] || "",
    nearestPort: o["puerto"] || o["puerto (ia)"] || "", lat: o["lat"] || "", lng: o["lng"] || "",
    indicativeFobUsd: o["fob usd"] || "", cptppOrigin: o["origen tipat"] || "",
    website: o["web"] || o["sitio"] || "", email: o["email"] || "", phone: o["telefono"] || "",
    sourceUrl: o["fuente"] || "", affinityScore: o["score"] || "",
    certifications: splitList(o["certificaciones"]), products: splitList(o["productos"]),
    notes: o["notas"] || "",
    contacted: /(^s|^y|^t|^1|sí|si)/i.test(o["contactado"] || ""),
    potential: (o["potencial"] || "").toLowerCase().includes("potencial") ? "yes" : (o["potencial"] || "").toLowerCase().includes("descart") ? "no" : "unset",
  };
}
function mapCompCsvRow(o) {
  return {
    company: o["empresa"] || "", segment: o["segmento"] || "", state: o["estado"] || "", city: o["ciudad"] || "",
    lat: o["lat"] || "", lng: o["lng"] || "", phone: o["telefono"] || "",
    website: o["sitio"] || "", email: o["email"] || "", sourceUrl: o["fuente"] || "",
    priceNote: o["precio ref."] || o["precio ref"] || "", userNotes: o["notas"] || "", scoreNote: o["nota"] || "",
    products: splitList(o["productos"]),
    scaleSize: o["tamano"] || "", geoReach: o["alcance"] || "", catalogBreadth: o["catalogo"] || "",
    webQuality: o["web"] || "", commercialSoph: o["comercial"] || "",
  };
}

function MexicoMap({ competitors, plant }) {
  const LNG_MIN = -118.5, LNG_MAX = -86.0, LAT_MIN = 14.0, LAT_MAX = 33.0;
  const COSF = Math.cos((23.5 * Math.PI) / 180);
  const W = 820, pad = 26;
  const s = (W - 2 * pad) / ((LNG_MAX - LNG_MIN) * COSF);
  const H = Math.round((LAT_MAX - LAT_MIN) * s + 2 * pad);
  const project = (lat, lng) => [pad + (lng - LNG_MIN) * COSF * s, pad + (LAT_MAX - lat) * s];
  const toPath = (pts) => pts.map((p, i) => { const [x, y] = project(p[0], p[1]); return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ") + " Z";
  const placed = competitors.map((c) => {
    const co = getCoords(c); if (!co) return null;
    const sg = SEG_COLORS.find((x) => x.key === segKey(c.segment)) || SEG_COLORS[4];
    const dist = plant ? haversineKm(co.lat, co.lng, plant.lat, plant.lng) : null;
    return { c, p: project(co.lat, co.lng), color: sg.color, label: sg.label, dist, approx: co.approx, r: hasScores(c) ? 5.5 + (compositeScore(c) / 100) * 9 : 6.5, big: hasScores(c) && compositeScore(c) >= 65 };
  }).filter(Boolean);
  spreadOverlaps(placed);
  placed.sort((a, b) => b.r - a.r);
  const pj = plant ? project(plant.lat, plant.lng) : null;
  const ringPx = (km) => (km / 111) * s;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ display: "block" }}>
      <rect x="0" y="0" width={W} height={H} fill="#0b1220" />
      <path d={toPath(MX_MAINLAND)} fill="#1e293b" stroke="#64748b" strokeWidth="1.3" strokeLinejoin="round" />
      <path d={toPath(MX_BAJA)} fill="#1e293b" stroke="#64748b" strokeWidth="1.3" strokeLinejoin="round" />
      {pj && [250, 500, 1000].map((km) => (<circle key={"ring" + km} cx={pj[0]} cy={pj[1]} r={ringPx(km)} fill="none" stroke="#ef4444" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 3" />))}
      {pj && [250, 500, 1000].map((km) => (<text key={"rl" + km} x={pj[0]} y={Math.max(pad + 8, pj[1] - ringPx(km) - 2)} fontSize="7.5" fill="#fca5a5" textAnchor="middle">{`${km} km`}</text>))}
      {placed.map(({ c, p, color, label, r, dist, approx }) => { const target = approx ? { company: c.company, city: c.city, state: c.state, country: c.country } : c; const u = gmapsUrl(target); const t = `${c.company} — ${label}${!isEmpty(c.state) ? " · " + c.state : ""}${hasScores(c) ? " · Fuerza " + compositeScore(c) : ""}${dist != null ? " · ~" + Math.round(dist) + " km" : ""}${!isEmpty(c.phone) ? " · " + c.phone : ""}${approx ? " · ubic. aprox." : ""}`; const dot = (<circle cx={p[0]} cy={p[1]} r={r} fill={color} fillOpacity={approx ? 0.75 : 1} stroke="#fff" strokeWidth="1.6" strokeOpacity={approx ? 0.7 : 0.95} strokeDasharray={approx ? "2.5 2" : undefined} style={{ filter: "drop-shadow(0 1px 1.2px rgba(0,0,0,0.55))" }}><title>{t + (u ? " · Abrir en Google Maps" : "")}</title></circle>); return u ? (<g key={c.id} role="button" tabIndex={0} aria-label={t} onClick={() => openGmaps(target)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGmaps(target); } }} style={{ cursor: "pointer" }}><circle cx={p[0]} cy={p[1]} r={r + 4} fill="transparent" />{dot}</g>) : (<g key={c.id}>{dot}</g>); })}
      {placed.filter((x) => x.big).map(({ c, p, r }) => { const nm = c.company.length > 16 ? c.company.slice(0, 15) + "…" : c.company; const w = nm.length * 5.4 + 4; const flip = p[0] + r + 1 + w > W - pad; return (<g key={c.id + "_l"} pointerEvents="none"><rect x={flip ? p[0] - r - 1 - w : p[0] + r + 1} y={p[1] - 4} width={w} height="12" rx="2" fill="#0b1220" fillOpacity="0.7" /><text x={flip ? p[0] - r - 3 : p[0] + r + 3} y={p[1] + 4.5} fontSize="10" fill="#e2e8f0" textAnchor={flip ? "end" : "start"}>{nm}</text></g>); })}
      {pj && (<g role="button" tabIndex={0} aria-label="Tu planta · Abrir en Google Maps" onClick={() => openGmaps({ company: "Tu planta", lat: plant.lat, lng: plant.lng })} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGmaps({ company: "Tu planta", lat: plant.lat, lng: plant.lng }); } }} style={{ cursor: "pointer" }}><circle cx={pj[0]} cy={pj[1]} r="7.5" fill="#ef4444" stroke="#fff" strokeWidth="2" style={{ filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.6))" }}><title>{`Tu planta${plant && plant.n ? " (" + plant.n + ", centro del estado)" : ""} · Abrir en Google Maps`}</title></circle><circle cx={pj[0]} cy={pj[1]} r="2.5" fill="#fff" pointerEvents="none" /><text x={pj[0]} y={pj[1] - 9} fontSize="10" fill="#fca5a5" textAnchor="middle" stroke="#0b1220" strokeWidth="0.6" paintOrder="stroke" pointerEvents="none">Tu planta</text></g>)}
      <text x={pad} y={H - 6} fontSize="9" fill="#737373" pointerEvents="none">Clic en un punto para abrirlo en Google Maps</text>
    </svg>
  );
}

function WorldMap({ suppliers }) {
  const LNG_MIN = -140, LNG_MAX = 180, LAT_MIN = -50, LAT_MAX = 72;
  const W = 900, pad = 16;
  const sc = (W - 2 * pad) / (LNG_MAX - LNG_MIN);
  const H = Math.round((LAT_MAX - LAT_MIN) * sc + 2 * pad);
  const project = (lat, lng) => [pad + (lng - LNG_MIN) * sc, pad + (LAT_MAX - lat) * sc];
  const toPath = (pts) => pts.map((p, i) => { const [x, y] = project(p[0], p[1]); return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ") + " Z";
  const placed = suppliers.map((sup) => {
    const co = getSupplierCoords(sup); if (!co) return null;
    const k = countryKey(sup.country); const meta = k ? COUNTRY_META[k] : null;
    const np = nearestPortOf(co.lat, co.lng);
    const score = Number(sup.affinityScore) || 0;
    return { sup, p: project(co.lat, co.lng), portP: np ? project(np.port.lat, np.port.lng) : null, np, color: meta ? meta.color : "#a3a3a3", r: 5.5 + (score / 100) * 8, approx: co.approx, score };
  }).filter(Boolean);
  spreadOverlaps(placed);
  placed.sort((a, b) => b.r - a.r);
  const vlines = []; for (let lng = -120; lng <= 180; lng += 30) vlines.push(lng);
  const hlines = []; for (let lat = -40; lat <= 60; lat += 20) hlines.push(lat);
  const eq = project(0, 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ display: "block" }}>
      <rect x="0" y="0" width={W} height={H} fill="#0b1220" />
      {vlines.map((lng) => { const [x] = project(0, lng); return <line key={"v" + lng} x1={x} y1={pad} x2={x} y2={H - pad} stroke="#1e293b" strokeWidth="0.8" />; })}
      {hlines.map((lat) => { const [, y] = project(lat, 0); return <line key={"h" + lat} x1={pad} y1={y} x2={W - pad} y2={y} stroke="#1e293b" strokeWidth="0.8" />; })}
      <line x1={pad} y1={eq[1]} x2={W - pad} y2={eq[1]} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
      {WORLD_LAND.map((poly, i) => (<path key={"land" + i} d={toPath(poly)} fill="#1e293b" stroke="#64748b" strokeWidth="0.9" strokeLinejoin="round" />))}
      {Object.values(COUNTRY_META).map((m) => { const [x, y] = project(m.lat, m.lng); return <text key={m.label} x={x} y={y} fontSize="8.5" fill="#94a3b8" textAnchor="middle" letterSpacing="0.3">{m.label}</text>; })}
      {PORTS.map((p, i) => { const [x, y] = project(p.lat, p.lng); return (<rect key={"port" + i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill="#38bdf8" fillOpacity="0.7" transform={`rotate(45 ${x} ${y})`}><title>{`Puerto: ${p.name} (${p.country})`}</title></rect>); })}
      {placed.map(({ p, portP }, i) => portP ? <line key={"cn" + i} x1={p[0]} y1={p[1]} x2={portP[0]} y2={portP[1]} stroke="#ef4444" strokeOpacity="0.4" strokeWidth="1" /> : null)}
      {placed.map(({ sup, p, color, r, np, approx, score }, i) => { const target = approx ? { company: sup.company, city: sup.city, province: sup.province, country: sup.country } : sup; const u = gmapsUrl(target); const t = `${sup.company} — ${sup.country || "país n/d"}${approx ? " (ubic. aprox.)" : ""} · Score ${score}${np ? `\nPuerto cercano: ${np.port.name} (~${Math.round(np.dist)} km)` : ""}${!isEmpty(sup.phone) ? `\nTel: ${sup.phone}` : ""}`; const dot = (<circle cx={p[0]} cy={p[1]} r={r} fill={color} fillOpacity={approx ? 0.75 : 1} stroke="#fff" strokeWidth="1.6" strokeOpacity={approx ? 0.7 : 0.95} strokeDasharray={approx ? "2.5 2" : undefined} style={{ filter: "drop-shadow(0 1px 1.2px rgba(0,0,0,0.55))" }}><title>{t + (u ? "\nAbrir en Google Maps" : "")}</title></circle>); return u ? (<g key={"sp" + i} role="button" tabIndex={0} aria-label={t.replace(/\n/g, " · ")} onClick={() => openGmaps(target)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGmaps(target); } }} style={{ cursor: "pointer" }}><circle cx={p[0]} cy={p[1]} r={r + 4} fill="transparent" />{dot}</g>) : (<g key={"sp" + i}>{dot}</g>); })}
      {placed.filter((x) => x.score >= 75).map(({ sup, p, r }, i) => { const nm = sup.company.length > 18 ? sup.company.slice(0, 17) + "…" : sup.company; const w = nm.length * 4.9 + 4; const flip = p[0] + r + 1 + w > W - pad; return (<g key={"spl" + i} pointerEvents="none"><rect x={flip ? p[0] - r - 1 - w : p[0] + r + 1} y={p[1] - 4} width={w} height="11" rx="2" fill="#0b1220" fillOpacity="0.7" /><text x={flip ? p[0] - r - 3 : p[0] + r + 3} y={p[1] + 3.5} fontSize="9" fill="#e2e8f0" textAnchor={flip ? "end" : "start"}>{nm}</text></g>); })}
      <text x={pad} y={H - 6} fontSize="9" fill="#737373" pointerEvents="none">Clic en un punto para abrirlo en Google Maps</text>
    </svg>
  );
}

export default function SupplierScout() {
  const [tab, setTab] = useState("search");
  const [productType, setProductType] = useState("saco_pp");
  const [country, setCountry] = useState("all");
  const [gsm, setGsm] = useState(""); const [denier, setDenier] = useState("");
  const [laminated, setLaminated] = useState(false); const [printed, setPrinted] = useState(false);
  const [targetMOQ, setTargetMOQ] = useState("");
  const [selectedCerts, setSelectedCerts] = useState(["Origen TIPAT"]);
  const [benchmark, setBenchmark] = useState({ name: "Tan Hung JSC", country: "Vietnam", port: "Haiphong", fobUsd: "", gsm: "", denier: "", moq: "", cptpp: "Por confirmar" });
  const [showBenchmark, setShowBenchmark] = useState(false);
  const setBench = (k, v) => setBenchmark((p) => ({ ...p, [k]: v }));
  const [loading, setLoading] = useState(false); const [error, setError] = useState(null); const [appending, setAppending] = useState(false);
  const [suppliers, setSuppliers] = useState([]); const [summary, setSummary] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [supUrl, setSupUrl] = useState(""); const [supUrlLoading, setSupUrlLoading] = useState(false); const [supUrlError, setSupUrlError] = useState(null);
  const [sortBy, setSortBy] = useState("score"); const [onlyCptpp, setOnlyCptpp] = useState(false);
  const [searchView, setSearchView] = useState("list");
  const [addedMsg, setAddedMsg] = useState("");

  const [repo, setRepo] = useState([]); const [repoLoaded, setRepoLoaded] = useState(false);
  const repoRef = useRef([]);
  const [sharedMode, setSharedMode] = useState(false); const sharedRef = useRef(false);
  const dirtyRepoRef = useRef(new Set()); const dirtyCompRef = useRef(new Set());
  const [repoFilterPot, setRepoFilterPot] = useState("all"); const [repoFilterContacted, setRepoFilterContacted] = useState("all"); const [repoFilterCountry, setRepoFilterCountry] = useState("all");
  const [confirmClear, setConfirmClear] = useState(false); const [repoView, setRepoView] = useState("list");

  const [compQuery, setCompQuery] = useState("costales y sacos de polipropileno");
  const [compUrl, setCompUrl] = useState(""); const [compUrlLoading, setCompUrlLoading] = useState(false); const [compUrlError, setCompUrlError] = useState(null);
  const [compLoading, setCompLoading] = useState(false); const [compError, setCompError] = useState(null); const [compAppending, setCompAppending] = useState(false);
  const [compResults, setCompResults] = useState([]); const [compSummary, setCompSummary] = useState("");
  const [compSearched, setCompSearched] = useState(false); const [compAddedMsg, setCompAddedMsg] = useState("");
  const [competitors, setCompetitors] = useState([]); const [compLoaded, setCompLoaded] = useState(false);
  const compRef = useRef([]);
  const [compFilterSeg, setCompFilterSeg] = useState("all"); const [compFilterState, setCompFilterState] = useState("all"); const [compFilterTier, setCompFilterTier] = useState("all"); const [compSort, setCompSort] = useState("score");
  const [confirmClearComp, setConfirmClearComp] = useState(false);
  const [compView, setCompView] = useState("list");
  const [compFilterPhone, setCompFilterPhone] = useState(false);
  const [plantState, setPlantState] = useState("Nuevo León");
  const [repoImportMsg, setRepoImportMsg] = useState(""); const [compImportMsg, setCompImportMsg] = useState("");
  const [outreach, setOutreach] = useState({ open: false, supplier: null, lang: "en", loading: false, error: "", subject: "", body: "", copied: "" });
  const [enrich, setEnrich] = useState({ open: false, supplier: null, loading: false, error: "", data: null, savedMsg: "" });

  // Carga una lista: en modo compartido lee la colección por-registro del servidor
  // (migrando una sola vez el blob anterior si la colección está vacía); si no, usa
  // el blob de window.storage (localStorage o el almacenamiento del artefacto).
  async function loadList(storageKey, setList, ref) {
    const coll = await fetchCollection(COLL[storageKey]);
    if (coll.shared) {
      sharedRef.current = true; setSharedMode(true);
      let records = coll.records;
      if (records.length === 0) {
        try { const r = await window.storage.get(storageKey); const blob = r && r.value ? JSON.parse(r.value) : []; if (Array.isArray(blob) && blob.length) { records = blob; syncCollection(COLL[storageKey], blob, []); } } catch (_) {}
      }
      setList(records); ref.current = records;
      return;
    }
    try { const r = await window.storage.get(storageKey); const p = r && r.value ? JSON.parse(r.value) : []; if (Array.isArray(p)) { setList(p); ref.current = p; } } catch (_) {}
  }

  useEffect(() => {
    let on = true;
    (async () => {
      try { await loadList(STORAGE_KEY, (v) => { if (on) setRepo(v); }, repoRef); } catch (_) {} finally { if (on) setRepoLoaded(true); }
      try { await loadList(KEY_COMP, (v) => { if (on) setCompetitors(v); }, compRef); } catch (_) {} finally { if (on) setCompLoaded(true); }
    })();
    return () => { on = false; };
  }, []);

  // En modo compartido, al volver a la pestaña/ventana se refresca desde el servidor
  // para ver los cambios del resto del equipo (antes se vuelcan los cambios pendientes).
  useEffect(() => {
    if (!SELF_HOSTED) return;
    let busy = false;
    async function refresh() {
      if (!sharedRef.current || busy || document.hidden) return;
      busy = true;
      try {
        persistNow(); persistCompNow();
        const [a, b] = await Promise.all([fetchCollection("repo"), fetchCollection("competitors")]);
        if (a.shared) { setRepo(a.records); repoRef.current = a.records; }
        if (b.shared) { setCompetitors(b.records); compRef.current = b.records; }
      } catch (_) {} finally { busy = false; }
    }
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, []);

  useEffect(() => {
    if (!outreach.open && !enrich.open) return;
    const onKey = (ev) => { if (ev.key === "Escape") { setOutreach((o) => ({ ...o, open: false })); setEnrich((e2) => ({ ...e2, open: false })); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [outreach.open, enrich.open]);

  function commitRepo(next) { const prev = repoRef.current; setRepo(next); repoRef.current = next; if (!next.length) setRepoView("list"); if (sharedRef.current) { const { upserts, deletes } = diffRecords(prev, next); syncCollection("repo", upserts, deletes); } else { window.storage.set(STORAGE_KEY, JSON.stringify(next)).catch(() => {}); } }
  function patchLocal(id, patch) { dirtyRepoRef.current.add(id); setRepo((prev) => { const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r)); repoRef.current = next; return next; }); }
  function persistNow() { if (sharedRef.current) { const ids = dirtyRepoRef.current; if (!ids.size) return; const ups = repoRef.current.filter((r) => ids.has(r.id)); dirtyRepoRef.current = new Set(); syncCollection("repo", ups, []); } else { window.storage.set(STORAGE_KEY, JSON.stringify(repoRef.current)).catch(() => {}); } }
  function addToRepo(list) { const ex = new Set(repoRef.current.map((r) => r.id)); const ad = []; list.forEach((s) => { const id = makeId(s); if (s.company && !ex.has(id)) { ad.push({ id, ...s, potential: "unset", contacted: false, notes: "", savedAt: Date.now() }); ex.add(id); } }); if (ad.length) commitRepo([...ad, ...repoRef.current]); return ad.length; }
  const isInRepo = (s) => repo.some((r) => r.id === makeId(s));
  function toggleRepoOne(s) { const id = makeId(s); if (repo.some((r) => r.id === id)) commitRepo(repo.filter((r) => r.id !== id)); else addToRepo([s]); }
  function saveAllToRepo() { const n = addToRepo(suppliers); setAddedMsg(n > 0 ? `${n} agregado(s)` : "Ya estaban guardados"); setTimeout(() => setAddedMsg(""), 2500); }

  function commitComp(next) { const prev = compRef.current; setCompetitors(next); compRef.current = next; if (sharedRef.current) { const { upserts, deletes } = diffRecords(prev, next); syncCollection("competitors", upserts, deletes); } else { window.storage.set(KEY_COMP, JSON.stringify(next)).catch(() => {}); } }
  function patchCompLocal(id, patch) { dirtyCompRef.current.add(id); setCompetitors((prev) => { const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r)); compRef.current = next; return next; }); }
  function persistCompNow() { if (sharedRef.current) { const ids = dirtyCompRef.current; if (!ids.size) return; const ups = compRef.current.filter((r) => ids.has(r.id)); dirtyCompRef.current = new Set(); syncCollection("competitors", ups, []); } else { window.storage.set(KEY_COMP, JSON.stringify(compRef.current)).catch(() => {}); } }
  function addToComp(list) { const ex = new Set(compRef.current.map((r) => r.id)); const ad = []; list.forEach((s) => { const id = makeId(s); if (s.company && !ex.has(id)) { ad.push({ id, ...s, userNotes: "", savedAt: Date.now() }); ex.add(id); } }); if (ad.length) commitComp([...ad, ...compRef.current]); return ad.length; }
  const isInComp = (s) => competitors.some((r) => r.id === makeId(s));
  function toggleCompOne(s) { const id = makeId(s); if (competitors.some((r) => r.id === id)) commitComp(competitors.filter((r) => r.id !== id)); else addToComp([s]); }
  function saveAllToComp() { const n = addToComp(compResults); setCompAddedMsg(n > 0 ? `${n} agregado(s)` : "Ya estaban guardados"); setTimeout(() => setCompAddedMsg(""), 2500); }

  function importRepoRecords(list) { const ex = new Set(repoRef.current.map((r) => r.id)); const add = []; list.forEach((s) => { const id = makeId(s); if (s.company && s.company.trim() && !ex.has(id)) { add.push({ id, ...s, potential: s.potential || "unset", contacted: !!s.contacted, notes: s.notes || "", savedAt: Date.now() }); ex.add(id); } }); if (add.length) commitRepo([...add, ...repoRef.current]); return add.length; }
  function handleRepoImport(e) { const file = e.target.files && e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { let n = 0, ok = true; try { n = importRepoRecords(csvToObjects(String(reader.result)).map(mapRepoCsvRow)); } catch (_) { ok = false; } setRepoImportMsg(!ok ? "CSV no válido" : n > 0 ? `${n} importado(s)` : "Sin nuevos (vacío o ya estaban)"); setTimeout(() => setRepoImportMsg(""), 4000); }; reader.onerror = () => { setRepoImportMsg("No se pudo leer el archivo"); setTimeout(() => setRepoImportMsg(""), 4000); }; reader.readAsText(file); e.target.value = ""; }
  function importCompRecords(list) { const ex = new Set(compRef.current.map((r) => r.id)); const add = []; list.forEach((s) => { const id = makeId(s); if (s.company && s.company.trim() && !ex.has(id)) { add.push({ id, ...s, userNotes: s.userNotes || "", savedAt: Date.now() }); ex.add(id); } }); if (add.length) commitComp([...add, ...compRef.current]); return add.length; }
  function handleCompImport(e) { const file = e.target.files && e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { let n = 0, ok = true; try { n = importCompRecords(csvToObjects(String(reader.result)).map(mapCompCsvRow)); } catch (_) { ok = false; } setCompImportMsg(!ok ? "CSV no válido" : n > 0 ? `${n} importado(s)` : "Sin nuevos (vacío o ya estaban)"); setTimeout(() => setCompImportMsg(""), 4000); }; reader.onerror = () => { setCompImportMsg("No se pudo leer el archivo"); setTimeout(() => setCompImportMsg(""), 4000); }; reader.readAsText(file); e.target.value = ""; }

  const toggleCert = (c) => setSelectedCerts((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const benchPrice = firstNum(benchmark.fobUsd);

  function buildOutreachPrompt(s, lang) {
    const pt = PRODUCT_TYPES.find((p) => p.id === productType);
    const specs = []; if (gsm) specs.push(`GSM ~${gsm}`); if (denier) specs.push(`denier ~${denier}`); if (laminated) specs.push("laminado"); if (printed) specs.push("con impresión");
    const prod = s.products && s.products.length ? s.products.join(", ") : (pt ? pt.label : "sacos de polipropileno tejido");
    return [
      `Proveedor destino: "${s.company}"${!isEmpty(s.country) ? ` (${s.country})` : ""}${!isEmpty(s.city) ? `, ${s.city}` : ""}.`,
      `Producto de interés: ${prod}.`,
      specs.length ? `Especificaciones: ${specs.join(", ")}.` : null,
      targetMOQ ? `Volumen / MOQ objetivo: ${targetMOQ}.` : null,
      selectedCerts.length ? `Certificaciones requeridas: ${selectedCerts.join(", ")}.` : null,
      `Remitente: Megacostales / Ganaplus, comprador industrial en México.`,
      `Pide explícitamente: precio FOB por unidad, MOQ, lead time, disponibilidad de muestras y certificado de origen TIPAT/CPTPP.`,
      `Idioma del correo: ${lang === "en" ? "inglés" : "español"}. Devuelve SOLO {"subject":"","body":""}.`,
    ].filter(Boolean).join("\n");
  }
  async function runOutreach(supplier, lang) {
    setOutreach((o) => ({ ...o, open: true, supplier, lang, loading: true, error: "", subject: "", body: "", copied: "" }));
    try {
      const text = await callClaudeText(OUTREACH_SYSTEM_PROMPT, buildOutreachPrompt(supplier, lang), 1500);
      const parsed = robustParse(text, "_") || {};
      const subject = parsed.subject || "";
      const body = parsed.body || (subject ? "" : text.trim());
      setOutreach((o) => ({ ...o, loading: false, subject, body }));
    } catch (e) { setOutreach((o) => ({ ...o, loading: false, error: e.message || "No se pudo generar el correo." })); }
  }
  const openOutreach = (supplier) => runOutreach(supplier, outreach.lang || "en");
  const closeOutreach = () => setOutreach((o) => ({ ...o, open: false }));

  function buildEnrichPrompt(s) {
    return [
      `Proveedor a enriquecer: "${s.company}"${!isEmpty(s.country) ? ` (${s.country})` : ""}${!isEmpty(s.city) ? `, ${s.city}` : ""}.`,
      !isEmpty(s.website) ? `Sitio conocido: ${s.website}.` : null,
      !isEmpty(s.email) ? `Email conocido: ${s.email}.` : null,
      `Busca en la web y completa su ficha: email, teléfono, WhatsApp, persona de contacto, dirección, sitio oficial validado, capacidades de producción, productos y certificaciones. Solo datos reales con fuente.`,
    ].filter(Boolean).join("\n");
  }
  async function runEnrich(supplier) {
    setEnrich({ open: true, supplier, loading: true, error: "", data: null, savedMsg: "" });
    try {
      const text = await callClaudeText(ENRICH_SYSTEM_PROMPT, buildEnrichPrompt(supplier), 2500, true);
      const data = robustParse(text, "_") || {};
      setEnrich((e) => ({ ...e, loading: false, data }));
    } catch (err) { setEnrich((e) => ({ ...e, loading: false, error: err.message || "No se pudo enriquecer." })); }
  }
  const openEnrich = (s) => runEnrich(s);
  const closeEnrich = () => setEnrich((e) => ({ ...e, open: false }));
  function applyEnrich() {
    const s = enrich.supplier, d = enrich.data; if (!s || !d) return;
    const merged = { ...s };
    const setIf = (k, v) => { if (!isEmpty(v)) merged[k] = v; };
    setIf("email", d.email); setIf("phone", d.phone); setIf("website", d.website); setIf("sourceUrl", d.sourceUrl);
    if (Array.isArray(d.products) && d.products.length) merged.products = d.products;
    if (Array.isArray(d.certifications) && d.certifications.length) merged.certifications = d.certifications;
    if (!isEmpty(d.capabilities)) merged.estimatedCapacity = d.capabilities;
    const extra = [!isEmpty(d.contactPerson) && `Contacto: ${d.contactPerson}`, !isEmpty(d.whatsapp) && `WhatsApp: ${d.whatsapp}`, !isEmpty(d.address) && `Dir: ${d.address}`, !isEmpty(d.notes) && d.notes].filter(Boolean).join(" · ");
    const id = makeId(merged);
    if (repoRef.current.some((r) => r.id === id)) {
      commitRepo(repoRef.current.map((r) => r.id === id ? { ...r, ...merged, id, notes: [r.notes, extra].filter(Boolean).join(" · ") } : r));
    } else {
      importRepoRecords([{ ...merged, notes: extra }]);
    }
    setEnrich((e) => ({ ...e, savedMsg: "Guardado en repositorio ✓" }));
    setTimeout(() => setEnrich((e) => ({ ...e, savedMsg: "", open: false })), 1200);
  }
  async function copyOut(field) {
    const txt = field === "subject" ? outreach.subject : field === "body" ? outreach.body : `${outreach.subject}\n\n${outreach.body}`;
    try { await navigator.clipboard.writeText(txt); setOutreach((o) => ({ ...o, copied: field })); setTimeout(() => setOutreach((o) => ({ ...o, copied: "" })), 1500); } catch (_) {}
  }

  function buildUserPrompt(exclude) {
    const pt = PRODUCT_TYPES.find((p) => p.id === productType); const co = COUNTRIES.find((c) => c.id === country);
    const specs = []; if (gsm) specs.push(`GSM ~${gsm}`); if (denier) specs.push(`denier ~${denier}`); if (laminated) specs.push("laminado"); if (printed) specs.push("con impresión / flexo");
    const geo = country === "all" ? `Países: cualquiera de los 12 miembros del TIPAT/CPTPP (${ALL_TIPAT}). Prioriza hubs de PP (Vietnam, Malasia, México) y variedad geográfica.` : `País: ${co.label} (miembro TIPAT/CPTPP). Todos los fabricantes en ${co.label}.`;
    return [`Producto: ${pt.label} (${pt.query}).`, geo, specs.length ? `Specs: ${specs.join(", ")}.` : null, targetMOQ ? `MOQ objetivo: ${targetMOQ}.` : null, selectedCerts.length ? `Certificaciones deseadas: ${selectedCerts.join(", ")}.` : null, `Incluye el país de cada fabricante. Fabricantes reales y verificables con URL fuente.`, (exclude && exclude.length) ? `Ya tengo estos proveedores; NO los repitas y devuelve OTROS distintos: ${exclude.join(", ")}.` : null].filter(Boolean).join("\n");
  }
  async function search(append = false) {
    if (append) setAppending(true); else setLoading(true);
    setError(null);
    try {
      const exclude = append ? suppliers.map((s) => s.company).filter(Boolean) : [];
      const { list, summary } = await callClaude(SYSTEM_PROMPT, buildUserPrompt(exclude), "suppliers", 7000);
      if (append) {
        const seen = new Set(suppliers.map((s) => makeId(s)));
        const fresh = list.filter((s) => s.company && !seen.has(makeId(s)));
        setSuppliers([...suppliers, ...fresh].map((s, i) => ({ ...s, _id: i })));
        setSummary(summary || ""); setAddedMsg(fresh.length ? `+${fresh.length} nuevo(s)` : "Sin proveedores nuevos"); setTimeout(() => setAddedMsg(""), 2500);
      } else { setSuppliers(list.map((s, i) => ({ ...s, _id: i }))); setSummary(summary); setHasSearched(true); }
    } catch (e) { setError(e.message || "Error."); if (!append) { setSuppliers([]); setHasSearched(true); } }
    finally { if (append) setAppending(false); else setLoading(false); }
  }
  // Agrega un proveedor que el usuario ya conoce a partir de su URL (o nombre): la IA lo
  // investiga, lo analiza con el mismo esquema y lo deja en los resultados para guardar.
  async function addSupplierByUrl() {
    const q = supUrl.trim();
    if (!q) { setSupUrlError("Pega la URL del sitio (o el nombre del fabricante)."); return; }
    setSupUrlLoading(true); setSupUrlError(null);
    try {
      const prompt = `Analiza UN fabricante/proveedor específico que YA conozco, a partir de este dato: "${q}". Investígalo en la web (su sitio oficial, catálogo, directorios) y devuelve EXACTAMENTE esa empresa (no sugieras otras) con país, ciudad/provincia, coordenadas lat/lng aproximadas, productos (saco/empaque de polipropileno), capacidad estimada, certificaciones, sitio web, email, teléfono y sourceUrl. Si "${q}" es una URL, úsala como su sitio web y fuente principal. INCLÚYELO aunque su país NO sea miembro TIPAT/CPTPP: pon su país real y, si no es TIPAT, cptppOrigin="no". Datos reales y verificables; lo que no encuentres = "no disponible".`;
      const { list } = await callClaude(SYSTEM_PROMPT, prompt, "suppliers", 3000);
      const cand = (list || []).filter((s) => s && s.company && s.company.trim());
      if (!cand.length) { setSupUrlError("No pude identificar al proveedor desde ese dato. Revisa la URL o prueba con el nombre."); return; }
      const seen = new Set([...suppliers, ...repo].map((s) => makeId(s)));
      const fresh = cand.filter((s) => !seen.has(makeId(s)));
      if (!fresh.length) { setSupUrlError("Ese proveedor ya está en tus resultados o en el repositorio."); return; }
      setSuppliers((prev) => [...fresh, ...prev].map((s, i) => ({ ...s, _id: i })));
      setHasSearched(true);
      setSupUrl("");
      setAddedMsg(`+${fresh.length} desde URL — revísalo y pulsa Guardar`); setTimeout(() => setAddedMsg(""), 4000);
    } catch (e) { setSupUrlError(e.message || "No se pudo analizar la URL. Reintenta."); }
    finally { setSupUrlLoading(false); }
  }
  async function searchComp(append = false) {
    if (append) setCompAppending(true); else setCompLoading(true);
    setCompError(null);
    const kw = compQuery.trim() || "costales y sacos de polipropileno";
    const exclude = append ? compResults.map((c) => c.company).filter(Boolean) : [];
    const prompt = `Empresas en MÉXICO que fabrican, importan, distribuyen o comercializan: ${kw}. Son competidores en el mercado mexicano de costalería/empaque de polipropileno. Para cada una incluye teléfono, ubicación (estado/ciudad), coordenadas lat/lng aproximadas, segmento, y EVALÚA sus dimensiones (tamaño, calidad web, amplitud de catálogo, alcance geográfico, sofisticación comercial). Empresas reales y verificables.${exclude.length ? ` Ya tengo estas empresas; NO las repitas y devuelve OTRAS distintas: ${exclude.join(", ")}.` : ""}`;
    try {
      const { list, summary } = await callClaude(COMP_SYSTEM_PROMPT, prompt, "competitors", 7000);
      if (append) {
        const seen = new Set(compResults.map((c) => makeId(c)));
        const fresh = list.filter((c) => c.company && !seen.has(makeId(c)));
        setCompResults([...compResults, ...fresh].map((c, i) => ({ ...c, _id: i })));
        setCompSummary(summary || ""); setCompAddedMsg(fresh.length ? `+${fresh.length} nuevo(s)` : "Sin empresas nuevas"); setTimeout(() => setCompAddedMsg(""), 2500);
      } else { setCompResults(list.map((s, i) => ({ ...s, _id: i }))); setCompSummary(summary); setCompSearched(true); }
    } catch (e) { setCompError(e.message || "Error."); if (!append) { setCompResults([]); setCompSearched(true); } }
    finally { if (append) setCompAppending(false); else setCompLoading(false); }
  }
  // Agrega un competidor que el usuario ya conoce a partir de su URL (o nombre): la IA
  // lo investiga, lo evalúa con el mismo esquema y lo deja en los resultados para guardar.
  async function addCompByUrl() {
    const q = compUrl.trim();
    if (!q) { setCompUrlError("Pega la URL del sitio (o el nombre de la empresa)."); return; }
    setCompUrlLoading(true); setCompUrlError(null);
    try {
      const prompt = `Analiza UNA empresa específica que ya conozco y que es competidor en el mercado MEXICANO de costalería/empaque de polipropileno, a partir de este dato: "${q}". Investígala en la web (su sitio oficial, directorios, Google Maps, redes) y devuelve EXACTAMENTE esa empresa (no sugieras otras) con teléfono, ubicación (estado/ciudad), coordenadas lat/lng aproximadas, segmento, productos y la evaluación de sus dimensiones. Si "${q}" es una URL, úsala como su sitio web y fuente principal. Datos reales y verificables; lo que no encuentres = "no disponible".`;
      const { list } = await callClaude(COMP_SYSTEM_PROMPT, prompt, "competitors", 3000);
      const cand = (list || []).filter((c) => c && c.company && c.company.trim());
      if (!cand.length) { setCompUrlError("No pude identificar la empresa desde ese dato. Revisa la URL o prueba con el nombre."); return; }
      const seen = new Set([...compResults, ...competitors].map((c) => makeId(c)));
      const fresh = cand.filter((c) => !seen.has(makeId(c)));
      if (!fresh.length) { setCompUrlError("Esa empresa ya está en tus resultados o en el directorio."); return; }
      setCompResults((prev) => [...fresh, ...prev].map((c, i) => ({ ...c, _id: i })));
      setCompSearched(true);
      setCompUrl("");
      setCompAddedMsg(`+${fresh.length} desde URL — revísalo y pulsa Guardar`); setTimeout(() => setCompAddedMsg(""), 4000);
    } catch (e) { setCompUrlError(e.message || "No se pudo analizar la URL. Reintenta."); }
    finally { setCompUrlLoading(false); }
  }

  function exportSearchCSV() { const h = ["Empresa", "País", "Ciudad", "Puerto (IA)", "Puerto cercano", "Dist. puerto (km)", "Lat", "Lng", "Productos", "Certificaciones", "Origen TIPAT", "Cert. origen", "FOB USD", "Web", "Email", "Telefono", "Fuente", "Score"]; const rows = displayed.map((s) => { const np = supplierNearestPort(s); const co = getSupplierCoords(s); return [s.company, s.country, s.city, s.nearestPort, np ? np.port.name : "", np ? Math.round(np.dist) : "", co ? co.lat : "", co ? co.lng : "", (s.products || []).join("; "), (s.certifications || []).join("; "), s.cptppOrigin, certMechanismFor(s.country) || "", s.indicativeFobUsd, s.website, s.email, s.phone, s.sourceUrl, s.affinityScore]; }); downloadCsv([h, ...rows], "busqueda_tipat_pp.csv"); }
  const POT_LABEL = { unset: "Sin evaluar", yes: "Con potencial", no: "Descartado" };
  function exportRepoCSV() { const h = ["Empresa", "País", "Ciudad", "Provincia", "Lat", "Lng", "Puerto", "Puerto cercano", "Productos", "Certificaciones", "Origen TIPAT", "Cert. origen", "FOB USD", "Potencial", "Contactado", "Notas", "Web", "Email", "Telefono", "Fuente", "Score"]; const rows = repoDisplayed.map((r) => { const np = supplierNearestPort(r); return [r.company, r.country, r.city, r.province ?? "", r.lat ?? "", r.lng ?? "", r.nearestPort, np ? np.port.name : "", (r.products || []).join("; "), (r.certifications || []).join("; "), r.cptppOrigin, certMechanismFor(r.country) || "", r.indicativeFobUsd, POT_LABEL[r.potential || "unset"], r.contacted ? "Sí" : "No", r.notes, r.website, r.email, r.phone, r.sourceUrl, r.affinityScore]; }); downloadCsv([h, ...rows], "repositorio_proveedores_tipat.csv"); }
  function exportCompCSV(src) { const h = ["Empresa", "Segmento", "Tier", "Fuerza", "Tamaño", "Alcance", "Integración", "Catálogo", "Web", "Comercial", "Estado", "Ciudad", "Lat", "Lng", `Dist. a ${plantState} (km)`, "Telefono", "Productos", "Precio ref.", "Notas", "Sitio", "Email", "Fuente"]; const rows = src.map((c) => { const cs = hasScores(c) ? compositeScore(c) : ""; const d = compDistanceKm(c); return [c.company, segmentStyle(c.segment).label, hasScores(c) ? tierOf(compositeScore(c)).key : "", cs, clamp100(c.scaleSize), clamp100(c.geoReach), verticalScore(c.segment), clamp100(c.catalogBreadth), clamp100(c.webQuality), clamp100(c.commercialSoph), c.state, c.city, c.lat ?? "", c.lng ?? "", d != null ? Math.round(d) : "", c.phone, (c.products || []).join("; "), c.priceNote, c.userNotes || c.note || "", c.website, c.email, c.sourceUrl]; }); downloadCsv([h, ...rows], "competencia_mx_scoring.csv"); }

  let displayed = [...suppliers];
  if (onlyCptpp) displayed = displayed.filter((s) => /^(s|yes)/i.test((s.cptppOrigin || "").toString()));
  if (sortBy === "score") displayed.sort((a, b) => (Number(b.affinityScore) || 0) - (Number(a.affinityScore) || 0));
  if (sortBy === "country") displayed.sort((a, b) => (a.country || "").localeCompare(b.country || ""));
  if (sortBy === "name") displayed.sort((a, b) => (a.company || "").localeCompare(b.company || ""));

  const repoStats = { total: repo.length, potential: repo.filter((r) => r.potential === "yes").length, contacted: repo.filter((r) => r.contacted).length };
  const repoCountries = Array.from(new Set(repo.map((r) => r.country).filter((c) => !isEmpty(c))));
  let repoDisplayed = [...repo];
  if (repoFilterPot !== "all") repoDisplayed = repoDisplayed.filter((r) => (r.potential || "unset") === repoFilterPot);
  if (repoFilterContacted !== "all") repoDisplayed = repoDisplayed.filter((r) => (repoFilterContacted === "yes" ? r.contacted : !r.contacted));
  if (repoFilterCountry !== "all") repoDisplayed = repoDisplayed.filter((r) => r.country === repoFilterCountry);
  repoDisplayed.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

  const compStates = Array.from(new Set(competitors.map((c) => c.state).filter((c) => !isEmpty(c))));
  const tierCount = { A: 0, B: 0, C: 0 };
  competitors.forEach((c) => { if (hasScores(c)) tierCount[tierOf(compositeScore(c)).key]++; });
  let compDisplayed = [...competitors];
  if (compFilterSeg !== "all") compDisplayed = compDisplayed.filter((c) => (c.segment || "").toLowerCase().includes(compFilterSeg));
  if (compFilterState !== "all") compDisplayed = compDisplayed.filter((c) => c.state === compFilterState);
  if (compFilterPhone) compDisplayed = compDisplayed.filter((c) => !isEmpty(c.phone));
  if (compFilterTier !== "all") compDisplayed = compDisplayed.filter((c) => hasScores(c) && tierOf(compositeScore(c)).key === compFilterTier);
  if (compSort === "score") compDisplayed.sort((a, b) => (hasScores(b) ? compositeScore(b) : -1) - (hasScores(a) ? compositeScore(a) : -1));
  else compDisplayed.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

  const stateCount: Record<string, number> = {};
  competitors.forEach((c) => { const k = !isEmpty(c.state) ? c.state : "Sin ubicar"; stateCount[k] = (stateCount[k] || 0) + 1; });
  const stateRanking = Object.entries(stateCount).sort((a, b) => b[1] - a[1]);
  const maxCount = stateRanking.length ? stateRanking[0][1] : 1;
  const unplaced = competitors.filter((c) => !getCoords(c)).length;
  const plant = MX_STATES.find((st) => st.n === plantState) || MX_STATES.find((st) => st.n === "Nuevo León");
  function compDistanceKm(c) { const co = getCoords(c); if (!co || !plant) return null; return haversineKm(co.lat, co.lng, plant.lat, plant.lng); }

  const Chip = ({ children, active, onClick, accent = false }) => (<button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${active ? accent ? "bg-red-600 border-red-600 text-white" : "bg-neutral-100 border-neutral-100 text-neutral-900" : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"}`}>{children}</button>);
  const Label = ({ children }) => (<div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 mb-2">{children}</div>);
  const SegBtn = ({ active, onClick, children, color }) => (<button onClick={onClick} className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors ${active ? color : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500"}`}>{children}</button>);
  const fieldCls = "w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:border-red-600 focus:outline-none";
  const benchInput = "w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-neutral-100 placeholder-neutral-600 focus:border-red-600 focus:outline-none";
  const selCls = "bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-red-600";

  function ScoreBreakdown({ c }) { return (<div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">{dimsOf(c).map((d) => (<div key={d.label} className="flex items-center gap-2"><span className="text-[10px] text-neutral-500 w-16 shrink-0">{d.label}</span><div className="flex-1 bg-neutral-800 rounded-full h-1.5 overflow-hidden"><div className="h-full rounded-full bg-neutral-400" style={{ width: `${d.val}%` }} /></div><span className="text-[10px] text-neutral-500 w-6 text-right">{d.val}</span></div>))}</div>); }

  function renderDeltas(s) {
    const chips = []; const sp = firstNum(s.indicativeFobUsd); const sameC = sameCountryAs(s.country, benchmark.country);
    if (sameC === true) { chips.push({ k: "geo", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25", node: <>Mismo origen ({benchmark.country})</> }); if (portMatch(s.nearestPort, benchmark.port) === false) chips.push({ k: "port", cls: "bg-amber-500/10 text-amber-300 border-amber-500/25", node: <>Otro puerto · revisar flete</> }); }
    else if (!isEmpty(s.country)) chips.push({ k: "geo", cls: "bg-amber-500/10 text-amber-300 border-amber-500/25", node: <>Otro origen TIPAT · logística distinta</> });
    if (benchPrice && sp) { const d = ((sp - benchPrice) / benchPrice) * 100; if (d < -1) chips.push({ k: "price", cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25", node: <><TrendingDown size={11} /> {Math.abs(d).toFixed(0)}% más barato</> }); else if (d > 1) chips.push({ k: "price", cls: "bg-red-500/10 text-red-300 border-red-500/25", node: <><TrendingUp size={11} /> {d.toFixed(0)}% más caro</> }); else chips.push({ k: "price", cls: "bg-neutral-700/40 text-neutral-300 border-neutral-600/40", node: <>= mismo precio</> }); }
    else if (benchPrice) chips.push({ k: "price", cls: "bg-neutral-700/40 text-neutral-400 border-neutral-600/40", node: <>Precio: cotizar</> });
    if (benchmark.cptpp === "Sí" && !/^(s|yes)/i.test((s.cptppOrigin || "").toString())) chips.push({ k: "cptpp", cls: "bg-red-500/10 text-red-300 border-red-500/25", node: <>Verificar origen TIPAT</> });
    if (!chips.length) return null;
    return (<div className="mt-3 pt-3 border-t border-dashed border-neutral-800"><div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-600 mb-1.5"><Target size={11} className="text-red-500" /> vs {benchmark.name || "actual"}</div><div className="flex flex-wrap gap-1.5">{chips.map((c) => (<span key={c.k} className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${c.cls}`}>{c.node}</span>))}</div></div>);
  }

  function CompScoreHeader({ c }) {
    const seg = segmentStyle(c.segment); const scored = hasScores(c); const cs = scored ? compositeScore(c) : null; const tier = scored ? tierOf(cs) : null;
    return (<div className="flex items-start gap-3">
      {scored ? (<div className="shrink-0 flex flex-col items-center"><span className={`text-base font-bold px-2.5 py-1 rounded-md border ${tier.cls}`}>{cs}</span><span className="text-[9px] text-neutral-500 mt-0.5 uppercase tracking-wider">fuerza</span></div>) : (<span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md border bg-neutral-800 border-neutral-700 text-neutral-500">s/e</span>)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold text-neutral-100 leading-tight truncate">{c.company}</h3><span className={`text-[10px] px-2 py-0.5 rounded border ${seg.cls}`}>{seg.label}</span>{scored && <span className={`text-[10px] px-2 py-0.5 rounded border ${tier.cls}`}>{tier.label}</span>}</div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1"><MapPin size={11} />{[c.city, c.state].filter((x) => !isEmpty(x)).join(", ") || "Ubicación n/d"}</div>
      </div>
    </div>);
  }

  function CompCard({ c, saved, onToggle }) {
    const web = normalizeUrl(c.website); const src = normalizeUrl(c.sourceUrl); const tel = telHref(c.phone);
    return (
      <div className={`relative bg-neutral-900/60 border rounded-xl p-5 transition-colors ${saved ? "border-red-600/60" : "border-neutral-800 hover:border-neutral-600"}`}>
        <button onClick={onToggle} title={saved ? "Quitar" : "Guardar"} className={`absolute top-4 right-4 h-7 px-2 rounded-md border flex items-center gap-1 text-[11px] transition-colors ${saved ? "bg-red-600/15 border-red-600 text-red-300" : "border-neutral-600 text-neutral-400 hover:border-neutral-400"}`}>{saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}{saved ? "Guardado" : "Guardar"}</button>
        <div className="pr-24"><CompScoreHeader c={c} /></div>
        <div className="mt-3">{tel ? (<a href={tel} className="inline-flex items-center gap-2 text-base font-semibold text-neutral-100 hover:text-red-400 transition-colors"><Phone size={16} className="text-red-500" /> {c.phone}</a>) : (<span className="inline-flex items-center gap-2 text-sm text-neutral-600"><Phone size={14} /> Teléfono no disponible</span>)}{(() => { const d = compDistanceKm(c); return d != null ? <span className="ml-3 inline-flex items-center gap-1 text-[11px] text-neutral-400"><Navigation size={11} className="text-red-500" /> ~{Math.round(d)} km de {plantState}</span> : null; })()}</div>
        {hasScores(c) && <ScoreBreakdown c={c} />}
        {!isEmpty(c.scoreNote) && <p className="text-[11px] text-neutral-500 mt-2 italic">{c.scoreNote}</p>}
        {!isEmpty(c.note) && <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{c.note}</p>}
        <div className="flex flex-wrap gap-1.5 mt-3">{(c.products || []).slice(0, 4).map((p, i) => (<span key={i} className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">{p}</span>))}</div>
        {!isEmpty(c.priceNote) && <div className="flex items-center gap-1.5 mt-3 text-[11px] text-amber-300/90"><Tag size={11} /> Precio ref.: {c.priceNote}</div>}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-800 text-xs">{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Globe size={13} /> Web</a>}{!isEmpty(c.email) && <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Mail size={13} /> Email</a>}{gmapsUrl(c) && <a href={gmapsUrl(c)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"><MapPin size={13} /> Google Maps</a>}<div className="flex-1" />{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 font-medium">Fuente <ExternalLink size={12} /></a>}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex items-center gap-3 mb-5"><div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40"><Package size={20} className="text-white" /></div><div><h1 className="text-xl font-bold tracking-tight leading-none">Supplier Scout <span className="text-red-500">·</span> TIPAT</h1><p className="text-xs text-neutral-500 mt-1">Megacostales / Ganaplus — abastecimiento, repositorio e inteligencia de competencia</p></div><div className="flex-1" />{sharedMode && <span title="Repositorio y competencia se guardan en la base de datos del equipo (se sincronizan entre todos)." className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full"><Database size={12} /> Datos compartidos</span>}</div>

        <div className="flex flex-wrap gap-1 mb-6 bg-neutral-900/60 border border-neutral-800 rounded-lg p-1 w-fit">
          <button onClick={() => setTab("search")} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "search" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-200"}`}><Search size={15} /> Buscar</button>
          <button onClick={() => setTab("repo")} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "repo" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-200"}`}><Database size={15} /> Repositorio{repoStats.total > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === "repo" ? "bg-white/20" : "bg-neutral-700 text-neutral-300"}`}>{repoStats.total}</span>}</button>
          <button onClick={() => setTab("comp")} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "comp" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-200"}`}><Swords size={15} /> Competencia MX{competitors.length > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === "comp" ? "bg-white/20" : "bg-neutral-700 text-neutral-300"}`}>{competitors.length}</span>}</button>
        </div>

        {tab === "search" && (
          <>
            <div className="flex items-start gap-2 text-[11px] text-neutral-500 mb-1 border-l-2 border-red-600/50 pl-3"><ShieldCheck size={14} className="text-red-500 mt-0.5 shrink-0" /><span>Búsqueda web en tiempo real. Solo proveedores con evidencia verificable y URL fuente — sin invenciones.</span></div>
            <div className="flex items-start gap-2 text-[11px] text-neutral-500 mb-6 border-l-2 border-neutral-700 pl-3"><FileBadge size={14} className="text-neutral-500 mt-0.5 shrink-0" /><span>El mecanismo de certificación de origen TIPAT varía por país: auto-certificación en la mayoría; emitido por autoridad en Vietnam (eCoSys/VCCI). Referencia general — confirma con tu agente aduanal.</span></div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 mb-4">
              <Label>Producto</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">{PRODUCT_TYPES.map((p) => (<button key={p.id} onClick={() => setProductType(p.id)} className={`px-3 py-2.5 rounded-lg text-sm font-medium border text-left transition-colors ${productType === p.id ? "bg-red-600/15 border-red-600 text-red-300" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600"}`}>{p.label}</button>))}</div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><Label>País (TIPAT)</Label><select value={country} onChange={(e) => setCountry(e.target.value)} className={fieldCls}>{COUNTRIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}</select></div>
                <div><Label>Especificaciones (opcional)</Label><div className="flex flex-wrap items-center gap-2"><input type="number" value={gsm} onChange={(e) => setGsm(e.target.value)} placeholder="GSM" className="w-20 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:border-red-600 focus:outline-none" /><input type="number" value={denier} onChange={(e) => setDenier(e.target.value)} placeholder="Denier" className="w-24 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:border-red-600 focus:outline-none" /><Chip active={laminated} onClick={() => setLaminated((v) => !v)}>Laminado</Chip><Chip active={printed} onClick={() => setPrinted((v) => !v)}>Impresión</Chip></div></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <div><Label>MOQ objetivo (opcional)</Label><input type="text" value={targetMOQ} onChange={(e) => setTargetMOQ(e.target.value)} placeholder="ej. 100,000 sacos / contenedor" className={fieldCls} /></div>
                <div><Label>Certificaciones</Label><div className="flex flex-wrap gap-2">{CERTS.map((c) => (<Chip key={c} active={selectedCerts.includes(c)} onClick={() => toggleCert(c)} accent={c === "Origen TIPAT"}>{c}</Chip>))}</div></div>
              </div>
              <button onClick={() => search()} disabled={loading} className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors">{loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}{loading ? "Buscando en la web…" : "Buscar proveedores"}</button>
            </div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 mb-6">
              <Label>¿Conoces un proveedor que falta? Pega su sitio web</Label>
              <div className="flex flex-col sm:flex-row gap-3"><input type="text" value={supUrl} onChange={(e) => setSupUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSupplierByUrl(); }} placeholder="https://fabricante.com  ·  (o el nombre del fabricante)" className={fieldCls} /><button onClick={addSupplierByUrl} disabled={supUrlLoading} className="shrink-0 inline-flex items-center justify-center gap-2 border border-red-700/60 text-red-300 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-6 py-2.5 rounded-lg transition-colors">{supUrlLoading ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}{supUrlLoading ? "Analizando…" : "Analizar y agregar"}</button></div>
              {supUrlError && <p className="text-[11px] text-red-300 mt-2 flex items-center gap-1.5"><AlertTriangle size={12} /> {supUrlError}</p>}
              <p className="text-[11px] text-neutral-600 mt-2">La IA lee su sitio y la web, lo analiza igual que los demás y lo agrega a tus resultados para que lo revises y guardes (aunque su país no sea TIPAT).</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl mb-6 overflow-hidden">
              <button onClick={() => setShowBenchmark((v) => !v)} className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-neutral-900/60 transition-colors"><div className="flex items-center gap-2.5"><Target size={16} className="text-red-500" /><span className="text-sm font-medium text-neutral-200">Benchmark · {benchmark.name || "proveedor actual"}</span><span className="text-[10px] uppercase tracking-wider bg-red-600/20 text-red-300 border border-red-600/30 px-2 py-0.5 rounded">Actual</span></div><ChevronDown size={16} className={`text-neutral-500 transition-transform ${showBenchmark ? "rotate-180" : ""}`} /></button>
              {showBenchmark && (<div className="px-5 pb-5 pt-1 border-t border-neutral-800"><p className="text-[11px] text-neutral-500 mb-4">Cada hallazgo se mide contra esto. El <span className="text-neutral-300">FOB/unidad</span> activa los deltas de precio.</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-3"><div><Label>Proveedor</Label><input type="text" value={benchmark.name} onChange={(e) => setBench("name", e.target.value)} className={benchInput} /></div><div><Label>País</Label><input type="text" value={benchmark.country} onChange={(e) => setBench("country", e.target.value)} className={benchInput} /></div><div><Label>Puerto</Label><input type="text" value={benchmark.port} onChange={(e) => setBench("port", e.target.value)} className={benchInput} /></div><div><Label>FOB USD/u</Label><input type="text" value={benchmark.fobUsd} onChange={(e) => setBench("fobUsd", e.target.value)} placeholder="ej. 0.095" className={benchInput} /></div><div><Label>Origen TIPAT</Label><select value={benchmark.cptpp} onChange={(e) => setBench("cptpp", e.target.value)} className={benchInput}><option>Sí</option><option>Por confirmar</option><option>No</option></select></div><div><Label>GSM</Label><input type="text" value={benchmark.gsm} onChange={(e) => setBench("gsm", e.target.value)} placeholder="—" className={benchInput} /></div><div><Label>Denier</Label><input type="text" value={benchmark.denier} onChange={(e) => setBench("denier", e.target.value)} placeholder="—" className={benchInput} /></div><div><Label>MOQ</Label><input type="text" value={benchmark.moq} onChange={(e) => setBench("moq", e.target.value)} placeholder="—" className={benchInput} /></div></div></div>)}
            </div>
            {loading && (<div className="text-center py-12 text-neutral-500 text-sm"><Loader2 size={28} className="animate-spin text-red-500 mx-auto mb-3" />Rastreando la web abierta en busca de fabricantes en el bloque TIPAT…<div className="text-xs text-neutral-600 mt-1">Puede tardar ~30 segundos.</div></div>)}
            {error && !loading && (<div className="bg-red-950/40 border border-red-900/60 rounded-xl p-4 mb-6"><div className="flex items-start gap-3 text-sm text-red-300"><AlertTriangle size={18} className="shrink-0 mt-0.5" /><div><div className="font-medium mb-1">No se pudo completar la búsqueda</div><div className="text-red-300/80">{error}</div></div></div><button onClick={() => search()} className="mt-3 ml-7 inline-flex items-center gap-1.5 text-xs font-medium bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors"><RotateCw size={13} /> Reintentar</button></div>)}
            {!loading && hasSearched && suppliers.length > 0 && (<>
              {summary && <p className="text-sm text-neutral-400 mb-4 italic">{summary}</p>}
              <div className="flex flex-wrap items-center gap-3 mb-5"><span className="text-xs text-neutral-500">{displayed.length} proveedor(es)</span><div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5"><button onClick={() => setSearchView("list")} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${searchView === "list" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"}`}><List size={13} /> Lista</button><button onClick={() => setSearchView("map")} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${searchView === "map" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-200"}`}><Map size={13} /> Mapa</button></div><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selCls}><option value="score">Ordenar: Score ↓</option><option value="country">Ordenar: País</option><option value="name">Ordenar: Nombre A–Z</option></select><Chip active={onlyCptpp} onClick={() => setOnlyCptpp((v) => !v)} accent>Solo elegibles TIPAT</Chip><div className="flex-1" />{addedMsg && <span className="text-[11px] text-emerald-400">{addedMsg}</span>}<button onClick={() => search(true)} disabled={loading || appending} className="inline-flex items-center gap-1.5 text-xs font-medium border border-red-700/60 text-red-300 px-3 py-1.5 rounded-lg hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{appending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Buscar más</button><button onClick={saveAllToRepo} className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"><Bookmark size={14} /> Guardar todos</button><button onClick={exportSearchCSV} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors"><Download size={14} /> CSV</button></div>
              {searchView === "map" ? (<><div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-2 mb-3"><WorldMap suppliers={displayed} /></div><div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-[11px]">{Object.values(COUNTRY_META).map((m) => (<span key={m.label} className="inline-flex items-center gap-1.5 text-neutral-400"><span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />{m.label}</span>))}<span className="inline-flex items-center gap-1.5 text-neutral-500"><span className="inline-block h-2 w-2 bg-sky-500/60 rotate-45" /> puerto</span><span className="text-neutral-600">· línea roja = puerto más cercano · tamaño del punto = score · sólido = ubic. exacta · punteado = aprox · clic = Google Maps</span></div>{(() => { const un = displayed.filter((s) => !getSupplierCoords(s)).length; return un > 0 ? <p className="text-[11px] text-amber-300/80 mb-2 flex items-center gap-1.5"><AlertTriangle size={12} /> {un} proveedor(es) sin ubicación reconocible — no aparecen en el mapa.</p> : null; })()}</>) : (<div className="grid gap-4 md:grid-cols-2">{displayed.map((s) => { const og = originStyle(s.cptppOrigin); const web = normalizeUrl(s.website); const src = normalizeUrl(s.sourceUrl); const saved = isInRepo(s); const mech = certMechanismFor(s.country); return (
                <div key={s._id} className={`relative bg-neutral-900/60 border rounded-xl p-5 transition-colors ${saved ? "border-red-600/60" : "border-neutral-800 hover:border-neutral-600"}`}>
                  <button onClick={() => toggleRepoOne(s)} title={saved ? "Quitar" : "Guardar"} className={`absolute top-4 right-4 h-7 px-2 rounded-md border flex items-center gap-1 text-[11px] transition-colors ${saved ? "bg-red-600/15 border-red-600 text-red-300" : "border-neutral-600 text-neutral-400 hover:border-neutral-400"}`}>{saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}{saved ? "Guardado" : "Guardar"}</button>
                  <div className="flex items-start gap-3 pr-24"><span className={`shrink-0 text-sm font-bold px-2.5 py-1 rounded-md border ${scoreColor(s.affinityScore)}`}>{s.affinityScore ?? "—"}</span><div><h3 className="font-semibold text-neutral-100 leading-tight">{s.company}</h3><div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1"><MapPin size={12} />{!isEmpty(s.country) && <span className="text-neutral-400 font-medium">{s.country}</span>}<span>{[s.city, s.province].filter((x) => !isEmpty(x)).join(", ")}</span></div></div></div>
                  {!isEmpty(s.scoreRationale) && <p className="text-xs text-neutral-400 mt-3 leading-relaxed">{s.scoreRationale}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">{(s.products || []).slice(0, 4).map((p, i) => (<span key={i} className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">{p}</span>))}</div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-4 text-xs">{(() => { const np = supplierNearestPort(s); return np ? <div className="flex items-center gap-1.5 text-neutral-300 col-span-2"><Anchor size={12} className="text-sky-500" /><span className="text-neutral-500">Puerto cercano:</span> {np.port.name} <span className="text-neutral-500">(~{Math.round(np.dist)} km{np.approx ? ", aprox." : ""})</span></div> : null; })()}{!isEmpty(s.nearestPort) && <div className="flex items-center gap-1.5 text-neutral-400"><Anchor size={12} className="text-neutral-500" />{s.nearestPort}</div>}{!isEmpty(s.estimatedCapacity) && <div className="flex items-center gap-1.5 text-neutral-400"><Factory size={12} className="text-neutral-500" />{s.estimatedCapacity}</div>}{!isEmpty(s.indicativeFobUsd) && <div className="flex items-center gap-1.5 text-neutral-400 col-span-2"><span className="text-neutral-500">FOB:</span>{s.indicativeFobUsd}</div>}</div>
                  <div className="flex flex-wrap gap-1.5 mt-3"><span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${og.cls}`}>{og.icon && <Check size={11} />}{og.label}</span>{(s.certifications || []).filter((c) => !/tipat|cptpp|origen/i.test(c)).slice(0, 4).map((c, i) => (<span key={i} className="text-[11px] border border-neutral-700 text-neutral-400 px-2 py-0.5 rounded">{c}</span>))}</div>
                  {mech && <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-500"><FileBadge size={11} /> Cert. origen: {mech}</div>}
                  {renderDeltas(s)}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-800 text-xs">{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Globe size={13} /> Web</a>}{!isEmpty(s.email) && <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Mail size={13} /> Email</a>}{!isEmpty(s.phone) && <span className="inline-flex items-center gap-1 text-neutral-500"><Phone size={13} /> {s.phone}</span>}<button onClick={() => openOutreach(s)} className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Sparkles size={13} /> Correo IA</button><button onClick={() => openEnrich(s)} className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Wand2 size={13} /> Enriquecer</button>{gmapsUrl(s) && <a href={gmapsUrl(s)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300"><MapPin size={13} /> Google Maps</a>}<div className="flex-1" />{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 font-medium">Fuente <ExternalLink size={12} /></a>}</div>
                </div>); })}</div>)}
            </>)}
            {!loading && hasSearched && suppliers.length === 0 && !error && (<div className="text-center py-12 text-neutral-500 text-sm"><Building2 size={28} className="mx-auto mb-3 text-neutral-700" />No se encontraron proveedores verificables. Prueba otro país o quita filtros.</div>)}
            {!hasSearched && !loading && (<div className="text-center py-12 text-neutral-600 text-sm">Define criterios y pulsa <span className="text-red-500 font-medium">Buscar proveedores</span>.</div>)}
          </>
        )}

        {tab === "repo" && (
          <>
            {!repoLoaded ? (<div className="text-center py-12 text-neutral-500 text-sm"><Loader2 size={24} className="animate-spin text-red-500 mx-auto mb-2" />Cargando repositorio…</div>) : repo.length === 0 ? (<div className="text-center py-16 text-neutral-500 text-sm"><Inbox size={32} className="mx-auto mb-3 text-neutral-700" />Tu repositorio está vacío. Ve a <button onClick={() => setTab("search")} className="text-red-500 font-medium hover:underline">Buscar</button> y guarda proveedores.<div className="mt-5"><label className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors cursor-pointer"><Upload size={14} /> Importar CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={handleRepoImport} /></label>{repoImportMsg && <span className="ml-2 text-emerald-400">{repoImportMsg}</span>}<p className="text-[11px] text-neutral-600 mt-2 max-w-md mx-auto">¿Tenías proveedores en el artefacto? Expórtalos allá (botón <span className="text-neutral-400">CSV</span> del Repositorio) e impórtalos aquí para recuperarlos.</p></div></div>) : (<>
              <div className="flex flex-wrap items-center gap-3 mb-5"><div className="flex items-center gap-4 text-xs"><span className="text-neutral-400">{repoStats.total} guardados</span><span className="text-emerald-400">{repoStats.potential} con potencial</span><span className="text-red-400">{repoStats.contacted} contactados</span></div><div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5"><button onClick={() => setRepoView("list")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${repoView === "list" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"}`}><List size={13} /> Lista</button><button onClick={() => setRepoView("map")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${repoView === "map" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-200"}`}><Map size={13} /> Mapa</button></div><div className="flex-1" />{repoImportMsg && <span className="text-[11px] text-emerald-400">{repoImportMsg}</span>}<label className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors cursor-pointer"><Upload size={14} /> Importar<input type="file" accept=".csv,text/csv" className="hidden" onChange={handleRepoImport} /></label><button onClick={exportRepoCSV} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors"><Download size={14} /> CSV</button>{confirmClear ? (<span className="inline-flex items-center gap-2 text-xs"><span className="text-neutral-400">¿Vaciar todo?</span><button onClick={() => { commitRepo([]); setConfirmClear(false); }} className="font-medium bg-red-600 text-white px-2.5 py-1 rounded">Sí</button><button onClick={() => setConfirmClear(false)} className="text-neutral-400 px-2 py-1">Cancelar</button></span>) : (<button onClick={() => setConfirmClear(true)} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-400 px-3 py-1.5 rounded-lg hover:border-red-700 hover:text-red-400 transition-colors"><Trash2 size={14} /> Vaciar</button>)}</div>
              <div className="flex flex-wrap items-center gap-2 mb-5 text-xs"><span className="text-[10px] uppercase tracking-wider text-neutral-600">Filtrar:</span><select value={repoFilterPot} onChange={(e) => setRepoFilterPot(e.target.value)} className={selCls}><option value="all">Potencial: todos</option><option value="yes">Con potencial</option><option value="no">Descartados</option><option value="unset">Sin evaluar</option></select><select value={repoFilterContacted} onChange={(e) => setRepoFilterContacted(e.target.value)} className={selCls}><option value="all">Contacto: todos</option><option value="yes">Contactados</option><option value="no">No contactados</option></select><select value={repoFilterCountry} onChange={(e) => setRepoFilterCountry(e.target.value)} className={selCls}><option value="all">País: todos</option>{repoCountries.map((c) => (<option key={c} value={c}>{c}</option>))}</select><span className="text-neutral-600">{repoDisplayed.length} mostrados</span></div>
              {repoView === "map" ? (<>
                {repoDisplayed.length === 0 ? (<p className="text-center py-8 text-neutral-500 text-sm">Ningún proveedor coincide con los filtros.</p>) : (<div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-2 mb-3"><WorldMap suppliers={repoDisplayed} /></div>)}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-[11px]">{Object.values(COUNTRY_META).map((m) => (<span key={m.label} className="inline-flex items-center gap-1.5 text-neutral-400"><span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />{m.label}</span>))}<span className="inline-flex items-center gap-1.5 text-neutral-500"><span className="inline-block h-2 w-2 bg-sky-500/60 rotate-45" /> puerto</span><span className="text-neutral-600">· línea roja = puerto más cercano · tamaño del punto = score · sólido = ubic. exacta · punteado = aprox · clic = Google Maps</span></div>
                {(() => { const un = repoDisplayed.filter((s) => !getSupplierCoords(s)).length; return un > 0 ? <p className="text-[11px] text-amber-300/80 mb-2 flex items-center gap-1.5"><AlertTriangle size={12} /> {un} proveedor(es) sin ubicación reconocible — no aparecen en el mapa.</p> : null; })()}
              </>) : (<div className="space-y-3">{repoDisplayed.map((r) => { const og = originStyle(r.cptppOrigin); const web = normalizeUrl(r.website); const src = normalizeUrl(r.sourceUrl); const mech = certMechanismFor(r.country); return (
                <div key={r.id} className={`bg-neutral-900/60 border rounded-xl p-4 ${r.potential === "yes" ? "border-emerald-600/40" : r.potential === "no" ? "border-neutral-800 opacity-70" : "border-neutral-800"}`}>
                  <div className="flex items-start gap-3"><span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded border ${scoreColor(r.affinityScore)}`}>{r.affinityScore ?? "—"}</span><div className="flex-1 min-w-0"><h3 className={`font-semibold text-neutral-100 leading-tight truncate ${r.potential === "no" ? "line-through text-neutral-400" : ""}`}>{r.company}</h3><div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5"><MapPin size={11} />{!isEmpty(r.country) && <span className="text-neutral-400">{r.country}</span>}<span>{[r.city, r.province].filter((x) => !isEmpty(x)).join(", ")}</span></div></div><button onClick={() => commitRepo(repo.filter((x) => x.id !== r.id))} title="Eliminar" className="shrink-0 text-neutral-600 hover:text-red-400 transition-colors p-1"><Trash2 size={15} /></button></div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-3"><span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${og.cls}`}>{og.icon && <Check size={11} />}{og.label}</span>{mech && <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500"><FileBadge size={10} /> {mech}</span>}{(() => { const np = supplierNearestPort(r); return np ? <span className="inline-flex items-center gap-1 text-[11px] text-sky-300/80"><Anchor size={10} /> {np.port.name} ~{Math.round(np.dist)} km</span> : null; })()}{!isEmpty(r.nearestPort) && <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500"><Anchor size={10} /> {r.nearestPort}</span>}{!isEmpty(r.indicativeFobUsd) && <span className="text-[11px] text-neutral-500">FOB: {r.indicativeFobUsd}</span>}<div className="flex-1" />{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Globe size={11} /> Web</a>}{!isEmpty(r.email) && <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Mail size={11} /> Email</a>}<button onClick={() => openOutreach(r)} className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Sparkles size={11} /> Correo IA</button><button onClick={() => openEnrich(r)} className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Wand2 size={11} /> Enriquecer</button>{gmapsUrl(r) && <a href={gmapsUrl(r)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"><MapPin size={11} /> Google Maps</a>}{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400">Fuente <ExternalLink size={10} /></a>}</div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 pt-3 border-t border-neutral-800">
                    <div className="flex items-center gap-1.5"><span className="text-[10px] uppercase tracking-wider text-neutral-600 mr-0.5">Potencial</span><SegBtn active={(r.potential || "unset") === "unset"} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, potential: "unset" } : x))} color="bg-neutral-700 border-neutral-600 text-neutral-100">Sin evaluar</SegBtn><SegBtn active={r.potential === "yes"} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, potential: "yes" } : x))} color="bg-emerald-600 border-emerald-600 text-white">Con potencial</SegBtn><SegBtn active={r.potential === "no"} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, potential: "no" } : x))} color="bg-neutral-600 border-neutral-600 text-neutral-200">Descartado</SegBtn></div>
                    <div className="flex items-center gap-1.5"><span className="text-[10px] uppercase tracking-wider text-neutral-600 mr-0.5">Contacto</span><SegBtn active={!r.contacted} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, contacted: false } : x))} color="bg-neutral-700 border-neutral-600 text-neutral-100">No contactado</SegBtn><SegBtn active={r.contacted} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, contacted: true } : x))} color="bg-red-600 border-red-600 text-white">Contactado</SegBtn></div>
                  </div>
                  <input type="text" value={r.notes || ""} onChange={(e) => patchLocal(r.id, { notes: e.target.value })} onBlur={persistNow} placeholder="Notas (cotización, lead time, contacto…)" className="mt-3 w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-red-600 focus:outline-none" />
                </div>); })}</div>)}
            </>)}
          </>
        )}

        {tab === "comp" && (
          <>
            <div className="flex items-start gap-2 text-[11px] text-neutral-500 mb-2 border-l-2 border-red-600/50 pl-3"><Swords size={14} className="text-red-500 mt-0.5 shrink-0" /><span>Inteligencia de competencia en México: cada empresa se cataloga y recibe un <span className="text-neutral-300">Índice de Fuerza Competitiva</span> (tamaño, alcance, integración, catálogo, web y sofisticación comercial).</span></div>
            <div className="flex items-start gap-2 text-[11px] text-neutral-500 mb-6 border-l-2 border-neutral-700 pl-3"><Gauge size={14} className="text-neutral-500 mt-0.5 shrink-0" /><span>Los scores son estimaciones de la IA sobre huella web pública, no auditorías. El "tamaño" es inferido; tómalos como aproximación y ajústalos con tu conocimiento de campo.</span></div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 mb-6">
              <Label>¿Qué competencia buscas?</Label>
              <div className="flex flex-col sm:flex-row gap-3"><input type="text" value={compQuery} onChange={(e) => setCompQuery(e.target.value)} placeholder="ej. costales para azúcar, big bags, sacos para grano…" className={fieldCls} /><button onClick={() => searchComp()} disabled={compLoading} className="shrink-0 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">{compLoading ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}{compLoading ? "Analizando…" : "Buscar y evaluar"}</button></div>
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <Label>¿Conoces un competidor que falta? Pega su sitio web</Label>
                <div className="flex flex-col sm:flex-row gap-3"><input type="text" value={compUrl} onChange={(e) => setCompUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addCompByUrl(); }} placeholder="https://empresa-competidora.com  ·  (o el nombre de la empresa)" className={fieldCls} /><button onClick={addCompByUrl} disabled={compUrlLoading} className="shrink-0 inline-flex items-center justify-center gap-2 border border-red-700/60 text-red-300 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-6 py-2.5 rounded-lg transition-colors">{compUrlLoading ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}{compUrlLoading ? "Analizando…" : "Analizar y agregar"}</button></div>
                {compUrlError && <p className="text-[11px] text-red-300 mt-2 flex items-center gap-1.5"><AlertTriangle size={12} /> {compUrlError}</p>}
                <p className="text-[11px] text-neutral-600 mt-2">La IA lee su sitio y la web, lo evalúa igual que los demás y lo agrega a tus resultados para que lo revises y guardes.</p>
              </div>
            </div>
            {compLoading && (<div className="text-center py-10 text-neutral-500 text-sm"><Loader2 size={26} className="animate-spin text-red-500 mx-auto mb-3" />Buscando y evaluando competidores mexicanos…<div className="text-xs text-neutral-600 mt-1">Puede tardar ~30 segundos.</div></div>)}
            {compError && !compLoading && (<div className="bg-red-950/40 border border-red-900/60 rounded-xl p-4 mb-6"><div className="flex items-start gap-3 text-sm text-red-300"><AlertTriangle size={18} className="shrink-0 mt-0.5" /><div><div className="font-medium mb-1">No se pudo completar la búsqueda</div><div className="text-red-300/80">{compError}</div></div></div><button onClick={() => searchComp()} className="mt-3 ml-7 inline-flex items-center gap-1.5 text-xs font-medium bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors"><RotateCw size={13} /> Reintentar</button></div>)}
            {!compLoading && compSearched && compResults.length > 0 && (<>
              {compSummary && <p className="text-sm text-neutral-400 mb-4 italic">{compSummary}</p>}
              <div className="flex flex-wrap items-center gap-3 mb-5"><span className="text-xs text-neutral-500">{compResults.length} resultado(s)</span><div className="flex-1" />{compAddedMsg && <span className="text-[11px] text-emerald-400">{compAddedMsg}</span>}<button onClick={() => searchComp(true)} disabled={compLoading || compAppending} className="inline-flex items-center gap-1.5 text-xs font-medium border border-red-700/60 text-red-300 px-3 py-1.5 rounded-lg hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{compAppending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Buscar más</button><button onClick={saveAllToComp} className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"><Bookmark size={14} /> Guardar todos</button></div>
              <div className="grid gap-4 md:grid-cols-2 mb-8">{compResults.map((c) => (<CompCard key={c._id} c={c} saved={isInComp(c)} onToggle={() => toggleCompOne(c)} />))}</div>
            </>)}
            {!compLoading && compSearched && compResults.length === 0 && !compError && (<div className="text-center py-10 text-neutral-500 text-sm"><Building2 size={26} className="mx-auto mb-3 text-neutral-700" />Sin resultados verificables. Prueba otras palabras clave.</div>)}

            <div className="flex items-center justify-between gap-2 mb-4 mt-2">
              <div className="flex items-center gap-2"><Database size={16} className="text-neutral-400" /><h2 className="text-sm font-semibold text-neutral-200">Directorio de competencia</h2>{competitors.length > 0 && <span className="text-[10px] bg-neutral-700 text-neutral-300 px-1.5 py-0.5 rounded-full">{competitors.length}</span>}</div>
              {competitors.length > 0 && (<div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5"><button onClick={() => setCompView("list")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${compView === "list" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"}`}><List size={13} /> Lista</button><button onClick={() => setCompView("map")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${compView === "map" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-200"}`}><Map size={13} /> Mapa</button></div>)}
            </div>

            {competitors.length > 0 && (<div className="flex flex-wrap items-center gap-2 mb-3 text-xs"><span className="inline-flex items-center gap-1.5 text-neutral-300"><Crosshair size={13} className="text-red-500" /> Tu planta:</span><select value={plantState} onChange={(e) => setPlantState(e.target.value)} className={selCls}>{MX_STATES.map((st) => (<option key={st.n} value={st.n}>{st.n}</option>))}</select><span className="text-neutral-600">— las distancias a cada competidor se miden desde aquí</span></div>)}
            {competitors.length > 0 && (<div className="flex items-center gap-4 text-xs mb-4"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-neutral-400">{tierCount.A} Tier A</span></span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-neutral-400">{tierCount.B} Tier B</span></span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-neutral-500" /><span className="text-neutral-400">{tierCount.C} Tier C</span></span></div>)}

            {!compLoaded ? (<div className="text-center py-8 text-neutral-500 text-sm"><Loader2 size={22} className="animate-spin text-red-500 mx-auto mb-2" />Cargando…</div>) : competitors.length === 0 ? (<div className="text-center py-10 text-neutral-600 text-sm border border-dashed border-neutral-800 rounded-xl"><Inbox size={26} className="mx-auto mb-2 text-neutral-700" />Aún no guardas competidores. Busca arriba y pulsa Guardar para catalogarlos, puntuarlos y mapearlos.<div className="mt-5"><label className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors cursor-pointer"><Upload size={14} /> Importar CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCompImport} /></label>{compImportMsg && <span className="ml-2 text-emerald-400">{compImportMsg}</span>}<p className="text-[11px] text-neutral-600 mt-2 max-w-md mx-auto">¿Tenías competidores en el artefacto? Expórtalos allá (botón <span className="text-neutral-400">CSV</span> de Competencia MX) e impórtalos aquí.</p></div></div>) : compView === "map" ? (
              <>
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-2 mb-3"><MexicoMap competitors={competitors} plant={plant} /></div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2 text-[11px]">{SEG_COLORS.slice(0, 4).map((sg) => (<span key={sg.key} className="inline-flex items-center gap-1.5 text-neutral-400"><span className="h-2.5 w-2.5 rounded-full" style={{ background: sg.color }} />{sg.label}</span>))}<span className="text-neutral-600">· tamaño del punto = fuerza competitiva · sólido = ubic. exacta · punteado = aprox · clic = Google Maps</span></div>
                {unplaced > 0 && <p className="text-[11px] text-amber-300/80 mb-4 flex items-center gap-1.5"><AlertTriangle size={12} /> {unplaced} competidor(es) sin ubicación reconocible — no aparecen en el mapa.</p>}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 mt-2">
                  <div className="flex items-center gap-2 mb-3"><MapPin size={14} className="text-red-500" /><h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Concentración por estado — zona de influencia</h3></div>
                  <div className="space-y-2">{stateRanking.map(([st, n]) => (<div key={st} className="flex items-center gap-3"><span className="text-xs text-neutral-300 w-40 shrink-0 truncate">{st}</span><div className="flex-1 bg-neutral-800 rounded-full h-2.5 overflow-hidden"><div className="bg-red-600 h-full rounded-full" style={{ width: `${(n / maxCount) * 100}%` }} /></div><span className="text-xs text-neutral-400 w-6 text-right">{n}</span></div>))}</div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs"><select value={compSort} onChange={(e) => setCompSort(e.target.value)} className={selCls}><option value="score">Ordenar: Fuerza ↓</option><option value="recent">Ordenar: Recientes</option></select><select value={compFilterTier} onChange={(e) => setCompFilterTier(e.target.value)} className={selCls}><option value="all">Tier: todos</option><option value="A">Tier A</option><option value="B">Tier B</option><option value="C">Tier C</option></select><select value={compFilterSeg} onChange={(e) => setCompFilterSeg(e.target.value)} className={selCls}><option value="all">Segmento: todos</option><option value="fabric">Fabricantes</option><option value="import">Importadores</option><option value="distrib">Distribuidores</option><option value="comerc">Comercializadores</option></select><select value={compFilterState} onChange={(e) => setCompFilterState(e.target.value)} className={selCls}><option value="all">Estado: todos</option>{compStates.map((s) => (<option key={s} value={s}>{s}</option>))}</select><Chip active={compFilterPhone} onClick={() => setCompFilterPhone((v) => !v)}>Solo con teléfono</Chip><span className="text-neutral-600">{compDisplayed.length} mostrados</span><div className="flex-1" />{compImportMsg && <span className="text-[11px] text-emerald-400">{compImportMsg}</span>}<label className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors cursor-pointer"><Upload size={14} /> Importar<input type="file" accept=".csv,text/csv" className="hidden" onChange={handleCompImport} /></label><button onClick={() => exportCompCSV(compDisplayed)} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors"><Download size={14} /> CSV</button>{confirmClearComp ? (<span className="inline-flex items-center gap-2"><span className="text-neutral-400">¿Vaciar?</span><button onClick={() => { commitComp([]); setConfirmClearComp(false); }} className="font-medium bg-red-600 text-white px-2.5 py-1 rounded">Sí</button><button onClick={() => setConfirmClearComp(false)} className="text-neutral-400 px-2 py-1">Cancelar</button></span>) : (<button onClick={() => setConfirmClearComp(true)} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-400 px-3 py-1.5 rounded-lg hover:border-red-700 hover:text-red-400 transition-colors"><Trash2 size={14} /> Vaciar</button>)}</div>
                <div className="space-y-3">{compDisplayed.map((c) => { const web = normalizeUrl(c.website); const src = normalizeUrl(c.sourceUrl); const tel = telHref(c.phone); return (
                  <div key={c.id} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                    <div className="flex items-start gap-3"><div className="flex-1 min-w-0"><CompScoreHeader c={c} /></div><button onClick={() => commitComp(competitors.filter((x) => x.id !== c.id))} title="Eliminar" className="shrink-0 text-neutral-600 hover:text-red-400 transition-colors p-1"><Trash2 size={15} /></button></div>
                    {hasScores(c) && <ScoreBreakdown c={c} />}
                    {!isEmpty(c.scoreNote) && <p className="text-[11px] text-neutral-500 mt-2 italic">{c.scoreNote}</p>}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">{tel ? (<a href={tel} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-100 hover:text-red-400 transition-colors"><Phone size={15} className="text-red-500" /> {c.phone}</a>) : (<span className="inline-flex items-center gap-2 text-xs text-neutral-600"><Phone size={13} /> Teléfono no disponible</span>)}{(() => { const d = compDistanceKm(c); return d != null ? <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400"><Navigation size={11} className="text-red-500" /> ~{Math.round(d)} km de {plantState}</span> : null; })()}{!isEmpty(c.priceNote) && <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90"><Tag size={11} /> {c.priceNote}</span>}<div className="flex-1" />{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Globe size={11} /> Web</a>}{!isEmpty(c.email) && <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Mail size={11} /> Email</a>}{gmapsUrl(c) && <a href={gmapsUrl(c)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"><MapPin size={11} /> Google Maps</a>}{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400">Fuente <ExternalLink size={10} /></a>}</div>
                    <input type="text" value={c.userNotes || ""} onChange={(e) => patchCompLocal(c.id, { userNotes: e.target.value })} onBlur={persistCompNow} placeholder="Notas (precios vistos, posicionamiento, clientes…)" className="mt-3 w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-red-600 focus:outline-none" />
                  </div>); })}</div>
              </>
            )}
          </>
        )}
      </div>
      {outreach.open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={closeOutreach}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2"><Sparkles size={18} className="text-red-500" /><h3 className="font-semibold text-neutral-100 leading-tight">Correo de cotización · {outreach.supplier?.company}</h3></div>
              <button onClick={closeOutreach} aria-label="Cerrar" className="text-neutral-500 hover:text-neutral-200 shrink-0"><X size={18} /></button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] text-neutral-500">Idioma:</span>
              <div className="flex gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
                <button onClick={() => runOutreach(outreach.supplier, "en")} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${outreach.lang === "en" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"}`}>English</button>
                <button onClick={() => runOutreach(outreach.supplier, "es")} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${outreach.lang === "es" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"}`}>Español</button>
              </div>
              <button onClick={() => runOutreach(outreach.supplier, outreach.lang)} disabled={outreach.loading} className="inline-flex items-center gap-1.5 text-xs text-neutral-300 border border-neutral-700 rounded-lg px-2.5 py-1 hover:border-neutral-500 disabled:opacity-50"><RotateCw size={13} /> Regenerar</button>
            </div>
            {outreach.loading ? (
              <div className="text-center py-12 text-neutral-500 text-sm"><Loader2 size={24} className="animate-spin text-red-500 mx-auto mb-2" />Redactando correo…</div>
            ) : outreach.error ? (
              <div className="bg-red-950/40 border border-red-900/60 rounded-lg p-3 text-sm text-red-300 flex items-start gap-2"><AlertTriangle size={16} className="shrink-0 mt-0.5" /><span>{outreach.error}</span></div>
            ) : (
              <>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500">Asunto</label>
                <div className="flex gap-2 mt-1 mb-3">
                  <input value={outreach.subject} onChange={(e) => setOutreach((o) => ({ ...o, subject: e.target.value }))} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 focus:border-red-600 focus:outline-none" />
                  <button onClick={() => copyOut("subject")} className="text-xs border border-neutral-700 rounded-lg px-2.5 hover:border-neutral-500 inline-flex items-center gap-1 text-neutral-300"><Copy size={13} />{outreach.copied === "subject" ? "✓" : ""}</button>
                </div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-500">Mensaje</label>
                <textarea value={outreach.body} onChange={(e) => setOutreach((o) => ({ ...o, body: e.target.value }))} rows={12} className="w-full mt-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-100 leading-relaxed focus:border-red-600 focus:outline-none" />
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button onClick={() => copyOut("all")} className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"><Copy size={14} /> {outreach.copied === "all" ? "Copiado ✓" : "Copiar todo"}</button>
                  {!isEmpty(outreach.supplier?.email) && <a href={`mailto:${outreach.supplier.email}?subject=${encodeURIComponent(outreach.subject)}&body=${encodeURIComponent(outreach.body)}`} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors"><Mail size={14} /> Abrir en correo</a>}
                </div>
                <p className="text-[11px] text-neutral-600 mt-3">Revísalo y edítalo antes de enviar — la IA puede equivocarse en datos del proveedor.</p>
              </>
            )}
          </div>
        </div>
      )}
      {enrich.open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={closeEnrich}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl w-full max-w-xl max-h-[90vh] overflow-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2"><Wand2 size={18} className="text-red-500" /><h3 className="font-semibold text-neutral-100 leading-tight">Enriquecer · {enrich.supplier?.company}</h3></div>
              <button onClick={closeEnrich} aria-label="Cerrar" className="text-neutral-500 hover:text-neutral-200 shrink-0"><X size={18} /></button>
            </div>
            {enrich.loading ? (
              <div className="text-center py-12 text-neutral-500 text-sm"><Loader2 size={24} className="animate-spin text-red-500 mx-auto mb-2" />Buscando más datos en la web…<div className="text-xs text-neutral-600 mt-1">Puede tardar ~30s.</div></div>
            ) : enrich.error ? (
              <div className="bg-red-950/40 border border-red-900/60 rounded-lg p-3 text-sm text-red-300 flex items-start gap-2"><AlertTriangle size={16} className="shrink-0 mt-0.5" /><span>{enrich.error}</span></div>
            ) : enrich.data ? (
              <>
                <div className="space-y-2 text-sm">
                  {[["Email", enrich.data.email], ["Teléfono", enrich.data.phone], ["WhatsApp", enrich.data.whatsapp], ["Contacto", enrich.data.contactPerson], ["Dirección", enrich.data.address], ["Sitio web", enrich.data.website], ["Capacidades", enrich.data.capabilities]].map(([k, v]) => (
                    <div key={k} className="flex gap-2"><span className="text-[11px] uppercase tracking-wider text-neutral-500 w-24 shrink-0 pt-0.5">{k}</span><span className={`flex-1 ${isEmpty(v) ? "text-neutral-600" : "text-neutral-200"}`}>{isEmpty(v) ? "no disponible" : v}</span></div>
                  ))}
                  {Array.isArray(enrich.data.products) && enrich.data.products.length > 0 && <div className="flex gap-2"><span className="text-[11px] uppercase tracking-wider text-neutral-500 w-24 shrink-0 pt-0.5">Productos</span><span className="flex-1 text-neutral-200">{enrich.data.products.join(", ")}</span></div>}
                  {Array.isArray(enrich.data.certifications) && enrich.data.certifications.length > 0 && <div className="flex gap-2"><span className="text-[11px] uppercase tracking-wider text-neutral-500 w-24 shrink-0 pt-0.5">Certificac.</span><span className="flex-1 text-neutral-200">{enrich.data.certifications.join(", ")}</span></div>}
                </div>
                {!isEmpty(enrich.data.sourceUrl) && <a href={normalizeUrl(enrich.data.sourceUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-400 mt-3">Fuente <ExternalLink size={12} /></a>}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-800">
                  <button onClick={applyEnrich} className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"><BookmarkCheck size={14} /> Guardar en repositorio</button>
                  {enrich.savedMsg && <span className="text-xs text-emerald-400">{enrich.savedMsg}</span>}
                  <div className="flex-1" />
                  <button onClick={() => runEnrich(enrich.supplier)} className="inline-flex items-center gap-1.5 text-xs text-neutral-300 border border-neutral-700 rounded-lg px-2.5 py-1 hover:border-neutral-500"><RotateCw size={13} /> Reintentar</button>
                </div>
                <p className="text-[11px] text-neutral-600 mt-3">Datos extraídos por IA de la web pública — verifícalos antes de usarlos.</p>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
