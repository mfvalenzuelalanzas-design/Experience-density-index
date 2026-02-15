import { useState, useMemo, useEffect } from “react”;

/* ═══ ARCHETYPES ═══ */
const ARCHETYPES = {
sanctuary: { name: “The Sanctuary”, short: “Radical spatial generosity. Silence and nature as the product.”, long: “Sparse programming is intentional — privacy and vast landscape are the luxury. Every villa is a world unto itself. The guest count is deliberately low. Design decisions favor emptiness over embellishment.”, radar: [95, 30, 92, 35, 80], ref: “Aman, Amangiri, Amanoi” },
theatre: { name: “The Grand Theatre”, short: “Choreographed experience. Theatrical public spaces. Destination dining.”, long: “Public spaces are stages — grand lobbies, dramatic pools, signature restaurants as destinations. The experience is layered and sequential with high touchpoint density. Architecture is expressive. Social energy is curated.”, radar: [60, 95, 50, 85, 65], ref: “One&Only, Belmond, Cheval Blanc” },
village: { name: “The Cultural Village”, short: “Inseparable from place. Local materials and traditions are structural.”, long: “The architecture speaks the language of the region. Programming connects guests to place through food, art, and community. Authenticity is the core value proposition. Could not exist anywhere else.”, radar: [55, 65, 60, 50, 95], ref: “Rosewood, Six Senses, Zannier” },
oasis: { name: “The Wellness Oasis”, short: “The entire property is therapeutic. The spa is the reason for being.”, long: “Architecture, landscape, light, and water are designed to heal. Programming is clinical in quality but sensorial in delivery. Biophilic design principles govern every decision.”, radar: [70, 55, 88, 45, 75], ref: “SHA Wellness, Chiva-Som, Six Senses” },
estate: { name: “The Branded Estate”, short: “Dual identity: resort experience + residential permanence.”, long: “Residential and hotel components each have distinct peak experiences while sharing a unified design language. Community-building for residents and privacy calibration between populations are critical.”, radar: [60, 72, 55, 75, 60], ref: “Aman Residences, Four Seasons Private Residences” },
club: { name: “The Social Club”, short: “Public spaces dominate. The energy of the crowd is the product.”, long: “Pools, beach clubs, and restaurants designed for atmosphere and social interaction. Architecture is bold. The guest values scene, curation, and cultural relevance over seclusion.”, radar: [45, 90, 45, 90, 40], ref: “Nobu Hotel, Edition, SLS, Fasano” },
};
const AK = Object.keys(ARCHETYPES);

/* ═══ CLIMATE & CONTEXT ═══ */
const CLIMATES = [
{ id: “tropical”, label: “Tropical” }, { id: “desert”, label: “Desert” },
{ id: “coastal”, label: “Coastal” }, { id: “mountain”, label: “Mountain” }, { id: “temperate”, label: “Temperate” },
];
const CONTEXTS = [
{ id: “resort”, label: “Resort / Rural”, note: “Isolated. The property IS the destination.” },
{ id: “urban”, label: “Urban”, note: “Verticality replaces landscape. City as amenity.” },
{ id: “periurban”, label: “Periurban”, note: “Edge condition. Accessibility is an asset.” },
{ id: “island”, label: “Island”, note: “Finite land. Water arrival. Exclusivity is inherent.” },
];

/* ═══ KEY TYPES ═══ */
const KT = [
{ id: “villa”, label: “Private Villas”, avg: 250, mult: 1.8 },
{ id: “suite_p”, label: “Premium Suites”, avg: 120, mult: 1.4 },
{ id: “suite_j”, label: “Junior Suites”, avg: 75, mult: 1.1 },
{ id: “room_d”, label: “Deluxe Rooms”, avg: 55, mult: 1.0 },
{ id: “room_s”, label: “Standard Rooms”, avg: 42, mult: 0.8 },
{ id: “res”, label: “Branded Residences”, avg: 180, mult: 1.6 },
];

/* ═══ TOUCHPOINTS (renamed categories) ═══ */
const TP = [
// First Impression
{ id: “lobby”, label: “Arrival Lobby”, cat: “welcome”, w: 1.0 },
{ id: “porte”, label: “Porte-Cochère”, cat: “welcome”, w: 0.8 },
{ id: “garden_arr”, label: “Garden Arrival Sequence”, cat: “welcome”, w: 1.2 },
{ id: “water_arr”, label: “Water Arrival”, cat: “welcome”, w: 1.5 },
{ id: “ritual”, label: “Welcome Ritual”, cat: “welcome”, w: 1.3 },
// Gastronomy
{ id: “sig_rest”, label: “Signature Restaurant”, cat: “gastronomy”, w: 1.4 },
{ id: “casual”, label: “Casual Dining”, cat: “gastronomy”, w: 0.8 },
{ id: “bar”, label: “Bar / Lounge”, cat: “gastronomy”, w: 1.0 },
{ id: “pool_bar”, label: “Pool Bar”, cat: “gastronomy”, w: 0.9 },
{ id: “priv_din”, label: “Private Dining”, cat: “gastronomy”, w: 1.3 },
{ id: “wine”, label: “Wine Cellar / Tasting”, cat: “gastronomy”, w: 1.2 },
{ id: “farm”, label: “Farm-to-Table”, cat: “gastronomy”, w: 1.4 },
{ id: “bfast”, label: “Breakfast Venue”, cat: “gastronomy”, w: 0.6 },
// Wellness
{ id: “spa”, label: “Spa & Wellness Center”, cat: “wellness”, w: 1.3 },
{ id: “gym”, label: “Fitness Center”, cat: “wellness”, w: 0.6 },
{ id: “yoga”, label: “Yoga / Meditation Pavilion”, cat: “wellness”, w: 1.1 },
{ id: “hammam”, label: “Hammam / Thermal Suite”, cat: “wellness”, w: 1.4 },
{ id: “plunge”, label: “Hydrotherapy Circuit”, cat: “wellness”, w: 1.2 },
{ id: “out_spa”, label: “Outdoor Treatments”, cat: “wellness”, w: 1.3 },
// Active Leisure
{ id: “pool”, label: “Main Pool”, cat: “active”, w: 0.8 },
{ id: “inf_pool”, label: “Adults Pool”, cat: “active”, w: 1.1 },
{ id: “beach”, label: “Beach Club”, cat: “active”, w: 1.3 },
{ id: “kids”, label: “Kids Club”, cat: “active”, w: 0.7 },
{ id: “tennis”, label: “Tennis / Padel”, cat: “active”, w: 0.7 },
{ id: “water_sp”, label: “Water Sports”, cat: “active”, w: 1.0 },
// Outdoor Immersion
{ id: “garden”, label: “Gardens / Trails”, cat: “outdoor”, w: 1.2 },
{ id: “mirador”, label: “Mirador / Viewpoint”, cat: “outdoor”, w: 1.3 },
{ id: “fire”, label: “Fire Pit / Gathering”, cat: “outdoor”, w: 1.1 },
{ id: “nat_feat”, label: “Natural Feature”, cat: “outdoor”, w: 1.6 },
{ id: “org_farm”, label: “Organic Farm”, cat: “outdoor”, w: 1.2 },
// Cultural Depth
{ id: “art”, label: “Art / Gallery Space”, cat: “cultural”, w: 1.3 },
{ id: “library”, label: “Library / Reading Room”, cat: “cultural”, w: 1.0 },
{ id: “cook”, label: “Cooking School”, cat: “cultural”, w: 1.2 },
{ id: “obs”, label: “Observatory / Stargazing”, cat: “cultural”, w: 1.4 },
{ id: “craft”, label: “Artisan Atelier”, cat: “cultural”, w: 1.3 },
{ id: “spirits”, label: “Spirits Room”, cat: “cultural”, w: 1.1 },
];
const CATS = { welcome: “First Impression”, gastronomy: “Gastronomy”, wellness: “Wellness”, active: “Active Leisure”, outdoor: “Outdoor Immersion”, cultural: “Cultural Depth” };
const CK = Object.keys(CATS);

