import { useState, useEffect, useRef } from "react";
import { Search, Package, MapPin, Globe, Mail, Phone, ExternalLink, Download, Check, Loader2, AlertTriangle, Anchor, ShieldCheck, Building2, ChevronDown, Factory, Target, TrendingDown, TrendingUp, RotateCw, FileBadge, Bookmark, BookmarkCheck, Trash2, Database, Inbox, Swords, Tag, Map, List, Gauge } from "lucide-react";

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

const SYSTEM_PROMPT = `Eres un investigador de abastecimiento (sourcing) industrial especializado en proveedores de los países miembros del TIPAT/CPTPP. Encuentras FABRICANTES REALES y verificables usando la herramienta de búsqueda web.

REGLA ABSOLUTA ANTI-ALUCINACIÓN:
- Solo incluye un proveedor si encontraste evidencia web real con URL verificable de tus búsquedas.
- NUNCA inventes empresas, contactos, capacidades, precios ni URLs.
- Si un dato no aparece en las fuentes, escribe "no disponible". No supongas.
- Cada proveedor DEBE tener sourceUrl con URL real.
- indicativeFobUsd: precio FOB por unidad en USD SOLO si aparece en fuente pública. Si no, "no disponible". Jamás estimes precios.

country: país del fabricante; DEBE ser uno de los 12 miembros del TIPAT/CPTPP (${ALL_TIPAT}).
cptppOrigin: "sí" si hay indicio de exportación bajo preferencia CPTPP o elegibilidad de origen CPTPP; "no" si no; "desconocido" si no hay info.
affinityScore entero (0-100) según coincidencia con: producto, país, specs, MOQ y certificaciones.

IMPORTANTE: Responde un JSON CORTO. Máximo 6 proveedores. Solo el objeto JSON, sin markdown. Estructura:
{"suppliers":[{"company":"","country":"","city":"","province":"","nearestPort":"","products":[""],"estimatedCapacity":"","certifications":[""],"cptppOrigin":"","indicativeFobUsd":"","website":"","email":"","phone":"","sourceUrl":"","affinityScore":0,"scoreRationale":""}],"searchSummary":""}

Devuelve hasta 6 proveedores reales. Si país específico, todos de ese país. Si "todos", prioriza variedad y hubs de PP (Vietnam, Malasia, México). Sé conciso.`;

const COMP_SYSTEM_PROMPT = `Eres un analista de inteligencia competitiva del mercado MEXICANO de costales y sacos de polipropileno (PP). Encuentras y EVALÚAS empresas mexicanas reales que compiten en ese mercado, usando la herramienta de búsqueda web.

REGLA ABSOLUTA ANTI-ALUCINACIÓN:
- Solo incluye una empresa si hay evidencia web real con URL verificable.
- NUNCA inventes empresas, teléfonos, contactos, precios, coordenadas ni URLs.
- Si un dato no aparece, escribe "no disponible". No supongas.
- Cada empresa DEBE tener sourceUrl con URL real. Prioriza EXTRAER el TELÉFONO.
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

IMPORTANTE: JSON CORTO. Máximo 5 empresas. Solo el objeto JSON, sin markdown. Estructura:
{"competitors":[{"company":"","segment":"","state":"","city":"","lat":0,"lng":0,"phone":"","website":"","email":"","products":[""],"priceNote":"","scaleSize":0,"webQuality":0,"catalogBreadth":0,"geoReach":0,"commercialSoph":0,"scoreNote":"","sourceUrl":"","note":""}],"searchSummary":""}

Devuelve hasta 5 empresas mexicanas reales. Evalúa con honestidad sobre evidencia. Sé conciso.`;

