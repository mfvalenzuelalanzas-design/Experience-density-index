import { useState, useMemo, useEffect } from "react";

/* ═══ ARCHETYPES ═══ */
const ARCHETYPES = {
  sanctuary: { name: "The Sanctuary", short: "Radical spatial generosity. Silence and nature as the product.", long: "Sparse programming is intentional — privacy and vast landscape are the luxury. Every villa is a world unto itself. The guest count is deliberately low. Design decisions favor emptiness over embellishment.", radar: [95, 30, 92, 35, 80], ref: "Aman, Amangiri, Amanoi" },
  theatre: { name: "The Grand Theatre", short: "Choreographed experience. Theatrical public spaces. Destination dining.", long: "Public spaces are stages — grand lobbies, dramatic pools, signature restaurants as destinations. The experience is layered and sequential with high touchpoint density. Architecture is expressive. Social energy is curated.", radar: [60, 95, 50, 85, 65], ref: "One&Only, Belmond, Cheval Blanc" },
  village: { name: "The Cultural Village", short: "Inseparable from place. Local materials and traditions are structural.", long: "The architecture speaks the language of the region. Programming connects guests to place through food, art, and community. Authenticity is the core value proposition. Could not exist anywhere else.", radar: [55, 65, 60, 50, 95], ref: "Rosewood, Six Senses, Zannier" },
  oasis: { name: "The Wellness Oasis", short: "The entire property is therapeutic. The spa is the reason for being.", long: "Architecture, landscape, light, and water are designed to heal. Programming is clinical in quality but sensorial in delivery. Biophilic design principles govern every decision.", radar: [70, 55, 88, 45, 75], ref: "SHA Wellness, Chiva-Som, Six Senses" },
  estate: { name: "The Branded Estate", short: "Dual identity: resort experience + residential permanence.", long: "Residential and hotel components each have distinct peak experiences while sharing a unified design language. Community-building for residents and privacy calibration between populations are critical.", radar: [60, 72, 55, 75, 60], ref: "Aman Residences, Four Seasons Private Residences" },
  club: { name: "The Social Club", short: "Public spaces dominate. The energy of the crowd is the product.", long: "Pools, beach clubs, and restaurants designed for atmosphere and social interaction. Architecture is bold. The guest values scene, curation, and cultural relevance over seclusion.", radar: [45, 90, 45, 90, 40], ref: "Nobu Hotel, Edition, SLS, Fasano" },
};
const AK = Object.keys(ARCHETYPES);

/* ═══ CLIMATE & CONTEXT ═══ */
const CLIMATES = [
  { id: "tropical", label: "Tropical" }, { id: "desert", label: "Desert" },
  { id: "coastal", label: "Coastal" }, { id: "mountain", label: "Mountain" }, { id: "temperate", label: "Temperate" },
];
const CONTEXTS = [
  { id: "resort", label: "Resort / Rural", note: "Isolated. The property IS the destination." },
  { id: "urban", label: "Urban", note: "Verticality replaces landscape. City as amenity." },
  { id: "periurban", label: "Periurban", note: "Edge condition. Accessibility is an asset." },
  { id: "island", label: "Island", note: "Finite land. Water arrival. Exclusivity is inherent." },
];

/* ═══ KEY TYPES ═══ */
const KT = [
  { id: "villa", label: "Private Villas", avg: 250, mult: 1.8 },
  { id: "suite_p", label: "Premium Suites", avg: 120, mult: 1.4 },
  { id: "suite_j", label: "Junior Suites", avg: 75, mult: 1.1 },
  { id: "room_d", label: "Deluxe Rooms", avg: 55, mult: 1.0 },
  { id: "room_s", label: "Standard Rooms", avg: 42, mult: 0.8 },
  { id: "res", label: "Branded Residences", avg: 180, mult: 1.6 },
];

/* ═══ TOUCHPOINTS ═══ */
const TP = [
  { id: "lobby", label: "Arrival Lobby", cat: "welcome", w: 1.0 },
  { id: "porte", label: "Porte-Cochere", cat: "welcome", w: 0.8 },
  { id: "garden_arr", label: "Garden Arrival Sequence", cat: "welcome", w: 1.2 },
  { id: "water_arr", label: "Water Arrival", cat: "welcome", w: 1.5 },
  { id: "ritual", label: "Welcome Ritual", cat: "welcome", w: 1.3 },
  { id: "sig_rest", label: "Signature Restaurant", cat: "gastronomy", w: 1.4 },
  { id: "casual", label: "Casual Dining", cat: "gastronomy", w: 0.8 },
  { id: "bar", label: "Bar / Lounge", cat: "gastronomy", w: 1.0 },
  { id: "pool_bar", label: "Pool Bar", cat: "gastronomy", w: 0.9 },
  { id: "priv_din", label: "Private Dining", cat: "gastronomy", w: 1.3 },
  { id: "wine", label: "Wine Cellar / Tasting", cat: "gastronomy", w: 1.2 },
  { id: "farm", label: "Farm-to-Table", cat: "gastronomy", w: 1.4 },
  { id: "bfast", label: "Breakfast Venue", cat: "gastronomy", w: 0.6 },
  { id: "spa", label: "Spa & Wellness Center", cat: "wellness", w: 1.3 },
  { id: "gym", label: "Fitness Center", cat: "wellness", w: 0.6 },
  { id: "yoga", label: "Yoga / Meditation Pavilion", cat: "wellness", w: 1.1 },
  { id: "hammam", label: "Hammam / Thermal Suite", cat: "wellness", w: 1.4 },
  { id: "plunge", label: "Hydrotherapy Circuit", cat: "wellness", w: 1.2 },
  { id: "out_spa", label: "Outdoor Treatments", cat: "wellness", w: 1.3 },
  { id: "pool", label: "Main Pool", cat: "active", w: 0.8 },
  { id: "inf_pool", label: "Adults Pool", cat: "active", w: 1.1 },
  { id: "beach", label: "Beach Club", cat: "active", w: 1.3 },
  { id: "kids", label: "Kids Club", cat: "active", w: 0.7 },
  { id: "tennis", label: "Tennis / Padel", cat: "active", w: 0.7 },
  { id: "water_sp", label: "Water Sports", cat: "active", w: 1.0 },
  { id: "garden", label: "Gardens / Trails", cat: "outdoor", w: 1.2 },
  { id: "mirador", label: "Mirador / Viewpoint", cat: "outdoor", w: 1.3 },
  { id: "fire", label: "Fire Pit / Gathering", cat: "outdoor", w: 1.1 },
  { id: "nat_feat", label: "Natural Feature", cat: "outdoor", w: 1.6 },
  { id: "org_farm", label: "Organic Farm", cat: "outdoor", w: 1.2 },
  { id: "art", label: "Art / Gallery Space", cat: "cultural", w: 1.3 },
  { id: "library", label: "Library / Reading Room", cat: "cultural", w: 1.0 },
  { id: "cook", label: "Cooking School", cat: "cultural", w: 1.2 },
  { id: "obs", label: "Observatory / Stargazing", cat: "cultural", w: 1.4 },
  { id: "craft", label: "Artisan Atelier", cat: "cultural", w: 1.3 },
  { id: "spirits", label: "Spirits Room", cat: "cultural", w: 1.1 },
];
const CATS = { welcome: "First Impression", gastronomy: "Gastronomy", wellness: "Wellness", active: "Active Leisure", outdoor: "Outdoor Immersion", cultural: "Cultural Depth" };
const CK = Object.keys(CATS);