/* ═══ BENCHMARK RANGES ═══ */
const RNG = {
spatial: [{ max: 100, label: “Standard” }, { max: 150, label: “Premium” }, { max: 220, label: “Luxury” }, { max: 300, label: “Ultra-Luxury” }, { max: 400, label: “Iconic” }],
coverage: [{ max: 15, label: “Ultra-Low” }, { max: 25, label: “Ultra-Luxury” }, { max: 35, label: “Luxury” }, { max: 50, label: “Dense” }],
density: [{ max: 5, label: “Sanctuary” }, { max: 10, label: “Exclusive” }, { max: 20, label: “Resort” }, { max: 40, label: “Dense” }],
pool: [{ max: 3, label: “Minimal” }, { max: 8, label: “Standard” }, { max: 15, label: “Generous” }, { max: 25, label: “Iconic” }],
efficiency: [{ max: 50, label: “Generous BOH” }, { max: 58, label: “Luxury” }, { max: 65, label: “Efficient” }, { max: 80, label: “Optimized” }],
};

/* ═══ EXPERIENCE EMPHASIS ═══ */
function getExpEmphasis(tpScores) {
const sorted = CK.map(k => ({ k, s: tpScores[k] || 0 })).sort((a, b) => b.s - a.s).filter(x => x.s > 20);
if (sorted.length === 0) return { label: “Undefined”, desc: “Touchpoint selection is too sparse to define an experiential emphasis.” };
const labels = {
welcome: “Journey-Focused”, gastronomy: “Gastronomy-Led”, wellness: “Wellness-Centered”,
active: “Activity-Rich”, outdoor: “Nature-Immersive”, cultural: “Culturally Rooted”
};
const descs = {
welcome: “The guest journey is prioritized — arrival choreography and first impressions define the brand.”,
gastronomy: “Food and beverage is the experiential anchor — culinary programming drives positioning and ADR.”,
wellness: “Healing and wellbeing are the core proposition — the architecture itself is therapeutic.”,
active: “Leisure programming is the draw — pools, sports, and beach culture create social energy.”,
outdoor: “Nature immersion is the centerpiece — landscape, trails, and outdoor gathering define the experience.”,
cultural: “Cultural authenticity differentiates — art, craft, and local narrative create irreplaceable identity.”
};
const primary = sorted[0];
const secondary = sorted.length > 1 && sorted[1].s > sorted[0].s * 0.7 ? sorted[1] : null;
if (secondary) {
return { label: `${labels[primary.k]}, ${labels[secondary.k]}`, desc: `${descs[primary.k]} ${descs[secondary.k]}` };
}
return { label: labels[primary.k], desc: descs[primary.k] };
}

/* ═══ HIGHLIGHTS GENERATOR ═══ */
function genHighlights(c, narr, clim, ctx, km, tk) {
const h = [];
const vc = parseInt(km.villa) || 0, rc = parseInt(km.res) || 0;
// Cross-reference both pentagons
if (c.spatial >= 70 && c.tpScores.outdoor >= 50) h.push(“Exceptional spatial generosity combined with strong outdoor programming creates a landscape-led experience where architecture serves as a frame for nature, not a barrier to it.”);
if (c.richness >= 60 && c.tpScores.gastronomy >= 60) h.push(“Rich experiential density anchored by gastronomy — this positions food and beverage not as amenity but as a destination driver capable of justifying premium ADR independently.”);
if (c.narrativeDepth >= 70 && c.tpScores.cultural >= 50) h.push(“A deeply articulated narrative paired with cultural infrastructure creates an experience that is rooted in place. This is the hardest quality for competitors to replicate.”);
if (c.spatial >= 60 && c.richness >= 60 && c.landscape >= 60) h.push(“Rare balance: high spatial generosity with rich programming AND strong landscape integration. Guests have multiple discovery layers without feeling crowded or under-programmed.”);
if (c.tpScores.welcome >= 60 && c.narrativeDepth >= 50) h.push(“The arrival sequence is layered and intentional. When narrative depth backs this up, the first impression becomes a promise that the rest of the property can deliver on.”);
if (vc / (tk || 1) >= 0.3 && c.spatial >= 60) h.push(“Villa-dominant key mix at this spatial ratio creates genuine exclusivity — each unit operates as an independent world, which is the defining characteristic of ultra-luxury positioning.”);
if (rc > 0 && c.tpScores.active >= 40 && c.tpScores.gastronomy >= 40) h.push(“The branded residence offering is strengthened by diverse leisure and gastronomy programming — residents need year-round reasons to use the property, and this mix delivers that.”);
if (c.poolRatio >= 10 && c.tpScores.wellness >= 50) h.push(“Generous water surface combined with wellness programming creates a therapeutic landscape that extends well beyond the spa building — water becomes architecture.”);
if (c.landscapeRatio >= 75 && ctx === “resort”) h.push(“With over 75% of the site remaining as landscape, the project preserves the asset that drew attention in the first place. In a resort context, this restraint IS the luxury.”);
if (c.tpScores.cultural >= 60 && c.tpScores.outdoor >= 50) h.push(“Cultural depth embedded within outdoor experiences — artisan ateliers, farm-to-table gardens, nature trails with interpretive moments — creates a narrative that unfolds through the landscape itself.”);
// Fallback
if (h.length === 0) h.push(“The project has potential for differentiation through clearer spatial commitments and a more articulated narrative. The current touchpoint selection provides a foundation; the next step is ensuring each programmed space has a clear experiential purpose.”);
return h.slice(0, 4);
}

/* ═══ IMPROVEMENTS ═══ */
function genImps(c, clim, ctx, km, narr, sTP, tk) {
const r = [], tpc = c.tpByCategory, rc = parseInt(km.res) || 0;
if (c.spatialRaw > 0 && c.spatialRaw < 150) r.push({ pr: “high”, title: “Increase Spatial Generosity”, text: “Reduce key count or expand GFA. At this ratio, the project positions as luxury, not ultra-luxury.” });
if (!tpc.welcome || tpc.welcome < 3) r.push({ pr: “high”, title: “Layer the Arrival Sequence”, text: “Minimum 3 chapters: anticipation (approach), transition (garden/water passage), reveal (first view). Each chapter engages a different sense.” });
if (!sTP.has(“farm”) && [“tropical”, “temperate”, “coastal”].includes(clim)) r.push({ pr: “med”, title: “Integrate Farm-to-Table”, text: “On-site garden creates a narrative loop: landscape → kitchen → plate → story. Connects guests to the land.” });
if (!tpc.wellness || tpc.wellness < 3) r.push({ pr: “med”, title: “Distribute Wellness”, text: “Move wellness from a single facility to a distributed philosophy. Outdoor treatments, hydrotherapy, meditation pavilions across the site.” });
if (c.siteCoverage > 30) r.push({ pr: “high”, title: “Reduce Site Coverage”, text: `${c.siteCoverage.toFixed(0)}% exceeds ultra-luxury targets (15-25%). Compact service cores, dispersed guest components.` });
if (!tpc.cultural || tpc.cultural < 2) r.push({ pr: “high”, title: “Build Cultural Infrastructure”, text: “Local artists, artisan residency, cultural programming spaces. Ultra-luxury guests seek meaning, not just comfort.” });
if (rc > 0) r.push({ pr: “med”, title: “Separate Resident Experiences”, text: “Residents and guests need distinct peak moments. Private club, dedicated pool, exclusive dining.” });
if (c.narrativeDepth < 60) r.push({ pr: “high”, title: “Deepen the Design Story”, text: “What is THIS place, and no other? The narrative must be specific enough to only exist here.” });
if (c.density > 12) r.push({ pr: “med”, title: “Reduce Density”, text: `${c.density.toFixed(1)} keys/ha is high. Aman: 2-5, One&Only: 5-8.` });
if (c.poolRatio < 5 && ctx !== “urban”) r.push({ pr: “med”, title: “Increase Pool Area”, text: `${c.poolRatio.toFixed(1)} m²/key is below generous thresholds (10-15). Private plunge pools, adults pool, or hydrotherapy.` });
if (c.efficiencyRatio > 0 && c.efficiencyRatio > 65) r.push({ pr: “med”, title: “Increase Public Area Generosity”, text: `${c.efficiencyRatio.toFixed(0)}% efficiency ratio is high for ultra-luxury — generous lobbies, wide corridors, and spatial surplus in public areas are expected.` });
return r.sort((a, b) => (a.pr === “high” ? 0 : 1) - (b.pr === “high” ? 0 : 1));
}