function scoreColor(s) { const n = Number(s) || 0; if (n >= 80) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"; if (n >= 60) return "bg-amber-500/15 text-amber-300 border-amber-500/30"; return "bg-neutral-500/15 text-neutral-300 border-neutral-600/40"; }
function originStyle(v) { const val = (v || "").toString().toLowerCase(); if (val.startsWith("s") || val === "yes") return { label: "Elegible TIPAT", icon: true, cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" }; if (val.startsWith("n") || val === "no") return { label: "Sin preferencia TIPAT", icon: false, cls: "bg-red-500/15 text-red-300 border-red-500/30" }; return { label: "TIPAT por confirmar", icon: false, cls: "bg-neutral-700/40 text-neutral-400 border-neutral-600/40" }; }
function segmentStyle(seg) { const s = (seg || "").toLowerCase(); if (s.includes("fabric")) return { label: "Fabricante", cls: "bg-red-500/15 text-red-300 border-red-500/30" }; if (s.includes("import")) return { label: "Importador", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" }; if (s.includes("distrib")) return { label: "Distribuidor", cls: "bg-sky-500/15 text-sky-300 border-sky-500/30" }; if (s.includes("comerc")) return { label: "Comercializador", cls: "bg-neutral-600/30 text-neutral-300 border-neutral-600/40" }; return { label: seg || "—", cls: "bg-neutral-700/40 text-neutral-400 border-neutral-600/40" }; }
function segKey(seg) { const s = (seg || "").toLowerCase(); if (s.includes("fabric")) return "fabric"; if (s.includes("import")) return "import"; if (s.includes("distrib")) return "distrib"; if (s.includes("comerc")) return "comerc"; return "other"; }
const isEmpty = (v) => !v || /^(no disponible|n\/a|null|desconocido)$/i.test(String(v).trim());
function normalizeUrl(u) { if (isEmpty(u)) return null; const s = String(u).trim(); return /^https?:\/\//i.test(s) ? s : `https://${s}`; }
function telHref(phone) { if (isEmpty(phone)) return null; const d = String(phone).replace(/[^\d+]/g, ""); return d ? `tel:${d}` : null; }
function firstNum(str) { const m = String(str || "").match(/[\d.]+/); return m ? parseFloat(m[0]) : null; }
function num(v) { const n = parseFloat(v); return Number.isFinite(n) ? n : null; }
function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(); }
function portMatch(a, b) { if (!b || isEmpty(a)) return null; const k = b.toLowerCase().split(/[\s(/]/)[0].trim(); return k ? a.toLowerCase().includes(k) : null; }
function sameCountryAs(a, b) { if (isEmpty(a) || isEmpty(b)) return null; const k = b.toLowerCase().split(/[\s(/]/)[0].trim(); return k ? a.toLowerCase().includes(k) : null; }
function certMechanismFor(country) { if (isEmpty(country)) return null; if (country.toLowerCase().includes("vietnam")) return "Cert. emitido por autoridad (eCoSys/VCCI)"; return "Auto-certificación (exportador)"; }
function makeId(s) { return `${(s.company || "").trim().toLowerCase()}|${(s.country || s.state || "").trim().toLowerCase()}`; }
function jitter(id, amt) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; const r = (Math.abs(h) % 1000) / 1000 - 0.5; return r * amt; }
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
async function callClaude(systemPrompt, userPrompt, arrKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: systemPrompt, messages: [{ role: "user", content: userPrompt }], tools: [{ type: "web_search_20250305", name: "web_search" }] }) });
  let data; try { data = await res.json(); } catch (_) { throw new Error(`La API respondió ${res.status} y no se pudo leer. Reintenta.`); }
  if (data && (data.type === "error" || data.error)) throw new Error(data.error?.message || "La API devolvió un error. Reintenta.");
  if (!data || !Array.isArray(data.content)) throw new Error("Respuesta inesperada de la API. Reintenta.");
  const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  if (!text.trim()) throw new Error("La búsqueda no devolvió texto (tardó demasiado). Reintenta.");
  const parsed = robustParse(text, arrKey); const list = (parsed && parsed[arrKey]) || [];
  if (list.length === 0) throw new Error("La respuesta llegó incompleta o vacía. Reintenta o acota los criterios.");
  return { list, summary: (parsed && parsed.searchSummary) || "" };
}
function downloadCsv(rows, name) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

function MexicoMap({ competitors }) {
  const LNG_MIN = -118.5, LNG_MAX = -86.0, LAT_MIN = 14.0, LAT_MAX = 33.0;
  const COSF = Math.cos((23.5 * Math.PI) / 180);
  const W = 820, pad = 26;
  const s = (W - 2 * pad) / ((LNG_MAX - LNG_MIN) * COSF);
  const H = Math.round((LAT_MAX - LAT_MIN) * s + 2 * pad);
  const project = (lat, lng) => [pad + (lng - LNG_MIN) * COSF * s, pad + (LAT_MAX - lat) * s];
  const toPath = (pts) => pts.map((p, i) => { const [x, y] = project(p[0], p[1]); return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ") + " Z";
  const placed = competitors.map((c) => {
    const co = getCoords(c); if (!co) return null;
    let lat = co.lat, lng = co.lng;
    if (co.approx) { lat += jitter(c.id, 0.6); lng += jitter(c.id + "x", 0.6); }
    const sg = SEG_COLORS.find((x) => x.key === segKey(c.segment)) || SEG_COLORS[4];
    return { c, p: project(lat, lng), color: sg.color, label: sg.label, r: hasScores(c) ? 4 + (compositeScore(c) / 100) * 9 : 5, big: hasScores(c) && compositeScore(c) >= 70 };
  }).filter(Boolean);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ display: "block" }}>
      <rect x="0" y="0" width={W} height={H} fill="#0a0a0a" />
      <path d={toPath(MX_MAINLAND)} fill="#1f1f1f" stroke="#525252" strokeWidth="1.2" strokeLinejoin="round" />
      <path d={toPath(MX_BAJA)} fill="#1f1f1f" stroke="#525252" strokeWidth="1.2" strokeLinejoin="round" />
      {placed.map(({ c, p, color, label, r }) => (
        <circle key={c.id} cx={p[0]} cy={p[1]} r={r} fill={color} fillOpacity="0.85" stroke="#0a0a0a" strokeWidth="1.2">
          <title>{`${c.company} — ${label}${!isEmpty(c.state) ? " · " + c.state : ""}${hasScores(c) ? " · Fuerza " + compositeScore(c) : ""}${!isEmpty(c.phone) ? " · " + c.phone : ""}`}</title>
        </circle>
      ))}
      {placed.filter((x) => x.big).map(({ c, p, r }) => (
        <text key={c.id + "_l"} x={p[0] + r + 3} y={p[1] + 3.5} fontSize="10" fill="#e5e5e5" stroke="#0a0a0a" strokeWidth="0.6" paintOrder="stroke">{c.company.length > 16 ? c.company.slice(0, 15) + "…" : c.company}</text>
      ))}
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
  const [loading, setLoading] = useState(false); const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]); const [summary, setSummary] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState("score"); const [onlyCptpp, setOnlyCptpp] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");

  const [repo, setRepo] = useState([]); const [repoLoaded, setRepoLoaded] = useState(false);
  const repoRef = useRef([]);
  const [repoFilterPot, setRepoFilterPot] = useState("all"); const [repoFilterContacted, setRepoFilterContacted] = useState("all"); const [repoFilterCountry, setRepoFilterCountry] = useState("all");
  const [confirmClear, setConfirmClear] = useState(false);

  const [compQuery, setCompQuery] = useState("costales y sacos de polipropileno");
  const [compLoading, setCompLoading] = useState(false); const [compError, setCompError] = useState(null);
  const [compResults, setCompResults] = useState([]); const [compSummary, setCompSummary] = useState("");
  const [compSearched, setCompSearched] = useState(false); const [compAddedMsg, setCompAddedMsg] = useState("");
  const [competitors, setCompetitors] = useState([]); const [compLoaded, setCompLoaded] = useState(false);
  const compRef = useRef([]);
  const [compFilterSeg, setCompFilterSeg] = useState("all"); const [compFilterState, setCompFilterState] = useState("all"); const [compFilterTier, setCompFilterTier] = useState("all"); const [compSort, setCompSort] = useState("score");
  const [confirmClearComp, setConfirmClearComp] = useState(false);
  const [compView, setCompView] = useState("list");

  useEffect(() => {
    let on = true;
    (async () => {
      try { const r = await window.storage.get(STORAGE_KEY); const p = r && r.value ? JSON.parse(r.value) : []; if (on && Array.isArray(p)) { setRepo(p); repoRef.current = p; } } catch (_) {} finally { if (on) setRepoLoaded(true); }
      try { const r2 = await window.storage.get(KEY_COMP); const p2 = r2 && r2.value ? JSON.parse(r2.value) : []; if (on && Array.isArray(p2)) { setCompetitors(p2); compRef.current = p2; } } catch (_) {} finally { if (on) setCompLoaded(true); }
    })();
    return () => { on = false; };
  }, []);

  function commitRepo(next) { setRepo(next); repoRef.current = next; window.storage.set(STORAGE_KEY, JSON.stringify(next)).catch(() => {}); }
  function patchLocal(id, patch) { setRepo((prev) => { const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r)); repoRef.current = next; return next; }); }
  function persistNow() { window.storage.set(STORAGE_KEY, JSON.stringify(repoRef.current)).catch(() => {}); }
  function addToRepo(list) { const ex = new Set(repoRef.current.map((r) => r.id)); const ad = []; list.forEach((s) => { const id = makeId(s); if (s.company && !ex.has(id)) { ad.push({ id, ...s, potential: "unset", contacted: false, notes: "", savedAt: Date.now() }); ex.add(id); } }); if (ad.length) commitRepo([...ad, ...repoRef.current]); return ad.length; }
  const isInRepo = (s) => repo.some((r) => r.id === makeId(s));
  function toggleRepoOne(s) { const id = makeId(s); if (repo.some((r) => r.id === id)) commitRepo(repo.filter((r) => r.id !== id)); else addToRepo([s]); }
  function saveAllToRepo() { const n = addToRepo(suppliers); setAddedMsg(n > 0 ? `${n} agregado(s)` : "Ya estaban guardados"); setTimeout(() => setAddedMsg(""), 2500); }

  function commitComp(next) { setCompetitors(next); compRef.current = next; window.storage.set(KEY_COMP, JSON.stringify(next)).catch(() => {}); }
  function patchCompLocal(id, patch) { setCompetitors((prev) => { const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r)); compRef.current = next; return next; }); }
  function persistCompNow() { window.storage.set(KEY_COMP, JSON.stringify(compRef.current)).catch(() => {}); }
  function addToComp(list) { const ex = new Set(compRef.current.map((r) => r.id)); const ad = []; list.forEach((s) => { const id = makeId(s); if (s.company && !ex.has(id)) { ad.push({ id, ...s, userNotes: "", savedAt: Date.now() }); ex.add(id); } }); if (ad.length) commitComp([...ad, ...compRef.current]); return ad.length; }
  const isInComp = (s) => competitors.some((r) => r.id === makeId(s));
  function toggleCompOne(s) { const id = makeId(s); if (competitors.some((r) => r.id === id)) commitComp(competitors.filter((r) => r.id !== id)); else addToComp([s]); }
  function saveAllToComp() { const n = addToComp(compResults); setCompAddedMsg(n > 0 ? `${n} agregado(s)` : "Ya estaban guardados"); setTimeout(() => setCompAddedMsg(""), 2500); }

  const toggleCert = (c) => setSelectedCerts((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const benchPrice = firstNum(benchmark.fobUsd);

  function buildUserPrompt() {
    const pt = PRODUCT_TYPES.find((p) => p.id === productType); const co = COUNTRIES.find((c) => c.id === country);
    const specs = []; if (gsm) specs.push(`GSM ~${gsm}`); if (denier) specs.push(`denier ~${denier}`); if (laminated) specs.push("laminado"); if (printed) specs.push("con impresión / flexo");
    const geo = country === "all" ? `Países: cualquiera de los 12 miembros del TIPAT/CPTPP (${ALL_TIPAT}). Prioriza hubs de PP (Vietnam, Malasia, México) y variedad geográfica.` : `País: ${co.label} (miembro TIPAT/CPTPP). Todos los fabricantes en ${co.label}.`;
    return [`Producto: ${pt.label} (${pt.query}).`, geo, specs.length ? `Specs: ${specs.join(", ")}.` : null, targetMOQ ? `MOQ objetivo: ${targetMOQ}.` : null, selectedCerts.length ? `Certificaciones deseadas: ${selectedCerts.join(", ")}.` : null, `Incluye el país de cada fabricante. Fabricantes reales y verificables con URL fuente.`].filter(Boolean).join("\n");
  }
  async function search() { setLoading(true); setError(null); try { const { list, summary } = await callClaude(SYSTEM_PROMPT, buildUserPrompt(), "suppliers"); setSuppliers(list.map((s, i) => ({ ...s, _id: i }))); setSummary(summary); setHasSearched(true); } catch (e) { setError(e.message || "Error."); setSuppliers([]); setHasSearched(true); } finally { setLoading(false); } }
  async function searchComp() {
    setCompLoading(true); setCompError(null);
    const kw = compQuery.trim() || "costales y sacos de polipropileno";
    const prompt = `Empresas en MÉXICO que fabrican, importan, distribuyen o comercializan: ${kw}. Son competidores en el mercado mexicano de costalería/empaque de polipropileno. Para cada una incluye teléfono, ubicación (estado/ciudad), coordenadas lat/lng aproximadas, segmento, y EVALÚA sus dimensiones (tamaño, calidad web, amplitud de catálogo, alcance geográfico, sofisticación comercial). Empresas reales y verificables.`;
    try { const { list, summary } = await callClaude(COMP_SYSTEM_PROMPT, prompt, "competitors"); setCompResults(list.map((s, i) => ({ ...s, _id: i }))); setCompSummary(summary); setCompSearched(true); } catch (e) { setCompError(e.message || "Error."); setCompResults([]); setCompSearched(true); } finally { setCompLoading(false); }
  }

  function exportSearchCSV() { const h = ["Empresa", "País", "Ciudad", "Puerto", "Productos", "Certificaciones", "Origen TIPAT", "Cert. origen", "FOB USD", "Web", "Email", "Telefono", "Fuente", "Score"]; const rows = suppliers.map((s) => [s.company, s.country, s.city, s.nearestPort, (s.products || []).join("; "), (s.certifications || []).join("; "), s.cptppOrigin, certMechanismFor(s.country) || "", s.indicativeFobUsd, s.website, s.email, s.phone, s.sourceUrl, s.affinityScore]); downloadCsv([h, ...rows], "busqueda_tipat_pp.csv"); }
  const POT_LABEL = { unset: "Sin evaluar", yes: "Con potencial", no: "Descartado" };
  function exportRepoCSV() { const h = ["Empresa", "País", "Ciudad", "Puerto", "Origen TIPAT", "Cert. origen", "FOB USD", "Potencial", "Contactado", "Notas", "Web", "Email", "Telefono", "Fuente", "Score"]; const rows = repo.map((r) => [r.company, r.country, r.city, r.nearestPort, r.cptppOrigin, certMechanismFor(r.country) || "", r.indicativeFobUsd, POT_LABEL[r.potential || "unset"], r.contacted ? "Sí" : "No", r.notes, r.website, r.email, r.phone, r.sourceUrl, r.affinityScore]); downloadCsv([h, ...rows], "repositorio_proveedores_tipat.csv"); }
  function exportCompCSV(src) { const h = ["Empresa", "Segmento", "Tier", "Fuerza", "Tamaño", "Alcance", "Integración", "Catálogo", "Web", "Comercial", "Estado", "Ciudad", "Telefono", "Productos", "Precio ref.", "Notas", "Sitio", "Email", "Fuente"]; const rows = src.map((c) => { const cs = hasScores(c) ? compositeScore(c) : ""; return [c.company, segmentStyle(c.segment).label, hasScores(c) ? tierOf(compositeScore(c)).key : "", cs, clamp100(c.scaleSize), clamp100(c.geoReach), verticalScore(c.segment), clamp100(c.catalogBreadth), clamp100(c.webQuality), clamp100(c.commercialSoph), c.state, c.city, c.phone, (c.products || []).join("; "), c.priceNote, c.userNotes || c.note || "", c.website, c.email, c.sourceUrl]; }); downloadCsv([h, ...rows], "competencia_mx_scoring.csv"); }

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
  if (compFilterTier !== "all") compDisplayed = compDisplayed.filter((c) => hasScores(c) && tierOf(compositeScore(c)).key === compFilterTier);
  if (compSort === "score") compDisplayed.sort((a, b) => (hasScores(b) ? compositeScore(b) : -1) - (hasScores(a) ? compositeScore(a) : -1));
  else compDisplayed.sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

  const stateCount = {};
  competitors.forEach((c) => { const k = !isEmpty(c.state) ? c.state : "Sin ubicar"; stateCount[k] = (stateCount[k] || 0) + 1; });
  const stateRanking = Object.entries(stateCount).sort((a, b) => b[1] - a[1]);
  const maxCount = stateRanking.length ? stateRanking[0][1] : 1;
  const unplaced = competitors.filter((c) => !getCoords(c)).length;

  const Chip = ({ children, active, onClick, accent }) => (<button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${active ? accent ? "bg-red-600 border-red-600 text-white" : "bg-neutral-100 border-neutral-100 text-neutral-900" : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"}`}>{children}</button>);
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
        <div className="mt-3">{tel ? (<a href={tel} className="inline-flex items-center gap-2 text-base font-semibold text-neutral-100 hover:text-red-400 transition-colors"><Phone size={16} className="text-red-500" /> {c.phone}</a>) : (<span className="inline-flex items-center gap-2 text-sm text-neutral-600"><Phone size={14} /> Teléfono no disponible</span>)}</div>
        {hasScores(c) && <ScoreBreakdown c={c} />}
        {!isEmpty(c.scoreNote) && <p className="text-[11px] text-neutral-500 mt-2 italic">{c.scoreNote}</p>}
        {!isEmpty(c.note) && <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{c.note}</p>}
        <div className="flex flex-wrap gap-1.5 mt-3">{(c.products || []).slice(0, 4).map((p, i) => (<span key={i} className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">{p}</span>))}</div>
        {!isEmpty(c.priceNote) && <div className="flex items-center gap-1.5 mt-3 text-[11px] text-amber-300/90"><Tag size={11} /> Precio ref.: {c.priceNote}</div>}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-800 text-xs">{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Globe size={13} /> Web</a>}{!isEmpty(c.email) && <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Mail size={13} /> Email</a>}<div className="flex-1" />{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 font-medium">Fuente <ExternalLink size={12} /></a>}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="flex items-center gap-3 mb-5"><div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40"><Package size={20} className="text-white" /></div><div><h1 className="text-xl font-bold tracking-tight leading-none">Supplier Scout <span className="text-red-500">·</span> TIPAT</h1><p className="text-xs text-neutral-500 mt-1">Megacostales / Ganaplus — abastecimiento, repositorio e inteligencia de competencia</p></div></div>

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
              <button onClick={search} disabled={loading} className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors">{loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}{loading ? "Buscando en la web…" : "Buscar proveedores"}</button>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl mb-6 overflow-hidden">
              <button onClick={() => setShowBenchmark((v) => !v)} className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-neutral-900/60 transition-colors"><div className="flex items-center gap-2.5"><Target size={16} className="text-red-500" /><span className="text-sm font-medium text-neutral-200">Benchmark · {benchmark.name || "proveedor actual"}</span><span className="text-[10px] uppercase tracking-wider bg-red-600/20 text-red-300 border border-red-600/30 px-2 py-0.5 rounded">Actual</span></div><ChevronDown size={16} className={`text-neutral-500 transition-transform ${showBenchmark ? "rotate-180" : ""}`} /></button>
              {showBenchmark && (<div className="px-5 pb-5 pt-1 border-t border-neutral-800"><p className="text-[11px] text-neutral-500 mb-4">Cada hallazgo se mide contra esto. El <span className="text-neutral-300">FOB/unidad</span> activa los deltas de precio.</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-3"><div><Label>Proveedor</Label><input type="text" value={benchmark.name} onChange={(e) => setBench("name", e.target.value)} className={benchInput} /></div><div><Label>País</Label><input type="text" value={benchmark.country} onChange={(e) => setBench("country", e.target.value)} className={benchInput} /></div><div><Label>Puerto</Label><input type="text" value={benchmark.port} onChange={(e) => setBench("port", e.target.value)} className={benchInput} /></div><div><Label>FOB USD/u</Label><input type="text" value={benchmark.fobUsd} onChange={(e) => setBench("fobUsd", e.target.value)} placeholder="ej. 0.095" className={benchInput} /></div><div><Label>Origen TIPAT</Label><select value={benchmark.cptpp} onChange={(e) => setBench("cptpp", e.target.value)} className={benchInput}><option>Sí</option><option>Por confirmar</option><option>No</option></select></div><div><Label>GSM</Label><input type="text" value={benchmark.gsm} onChange={(e) => setBench("gsm", e.target.value)} placeholder="—" className={benchInput} /></div><div><Label>Denier</Label><input type="text" value={benchmark.denier} onChange={(e) => setBench("denier", e.target.value)} placeholder="—" className={benchInput} /></div><div><Label>MOQ</Label><input type="text" value={benchmark.moq} onChange={(e) => setBench("moq", e.target.value)} placeholder="—" className={benchInput} /></div></div></div>)}
            </div>
            {loading && (<div className="text-center py-12 text-neutral-500 text-sm"><Loader2 size={28} className="animate-spin text-red-500 mx-auto mb-3" />Rastreando la web abierta en busca de fabricantes en el bloque TIPAT…<div className="text-xs text-neutral-600 mt-1">Puede tardar ~30 segundos.</div></div>)}
            {error && !loading && (<div className="bg-red-950/40 border border-red-900/60 rounded-xl p-4 mb-6"><div className="flex items-start gap-3 text-sm text-red-300"><AlertTriangle size={18} className="shrink-0 mt-0.5" /><div><div className="font-medium mb-1">No se pudo completar la búsqueda</div><div className="text-red-300/80">{error}</div></div></div><button onClick={search} className="mt-3 ml-7 inline-flex items-center gap-1.5 text-xs font-medium bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors"><RotateCw size={13} /> Reintentar</button></div>)}
            {!loading && hasSearched && suppliers.length > 0 && (<>
              {summary && <p className="text-sm text-neutral-400 mb-4 italic">{summary}</p>}
              <div className="flex flex-wrap items-center gap-3 mb-5"><span className="text-xs text-neutral-500">{displayed.length} proveedor(es)</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selCls}><option value="score">Ordenar: Score ↓</option><option value="country">Ordenar: País</option><option value="name">Ordenar: Nombre A–Z</option></select><Chip active={onlyCptpp} onClick={() => setOnlyCptpp((v) => !v)} accent>Solo elegibles TIPAT</Chip><div className="flex-1" />{addedMsg && <span className="text-[11px] text-emerald-400">{addedMsg}</span>}<button onClick={saveAllToRepo} className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"><Bookmark size={14} /> Guardar todos</button><button onClick={exportSearchCSV} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors"><Download size={14} /> CSV</button></div>
              <div className="grid gap-4 md:grid-cols-2">{displayed.map((s) => { const og = originStyle(s.cptppOrigin); const web = normalizeUrl(s.website); const src = normalizeUrl(s.sourceUrl); const saved = isInRepo(s); const mech = certMechanismFor(s.country); return (
                <div key={s._id} className={`relative bg-neutral-900/60 border rounded-xl p-5 transition-colors ${saved ? "border-red-600/60" : "border-neutral-800 hover:border-neutral-600"}`}>
                  <button onClick={() => toggleRepoOne(s)} title={saved ? "Quitar" : "Guardar"} className={`absolute top-4 right-4 h-7 px-2 rounded-md border flex items-center gap-1 text-[11px] transition-colors ${saved ? "bg-red-600/15 border-red-600 text-red-300" : "border-neutral-600 text-neutral-400 hover:border-neutral-400"}`}>{saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}{saved ? "Guardado" : "Guardar"}</button>
                  <div className="flex items-start gap-3 pr-24"><span className={`shrink-0 text-sm font-bold px-2.5 py-1 rounded-md border ${scoreColor(s.affinityScore)}`}>{s.affinityScore ?? "—"}</span><div><h3 className="font-semibold text-neutral-100 leading-tight">{s.company}</h3><div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1"><MapPin size={12} />{!isEmpty(s.country) && <span className="text-neutral-400 font-medium">{s.country}</span>}<span>{[s.city, s.province].filter((x) => !isEmpty(x)).join(", ")}</span></div></div></div>
                  {!isEmpty(s.scoreRationale) && <p className="text-xs text-neutral-400 mt-3 leading-relaxed">{s.scoreRationale}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">{(s.products || []).slice(0, 4).map((p, i) => (<span key={i} className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">{p}</span>))}</div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-4 text-xs">{!isEmpty(s.nearestPort) && <div className="flex items-center gap-1.5 text-neutral-400"><Anchor size={12} className="text-neutral-500" />{s.nearestPort}</div>}{!isEmpty(s.estimatedCapacity) && <div className="flex items-center gap-1.5 text-neutral-400"><Factory size={12} className="text-neutral-500" />{s.estimatedCapacity}</div>}{!isEmpty(s.indicativeFobUsd) && <div className="flex items-center gap-1.5 text-neutral-400 col-span-2"><span className="text-neutral-500">FOB:</span>{s.indicativeFobUsd}</div>}</div>
                  <div className="flex flex-wrap gap-1.5 mt-3"><span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${og.cls}`}>{og.icon && <Check size={11} />}{og.label}</span>{(s.certifications || []).filter((c) => !/tipat|cptpp|origen/i.test(c)).slice(0, 4).map((c, i) => (<span key={i} className="text-[11px] border border-neutral-700 text-neutral-400 px-2 py-0.5 rounded">{c}</span>))}</div>
                  {mech && <div className="flex items-center gap-1.5 mt-2 text-[11px] text-neutral-500"><FileBadge size={11} /> Cert. origen: {mech}</div>}
                  {renderDeltas(s)}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-800 text-xs">{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Globe size={13} /> Web</a>}{!isEmpty(s.email) && <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1 text-neutral-400 hover:text-red-400"><Mail size={13} /> Email</a>}{!isEmpty(s.phone) && <span className="inline-flex items-center gap-1 text-neutral-500"><Phone size={13} /> {s.phone}</span>}<div className="flex-1" />{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 font-medium">Fuente <ExternalLink size={12} /></a>}</div>
                </div>); })}</div>
            </>)}
            {!loading && hasSearched && suppliers.length === 0 && !error && (<div className="text-center py-12 text-neutral-500 text-sm"><Building2 size={28} className="mx-auto mb-3 text-neutral-700" />No se encontraron proveedores verificables. Prueba otro país o quita filtros.</div>)}
            {!hasSearched && !loading && (<div className="text-center py-12 text-neutral-600 text-sm">Define criterios y pulsa <span className="text-red-500 font-medium">Buscar proveedores</span>.</div>)}
          </>
        )}

        {tab === "repo" && (
          <>
            {!repoLoaded ? (<div className="text-center py-12 text-neutral-500 text-sm"><Loader2 size={24} className="animate-spin text-red-500 mx-auto mb-2" />Cargando repositorio…</div>) : repo.length === 0 ? (<div className="text-center py-16 text-neutral-500 text-sm"><Inbox size={32} className="mx-auto mb-3 text-neutral-700" />Tu repositorio está vacío. Ve a <button onClick={() => setTab("search")} className="text-red-500 font-medium hover:underline">Buscar</button> y guarda proveedores.</div>) : (<>
              <div className="flex flex-wrap items-center gap-3 mb-5"><div className="flex items-center gap-4 text-xs"><span className="text-neutral-400">{repoStats.total} guardados</span><span className="text-emerald-400">{repoStats.potential} con potencial</span><span className="text-red-400">{repoStats.contacted} contactados</span></div><div className="flex-1" /><button onClick={exportRepoCSV} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors"><Download size={14} /> CSV</button>{confirmClear ? (<span className="inline-flex items-center gap-2 text-xs"><span className="text-neutral-400">¿Vaciar todo?</span><button onClick={() => { commitRepo([]); setConfirmClear(false); }} className="font-medium bg-red-600 text-white px-2.5 py-1 rounded">Sí</button><button onClick={() => setConfirmClear(false)} className="text-neutral-400 px-2 py-1">Cancelar</button></span>) : (<button onClick={() => setConfirmClear(true)} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-400 px-3 py-1.5 rounded-lg hover:border-red-700 hover:text-red-400 transition-colors"><Trash2 size={14} /> Vaciar</button>)}</div>
              <div className="flex flex-wrap items-center gap-2 mb-5 text-xs"><span className="text-[10px] uppercase tracking-wider text-neutral-600">Filtrar:</span><select value={repoFilterPot} onChange={(e) => setRepoFilterPot(e.target.value)} className={selCls}><option value="all">Potencial: todos</option><option value="yes">Con potencial</option><option value="no">Descartados</option><option value="unset">Sin evaluar</option></select><select value={repoFilterContacted} onChange={(e) => setRepoFilterContacted(e.target.value)} className={selCls}><option value="all">Contacto: todos</option><option value="yes">Contactados</option><option value="no">No contactados</option></select><select value={repoFilterCountry} onChange={(e) => setRepoFilterCountry(e.target.value)} className={selCls}><option value="all">País: todos</option>{repoCountries.map((c) => (<option key={c} value={c}>{c}</option>))}</select><span className="text-neutral-600">{repoDisplayed.length} mostrados</span></div>
              <div className="space-y-3">{repoDisplayed.map((r) => { const og = originStyle(r.cptppOrigin); const web = normalizeUrl(r.website); const src = normalizeUrl(r.sourceUrl); const mech = certMechanismFor(r.country); return (
                <div key={r.id} className={`bg-neutral-900/60 border rounded-xl p-4 ${r.potential === "yes" ? "border-emerald-600/40" : r.potential === "no" ? "border-neutral-800 opacity-70" : "border-neutral-800"}`}>
                  <div className="flex items-start gap-3"><span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded border ${scoreColor(r.affinityScore)}`}>{r.affinityScore ?? "—"}</span><div className="flex-1 min-w-0"><h3 className={`font-semibold text-neutral-100 leading-tight truncate ${r.potential === "no" ? "line-through text-neutral-400" : ""}`}>{r.company}</h3><div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5"><MapPin size={11} />{!isEmpty(r.country) && <span className="text-neutral-400">{r.country}</span>}<span>{[r.city, r.province].filter((x) => !isEmpty(x)).join(", ")}</span></div></div><button onClick={() => commitRepo(repo.filter((x) => x.id !== r.id))} title="Eliminar" className="shrink-0 text-neutral-600 hover:text-red-400 transition-colors p-1"><Trash2 size={15} /></button></div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-3"><span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${og.cls}`}>{og.icon && <Check size={11} />}{og.label}</span>{mech && <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500"><FileBadge size={10} /> {mech}</span>}{!isEmpty(r.nearestPort) && <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500"><Anchor size={10} /> {r.nearestPort}</span>}{!isEmpty(r.indicativeFobUsd) && <span className="text-[11px] text-neutral-500">FOB: {r.indicativeFobUsd}</span>}<div className="flex-1" />{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Globe size={11} /> Web</a>}{!isEmpty(r.email) && <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Mail size={11} /> Email</a>}{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400">Fuente <ExternalLink size={10} /></a>}</div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 pt-3 border-t border-neutral-800">
                    <div className="flex items-center gap-1.5"><span className="text-[10px] uppercase tracking-wider text-neutral-600 mr-0.5">Potencial</span><SegBtn active={(r.potential || "unset") === "unset"} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, potential: "unset" } : x))} color="bg-neutral-700 border-neutral-600 text-neutral-100">Sin evaluar</SegBtn><SegBtn active={r.potential === "yes"} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, potential: "yes" } : x))} color="bg-emerald-600 border-emerald-600 text-white">Con potencial</SegBtn><SegBtn active={r.potential === "no"} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, potential: "no" } : x))} color="bg-neutral-600 border-neutral-600 text-neutral-200">Descartado</SegBtn></div>
                    <div className="flex items-center gap-1.5"><span className="text-[10px] uppercase tracking-wider text-neutral-600 mr-0.5">Contacto</span><SegBtn active={!r.contacted} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, contacted: false } : x))} color="bg-neutral-700 border-neutral-600 text-neutral-100">No contactado</SegBtn><SegBtn active={r.contacted} onClick={() => commitRepo(repo.map((x) => x.id === r.id ? { ...x, contacted: true } : x))} color="bg-red-600 border-red-600 text-white">Contactado</SegBtn></div>
                  </div>
                  <input type="text" value={r.notes || ""} onChange={(e) => patchLocal(r.id, { notes: e.target.value })} onBlur={persistNow} placeholder="Notas (cotización, lead time, contacto…)" className="mt-3 w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-red-600 focus:outline-none" />
                </div>); })}</div>
            </>)}
          </>
        )}

        {tab === "comp" && (
          <>
            <div className="flex items-start gap-2 text-[11px] text-neutral-500 mb-2 border-l-2 border-red-600/50 pl-3"><Swords size={14} className="text-red-500 mt-0.5 shrink-0" /><span>Inteligencia de competencia en México: cada empresa se cataloga y recibe un <span className="text-neutral-300">Índice de Fuerza Competitiva</span> (tamaño, alcance, integración, catálogo, web y sofisticación comercial).</span></div>
            <div className="flex items-start gap-2 text-[11px] text-neutral-500 mb-6 border-l-2 border-neutral-700 pl-3"><Gauge size={14} className="text-neutral-500 mt-0.5 shrink-0" /><span>Los scores son estimaciones de la IA sobre huella web pública, no auditorías. El "tamaño" es inferido; tómalos como aproximación y ajústalos con tu conocimiento de campo.</span></div>
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 mb-6">
              <Label>¿Qué competencia buscas?</Label>
              <div className="flex flex-col sm:flex-row gap-3"><input type="text" value={compQuery} onChange={(e) => setCompQuery(e.target.value)} placeholder="ej. costales para azúcar, big bags, sacos para grano…" className={fieldCls} /><button onClick={searchComp} disabled={compLoading} className="shrink-0 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">{compLoading ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}{compLoading ? "Analizando…" : "Buscar y evaluar"}</button></div>
            </div>
            {compLoading && (<div className="text-center py-10 text-neutral-500 text-sm"><Loader2 size={26} className="animate-spin text-red-500 mx-auto mb-3" />Buscando y evaluando competidores mexicanos…<div className="text-xs text-neutral-600 mt-1">Puede tardar ~30 segundos.</div></div>)}
            {compError && !compLoading && (<div className="bg-red-950/40 border border-red-900/60 rounded-xl p-4 mb-6"><div className="flex items-start gap-3 text-sm text-red-300"><AlertTriangle size={18} className="shrink-0 mt-0.5" /><div><div className="font-medium mb-1">No se pudo completar la búsqueda</div><div className="text-red-300/80">{compError}</div></div></div><button onClick={searchComp} className="mt-3 ml-7 inline-flex items-center gap-1.5 text-xs font-medium bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors"><RotateCw size={13} /> Reintentar</button></div>)}
            {!compLoading && compSearched && compResults.length > 0 && (<>
              {compSummary && <p className="text-sm text-neutral-400 mb-4 italic">{compSummary}</p>}
              <div className="flex flex-wrap items-center gap-3 mb-5"><span className="text-xs text-neutral-500">{compResults.length} resultado(s)</span><div className="flex-1" />{compAddedMsg && <span className="text-[11px] text-emerald-400">{compAddedMsg}</span>}<button onClick={saveAllToComp} className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"><Bookmark size={14} /> Guardar todos</button></div>
              <div className="grid gap-4 md:grid-cols-2 mb-8">{compResults.map((c) => (<CompCard key={c._id} c={c} saved={isInComp(c)} onToggle={() => toggleCompOne(c)} />))}</div>
            </>)}
            {!compLoading && compSearched && compResults.length === 0 && !compError && (<div className="text-center py-10 text-neutral-500 text-sm"><Building2 size={26} className="mx-auto mb-3 text-neutral-700" />Sin resultados verificables. Prueba otras palabras clave.</div>)}

            <div className="flex items-center justify-between gap-2 mb-4 mt-2">
              <div className="flex items-center gap-2"><Database size={16} className="text-neutral-400" /><h2 className="text-sm font-semibold text-neutral-200">Directorio de competencia</h2>{competitors.length > 0 && <span className="text-[10px] bg-neutral-700 text-neutral-300 px-1.5 py-0.5 rounded-full">{competitors.length}</span>}</div>
              {competitors.length > 0 && (<div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5"><button onClick={() => setCompView("list")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${compView === "list" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-200"}`}><List size={13} /> Lista</button><button onClick={() => setCompView("map")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${compView === "map" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-200"}`}><Map size={13} /> Mapa</button></div>)}
            </div>

            {competitors.length > 0 && (<div className="flex items-center gap-4 text-xs mb-4"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-neutral-400">{tierCount.A} Tier A</span></span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-neutral-400">{tierCount.B} Tier B</span></span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-neutral-500" /><span className="text-neutral-400">{tierCount.C} Tier C</span></span></div>)}

            {!compLoaded ? (<div className="text-center py-8 text-neutral-500 text-sm"><Loader2 size={22} className="animate-spin text-red-500 mx-auto mb-2" />Cargando…</div>) : competitors.length === 0 ? (<div className="text-center py-10 text-neutral-600 text-sm border border-dashed border-neutral-800 rounded-xl"><Inbox size={26} className="mx-auto mb-2 text-neutral-700" />Aún no guardas competidores. Busca arriba y pulsa Guardar para catalogarlos, puntuarlos y mapearlos.</div>) : compView === "map" ? (
              <>
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-2 mb-3"><MexicoMap competitors={competitors} /></div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2 text-[11px]">{SEG_COLORS.slice(0, 4).map((sg) => (<span key={sg.key} className="inline-flex items-center gap-1.5 text-neutral-400"><span className="h-2.5 w-2.5 rounded-full" style={{ background: sg.color }} />{sg.label}</span>))}<span className="text-neutral-600">· tamaño del punto = fuerza competitiva</span></div>
                {unplaced > 0 && <p className="text-[11px] text-amber-300/80 mb-4 flex items-center gap-1.5"><AlertTriangle size={12} /> {unplaced} competidor(es) sin ubicación reconocible — no aparecen en el mapa.</p>}
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 mt-2">
                  <div className="flex items-center gap-2 mb-3"><MapPin size={14} className="text-red-500" /><h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Concentración por estado — zona de influencia</h3></div>
                  <div className="space-y-2">{stateRanking.map(([st, n]) => (<div key={st} className="flex items-center gap-3"><span className="text-xs text-neutral-300 w-40 shrink-0 truncate">{st}</span><div className="flex-1 bg-neutral-800 rounded-full h-2.5 overflow-hidden"><div className="bg-red-600 h-full rounded-full" style={{ width: `${(n / maxCount) * 100}%` }} /></div><span className="text-xs text-neutral-400 w-6 text-right">{n}</span></div>))}</div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs"><select value={compSort} onChange={(e) => setCompSort(e.target.value)} className={selCls}><option value="score">Ordenar: Fuerza ↓</option><option value="recent">Ordenar: Recientes</option></select><select value={compFilterTier} onChange={(e) => setCompFilterTier(e.target.value)} className={selCls}><option value="all">Tier: todos</option><option value="A">Tier A</option><option value="B">Tier B</option><option value="C">Tier C</option></select><select value={compFilterSeg} onChange={(e) => setCompFilterSeg(e.target.value)} className={selCls}><option value="all">Segmento: todos</option><option value="fabric">Fabricantes</option><option value="import">Importadores</option><option value="distrib">Distribuidores</option><option value="comerc">Comercializadores</option></select><select value={compFilterState} onChange={(e) => setCompFilterState(e.target.value)} className={selCls}><option value="all">Estado: todos</option>{compStates.map((s) => (<option key={s} value={s}>{s}</option>))}</select><span className="text-neutral-600">{compDisplayed.length} mostrados</span><div className="flex-1" /><button onClick={() => exportCompCSV(competitors)} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg hover:border-neutral-500 transition-colors"><Download size={14} /> CSV</button>{confirmClearComp ? (<span className="inline-flex items-center gap-2"><span className="text-neutral-400">¿Vaciar?</span><button onClick={() => { commitComp([]); setConfirmClearComp(false); }} className="font-medium bg-red-600 text-white px-2.5 py-1 rounded">Sí</button><button onClick={() => setConfirmClearComp(false)} className="text-neutral-400 px-2 py-1">Cancelar</button></span>) : (<button onClick={() => setConfirmClearComp(true)} className="inline-flex items-center gap-1.5 text-xs font-medium border border-neutral-700 text-neutral-400 px-3 py-1.5 rounded-lg hover:border-red-700 hover:text-red-400 transition-colors"><Trash2 size={14} /> Vaciar</button>)}</div>
                <div className="space-y-3">{compDisplayed.map((c) => { const web = normalizeUrl(c.website); const src = normalizeUrl(c.sourceUrl); const tel = telHref(c.phone); return (
                  <div key={c.id} className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                    <div className="flex items-start gap-3"><div className="flex-1 min-w-0"><CompScoreHeader c={c} /></div><button onClick={() => commitComp(competitors.filter((x) => x.id !== c.id))} title="Eliminar" className="shrink-0 text-neutral-600 hover:text-red-400 transition-colors p-1"><Trash2 size={15} /></button></div>
                    {hasScores(c) && <ScoreBreakdown c={c} />}
                    {!isEmpty(c.scoreNote) && <p className="text-[11px] text-neutral-500 mt-2 italic">{c.scoreNote}</p>}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">{tel ? (<a href={tel} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-100 hover:text-red-400 transition-colors"><Phone size={15} className="text-red-500" /> {c.phone}</a>) : (<span className="inline-flex items-center gap-2 text-xs text-neutral-600"><Phone size={13} /> Teléfono no disponible</span>)}{!isEmpty(c.priceNote) && <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90"><Tag size={11} /> {c.priceNote}</span>}<div className="flex-1" />{web && <a href={web} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Globe size={11} /> Web</a>}{!isEmpty(c.email) && <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400"><Mail size={11} /> Email</a>}{src && <a href={src} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400">Fuente <ExternalLink size={10} /></a>}</div>
                    <input type="text" value={c.userNotes || ""} onChange={(e) => patchCompLocal(c.id, { userNotes: e.target.value })} onBlur={persistCompNow} placeholder="Notas (precios vistos, posicionamiento, clientes…)" className="mt-3 w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-red-600 focus:outline-none" />
                  </div>); })}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