/* ═══ BENCHMARK RANGES ═══ */
const RNG = {
  spatial: [{ max: 100, label: "Standard" }, { max: 150, label: "Premium" }, { max: 220, label: "Luxury" }, { max: 300, label: "Ultra-Luxury" }, { max: 400, label: "Iconic" }],
  coverage: [{ max: 15, label: "Ultra-Low" }, { max: 25, label: "Ultra-Luxury" }, { max: 35, label: "Luxury" }, { max: 50, label: "Dense" }],
  density: [{ max: 5, label: "Sanctuary" }, { max: 10, label: "Exclusive" }, { max: 20, label: "Resort" }, { max: 40, label: "Dense" }],
  pool: [{ max: 3, label: "Minimal" }, { max: 8, label: "Standard" }, { max: 15, label: "Generous" }, { max: 25, label: "Iconic" }],
  efficiency: [{ max: 50, label: "Generous BOH" }, { max: 58, label: "Luxury" }, { max: 65, label: "Efficient" }, { max: 80, label: "Optimized" }],
};

/* ═══ EXPERIENCE EMPHASIS ═══ */
function getExpEmphasis(tpScores) {
  const sorted = CK.map(k => ({ k, s: tpScores[k] || 0 })).sort((a, b) => b.s - a.s).filter(x => x.s > 20);
  if (sorted.length === 0) return { label: "Undefined", desc: "Touchpoint selection is too sparse to define an experiential emphasis." };
  const labels = { welcome: "Journey-Focused", gastronomy: "Gastronomy-Led", wellness: "Wellness-Centered", active: "Activity-Rich", outdoor: "Nature-Immersive", cultural: "Culturally Rooted" };
  const descs = {
    welcome: "The guest journey is prioritized -- arrival choreography and first impressions define the brand.",
    gastronomy: "Food and beverage is the experiential anchor -- culinary programming drives positioning and ADR.",
    wellness: "Healing and wellbeing are the core proposition -- the architecture itself is therapeutic.",
    active: "Leisure programming is the draw -- pools, sports, and beach culture create social energy.",
    outdoor: "Nature immersion is the centerpiece -- landscape, trails, and outdoor gathering define the experience.",
    cultural: "Cultural authenticity differentiates -- art, craft, and local narrative create irreplaceable identity."
  };
  const primary = sorted[0];
  const secondary = sorted.length > 1 && sorted[1].s > sorted[0].s * 0.7 ? sorted[1] : null;
  if (secondary) return { label: labels[primary.k] + ", " + labels[secondary.k], desc: descs[primary.k] + " " + descs[secondary.k] };
  return { label: labels[primary.k], desc: descs[primary.k] };
}

/* ═══ HIGHLIGHTS ═══ */
function genHighlights(c, narr, clim, ctx, km, tk) {
  var h = [];
  var vc = parseInt(km.villa) || 0, rc = parseInt(km.res) || 0, k = tk || 1;
  if (c.spatial >= 70 && c.tpScores.outdoor >= 50) h.push("Exceptional spatial generosity combined with strong outdoor programming creates a landscape-led experience where architecture serves as a frame for nature, not a barrier to it.");
  if (c.richness >= 60 && c.tpScores.gastronomy >= 60) h.push("Rich experiential density anchored by gastronomy -- this positions food and beverage not as amenity but as a destination driver capable of justifying premium ADR independently.");
  if (c.narrativeDepth >= 70 && c.tpScores.cultural >= 50) h.push("A deeply articulated narrative paired with cultural infrastructure creates an experience that is rooted in place. This is the hardest quality for competitors to replicate.");
  if (c.spatial >= 60 && c.richness >= 60 && c.landscape >= 60) h.push("Rare balance: high spatial generosity with rich programming AND strong landscape integration. Guests have multiple discovery layers without feeling crowded or under-programmed.");
  if (c.tpScores.welcome >= 60 && c.narrativeDepth >= 50) h.push("The arrival sequence is layered and intentional. When narrative depth backs this up, the first impression becomes a promise that the rest of the property can deliver on.");
  if (vc / k >= 0.3 && c.spatial >= 60) h.push("Villa-dominant key mix at this spatial ratio creates genuine exclusivity -- each unit operates as an independent world, which is the defining characteristic of ultra-luxury positioning.");
  if (rc > 0 && c.tpScores.active >= 40 && c.tpScores.gastronomy >= 40) h.push("The branded residence offering is strengthened by diverse leisure and gastronomy programming -- residents need year-round reasons to use the property, and this mix delivers that.");
  if (c.poolRatio >= 10 && c.tpScores.wellness >= 50) h.push("Generous water surface combined with wellness programming creates a therapeutic landscape that extends well beyond the spa building -- water becomes architecture.");
  if (c.landscapeRatio >= 75 && ctx === "resort") h.push("With over 75% of the site remaining as landscape, the project preserves the asset that drew attention in the first place. In a resort context, this restraint IS the luxury.");
  if (c.tpScores.cultural >= 60 && c.tpScores.outdoor >= 50) h.push("Cultural depth embedded within outdoor experiences -- artisan ateliers, farm-to-table gardens, nature trails with interpretive moments -- creates a narrative that unfolds through the landscape itself.");
  if (h.length === 0) h.push("The project has potential for differentiation through clearer spatial commitments and a more articulated narrative. The current touchpoint selection provides a foundation; the next step is ensuring each programmed space has a clear experiential purpose.");
  return h.slice(0, 4);
}

/* ═══ IMPROVEMENTS ═══ */
function genImps(c, clim, ctx, km, narr, sTP, tk) {
  var r = [], tpc = c.tpByCategory, rc = parseInt(km.res) || 0;
  if (c.spatialRaw > 0 && c.spatialRaw < 150) r.push({ pr: "high", title: "Increase Spatial Generosity", text: "Reduce key count or expand GFA. At this ratio, the project positions as luxury, not ultra-luxury." });
  if (!tpc.welcome || tpc.welcome < 3) r.push({ pr: "high", title: "Layer the Arrival Sequence", text: "Minimum 3 chapters: anticipation (approach), transition (garden/water passage), reveal (first view). Each chapter engages a different sense." });
  if (!sTP.has("farm") && ["tropical", "temperate", "coastal"].includes(clim)) r.push({ pr: "med", title: "Integrate Farm-to-Table", text: "On-site garden creates a narrative loop: landscape to kitchen to plate to story. Connects guests to the land." });
  if (!tpc.wellness || tpc.wellness < 3) r.push({ pr: "med", title: "Distribute Wellness", text: "Move wellness from a single facility to a distributed philosophy. Outdoor treatments, hydrotherapy, meditation pavilions across the site." });
  if (c.siteCoverage > 30) r.push({ pr: "high", title: "Reduce Site Coverage", text: c.siteCoverage.toFixed(0) + "% exceeds ultra-luxury targets (15-25%). Compact service cores, dispersed guest components." });
  if (!tpc.cultural || tpc.cultural < 2) r.push({ pr: "high", title: "Build Cultural Infrastructure", text: "Local artists, artisan residency, cultural programming spaces. Ultra-luxury guests seek meaning, not just comfort." });
  if (rc > 0) r.push({ pr: "med", title: "Separate Resident Experiences", text: "Residents and guests need distinct peak moments. Private club, dedicated pool, exclusive dining." });
  if (c.narrativeDepth < 60) r.push({ pr: "high", title: "Deepen the Design Story", text: "What is THIS place, and no other? The narrative must be specific enough to only exist here." });
  if (c.density > 12) r.push({ pr: "med", title: "Reduce Density", text: c.density.toFixed(1) + " keys/ha is high. Aman: 2-5, One&Only: 5-8." });
  if (c.poolRatio < 5 && ctx !== "urban") r.push({ pr: "med", title: "Increase Pool Area", text: c.poolRatio.toFixed(1) + " m2/key is below generous thresholds (10-15). Private plunge pools, adults pool, or hydrotherapy." });
  if (c.efficiencyRatio > 0 && c.efficiencyRatio > 65) r.push({ pr: "med", title: "Increase Public Area Generosity", text: c.efficiencyRatio.toFixed(0) + "% efficiency is high -- ultra-luxury expects generous non-rentable areas." });
  return r.sort(function(a, b) { return (a.pr === "high" ? 0 : 1) - (b.pr === "high" ? 0 : 1); });
}