/* ═══ PENTAGON ═══ */
function Pentagon({ metrics, ghost, labels, size = 400 }) {
const c = size / 2, r = size * 0.34, n = labels.length;
const angles = labels.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);
const pt = (a, v) => ({ x: c + r * (v / 100) * Math.cos(a), y: c + r * (v / 100) * Math.sin(a) });
const path = (v) => v.map((val, i) => `${i === 0 ? "M" : "L"} ${pt(angles[i], val).x} ${pt(angles[i], val).y}`).join(” “) + “ Z”;
const uid = `pg${n}${size}`;
return (
<svg viewBox={`0 0 ${size} ${size}`} style={{ width: “100%”, maxWidth: size, display: “block”, margin: “0 auto” }}>
<defs><linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2a2420" stopOpacity="0.06" /><stop offset="100%" stopColor="#2a2420" stopOpacity="0.015" /></linearGradient></defs>
{[20, 40, 60, 80, 100].map(l => <polygon key={l} points={angles.map(a => `${pt(a, l).x},${pt(a, l).y}`).join(” “)} fill=“none” stroke={l === 100 ? “rgba(0,0,0,0.06)” : “rgba(0,0,0,0.02)”} strokeWidth=“0.5” />)}
{angles.map((a, i) => <line key={i} x1={c} y1={c} x2={pt(a, 105).x} y2={pt(a, 105).y} stroke=“rgba(0,0,0,0.03)” strokeWidth=“0.5” />)}
{ghost && ghost.map((g, gi) => <path key={gi} d={path(g.values)} fill=“none” stroke={`rgba(0,0,0,${g.hl ? 0.13 : 0.025})`} strokeWidth={g.hl ? 1.5 : 0.7} strokeDasharray={g.hl ? “7 5” : “3 4”} />)}
<path d={path(metrics)} fill={`url(#${uid})`} stroke=”#2a2420” strokeWidth=“2” strokeLinejoin=“round” />
{metrics.map((v, i) => { const p = pt(angles[i], v); return <g key={i}><circle cx={p.x} cy={p.y} r="4" fill="rgba(42,36,32,0.06)" /><circle cx={p.x} cy={p.y} r="2.5" fill="#2a2420" /></g>; })}
{labels.map((label, i) => {
const p = pt(angles[i], n === 5 ? 118 : 116);
return <g key={i}>{label.split(”\n”).map((line, li) => <text key={li} x={p.x} y={p.y + li * 11 - (label.split(”\n”).length - 1) * 4.5} textAnchor=“middle” dominantBaseline=“middle” fill=“rgba(0,0,0,0.4)” fontSize=“8.5” fontFamily=”‘Cormorant Garamond’, Georgia, serif” letterSpacing=“0.07em”>{line.toUpperCase()}</text>)}</g>;
})}
</svg>
);
}