/* ═══ PENTAGON ═══ */
function Pentagon(props) {
  var metrics = props.metrics, ghost = props.ghost, labels = props.labels, size = props.size || 400;
  var c = size / 2, r = size * 0.34, n = labels.length;
  var angles = labels.map(function(_, i) { return (Math.PI * 2 * i) / n - Math.PI / 2; });
  var pt = function(a, v) { return { x: c + r * (v / 100) * Math.cos(a), y: c + r * (v / 100) * Math.sin(a) }; };
  var path = function(v) { return v.map(function(val, i) { return (i === 0 ? "M" : "L") + " " + pt(angles[i], val).x + " " + pt(angles[i], val).y; }).join(" ") + " Z"; };
  var uid = "pg" + n + size;
  return (
    <svg viewBox={"0 0 " + size + " " + size} style={{ width: "100%", maxWidth: size, display: "block", margin: "0 auto" }}>
      <defs><linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2a2420" stopOpacity="0.06" /><stop offset="100%" stopColor="#2a2420" stopOpacity="0.015" /></linearGradient></defs>
      {[20, 40, 60, 80, 100].map(function(l) { return <polygon key={l} points={angles.map(function(a) { return pt(a, l).x + "," + pt(a, l).y; }).join(" ")} fill="none" stroke={l === 100 ? "rgba(0,0,0,0.07)" : "rgba(0,0,0,0.025)"} strokeWidth="0.5" />; })}
      {angles.map(function(a, i) { return <line key={i} x1={c} y1={c} x2={pt(a, 105).x} y2={pt(a, 105).y} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />; })}
      {ghost && ghost.map(function(g, gi) { return <path key={gi} d={path(g.values)} fill="none" stroke={"rgba(0,0,0," + (g.hl ? 0.14 : 0.03) + ")"} strokeWidth={g.hl ? 1.5 : 0.7} strokeDasharray={g.hl ? "7 5" : "3 4"} />; })}
      <path d={path(metrics)} fill={"url(#" + uid + ")"} stroke="#2a2420" strokeWidth="2" strokeLinejoin="round" />
      {metrics.map(function(v, i) { var p = pt(angles[i], v); return <g key={i}><circle cx={p.x} cy={p.y} r="4" fill="rgba(42,36,32,0.06)" /><circle cx={p.x} cy={p.y} r="2.5" fill="#2a2420" /></g>; })}
      {labels.map(function(label, i) {
        var p = pt(angles[i], n === 5 ? 118 : 116);
        var lines = label.split("\n");
        return <g key={i}>{lines.map(function(line, li) { return <text key={li} x={p.x} y={p.y + li * 11 - (lines.length - 1) * 4.5} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,0,0,0.7)" fontSize="8.5" fontFamily="'Cormorant Garamond', Georgia, serif" letterSpacing="0.07em">{line.toUpperCase()}</text>; })}</g>;
      })}
    </svg>
  );
}

/* ═══ CONTEXT BAR ═══ */
function CtxBar(props) {
  var label = props.label, value = props.value, max = props.max, ranges = props.ranges, unit = props.unit;
  var pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: "#5a5248", letterSpacing: "0.1em" }}>{label.toUpperCase()}</span>
        <span style={{ fontSize: 15, color: "#1a1815", fontWeight: 400 }}>{typeof value === "number" ? (value % 1 === 0 ? value : value.toFixed(1)) : value}{unit && <span style={{ fontSize: 10, color: "#6a5e4e", marginLeft: 2 }}>{unit}</span>}</span>
      </div>
      <div style={{ position: "relative", height: 22, display: "flex", borderRadius: 2, overflow: "hidden" }}>
        {ranges.map(function(rng, i) {
          var prev = i > 0 ? ranges[i - 1].max : 0;
          return <div key={i} style={{ width: ((rng.max - prev) / max) * 100 + "%", background: "rgba(0,0,0," + (0.018 + i * 0.014) + ")", borderRight: i < ranges.length - 1 ? "1px solid rgba(255,255,255,0.8)" : "none", position: "relative" }}>
            <span style={{ position: "absolute", bottom: -15, left: "50%", transform: "translateX(-50%)", fontSize: 7.5, color: "#7a6e62", whiteSpace: "nowrap" }}>{rng.label}</span>
          </div>;
        })}
        <div style={{ position: "absolute", left: pct + "%", top: 0, bottom: 0, width: 2.5, background: "#1a1815", borderRadius: 1, transform: "translateX(-1px)", transition: "left 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>
    </div>
  );
}

/* ═══ PDF ═══ */
function exportPDF(pn, loc, clim, ctx, tk, km, c, selTP, narr, imps, adr, highlights, expEmph) {
  var arch = ARCHETYPES[c.bestArch];
  var tpList = TP.filter(function(t) { return selTP.has(t.id); });
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>EDI -- ' + pn + '</title>' +
'<style>@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap");' +
'*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Cormorant Garamond",Georgia,serif;color:#1a1815;background:#fff;padding:44px 52px;line-height:1.6;max-width:720px;margin:0 auto}' +
'.hdr{font-size:9px;letter-spacing:0.35em;color:#6a5e4e;text-transform:uppercase;margin-bottom:12px}' +
'h1{font-size:24px;font-weight:300;color:#1a1815}' +
'h2{font-size:10px;font-weight:400;color:#4a4238;letter-spacing:0.22em;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #e6e2dc;text-transform:uppercase}' +
'p{font-size:12px;color:#2a2420;margin-bottom:4px}' +
'.sb{text-align:center;padding:18px;border:1px solid #e6e2dc;border-radius:3px;margin:10px 0}' +
'.sn{font-size:42px;font-weight:300;color:#1a1815}.st{font-size:10px;letter-spacing:0.18em;color:#4a4238;margin-top:1px}' +
'.g2{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:6px 0}' +
'.m{padding:6px 10px;border:1px solid #e6e2dc;border-radius:2px}.ml{font-size:8px;letter-spacing:0.12em;color:#6a5e4e;text-transform:uppercase}.mv{font-size:16px;font-weight:300;color:#1a1815;margin-top:1px}' +
'.ab{padding:12px 16px;border:1px solid #e6e2dc;border-radius:3px;margin:6px 0;text-align:center}' +
'.nb{padding:8px 12px;border:1px solid #e6e2dc;border-radius:2px;margin:4px 0;border-left:2px solid #8a7e6e}.nl{font-size:8px;letter-spacing:0.1em;color:#6a5e4e;text-transform:uppercase}.nt{font-size:11px;color:#2a2420;font-style:italic}' +
'.ins{padding:6px 10px;margin:3px 0;border-radius:2px;font-size:10.5px;border-left:2px solid #8a7e6e;background:#faf8f5}' +
'.imp{padding:8px 10px;margin:4px 0;border:1px solid #e6e2dc;border-radius:2px}.it{font-size:11px;font-weight:500;color:#1a1815}.ix{font-size:10px;color:#3a3428;margin-top:1px;line-height:1.5}' +
'.hl{padding:10px 14px;margin:5px 0;border-left:2px solid #1a1815;font-size:11.5px;color:#1a1815;line-height:1.6;font-style:italic}' +
'.ft{margin-top:28px;padding-top:8px;border-top:1px solid #e6e2dc;font-size:8px;color:#6a5e4e;letter-spacing:0.12em;text-align:center}' +
'@media print{body{padding:24px 28px}.imp,.ins,.hl{break-inside:avoid}}</style></head><body>' +
'<div class="hdr">Experience Density Index -- Concept Phase</div>' +
'<h1>' + (pn || "Untitled") + '</h1>' +
'<p style="color:#6a5e4e;font-size:10px">' + (CLIMATES.find(function(x) { return x.id === clim; }) || {}).label + ' &middot; ' + (CONTEXTS.find(function(x) { return x.id === ctx; }) || {}).label + (loc ? " -- " + loc : "") + ' &middot; ' + tk + ' Keys &middot; ' + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) + '</p>' +
'<div class="sb"><div class="sn">' + c.ediScore + '</div><div class="st">' + c.tier + '</div></div>' +
'<h2>Experience Archetype</h2><div class="ab"><div style="font-size:16px;color:#1a1815">' + arch.name + '</div><div style="font-size:10.5px;color:#3a3428;margin-top:3px;max-width:420px;margin-left:auto;margin-right:auto">' + arch.long + '</div><p style="font-size:9px;color:#6a5e4e;margin-top:4px;font-style:italic">' + c.archReason + '</p></div>' +
'<h2>Experience Emphasis</h2><p><strong>' + expEmph.label + '</strong> -- ' + expEmph.desc + '</p>' +
(c.valueProposition ? '<h2>Value Proposition</h2><p style="font-style:italic;font-size:12.5px;color:#1a1815;padding:8px 12px;border-left:2px solid #8a7e6e">' + c.valueProposition + '</p>' : '') +
(adr ? '<h2>Market ADR Reference</h2><p>' + adr + '</p>' : '') +
'<h2>Key Metrics</h2><div class="g2">' +
'<div class="m"><div class="ml">Spatial Generosity</div><div class="mv">' + c.spatialRaw.toFixed(0) + ' m2/key</div></div>' +
'<div class="m"><div class="ml">Site Coverage</div><div class="mv">' + c.siteCoverage.toFixed(1) + '%</div></div>' +
'<div class="m"><div class="ml">Density</div><div class="mv">' + c.density.toFixed(1) + ' keys/ha</div></div>' +
'<div class="m"><div class="ml">Pool Ratio</div><div class="mv">' + c.poolRatio.toFixed(1) + ' m2/key</div></div>' +
'<div class="m"><div class="ml">Efficiency</div><div class="mv">' + c.efficiencyRatio.toFixed(0) + '%</div></div>' +
'<div class="m"><div class="ml">Rentable / Key</div><div class="mv">' + c.rentablePerKey.toFixed(0) + ' m2</div></div>' +
'<div class="m"><div class="ml">Landscape</div><div class="mv">' + c.landscapeRatio.toFixed(0) + '%</div></div>' +
'<div class="m"><div class="ml">Narrative Depth</div><div class="mv">' + c.narrativeDepth + '/100</div></div></div>' +
'<h2>Narrative</h2>' +
(narr.concept ? '<div class="nb"><div class="nl">Concept</div><div class="nt">' + narr.concept + '</div></div>' : '') +
(narr.purpose ? '<div class="nb"><div class="nl">Purpose</div><div class="nt">' + narr.purpose + '</div></div>' : '') +
(narr.drivers ? '<div class="nb"><div class="nl">Drivers</div><div class="nt">' + narr.drivers + '</div></div>' : '') +
(narr.materiality ? '<div class="nb"><div class="nl">Materiality</div><div class="nt">' + narr.materiality + '</div></div>' : '') +
'<h2>Touchpoints (' + tpList.length + ')</h2>' +
Object.entries(CATS).map(function(entry) { var items = tpList.filter(function(t) { return t.cat === entry[0]; }); return items.length ? '<p><strong>' + entry[1] + ':</strong> ' + items.map(function(t) { return t.label; }).join(", ") + '</p>' : ''; }).join('') +
'<h2>Insights</h2>' + c.insights.map(function(i) { return '<div class="ins">' + i.text + '</div>'; }).join('') +
'<h2>Design Recommendations</h2>' + imps.map(function(i) { return '<div class="imp"><div class="it">' + i.title + '</div><div class="ix">' + i.text + '</div></div>'; }).join('') +
'<h2>Project Highlights</h2>' + highlights.map(function(h) { return '<div class="hl">' + h + '</div>'; }).join('') +
'<div class="ft">EDI &middot; CONCEPT PHASE &middot; CONFIDENTIAL</div></body></html>';
  var w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank");
  if (w) setTimeout(function() { w.print(); }, 800);
}