/* ═══ CONTEXT BAR ═══ */
function CtxBar({ label, value, max, ranges, unit }) {
const pct = Math.min((value / max) * 100, 100);
return (
<div style={{ marginBottom: 26 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 5 }}>
<span style={{ fontSize: 10, color: “rgba(0,0,0,0.4)”, letterSpacing: “0.1em” }}>{label.toUpperCase()}</span>
<span style={{ fontSize: 15, color: “#2a2420”, fontWeight: 400 }}>{typeof value === “number” ? (value % 1 === 0 ? value : value.toFixed(1)) : value}{unit && <span style={{ fontSize: 10, opacity: 0.4, marginLeft: 2 }}>{unit}</span>}</span>
</div>
<div style={{ position: “relative”, height: 22, display: “flex”, borderRadius: 2, overflow: “hidden” }}>
{ranges.map((rng, i) => {
const prev = i > 0 ? ranges[i - 1].max : 0;
return <div key={i} style={{ width: `${((rng.max - prev) / max) * 100}%`, background: `rgba(0,0,0,${0.018 + i * 0.014})`, borderRight: i < ranges.length - 1 ? “1px solid rgba(255,255,255,0.8)” : “none”, position: “relative” }}>
<span style={{ position: “absolute”, bottom: -15, left: “50%”, transform: “translateX(-50%)”, fontSize: 7.5, color: “rgba(0,0,0,0.24)”, whiteSpace: “nowrap” }}>{rng.label}</span>
</div>;
})}
<div style={{ position: “absolute”, left: `${pct}%`, top: 0, bottom: 0, width: 2.5, background: “#2a2420”, borderRadius: 1, transform: “translateX(-1px)”, transition: “left 0.8s cubic-bezier(0.16, 1, 0.3, 1)” }} />
</div>
</div>
);
}

/* ═══ PDF ═══ */
function exportPDF(pn, loc, clim, ctx, tk, km, c, selTP, narr, imps, adr, highlights, expEmph) {
const arch = ARCHETYPES[c.bestArch];
const tpList = TP.filter(t => selTP.has(t.id));
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>EDI — ${pn}</title>

<style>@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Cormorant Garamond',Georgia,serif;color:#2a2420;background:#fff;padding:44px 52px;line-height:1.6;max-width:720px;margin:0 auto}
.hdr{font-size:9px;letter-spacing:0.35em;color:#9a9080;text-transform:uppercase;margin-bottom:12px}
h1{font-size:24px;font-weight:300;color:#2a2420}
h2{font-size:10px;font-weight:400;color:#6a5e4e;letter-spacing:0.22em;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #e6e2dc;text-transform:uppercase}
p{font-size:12px;color:#4a4238;margin-bottom:4px}
.sb{text-align:center;padding:18px;border:1px solid #e6e2dc;border-radius:3px;margin:10px 0}
.sn{font-size:42px;font-weight:300;color:#2a2420}.st{font-size:10px;letter-spacing:0.18em;color:#6a5e4e;margin-top:1px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:6px 0}
.m{padding:6px 10px;border:1px solid #e6e2dc;border-radius:2px}.ml{font-size:8px;letter-spacing:0.12em;color:#9a9080;text-transform:uppercase}.mv{font-size:16px;font-weight:300;color:#2a2420;margin-top:1px}
.ab{padding:12px 16px;border:1px solid #e6e2dc;border-radius:3px;margin:6px 0;text-align:center}
.nb{padding:8px 12px;border:1px solid #e6e2dc;border-radius:2px;margin:4px 0;border-left:2px solid #9a9080}.nl{font-size:8px;letter-spacing:0.1em;color:#9a9080;text-transform:uppercase}.nt{font-size:11px;color:#4a4238;font-style:italic}
.ins{padding:6px 10px;margin:3px 0;border-radius:2px;font-size:10.5px;border-left:2px solid #9a9080;background:#faf8f5}
.imp{padding:8px 10px;margin:4px 0;border:1px solid #e6e2dc;border-radius:2px}.it{font-size:11px;font-weight:500;color:#2a2420}.ix{font-size:10px;color:#6a5e4e;margin-top:1px;line-height:1.5}
.hl{padding:10px 14px;margin:5px 0;border-left:2px solid #2a2420;font-size:11.5px;color:#2a2420;line-height:1.6;font-style:italic}
.ft{margin-top:28px;padding-top:8px;border-top:1px solid #e6e2dc;font-size:8px;color:#9a9080;letter-spacing:0.12em;text-align:center}
@media print{body{padding:24px 28px}.imp,.ins,.hl{break-inside:avoid}}
</style></head><body>

<div class="hdr">Experience Density Index — Concept Phase</div>
<h1>${pn || "Untitled"}</h1>
<p style="color:#9a9080;font-size:10px">${CLIMATES.find(x => x.id === clim)?.label || ""} · ${CONTEXTS.find(x => x.id === ctx)?.label || ""}${loc ? " — " + loc : ""} · ${tk} Keys · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
<div class="sb"><div class="sn">${c.ediScore}</div><div class="st">${c.tier}</div></div>
<h2>Experience Archetype</h2>
<div class="ab"><div style="font-size:16px;color:#2a2420">${arch.name}</div><div style="font-size:10.5px;color:#6a5e4e;margin-top:3px;max-width:420px;margin-left:auto;margin-right:auto">${arch.long}</div><p style="font-size:9px;color:#9a9080;margin-top:4px;font-style:italic">${c.archReason}</p></div>
<h2>Experience Emphasis</h2>
<p><strong>${expEmph.label}</strong> — ${expEmph.desc}</p>
${c.valueProposition ? `<h2>Value Proposition</h2><p style="font-style:italic;font-size:12.5px;color:#2a2420;padding:8px 12px;border-left:2px solid #9a9080">"${c.valueProposition}"</p>` : ""}
${adr ? `<h2>Market ADR Reference</h2><p>${adr}</p>` : ""}
<h2>Key Metrics</h2>
<div class="g2">
<div class="m"><div class="ml">Spatial Generosity</div><div class="mv">${c.spatialRaw.toFixed(0)} m²/key</div></div>
<div class="m"><div class="ml">Site Coverage</div><div class="mv">${c.siteCoverage.toFixed(1)}%</div></div>
<div class="m"><div class="ml">Density</div><div class="mv">${c.density.toFixed(1)} keys/ha</div></div>
<div class="m"><div class="ml">Pool Ratio</div><div class="mv">${c.poolRatio.toFixed(1)} m²/key</div></div>
<div class="m"><div class="ml">Efficiency</div><div class="mv">${c.efficiencyRatio.toFixed(0)}%</div></div>
<div class="m"><div class="ml">Rentable / Key</div><div class="mv">${c.rentablePerKey.toFixed(0)} m²</div></div>
<div class="m"><div class="ml">Landscape</div><div class="mv">${c.landscapeRatio.toFixed(0)}%</div></div>
<div class="m"><div class="ml">Narrative Depth</div><div class="mv">${c.narrativeDepth}/100</div></div>
</div>
<h2>Narrative</h2>
${narr.concept ? `<div class="nb"><div class="nl">Concept</div><div class="nt">"${narr.concept}"</div></div>` : ""}
${narr.purpose ? `<div class="nb"><div class="nl">Purpose</div><div class="nt">"${narr.purpose}"</div></div>` : ""}
${narr.drivers ? `<div class="nb"><div class="nl">Drivers</div><div class="nt">${narr.drivers}</div></div>` : ""}
${narr.materiality ? `<div class="nb"><div class="nl">Materiality</div><div class="nt">${narr.materiality}</div></div>` : ""}
<h2>Touchpoints (${tpList.length})</h2>
${Object.entries(CATS).map(([k, v]) => { const items = tpList.filter(t => t.cat === k); return items.length ? `<p><strong>${v}:</strong> ${items.map(t => t.label).join(", ")}</p>` : ""; }).join("")}
<h2>Insights</h2>${c.insights.map(i => `<div class="ins">${i.text}</div>`).join("")}
<h2>Design Recommendations</h2>${imps.map(i => `<div class="imp"><div class="it">${i.title}</div><div class="ix">${i.text}</div></div>`).join("")}
<h2>Project Highlights</h2>${highlights.map(h => `<div class="hl">${h}</div>`).join("")}
<div class="ft">EDI · CONCEPT PHASE · CONFIDENTIAL</div></body></html>`;
  const w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank");
  if (w) setTimeout(() => w.print(), 800);
}

/* ═══ MAIN ═══ */
export default function EDI() {
const [step, setStep] = useState(0);
const [pn, setPn] = useState(””);
const [loc, setLoc] = useState(””);
const [clim, setClim] = useState(””);
const [ctx, setCtx] = useState(””);
const [km, setKm] = useState({});
const [gfa, setGfa] = useState(””);
const [rentGfa, setRentGfa] = useState(””);
const [openProg, setOpenProg] = useState(””);
const [siteArea, setSiteArea] = useState(””);
const [poolArea, setPoolArea] = useState(””);
const [sTP, setSTP] = useState(new Set());
const [selArch, setSelArch] = useState(“sanctuary”);
const [narr, setNarr] = useState({ concept: “”, purpose: “”, drivers: “”, materiality: “” });
const [adr, setAdr] = useState(””);
const [aScore, setAScore] = useState(0);
const [fade, setFade] = useState(true);
const [sketches, setSketches] = useState([]);

const tk = useMemo(() => Object.values(km).reduce((s, v) => s + (parseInt(v) || 0), 0), [km]);
const go = (s) => { setFade(false); setTimeout(() => { setStep(s); setFade(true); }, 180); };
const togTP = (id) => { setSTP(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); };

const calc = useMemo(() => {
const k = tk || 1, gfaV = parseFloat(gfa) || 0, rV = parseFloat(rentGfa) || 0, opV = parseFloat(openProg) || 0, saV = parseFloat(siteArea) || 0, plV = parseFloat(poolArea) || 0;
const vc = parseInt(km.villa) || 0, ps = parseInt(km.suite_p) || 0, rc = parseInt(km.res) || 0;
const luxMix = k > 0 ? Math.min(((vc * 1.8 + ps * 1.4 + rc * 1.6) / k) * 8, 15) : 0;

```
const spatialRaw = gfaV / k;
const spatial = Math.min((spatialRaw / 350) * 100, 100);
const wTP = TP.filter(t => sTP.has(t.id)).reduce((s, t) => s + t.w, 0);
const richness = Math.min((wTP / 30) * 100, 100);
const siteCoverage = saV > 0 ? (gfaV / saV) * 100 : 0;
const landscapeRatio = saV > 0 ? ((saV - gfaV) / saV) * 100 : 0;
const landscape = Math.min((landscapeRatio / 85) * 100, 100);
const openRatio = gfaV > 0 ? (opV / gfaV) * 100 : 0;
const balance = Math.min((openRatio / 40) * 100, 100);
const density = saV > 0 ? k / (saV / 10000) : 0;
const poolRatio = plV / k;
const efficiencyRatio = gfaV > 0 ? (rV / gfaV) * 100 : 0;
const rentablePerKey = rV / k;

let nd = 0;
if (narr.concept.length > 15) nd += 28;
if (narr.purpose.length > 15) nd += 28;
if (narr.drivers.length > 15) nd += 24;
if (narr.materiality.length > 10) nd += 20;
const narrativeDepth = Math.min(nd, 100);

const raw = spatial * 0.24 + richness * 0.24 + landscape * 0.18 + balance * 0.14 + narrativeDepth * 0.20 * (narrativeDepth / 100) + luxMix;
const ediScore = Math.min(Math.round(raw), 100);
let tier = "Standard";
if (ediScore >= 88) tier = "Ultra-Luxury Icon"; else if (ediScore >= 74) tier = "Ultra-Luxury"; else if (ediScore >= 60) tier = "Luxury+"; else if (ediScore >= 44) tier = "Luxury"; else if (ediScore >= 28) tier = "Premium";

const tpByCategory = {};
TP.forEach(t => { if (sTP.has(t.id)) tpByCategory[t.cat] = (tpByCategory[t.cat] || 0) + 1; });
const tpScores = {};
CK.forEach(ck => {
  const catTPs = TP.filter(t => t.cat === ck);
  const maxW = catTPs.reduce((s, t) => s + t.w, 0);
  const selW = catTPs.filter(t => sTP.has(t.id)).reduce((s, t) => s + t.w, 0);
  tpScores[ck] = maxW > 0 ? Math.min((selW / maxW) * 120, 100) : 0;
});

const pr = [spatial, richness, landscape, balance, narrativeDepth];
let bestArch = "sanctuary", bestDist = Infinity;
Object.entries(ARCHETYPES).forEach(([key, a]) => { const d = a.radar.reduce((s, v, i) => s + Math.pow(v - pr[i], 2), 0); if (d < bestDist) { bestDist = d; bestArch = key; } });

const reasons = [];
if (spatial >= 75 && richness < 50) reasons.push("high spatial generosity with minimal programming");
else if (spatial >= 75) reasons.push("high spatial generosity");
if (richness >= 70) reasons.push("rich experiential programming");
if (landscape >= 70) reasons.push("strong landscape immersion");
if (balance >= 65) reasons.push("prominent outdoor program");
if (narrativeDepth >= 65) reasons.push("deep narrative foundation");
const archReason = `Matched based on: ${reasons.length > 0 ? reasons.join(", ") : "overall profile balance"}.`;

const insights = [];
if (spatialRaw > 0 && spatialRaw < 140) insights.push({ type: "w", text: `${spatialRaw.toFixed(0)} m²/key is below ultra-luxury threshold (220+). Consider fewer keys or expanded GFA.` });
if (spatialRaw >= 250) insights.push({ type: "s", text: `${spatialRaw.toFixed(0)} m²/key — iconic generosity. Core narrative asset.` });
if (vc > 0 && vc / k >= 0.3) insights.push({ type: "s", text: `${Math.round(vc / k * 100)}% villa mix elevates exclusivity and ADR potential.` });
if (rc > 0) insights.push({ type: "o", text: `${rc} branded residences need dedicated touchpoints.` });
if (!tpByCategory.welcome || tpByCategory.welcome < 2) insights.push({ type: "w", text: "Arrival journey needs more sensory layers." });
if (tpByCategory.cultural >= 3) insights.push({ type: "s", text: "Strong cultural infrastructure differentiates from hedonistic resorts." });
if (!tpByCategory.cultural) insights.push({ type: "o", text: "No cultural touchpoints. Consider programming that roots guests in place." });
if (narrativeDepth < 40) insights.push({ type: "w", text: "Weak narrative. A clear design story can add 10-15 EDI points." });
if (siteCoverage > 30 && saV > 0) insights.push({ type: "w", text: `${siteCoverage.toFixed(0)}% coverage exceeds ultra-luxury targets (15-25%).` });
if (density > 12 && saV > 0) insights.push({ type: "w", text: `${density.toFixed(1)} keys/ha is dense. Sanctuary: 2-5, Exclusive: 5-10.` });
if (poolRatio >= 12) insights.push({ type: "s", text: `${poolRatio.toFixed(1)} m²/key — generous water experience.` });
if (poolRatio > 0 && poolRatio < 5) insights.push({ type: "w", text: `${poolRatio.toFixed(1)} m²/key pool area is minimal. Target 10-15.` });
if (efficiencyRatio > 0 && efficiencyRatio < 50) insights.push({ type: "o", text: `${efficiencyRatio.toFixed(0)}% efficiency ratio — generous BOH/public allocation, typical for ultra-luxury.` });
if (efficiencyRatio > 65) insights.push({ type: "w", text: `${efficiencyRatio.toFixed(0)}% efficiency is high — ultra-luxury expects generous non-rentable areas (lobbies, corridors, amenities).` });
if (sTP.size >= 15 && spatialRaw >= 200) insights.push({ type: "s", text: "High generosity + rich touchpoints: discovery without saturation." });

// Value prop
const vpParts = [];
if (spatialRaw >= 220) vpParts.push("exceptional spatial generosity");
if (narrativeDepth >= 70) vpParts.push("a deeply articulated design narrative");
if (sTP.size >= 18) vpParts.push("rich experiential programming");
if (vc / k >= 0.3) vpParts.push("a villa-dominant key mix");
if (rc > 0) vpParts.push("an integrated branded residence component");
if (tpByCategory.cultural >= 3) vpParts.push("strong cultural infrastructure");
if (landscapeRatio >= 75) vpParts.push("radical landscape immersion");
if (poolRatio >= 10) vpParts.push("generous water experiences");
const archN = ARCHETYPES[bestArch]?.name;
const valueProposition = vpParts.length > 0 ? `Positioned as ${archN}, the project differentiates through ${vpParts.slice(0, 3).join(", ")}${vpParts.length > 3 ? `, further supported by ${vpParts.slice(3).join(" and ")}` : ""}.` : `A ${clim || ""} ${ctx || ""} project with potential for differentiation through stronger spatial and narrative commitments.`;

return { spatial, richness, landscape, balance, narrativeDepth, spatialRaw, siteCoverage, density, openRatio, landscapeRatio, poolRatio, efficiencyRatio, rentablePerKey, ediScore, tier, insights, tpByCategory, tpScores, luxuryMixBonus: luxMix, bestArch, archReason, tpCount: sTP.size, valueProposition };
```

}, [tk, km, gfa, rentGfa, openProg, siteArea, poolArea, sTP, clim, ctx, narr]);

const imps = useMemo(() => genImps(calc, clim, ctx, km, narr, sTP, tk), [calc, clim, ctx, km, narr, sTP, tk]);
const expEmph = useMemo(() => getExpEmphasis(calc.tpScores), [calc.tpScores]);
const highlights = useMemo(() => genHighlights(calc, narr, clim, ctx, km, tk), [calc, narr, clim, ctx, km, tk]);

useEffect(() => {
if (step === 4) { let c = 0; const t = calc.ediScore; const iv = setInterval(() => { c++; if (c >= t) { c = t; clearInterval(iv); } setAScore(c); }, 14); return () => clearInterval(iv); }
}, [step, calc.ediScore]);

/* STYLES */
const I = { width: “100%”, padding: “10px 12px”, background: “#faf9f7”, border: “1px solid #e2dfd8”, borderRadius: 2, color: “#2a2420”, fontSize: 14, fontFamily: “inherit”, outline: “none”, transition: “border-color 0.3s”, boxSizing: “border-box” };
const L = { display: “block”, marginBottom: 4, fontSize: 9, color: “rgba(0,0,0,0.35)”, letterSpacing: “0.15em” };
const B = { padding: “11px 26px”, border: “1px solid #d6d2ca”, background: “#fff”, color: “#4a4238”, fontSize: 10, letterSpacing: “0.17em”, fontFamily: “inherit”, cursor: “pointer”, borderRadius: 2, transition: “all 0.2s” };
const bh = (e, on) => { e.target.style.background = on ? “#f4f1ec” : “#fff”; };
const navB = (back, next, label = “CONTINUE”) => (
<div style={{ display: “flex”, justifyContent: “space-between”, marginTop: 36, paddingTop: 14, borderTop: “1px solid #e6e2dc” }}>
{back !== null ? <button style={{ …B, opacity: 0.45 }} onClick={() => go(back)}>BACK</button> : <div />}
<button style={{ …B, background: “#faf9f7” }} onClick={() => go(next)} onMouseEnter={e => bh(e, true)} onMouseLeave={e => bh(e, false)}>{label}</button>
</div>
);
const stepH = (n, t, sub) => (
<div style={{ textAlign: “center”, marginBottom: 28 }}>
<div style={{ fontSize: 8, letterSpacing: “0.3em”, color: “rgba(0,0,0,0.18)”, marginBottom: 6 }}>STEP {n} OF 4</div>
<h2 style={{ fontSize: 23, fontWeight: 300, color: “#2a2420”, margin: 0 }}>{t}</h2>
{sub && <p style={{ fontSize: 11.5, color: “rgba(0,0,0,0.32)”, marginTop: 4 }}>{sub}</p>}
</div>
);

/* ═══ S0: Project ═══ */
const S0 = () => (
<div style={{ maxWidth: 510, margin: “0 auto” }}>
<div style={{ textAlign: “center”, marginBottom: 40, paddingTop: 8 }}>
<div style={{ fontSize: 8, letterSpacing: “0.4em”, color: “rgba(0,0,0,0.16)”, marginBottom: 12 }}>CONCEPT PHASE EVALUATION</div>
<h1 style={{ fontSize: 34, fontWeight: 300, color: “#2a2420”, margin: 0, lineHeight: 1.1 }}>Experience<br /><span style={{ fontWeight: 400 }}>Density Index</span></h1>
<div style={{ width: 30, height: 1, background: “#d6d2ca”, margin: “16px auto” }} />
</div>
<div style={{ display: “grid”, gap: 14 }}>
<div><label style={L}>PROJECT NAME</label><input style={I} placeholder=“Riviera Maya Resort & Residences” value={pn} onChange={e => setPn(e.target.value)} /></div>
<div><label style={L}>LOCATION</label><input style={I} placeholder=“Tulum, Mexico” value={loc} onChange={e => setLoc(e.target.value)} /></div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 10 }}>
<div>
<label style={L}>CLIMATE</label>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 3 }}>
{CLIMATES.map(c => <button key={c.id} onClick={() => setClim(c.id)} style={{ padding: “7px 10px”, borderRadius: 2, cursor: “pointer”, border: `1px solid ${clim === c.id ? "#9a9080" : "#e2dfd8"}`, background: clim === c.id ? “#f0ece6” : “#fff”, fontFamily: “inherit”, fontSize: 10.5, color: clim === c.id ? “#2a2420” : “rgba(0,0,0,0.3)”, transition: “all 0.2s” }}>{c.label}</button>)}
</div>
</div>
<div>
<label style={L}>CONTEXT</label>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 3 }}>
{CONTEXTS.map(c => <button key={c.id} onClick={() => setCtx(c.id)} style={{ padding: “7px 10px”, borderRadius: 2, cursor: “pointer”, border: `1px solid ${ctx === c.id ? "#9a9080" : "#e2dfd8"}`, background: ctx === c.id ? “#f0ece6” : “#fff”, fontFamily: “inherit”, fontSize: 10.5, color: ctx === c.id ? “#2a2420” : “rgba(0,0,0,0.3)”, transition: “all 0.2s” }}>{c.label}</button>)}
</div>
</div>
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 10 }}>
<div><label style={L}>TOTAL SITE AREA (M²)</label><input style={I} type=“number” placeholder=“80,000” value={siteArea} onChange={e => setSiteArea(e.target.value)} /><div style={{ fontSize: 8.5, color: “rgba(0,0,0,0.18)”, marginTop: 2 }}>Entire plot</div></div>
<div><label style={L}>GROSS FLOOR AREA (M²)</label><input style={I} type=“number” placeholder=“24,000” value={gfa} onChange={e => setGfa(e.target.value)} /><div style={{ fontSize: 8.5, color: “rgba(0,0,0,0.18)”, marginTop: 2 }}>All buildings, all floors</div></div>
<div><label style={L}>RENTABLE AREA (M²)</label><input style={I} type=“number” placeholder=“14,000” value={rentGfa} onChange={e => setRentGfa(e.target.value)} /><div style={{ fontSize: 8.5, color: “rgba(0,0,0,0.18)”, marginTop: 2 }}>Keys + residences net sellable</div></div>
<div><label style={L}>OPEN PROGRAM (M²)</label><input style={I} type=“number” placeholder=“6,000” value={openProg} onChange={e => setOpenProg(e.target.value)} /><div style={{ fontSize: 8.5, color: “rgba(0,0,0,0.18)”, marginTop: 2 }}>Terraces, pool decks, outdoor dining</div></div>
<div style={{ gridColumn: “1 / -1” }}><label style={L}>TOTAL POOL / WATER SURFACE (M²)</label><input style={I} type=“number” placeholder=“3,000” value={poolArea} onChange={e => setPoolArea(e.target.value)} /></div>
</div>
</div>
{navB(null, 1, “KEY MIX”)}
</div>
);

/* ═══ S1: Key Mix ═══ */
const S1 = () => (
<div style={{ maxWidth: 490, margin: “0 auto” }}>
{stepH(2, “Key Mix”, “Room inventory impacts spatial perception and ADR.”)}
<div style={{ display: “flex”, flexDirection: “column”, gap: 6 }}>
{KT.map(kt => { const c = parseInt(km[kt.id]) || 0; return (
<div key={kt.id} style={{ display: “flex”, alignItems: “center”, gap: 10, padding: “8px 12px”, borderRadius: 2, border: `1px solid ${c > 0 ? "#d0ccc4" : "#e6e2dc"}`, background: c > 0 ? “#faf9f7” : “#fff” }}>
<div style={{ flex: 1 }}><div style={{ fontSize: 12.5, color: c > 0 ? “#2a2420” : “rgba(0,0,0,0.3)” }}>{kt.label}</div><div style={{ fontSize: 9, color: “rgba(0,0,0,0.2)” }}>~{kt.avg} m²</div></div>
<input style={{ …I, width: 60, textAlign: “center”, padding: “6px” }} type=“number” placeholder=“0” value={km[kt.id] || “”} onChange={e => setKm({ …km, [kt.id]: e.target.value })} />
</div>
); })}
</div>
<div style={{ marginTop: 12, textAlign: “center”, padding: “9px”, border: “1px solid #e2dfd8”, borderRadius: 2 }}>
<div style={{ fontSize: 8, color: “rgba(0,0,0,0.22)”, letterSpacing: “0.16em” }}>TOTAL KEYS</div>
<span style={{ fontSize: 26, color: “#2a2420”, fontWeight: 300 }}>{tk}</span>
</div>
{navB(0, 2, “TOUCHPOINTS”)}
</div>
);

/* ═══ S2: Touchpoints ═══ */
const S2 = () => (
<div style={{ maxWidth: 600, margin: “0 auto” }}>
{stepH(3, “Experience Touchpoints”, “Select every experiential moment in the guest journey.”)}
{Object.entries(CATS).map(([ck, cl]) => (
<div key={ck} style={{ marginBottom: 16 }}>
<div style={{ fontSize: 9, letterSpacing: “0.14em”, color: “rgba(0,0,0,0.3)”, marginBottom: 5 }}>{cl.toUpperCase()}</div>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 4 }}>
{TP.filter(t => t.cat === ck).map(tp => { const s = sTP.has(tp.id); return (
<button key={tp.id} onClick={() => togTP(tp.id)} style={{ padding: “5px 10px”, borderRadius: 11, fontSize: 10.5, cursor: “pointer”, fontFamily: “inherit”, border: `1px solid ${s ? "#9a9080" : "#e2dfd8"}`, background: s ? “#ede9e2” : “#fff”, color: s ? “#2a2420” : “rgba(0,0,0,0.28)”, transition: “all 0.2s” }}>
{s && <span style={{ marginRight: 3, fontSize: 8 }}>+</span>}{tp.label}
</button>
); })}
</div>
</div>
))}
{navB(1, 3, “NARRATIVE”)}
</div>
);

/* ═══ S3: Narrative + Sketches + ADR ═══ */
const S3 = () => (
<div style={{ maxWidth: 510, margin: “0 auto” }}>
{stepH(4, “Design Narrative”, “The story that gives coherence.”)}
{[
{ k: “concept”, l: “DESIGN CONCEPT”, p: “A sanctuary where jungle meets ocean, rooted in Mayan cosmology”, s: “One sentence governing all decisions” },
{ k: “purpose”, l: “PURPOSE STATEMENT”, p: “To create a place where guests rediscover connection to nature, culture, and themselves”, s: “Why does this project exist?” },
{ k: “drivers”, l: “DESIGN DRIVERS”, p: “1. Landscape-first  2. Sensory transitions  3. Local craft as structure”, s: “3-5 principles guiding design”, ta: true },
{ k: “materiality”, l: “MATERIALITY & SENSORY PALETTE”, p: “Local limestone, reclaimed hardwoods, henequen, copal, water sounds…”, s: “Materials, textures, scents, sounds”, ta: true },
].map(f => (
<div key={f.k} style={{ marginBottom: 14 }}>
<label style={L}>{f.l}</label>
{f.ta ? <textarea style={{ …I, minHeight: 56, resize: “vertical”, fontFamily: “inherit” }} placeholder={f.p} value={narr[f.k]} onChange={e => setNarr({ …narr, [f.k]: e.target.value })} /> : <input style={I} placeholder={f.p} value={narr[f.k]} onChange={e => setNarr({ …narr, [f.k]: e.target.value })} />}
<div style={{ fontSize: 8.5, color: “rgba(0,0,0,0.16)”, marginTop: 2 }}>{f.s}</div>
</div>
))}
{/* Narrative depth */}
<div style={{ padding: “9px 12px”, border: “1px solid #e2dfd8”, borderRadius: 2, marginBottom: 20 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<div style={{ fontSize: 20, color: “#2a2420”, fontWeight: 300 }}>{calc.narrativeDepth}<span style={{ fontSize: 10, color: “rgba(0,0,0,0.22)” }}>/100</span></div>
<div style={{ flex: 1, height: 3, background: “#e6e2dc”, borderRadius: 2 }}><div style={{ height: “100%”, width: `${calc.narrativeDepth}%`, background: “#9a9080”, borderRadius: 2, transition: “width 0.5s” }} /></div>
</div>
</div>
{/* Sketch attach */}
<div style={{ borderTop: “1px solid #e6e2dc”, paddingTop: 14, marginBottom: 14 }}>
<label style={L}>REFERENCE SKETCHES (OPTIONAL)</label>
<div style={{ display: “flex”, gap: 6, alignItems: “center”, flexWrap: “wrap” }}>
<div style={{ border: “1px dashed #d6d2ca”, borderRadius: 2, padding: “8px 14px”, cursor: “pointer”, fontSize: 10.5, color: “rgba(0,0,0,0.28)” }} onClick={() => document.getElementById(“sk-in”).click()}>+ Add images</div>
<input id=“sk-in” type=“file” accept=“image/*” multiple onChange={e => { Array.from(e.target.files).forEach(f => { const r = new FileReader(); r.onload = ev => setSketches(prev => […prev, ev.target.result]); r.readAsDataURL(f); }); }} style={{ display: “none” }} />
{sketches.map((sk, i) => (
<div key={i} style={{ position: “relative”, width: 48, height: 48 }}>
<img src={sk} alt=”” style={{ width: 48, height: 48, objectFit: “cover”, borderRadius: 2, border: “1px solid #e2dfd8” }} />
<button onClick={() => setSketches(p => p.filter((_, j) => j !== i))} style={{ position: “absolute”, top: -4, right: -4, width: 14, height: 14, borderRadius: 7, border: “none”, background: “rgba(0,0,0,0.2)”, color: “#fff”, fontSize: 8, cursor: “pointer”, display: “flex”, alignItems: “center”, justifyContent: “center” }}>×</button>
</div>
))}
</div>
<div style={{ fontSize: 8.5, color: “rgba(0,0,0,0.14)”, marginTop: 3 }}>Attached to PDF report</div>
</div>
{/* ADR */}
<div><label style={L}>MARKET ADR REFERENCE (OPTIONAL)</label><input style={I} placeholder=“Ultra-Luxury: $800-$2,500 / Luxury: $400-$800” value={adr} onChange={e => setAdr(e.target.value)} /></div>
{navB(2, 4, “CALCULATE EDI”)}
</div>
);

/* ═══ S4: RESULTS ═══ */
const S4 = () => {
const arch = ARCHETYPES[calc.bestArch];
const sa = ARCHETYPES[selArch];
const tpRadar = CK.map(ck => calc.tpScores[ck]);

```
return (
  <div style={{ maxWidth: 760, margin: "0 auto" }}>
    <div style={{ textAlign: "center", paddingTop: 2 }}>
      <div style={{ fontSize: 8, letterSpacing: "0.35em", color: "rgba(0,0,0,0.16)" }}>EXPERIENCE DENSITY INDEX</div>
      <h2 style={{ fontSize: 21, fontWeight: 300, color: "#2a2420", margin: "3px 0 0" }}>{pn || "Untitled"}</h2>
      <div style={{ fontSize: 10, color: "rgba(0,0,0,0.28)", marginTop: 2 }}>{CLIMATES.find(c => c.id === clim)?.label || ""} · {CONTEXTS.find(c => c.id === ctx)?.label || ""}{loc ? ` — ${loc}` : ""} · {tk} Keys</div>
    </div>

    {/* HERO RADAR */}
    <div style={{ marginTop: 20 }}>
      <Pentagon metrics={[calc.spatial, calc.richness, calc.landscape, calc.balance, calc.narrativeDepth]} ghost={AK.map(k => ({ values: ARCHETYPES[k].radar, hl: k === selArch }))} labels={["Spatial\nGenerosity", "Experience\nRichness", "Landscape\nImmersion", "Public Space\nPresence", "Narrative\nDepth"]} size={440} />
      <div style={{ textAlign: "center", marginTop: -4, fontSize: 9, color: "rgba(0,0,0,0.22)" }}>Solid — your project · Dashed — {sa.name}</div>
    </div>

    {/* Archetype + Score */}
    <div style={{ padding: "16px 20px", border: "1px solid #e2dfd8", borderRadius: 3, marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "rgba(0,0,0,0.24)" }}>EXPERIENCE ARCHETYPE</div>
          <div style={{ fontSize: 18, color: "#2a2420", fontWeight: 300, marginTop: 1 }}>{arch.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "rgba(0,0,0,0.24)" }}>EDI</div>
          <div style={{ fontSize: 24, color: "#2a2420", fontWeight: 300 }}>{aScore}</div>
          <div style={{ fontSize: 9, color: "rgba(0,0,0,0.3)", letterSpacing: "0.08em" }}>{calc.tier.toUpperCase()}</div>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.44)", lineHeight: 1.6, marginTop: 8 }}>{arch.long}</div>
      <div style={{ fontSize: 10, color: "rgba(0,0,0,0.32)", fontStyle: "italic", marginTop: 5 }}>{calc.archReason}</div>
      <div style={{ borderTop: "1px solid #e6e2dc", marginTop: 10, paddingTop: 8 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "rgba(0,0,0,0.2)", marginBottom: 5 }}>COMPARE</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {AK.map(k => <button key={k} onClick={() => setSelArch(k)} style={{ padding: "3px 9px", borderRadius: 10, fontSize: 9.5, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${selArch === k ? "#9a9080" : "#e2dfd8"}`, background: selArch === k ? "#ede9e2" : "#fff", color: selArch === k ? "#2a2420" : "rgba(0,0,0,0.25)" }}>{ARCHETYPES[k].name}</button>)}
        </div>
        {selArch !== calc.bestArch && <div style={{ marginTop: 6, fontSize: 10.5, color: "rgba(0,0,0,0.36)", lineHeight: 1.5 }}>{sa.short}</div>}
      </div>
    </div>

    {/* Experience Emphasis */}
    <div style={{ padding: "12px 16px", border: "1px solid #e2dfd8", borderRadius: 3, marginTop: 10 }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "rgba(0,0,0,0.24)", marginBottom: 3 }}>EXPERIENCE EMPHASIS</div>
      <div style={{ fontSize: 15, color: "#2a2420", fontWeight: 400 }}>{expEmph.label}</div>
      <div style={{ fontSize: 11, color: "rgba(0,0,0,0.38)", lineHeight: 1.55, marginTop: 3 }}>{expEmph.desc}</div>
    </div>

    {/* Value Prop */}
    <div style={{ padding: "12px 16px", border: "1px solid #e2dfd8", borderRadius: 3, marginTop: 10, borderLeft: "3px solid #9a9080" }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "rgba(0,0,0,0.24)", marginBottom: 3 }}>VALUE PROPOSITION</div>
      <div style={{ fontSize: 12.5, color: "#2a2420", lineHeight: 1.6, fontStyle: "italic" }}>{calc.valueProposition}</div>
    </div>

    {/* ADR */}
    {adr && <div style={{ padding: "9px 14px", border: "1px solid #e2dfd8", borderRadius: 2, marginTop: 10 }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.08em", color: "rgba(0,0,0,0.22)" }}>MARKET ADR</div>
      <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.44)", marginTop: 1 }}>{adr}</div>
    </div>}

    {/* TOUCHPOINT HEXAGON */}
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.22)", textAlign: "center", marginBottom: 2 }}>EXPERIENCE PROFILE</div>
      <Pentagon metrics={tpRadar} ghost={null} labels={CK.map(ck => CATS[ck])} size={340} />
      <div style={{ textAlign: "center", fontSize: 9, color: "rgba(0,0,0,0.22)", marginTop: -2 }}>{sTP.size} touchpoints — weighted coverage per category</div>
    </div>

    {/* Metrics */}
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.22)", marginBottom: 12 }}>KEY METRICS</div>
      <CtxBar label="Spatial Generosity" value={calc.spatialRaw} max={400} ranges={RNG.spatial} unit=" m²/key" />
      <CtxBar label="Site Coverage" value={calc.siteCoverage} max={50} ranges={RNG.coverage} unit="%" />
      <CtxBar label="Density" value={calc.density} max={40} ranges={RNG.density} unit=" keys/ha" />
      <CtxBar label="Pool Ratio" value={calc.poolRatio} max={25} ranges={RNG.pool} unit=" m²/key" />
      <CtxBar label="Efficiency (Rentable / GFA)" value={calc.efficiencyRatio} max={80} ranges={RNG.efficiency} unit="%" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
      {[
        ["LANDSCAPE", `${calc.landscapeRatio.toFixed(0)}%`, "of site"],
        ["OPEN PROGRAM", `${calc.openRatio.toFixed(0)}%`, "of GFA"],
        ["RENTABLE / KEY", `${calc.rentablePerKey.toFixed(0)}`, "m²"],
        ["NARRATIVE", `${calc.narrativeDepth}`, calc.narrativeDepth >= 80 ? "articulated" : calc.narrativeDepth >= 50 ? "developing" : "needs work"],
      ].map(([l, v, s], i) => (
        <div key={i} style={{ padding: "8px 9px", border: "1px solid #e2dfd8", borderRadius: 2 }}>
          <div style={{ fontSize: 7.5, color: "rgba(0,0,0,0.24)", letterSpacing: "0.08em" }}>{l}</div>
          <div style={{ fontSize: 17, color: "#2a2420", fontWeight: 300 }}>{v}</div>
          <div style={{ fontSize: 8, color: "rgba(0,0,0,0.2)" }}>{s}</div>
        </div>
      ))}
    </div>

    {/* Touchpoint map */}
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.22)", marginBottom: 8 }}>TOUCHPOINT MAP</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
        {Object.entries(CATS).map(([ck, cl]) => {
          const ct = calc.tpByCategory[ck] || 0, m = TP.filter(t => t.cat === ck).length;
          return (
            <div key={ck} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", border: "1px solid #e6e2dc", borderRadius: 2 }}>
              <div style={{ fontSize: 9.5, color: "rgba(0,0,0,0.34)", width: 54 }}>{cl.split(" ")[0]}</div>
              <div style={{ flex: 1, display: "flex", gap: 2 }}>{Array.from({ length: m }).map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: 1, background: i < ct ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.025)" }} />)}</div>
              <div style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", width: 12, textAlign: "right" }}>{ct}</div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Insights */}
    {calc.insights.length > 0 && <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.22)", marginBottom: 8 }}>INSIGHTS</div>
      {calc.insights.map((ins, i) => (
        <div key={i} style={{ padding: "8px 11px", marginBottom: 4, borderRadius: 2, background: "#faf9f7", borderLeft: `2px solid ${ins.type === "w" ? "#c4a070" : ins.type === "s" ? "#8aaa8a" : "#7a9aaa"}`, fontSize: 11, color: "rgba(0,0,0,0.48)", lineHeight: 1.55 }}>{ins.text}</div>
      ))}
    </div>}

    {/* Recommendations */}
    {imps.length > 0 && <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.22)", marginBottom: 8 }}>DESIGN RECOMMENDATIONS</div>
      {imps.map((imp, i) => (
        <div key={i} style={{ padding: "9px 12px", marginBottom: 5, border: "1px solid #e2dfd8", borderRadius: 2, borderLeft: `2px solid ${imp.pr === "high" ? "#c4a070" : "#9a9080"}` }}>
          <div style={{ fontSize: 11.5, color: "#2a2420", fontWeight: 500 }}>{imp.title}</div>
          <div style={{ fontSize: 10.5, color: "rgba(0,0,0,0.4)", lineHeight: 1.55, marginTop: 2 }}>{imp.text}</div>
        </div>
      ))}
    </div>}

    {/* ═══ PROJECT HIGHLIGHTS ═══ */}
    <div style={{ marginTop: 28, padding: "18px 20px", border: "1px solid #d0ccc4", borderRadius: 3, background: "#faf9f7" }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.28)", marginBottom: 10 }}>PROJECT HIGHLIGHTS — WHAT MAKES THIS SPECIAL</div>
      {highlights.map((h, i) => (
        <div key={i} style={{ padding: "10px 14px", marginBottom: 6, borderLeft: "2px solid #2a2420", fontSize: 12, color: "#2a2420", lineHeight: 1.65, fontStyle: "italic" }}>{h}</div>
      ))}
    </div>

    {/* Sketches */}
    {sketches.length > 0 && <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(0,0,0,0.22)", marginBottom: 6 }}>REFERENCE SKETCHES</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {sketches.map((sk, i) => <img key={i} src={sk} alt="" style={{ height: 120, borderRadius: 2, border: "1px solid #e2dfd8" }} />)}
      </div>
    </div>}

    {/* Actions */}
    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 28, paddingTop: 12, borderTop: "1px solid #e2dfd8", flexWrap: "wrap" }}>
      {[["PROJECT", 0], ["KEYS", 1], ["TOUCHPOINTS", 2], ["NARRATIVE", 3]].map(([l, s]) => (
        <button key={s} style={{ ...B, fontSize: 9, padding: "6px 12px" }} onClick={() => go(s)} onMouseEnter={e => bh(e, true)} onMouseLeave={e => bh(e, false)}>{l}</button>
      ))}
      <button style={{ ...B, fontSize: 9, padding: "6px 16px", background: "#ede9e2" }} onClick={() => exportPDF(pn, loc, clim, ctx, tk, km, calc, sTP, narr, imps, adr, highlights, expEmph)} onMouseEnter={e => { e.target.style.background = "#e4e0d8"; }} onMouseLeave={e => { e.target.style.background = "#ede9e2"; }}>DOWNLOAD PDF</button>
    </div>
  </div>
);
```

};

const steps = [S0, S1, S2, S3, S4];
return (
<div style={{ minHeight: “100vh”, background: “#fff”, color: “#2a2420”, fontFamily: “‘Cormorant Garamond’, Georgia, serif” }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:rgba(0,0,0,0.2)}input:focus,textarea:focus{border-color:#9a9080!important}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}textarea{font-family:'Cormorant Garamond',Georgia,serif}`}</style>
<div style={{ position: “fixed”, top: 0, left: 0, right: 0, zIndex: 100, height: 1.5, background: “#e2dfd8” }}>
<div style={{ height: “100%”, width: `${((step + 1) / 5) * 100}%`, background: “#9a9080”, transition: “width 0.6s cubic-bezier(0.16, 1, 0.3, 1)” }} />
</div>
<div style={{ padding: “20px 22px 44px”, maxWidth: 840, margin: “0 auto”, opacity: fade ? 1 : 0, transform: fade ? “translateY(0)” : “translateY(8px)”, transition: “opacity 0.2s, transform 0.2s” }}>
{steps[step]()}
</div>
</div>
);
}