/* ═══ MAIN ═══ */
export default function EDI() {
  var _s = useState(0), step = _s[0], setStep = _s[1];
  var _pn = useState(""), pn = _pn[0], setPn = _pn[1];
  var _loc = useState(""), loc = _loc[0], setLoc = _loc[1];
  var _cl = useState(""), clim = _cl[0], setClim = _cl[1];
  var _ct = useState(""), ctx = _ct[0], setCtx = _ct[1];
  var _km = useState({}), km = _km[0], setKm = _km[1];
  var _gfa = useState(""), gfa = _gfa[0], setGfa = _gfa[1];
  var _rg = useState(""), rentGfa = _rg[0], setRentGfa = _rg[1];
  var _op = useState(""), openProg = _op[0], setOpenProg = _op[1];
  var _sa = useState(""), siteArea = _sa[0], setSiteArea = _sa[1];
  var _pa = useState(""), poolArea = _pa[0], setPoolArea = _pa[1];
  var _tp = useState(new Set()), sTP = _tp[0], setSTP = _tp[1];
  var _ar = useState("sanctuary"), selArch = _ar[0], setSelArch = _ar[1];
  var _nr = useState({ concept: "", purpose: "", drivers: "", materiality: "" }), narr = _nr[0], setNarr = _nr[1];
  var _ad = useState(""), adr = _ad[0], setAdr = _ad[1];
  var _as = useState(0), aScore = _as[0], setAScore = _as[1];
  var _fd = useState(true), fade = _fd[0], setFade = _fd[1];
  var _sk = useState([]), sketches = _sk[0], setSketches = _sk[1];

  var tk = useMemo(function() { return Object.values(km).reduce(function(s, v) { return s + (parseInt(v) || 0); }, 0); }, [km]);
  var go = function(s) { setFade(false); setTimeout(function() { setStep(s); setFade(true); }, 180); };
  var togTP = function(id) { setSTP(function(p) { var n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };

  var calc = useMemo(function() {
    var k = tk || 1, gfaV = parseFloat(gfa) || 0, rV = parseFloat(rentGfa) || 0, opV = parseFloat(openProg) || 0, saV = parseFloat(siteArea) || 0, plV = parseFloat(poolArea) || 0;
    var vc = parseInt(km.villa) || 0, ps = parseInt(km.suite_p) || 0, rc = parseInt(km.res) || 0;
    var luxMix = k > 0 ? Math.min(((vc * 1.8 + ps * 1.4 + rc * 1.6) / k) * 8, 15) : 0;
    var spatialRaw = gfaV / k;
    var spatial = Math.min((spatialRaw / 350) * 100, 100);
    var wTP = TP.filter(function(t) { return sTP.has(t.id); }).reduce(function(s, t) { return s + t.w; }, 0);
    var richness = Math.min((wTP / 30) * 100, 100);
    var siteCoverage = saV > 0 ? (gfaV / saV) * 100 : 0;
    var landscapeRatio = saV > 0 ? ((saV - gfaV) / saV) * 100 : 0;
    var landscape = Math.min((landscapeRatio / 85) * 100, 100);
    var openRatio = gfaV > 0 ? (opV / gfaV) * 100 : 0;
    var balance = Math.min((openRatio / 40) * 100, 100);
    var density = saV > 0 ? k / (saV / 10000) : 0;
    var poolRatio = plV / k;
    var efficiencyRatio = gfaV > 0 ? (rV / gfaV) * 100 : 0;
    var rentablePerKey = rV / k;
    var nd = 0;
    if (narr.concept.length > 15) nd += 28;
    if (narr.purpose.length > 15) nd += 28;
    if (narr.drivers.length > 15) nd += 24;
    if (narr.materiality.length > 10) nd += 20;
    var narrativeDepth = Math.min(nd, 100);
    var raw = spatial * 0.24 + richness * 0.24 + landscape * 0.18 + balance * 0.14 + narrativeDepth * 0.20 * (narrativeDepth / 100) + luxMix;
    var ediScore = Math.min(Math.round(raw), 100);
    var tier = "Standard";
    if (ediScore >= 88) tier = "Ultra-Luxury Icon"; else if (ediScore >= 74) tier = "Ultra-Luxury"; else if (ediScore >= 60) tier = "Luxury+"; else if (ediScore >= 44) tier = "Luxury"; else if (ediScore >= 28) tier = "Premium";
    var tpByCategory = {};
    TP.forEach(function(t) { if (sTP.has(t.id)) tpByCategory[t.cat] = (tpByCategory[t.cat] || 0) + 1; });
    var tpScores = {};
    CK.forEach(function(ck) {
      var catTPs = TP.filter(function(t) { return t.cat === ck; });
      var maxW = catTPs.reduce(function(s, t) { return s + t.w; }, 0);
      var selW = catTPs.filter(function(t) { return sTP.has(t.id); }).reduce(function(s, t) { return s + t.w; }, 0);
      tpScores[ck] = maxW > 0 ? Math.min((selW / maxW) * 120, 100) : 0;
    });
    var pr = [spatial, richness, landscape, balance, narrativeDepth];
    var bestArch = "sanctuary", bestDist = Infinity;
    Object.entries(ARCHETYPES).forEach(function(entry) { var d = entry[1].radar.reduce(function(s, v, i) { return s + Math.pow(v - pr[i], 2); }, 0); if (d < bestDist) { bestDist = d; bestArch = entry[0]; } });
    var reasons = [];
    if (spatial >= 75 && richness < 50) reasons.push("high spatial generosity with minimal programming");
    else if (spatial >= 75) reasons.push("high spatial generosity");
    if (richness >= 70) reasons.push("rich experiential programming");
    if (landscape >= 70) reasons.push("strong landscape immersion");
    if (balance >= 65) reasons.push("prominent outdoor program");
    if (narrativeDepth >= 65) reasons.push("deep narrative foundation");
    var archReason = "Matched based on: " + (reasons.length > 0 ? reasons.join(", ") : "overall profile balance") + ".";
    var insights = [];
    if (spatialRaw > 0 && spatialRaw < 140) insights.push({ type: "w", text: spatialRaw.toFixed(0) + " m2/key is below ultra-luxury threshold (220+). Consider fewer keys or expanded GFA." });
    if (spatialRaw >= 250) insights.push({ type: "s", text: spatialRaw.toFixed(0) + " m2/key -- iconic generosity. Core narrative asset." });
    if (vc > 0 && vc / k >= 0.3) insights.push({ type: "s", text: Math.round(vc / k * 100) + "% villa mix elevates exclusivity and ADR potential." });
    if (rc > 0) insights.push({ type: "o", text: rc + " branded residences need dedicated touchpoints." });
    if (!tpByCategory.welcome || tpByCategory.welcome < 2) insights.push({ type: "w", text: "Arrival journey needs more sensory layers." });
    if (tpByCategory.cultural >= 3) insights.push({ type: "s", text: "Strong cultural infrastructure differentiates from hedonistic resorts." });
    if (!tpByCategory.cultural) insights.push({ type: "o", text: "No cultural touchpoints. Consider programming that roots guests in place." });
    if (narrativeDepth < 40) insights.push({ type: "w", text: "Weak narrative. A clear design story can add 10-15 EDI points." });
    if (siteCoverage > 30 && saV > 0) insights.push({ type: "w", text: siteCoverage.toFixed(0) + "% coverage exceeds ultra-luxury targets (15-25%)." });
    if (density > 12 && saV > 0) insights.push({ type: "w", text: density.toFixed(1) + " keys/ha is dense. Sanctuary: 2-5, Exclusive: 5-10." });
    if (poolRatio >= 12) insights.push({ type: "s", text: poolRatio.toFixed(1) + " m2/key -- generous water experience." });
    if (poolRatio > 0 && poolRatio < 5) insights.push({ type: "w", text: poolRatio.toFixed(1) + " m2/key pool area is minimal. Target 10-15." });
    if (efficiencyRatio > 0 && efficiencyRatio < 50) insights.push({ type: "o", text: efficiencyRatio.toFixed(0) + "% efficiency -- generous BOH/public allocation, typical for ultra-luxury." });
    if (efficiencyRatio > 65) insights.push({ type: "w", text: efficiencyRatio.toFixed(0) + "% efficiency is high -- ultra-luxury expects generous non-rentable areas." });
    if (sTP.size >= 15 && spatialRaw >= 200) insights.push({ type: "s", text: "High generosity + rich touchpoints: discovery without saturation." });
    var vpParts = [];
    if (spatialRaw >= 220) vpParts.push("exceptional spatial generosity");
    if (narrativeDepth >= 70) vpParts.push("a deeply articulated design narrative");
    if (sTP.size >= 18) vpParts.push("rich experiential programming");
    if (vc / k >= 0.3) vpParts.push("a villa-dominant key mix");
    if (rc > 0) vpParts.push("an integrated branded residence component");
    if (tpByCategory.cultural >= 3) vpParts.push("strong cultural infrastructure");
    if (landscapeRatio >= 75) vpParts.push("radical landscape immersion");
    if (poolRatio >= 10) vpParts.push("generous water experiences");
    var archN = ARCHETYPES[bestArch].name;
    var valueProposition = vpParts.length > 0 ? "Positioned as " + archN + ", the project differentiates through " + vpParts.slice(0, 3).join(", ") + (vpParts.length > 3 ? ", further supported by " + vpParts.slice(3).join(" and ") : "") + "." : "A project with potential for differentiation through stronger spatial and narrative commitments.";
    return { spatial: spatial, richness: richness, landscape: landscape, balance: balance, narrativeDepth: narrativeDepth, spatialRaw: spatialRaw, siteCoverage: siteCoverage, density: density, openRatio: openRatio, landscapeRatio: landscapeRatio, poolRatio: poolRatio, efficiencyRatio: efficiencyRatio, rentablePerKey: rentablePerKey, ediScore: ediScore, tier: tier, insights: insights, tpByCategory: tpByCategory, tpScores: tpScores, bestArch: bestArch, archReason: archReason, tpCount: sTP.size, valueProposition: valueProposition };
  }, [tk, km, gfa, rentGfa, openProg, siteArea, poolArea, sTP, clim, ctx, narr]);

  var imps = useMemo(function() { return genImps(calc, clim, ctx, km, narr, sTP, tk); }, [calc, clim, ctx, km, narr, sTP, tk]);
  var expEmph = useMemo(function() { return getExpEmphasis(calc.tpScores); }, [calc.tpScores]);
  var highlights = useMemo(function() { return genHighlights(calc, narr, clim, ctx, km, tk); }, [calc, narr, clim, ctx, km, tk]);

  useEffect(function() {
    if (step === 4) { var c = 0, t = calc.ediScore; var iv = setInterval(function() { c++; if (c >= t) { c = t; clearInterval(iv); } setAScore(c); }, 14); return function() { clearInterval(iv); }; }
  }, [step, calc.ediScore]);

  /* STYLES */
  var I = { width: "100%", padding: "10px 12px", background: "#faf9f7", border: "1px solid #e2dfd8", borderRadius: 2, color: "#1a1815", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" };
  var L = { display: "block", marginBottom: 4, fontSize: 9, color: "#5a5248", letterSpacing: "0.15em" };
  var B = { padding: "11px 26px", border: "1px solid #d6d2ca", background: "#fff", color: "#3a3428", fontSize: 10, letterSpacing: "0.17em", fontFamily: "inherit", cursor: "pointer", borderRadius: 2, transition: "all 0.2s" };
  var bh = function(e, on) { e.target.style.background = on ? "#f4f1ec" : "#fff"; };
  var navB = function(back, next, label) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 14, borderTop: "1px solid #e6e2dc" }}>
        {back !== null ? <button style={{ ...B, opacity: 0.5 }} onClick={function() { go(back); }}>BACK</button> : <div />}
        <button style={{ ...B, background: "#faf9f7" }} onClick={function() { go(next); }} onMouseEnter={function(e) { bh(e, true); }} onMouseLeave={function(e) { bh(e, false); }}>{label || "CONTINUE"}</button>
      </div>
    );
  };
  var stepH = function(n, t, sub) {
    return (
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.3em", color: "#7a6e62", marginBottom: 6 }}>{"STEP " + n + " OF 4"}</div>
        <h2 style={{ fontSize: 23, fontWeight: 300, color: "#1a1815", margin: 0 }}>{t}</h2>
        {sub && <p style={{ fontSize: 11.5, color: "#5a5248", marginTop: 4 }}>{sub}</p>}
      </div>
    );
  };

  /* S0 */
  var S0 = function() {
    return (
      <div style={{ maxWidth: 510, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40, paddingTop: 8 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.4em", color: "#7a6e62", marginBottom: 12 }}>CONCEPT PHASE EVALUATION</div>
          <h1 style={{ fontSize: 34, fontWeight: 300, color: "#1a1815", margin: 0, lineHeight: 1.1 }}>Experience<br /><span style={{ fontWeight: 400 }}>Density Index</span></h1>
          <div style={{ width: 30, height: 1, background: "#d6d2ca", margin: "16px auto" }} />
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <div><label style={L}>PROJECT NAME</label><input style={I} placeholder="Riviera Maya Resort & Residences" value={pn} onChange={function(e) { setPn(e.target.value); }} /></div>
          <div><label style={L}>LOCATION</label><input style={I} placeholder="Tulum, Mexico" value={loc} onChange={function(e) { setLoc(e.target.value); }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={L}>CLIMATE</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {CLIMATES.map(function(c) { return <button key={c.id} onClick={function() { setClim(c.id); }} style={{ padding: "7px 10px", borderRadius: 2, cursor: "pointer", border: "1px solid " + (clim === c.id ? "#8a7e6e" : "#e2dfd8"), background: clim === c.id ? "#f0ece6" : "#fff", fontFamily: "inherit", fontSize: 10.5, color: clim === c.id ? "#1a1815" : "#6a5e4e", transition: "all 0.2s" }}>{c.label}</button>; })}
              </div>
            </div>
            <div>
              <label style={L}>CONTEXT</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {CONTEXTS.map(function(c) { return <button key={c.id} onClick={function() { setCtx(c.id); }} style={{ padding: "7px 10px", borderRadius: 2, cursor: "pointer", border: "1px solid " + (ctx === c.id ? "#8a7e6e" : "#e2dfd8"), background: ctx === c.id ? "#f0ece6" : "#fff", fontFamily: "inherit", fontSize: 10.5, color: ctx === c.id ? "#1a1815" : "#6a5e4e", transition: "all 0.2s" }}>{c.label}</button>; })}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={L}>TOTAL SITE AREA (M2)</label><input style={I} type="number" placeholder="80,000" value={siteArea} onChange={function(e) { setSiteArea(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Entire plot</div></div>
            <div><label style={L}>GROSS FLOOR AREA (M2)</label><input style={I} type="number" placeholder="24,000" value={gfa} onChange={function(e) { setGfa(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>All buildings, all floors</div></div>
            <div><label style={L}>RENTABLE AREA (M2)</label><input style={I} type="number" placeholder="14,000" value={rentGfa} onChange={function(e) { setRentGfa(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Keys + residences net sellable</div></div>
            <div><label style={L}>OPEN PROGRAM (M2)</label><input style={I} type="number" placeholder="6,000" value={openProg} onChange={function(e) { setOpenProg(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Terraces, pool decks, outdoor dining</div></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={L}>TOTAL POOL / WATER SURFACE (M2)</label><input style={I} type="number" placeholder="3,000" value={poolArea} onChange={function(e) { setPoolArea(e.target.value); }} /></div>
          </div>
        </div>
        {navB(null, 1, "KEY MIX")}
      </div>
    );
  };

  /* S1 */
  var S1 = function() {
    return (
      <div style={{ maxWidth: 490, margin: "0 auto" }}>
        {stepH(2, "Key Mix", "Room inventory impacts spatial perception and ADR.")}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {KT.map(function(kt) { var c = parseInt(km[kt.id]) || 0; return (
            <div key={kt.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 2, border: "1px solid " + (c > 0 ? "#d0ccc4" : "#e6e2dc"), background: c > 0 ? "#faf9f7" : "#fff" }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, color: c > 0 ? "#1a1815" : "#8a7e6e" }}>{kt.label}</div><div style={{ fontSize: 9, color: "#7a6e62" }}>~{kt.avg} m2</div></div>
              <input style={{ ...I, width: 60, textAlign: "center", padding: "6px" }} type="number" placeholder="0" value={km[kt.id] || ""} onChange={function(e) { setKm({ ...km, [kt.id]: e.target.value }); }} />
            </div>
          ); })}
        </div>
        <div style={{ marginTop: 12, textAlign: "center", padding: "9px", border: "1px solid #e2dfd8", borderRadius: 2 }}>
          <div style={{ fontSize: 8, color: "#6a5e4e", letterSpacing: "0.16em" }}>TOTAL KEYS</div>
          <span style={{ fontSize: 26, color: "#1a1815", fontWeight: 300 }}>{tk}</span>
        </div>
        {navB(0, 2, "TOUCHPOINTS")}
      </div>
    );
  };

  /* S2 */
  var S2 = function() {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {stepH(3, "Experience Touchpoints", "Select every experiential moment in the guest journey.")}
        {Object.entries(CATS).map(function(entry) {
          return (
            <div key={entry[0]} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", marginBottom: 5 }}>{entry[1].toUpperCase()}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {TP.filter(function(t) { return t.cat === entry[0]; }).map(function(tp) { var s = sTP.has(tp.id); return (
                  <button key={tp.id} onClick={function() { togTP(tp.id); }} style={{ padding: "5px 10px", borderRadius: 11, fontSize: 10.5, cursor: "pointer", fontFamily: "inherit", border: "1px solid " + (s ? "#8a7e6e" : "#e2dfd8"), background: s ? "#ede9e2" : "#fff", color: s ? "#1a1815" : "#7a6e62", transition: "all 0.2s" }}>
                    {s && <span style={{ marginRight: 3, fontSize: 8 }}>+</span>}{tp.label}
                  </button>
                ); })}
              </div>
            </div>
          );
        })}
        {navB(1, 3, "NARRATIVE")}
      </div>
    );
  };

  /* S3 */
  var S3 = function() {
    var fields = [
      { k: "concept", l: "DESIGN CONCEPT", p: "A sanctuary where jungle meets ocean, rooted in Mayan cosmology", s: "One sentence governing all decisions" },
      { k: "purpose", l: "PURPOSE STATEMENT", p: "To create a place where guests rediscover connection to nature, culture, and themselves", s: "Why does this project exist?" },
      { k: "drivers", l: "DESIGN DRIVERS", p: "1. Landscape-first  2. Sensory transitions  3. Local craft as structure", s: "3-5 principles guiding design", ta: true },
      { k: "materiality", l: "MATERIALITY & SENSORY PALETTE", p: "Local limestone, reclaimed hardwoods, henequen, copal, water sounds...", s: "Materials, textures, scents, sounds", ta: true },
    ];
    return (
      <div style={{ maxWidth: 510, margin: "0 auto" }}>
        {stepH(4, "Design Narrative", "The story that gives coherence.")}
        {fields.map(function(f) {
          return (
            <div key={f.k} style={{ marginBottom: 14 }}>
              <label style={L}>{f.l}</label>
              {f.ta ? <textarea style={{ ...I, minHeight: 56, resize: "vertical", fontFamily: "inherit" }} placeholder={f.p} value={narr[f.k]} onChange={function(e) { setNarr({ ...narr, [f.k]: e.target.value }); }} /> : <input style={I} placeholder={f.p} value={narr[f.k]} onChange={function(e) { setNarr({ ...narr, [f.k]: e.target.value }); }} />}
              <div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>{f.s}</div>
            </div>
          );
        })}
        <div style={{ padding: "9px 12px", border: "1px solid #e2dfd8", borderRadius: 2, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 20, color: "#1a1815", fontWeight: 300 }}>{calc.narrativeDepth}<span style={{ fontSize: 10, color: "#6a5e4e" }}>/100</span></div>
            <div style={{ flex: 1, height: 3, background: "#e6e2dc", borderRadius: 2 }}><div style={{ height: "100%", width: calc.narrativeDepth + "%", background: "#8a7e6e", borderRadius: 2, transition: "width 0.5s" }} /></div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #e6e2dc", paddingTop: 14, marginBottom: 14 }}>
          <label style={L}>REFERENCE SKETCHES (OPTIONAL)</label>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ border: "1px dashed #d6d2ca", borderRadius: 2, padding: "8px 14px", cursor: "pointer", fontSize: 10.5, color: "#5a5248" }} onClick={function() { document.getElementById("sk-in").click(); }}>+ Add images</div>
            <input id="sk-in" type="file" accept="image/*" multiple onChange={function(e) { Array.from(e.target.files).forEach(function(f) { var r = new FileReader(); r.onload = function(ev) { setSketches(function(prev) { return prev.concat([ev.target.result]); }); }; r.readAsDataURL(f); }); }} style={{ display: "none" }} />
            {sketches.map(function(sk, i) {
              return (
                <div key={i} style={{ position: "relative", width: 48, height: 48 }}>
                  <img src={sk} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 2, border: "1px solid #e2dfd8" }} />
                  <button onClick={function() { setSketches(function(p) { return p.filter(function(_, j) { return j !== i; }); }); }} style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: 7, border: "none", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>x</button>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 3 }}>Attached to PDF report</div>
        </div>
        <div><label style={L}>MARKET ADR REFERENCE (OPTIONAL)</label><input style={I} placeholder="Ultra-Luxury: $800-$2,500 / Luxury: $400-$800" value={adr} onChange={function(e) { setAdr(e.target.value); }} /></div>
        {navB(2, 4, "CALCULATE EDI")}
      </div>
    );
  };

  /* S4 RESULTS */
  var S4 = function() {
    var arch = ARCHETYPES[calc.bestArch];
    var sa = ARCHETYPES[selArch];
    var tpRadar = CK.map(function(ck) { return calc.tpScores[ck]; });
    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", paddingTop: 2 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.35em", color: "#7a6e62" }}>EXPERIENCE DENSITY INDEX</div>
          <h2 style={{ fontSize: 21, fontWeight: 300, color: "#1a1815", margin: "3px 0 0" }}>{pn || "Untitled"}</h2>
          <div style={{ fontSize: 10, color: "#5a5248", marginTop: 2 }}>
            {(CLIMATES.find(function(c) { return c.id === clim; }) || {}).label || ""} {" "} {(CONTEXTS.find(function(c) { return c.id === ctx; }) || {}).label || ""}{loc ? " -- " + loc : ""} {" "} {tk} Keys
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Pentagon metrics={[calc.spatial, calc.richness, calc.landscape, calc.balance, calc.narrativeDepth]} ghost={AK.map(function(k) { return { values: ARCHETYPES[k].radar, hl: k === selArch }; })} labels={["Spatial\nGenerosity", "Experience\nRichness", "Landscape\nImmersion", "Public Space\nPresence", "Narrative\nDepth"]} size={440} />
          <div style={{ textAlign: "center", marginTop: -4, fontSize: 9, color: "#6a5e4e" }}>{"Solid -- your project / Dashed -- " + sa.name}</div>
        </div>

        <div style={{ padding: "16px 20px", border: "1px solid #e2dfd8", borderRadius: 3, marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "#6a5e4e" }}>EXPERIENCE ARCHETYPE</div>
              <div style={{ fontSize: 18, color: "#1a1815", fontWeight: 300, marginTop: 1 }}>{arch.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "#6a5e4e" }}>EDI</div>
              <div style={{ fontSize: 24, color: "#1a1815", fontWeight: 300 }}>{aScore}</div>
              <div style={{ fontSize: 9, color: "#4a4238", letterSpacing: "0.08em" }}>{calc.tier.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: "#3a3428", lineHeight: 1.6, marginTop: 8 }}>{arch.long}</div>
          <div style={{ fontSize: 10, color: "#5a5248", fontStyle: "italic", marginTop: 5 }}>{calc.archReason}</div>
          <div style={{ borderTop: "1px solid #e6e2dc", marginTop: 10, paddingTop: 8 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.1em", color: "#6a5e4e", marginBottom: 5 }}>COMPARE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {AK.map(function(k) { return <button key={k} onClick={function() { setSelArch(k); }} style={{ padding: "3px 9px", borderRadius: 10, fontSize: 9.5, cursor: "pointer", fontFamily: "inherit", border: "1px solid " + (selArch === k ? "#8a7e6e" : "#e2dfd8"), background: selArch === k ? "#ede9e2" : "#fff", color: selArch === k ? "#1a1815" : "#6a5e4e" }}>{ARCHETYPES[k].name}</button>; })}
            </div>
            {selArch !== calc.bestArch && <div style={{ marginTop: 6, fontSize: 10.5, color: "#4a4238", lineHeight: 1.5 }}>{sa.short}</div>}
          </div>
        </div>

        <div style={{ padding: "12px 16px", border: "1px solid #e2dfd8", borderRadius: 3, marginTop: 10 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "#6a5e4e", marginBottom: 3 }}>EXPERIENCE EMPHASIS</div>
          <div style={{ fontSize: 15, color: "#1a1815", fontWeight: 400 }}>{expEmph.label}</div>
          <div style={{ fontSize: 11, color: "#3a3428", lineHeight: 1.55, marginTop: 3 }}>{expEmph.desc}</div>
        </div>

        <div style={{ padding: "12px 16px", border: "1px solid #e2dfd8", borderRadius: 3, marginTop: 10, borderLeft: "3px solid #8a7e6e" }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.1em", color: "#6a5e4e", marginBottom: 3 }}>VALUE PROPOSITION</div>
          <div style={{ fontSize: 12.5, color: "#1a1815", lineHeight: 1.6, fontStyle: "italic" }}>{calc.valueProposition}</div>
        </div>

        {adr && <div style={{ padding: "9px 14px", border: "1px solid #e2dfd8", borderRadius: 2, marginTop: 10 }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.08em", color: "#6a5e4e" }}>MARKET ADR</div>
          <div style={{ fontSize: 11.5, color: "#3a3428", marginTop: 1 }}>{adr}</div>
        </div>}

        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", textAlign: "center", marginBottom: 2 }}>EXPERIENCE PROFILE</div>
          <Pentagon metrics={tpRadar} ghost={null} labels={CK.map(function(ck) { return CATS[ck]; })} size={340} />
          <div style={{ textAlign: "center", fontSize: 9, color: "#6a5e4e", marginTop: -2 }}>{sTP.size + " touchpoints -- weighted coverage per category"}</div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", marginBottom: 12 }}>KEY METRICS</div>
          <CtxBar label="Spatial Generosity" value={calc.spatialRaw} max={400} ranges={RNG.spatial} unit=" m2/key" />
          <CtxBar label="Site Coverage" value={calc.siteCoverage} max={50} ranges={RNG.coverage} unit="%" />
          <CtxBar label="Density" value={calc.density} max={40} ranges={RNG.density} unit=" keys/ha" />
          <CtxBar label="Pool Ratio" value={calc.poolRatio} max={25} ranges={RNG.pool} unit=" m2/key" />
          <CtxBar label="Efficiency (Rentable / GFA)" value={calc.efficiencyRatio} max={80} ranges={RNG.efficiency} unit="%" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
          {[
            ["LANDSCAPE", calc.landscapeRatio.toFixed(0) + "%", "of site"],
            ["OPEN PROGRAM", calc.openRatio.toFixed(0) + "%", "of GFA"],
            ["RENTABLE / KEY", calc.rentablePerKey.toFixed(0), "m2"],
            ["NARRATIVE", String(calc.narrativeDepth), calc.narrativeDepth >= 80 ? "articulated" : calc.narrativeDepth >= 50 ? "developing" : "needs work"],
          ].map(function(arr, i) {
            return (
              <div key={i} style={{ padding: "8px 9px", border: "1px solid #e2dfd8", borderRadius: 2 }}>
                <div style={{ fontSize: 7.5, color: "#6a5e4e", letterSpacing: "0.08em" }}>{arr[0]}</div>
                <div style={{ fontSize: 17, color: "#1a1815", fontWeight: 300 }}>{arr[1]}</div>
                <div style={{ fontSize: 8, color: "#7a6e62" }}>{arr[2]}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", marginBottom: 8 }}>TOUCHPOINT MAP</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            {Object.entries(CATS).map(function(entry) {
              var ct = calc.tpByCategory[entry[0]] || 0, m = TP.filter(function(t) { return t.cat === entry[0]; }).length;
              return (
                <div key={entry[0]} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", border: "1px solid #e6e2dc", borderRadius: 2 }}>
                  <div style={{ fontSize: 9.5, color: "#4a4238", width: 54 }}>{entry[1].split(" ")[0]}</div>
                  <div style={{ flex: 1, display: "flex", gap: 2 }}>{Array.from({ length: m }).map(function(_, i) { return <div key={i} style={{ width: 8, height: 8, borderRadius: 1, background: i < ct ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.04)" }} />; })}</div>
                  <div style={{ fontSize: 10, color: "#4a4238", width: 12, textAlign: "right" }}>{ct}</div>
                </div>
              );
            })}
          </div>
        </div>

        {calc.insights.length > 0 && <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", marginBottom: 8 }}>INSIGHTS</div>
          {calc.insights.map(function(ins, i) {
            return <div key={i} style={{ padding: "8px 11px", marginBottom: 4, borderRadius: 2, background: "#faf9f7", borderLeft: "2px solid " + (ins.type === "w" ? "#c4a070" : ins.type === "s" ? "#8aaa8a" : "#7a9aaa"), fontSize: 11, color: "#2a2420", lineHeight: 1.55 }}>{ins.text}</div>;
          })}
        </div>}

        {imps.length > 0 && <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", marginBottom: 8 }}>DESIGN RECOMMENDATIONS</div>
          {imps.map(function(imp, i) {
            return (
              <div key={i} style={{ padding: "9px 12px", marginBottom: 5, border: "1px solid #e2dfd8", borderRadius: 2, borderLeft: "2px solid " + (imp.pr === "high" ? "#c4a070" : "#8a7e6e") }}>
                <div style={{ fontSize: 11.5, color: "#1a1815", fontWeight: 500 }}>{imp.title}</div>
                <div style={{ fontSize: 10.5, color: "#3a3428", lineHeight: 1.55, marginTop: 2 }}>{imp.text}</div>
              </div>
            );
          })}
        </div>}

        <div style={{ marginTop: 28, padding: "18px 20px", border: "1px solid #d0ccc4", borderRadius: 3, background: "#faf9f7" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#4a4238", marginBottom: 10 }}>PROJECT HIGHLIGHTS -- WHAT MAKES THIS SPECIAL</div>
          {highlights.map(function(h, i) {
            return <div key={i} style={{ padding: "10px 14px", marginBottom: 6, borderLeft: "2px solid #1a1815", fontSize: 12, color: "#1a1815", lineHeight: 1.65, fontStyle: "italic" }}>{h}</div>;
          })}
        </div>

        {sketches.length > 0 && <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", marginBottom: 6 }}>REFERENCE SKETCHES</div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {sketches.map(function(sk, i) { return <img key={i} src={sk} alt="" style={{ height: 120, borderRadius: 2, border: "1px solid #e2dfd8" }} />; })}
          </div>
        </div>}

        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 28, paddingTop: 12, borderTop: "1px solid #e2dfd8", flexWrap: "wrap" }}>
          {[["PROJECT", 0], ["KEYS", 1], ["TOUCHPOINTS", 2], ["NARRATIVE", 3]].map(function(arr) {
            return <button key={arr[1]} style={{ ...B, fontSize: 9, padding: "6px 12px" }} onClick={function() { go(arr[1]); }} onMouseEnter={function(e) { bh(e, true); }} onMouseLeave={function(e) { bh(e, false); }}>{arr[0]}</button>;
          })}
          <button style={{ ...B, fontSize: 9, padding: "6px 16px", background: "#ede9e2" }} onClick={function() { exportPDF(pn, loc, clim, ctx, tk, km, calc, sTP, narr, imps, adr, highlights, expEmph); }} onMouseEnter={function(e) { e.target.style.background = "#e4e0d8"; }} onMouseLeave={function(e) { e.target.style.background = "#ede9e2"; }}>DOWNLOAD PDF</button>
        </div>
      </div>
    );
  };

  var steps = [S0, S1, S2, S3, S4];
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#1a1815", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap");*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:rgba(0,0,0,0.3)}input:focus,textarea:focus{border-color:#8a7e6e!important}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}textarea{font-family:"Cormorant Garamond",Georgia,serif}'}</style>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 1.5, background: "#e2dfd8" }}>
        <div style={{ height: "100%", width: ((step + 1) / 5) * 100 + "%", background: "#8a7e6e", transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>
      <div style={{ padding: "20px 22px 44px", maxWidth: 840, margin: "0 auto", opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.2s, transform 0.2s" }}>
        {steps[step]()}
      </div>
    </div>
  );
}
