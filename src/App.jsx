import { useState, useMemo, useEffect } from "react";

/* ═══ POSITIONING TIERS ═══ */
var TIERS = [
  { id: "ultra", label: "Ultra-Luxury", desc: "Aman, One&Only, Six Senses, Cheval Blanc. Radical generosity, iconic narrative, 220+ m2/key.", benchmarks: {
    aman: { name: "Aman", radar: [95, 25, 92, 30, 88], note: "Radical minimalism. 2-5 keys/ha." },
    oneonly: { name: "One&Only", radar: [70, 90, 60, 85, 70], note: "Theatrical public spaces. Destination dining." },
    sixsenses: { name: "Six Senses", radar: [75, 60, 88, 50, 90], note: "Wellness + sustainability narrative." },
    chevalb: { name: "Cheval Blanc", radar: [68, 85, 55, 80, 75], note: "Art de vivre. Curated luxury." },
  }},
  { id: "luxury", label: "Luxury", desc: "Four Seasons, Rosewood, Mandarin Oriental, Park Hyatt. Polished service, 140-220 m2/key.", benchmarks: {
    fourseasons: { name: "Four Seasons", radar: [65, 78, 55, 72, 58], note: "Consistent excellence. Service-driven." },
    rosewood: { name: "Rosewood", radar: [58, 70, 60, 55, 82], note: "Sense of place. Cultural narrative." },
    mandarin: { name: "Mandarin Oriental", radar: [60, 75, 50, 70, 60], note: "Refined. Spa heritage." },
    ritz: { name: "Ritz-Carlton", radar: [55, 72, 45, 68, 52], note: "Legacy brand. Event-driven." },
  }},
  { id: "upper", label: "Upper Upscale", desc: "Edition, Nobu, W, Fasano. Design-forward, social energy, 90-140 m2/key.", benchmarks: {
    edition: { name: "Edition", radar: [48, 82, 40, 88, 55], note: "Nightlife meets design hotel." },
    nobu: { name: "Nobu", radar: [45, 85, 38, 90, 45], note: "F&B is the brand. Social energy." },
    w: { name: "W Hotels", radar: [42, 78, 35, 85, 40], note: "Bold. Youthful. Scene-driven." },
    fasano: { name: "Fasano", radar: [52, 80, 45, 82, 60], note: "Brazilian sophistication. Beach culture." },
  }},
  { id: "lifestyle", label: "Lifestyle", desc: "1Hotels, Ace, Soho House. Community-driven, values-led, 60-100 m2/key.", benchmarks: {
    onehotel: { name: "1Hotels", radar: [45, 55, 70, 50, 75], note: "Nature + sustainability mission." },
    ace: { name: "Ace Hotel", radar: [35, 65, 30, 80, 60], note: "Creative community. Local culture." },
    soho: { name: "Soho House", radar: [40, 72, 35, 88, 55], note: "Members club. Curated belonging." },
    standard: { name: "The Standard", radar: [38, 70, 32, 85, 48], note: "Counter-culture energy." },
  }},
];

/* ═══ ARCHETYPES ═══ */
var ARCHETYPES = {
  sanctuary: { name: "The Sanctuary", short: "Radical spatial generosity. Silence and nature as the product.", long: "Sparse programming is intentional. Privacy and vast landscape are the luxury. Every villa is a world unto itself. Design decisions favor emptiness over embellishment.", radar: [95, 30, 92, 35, 80], keywords: ["silence", "privacy", "retreat", "minimal", "solitude", "nature", "escape", "sanctuary", "contemplat", "stillness", "horizon", "vast", "seclu"] },
  theatre: { name: "The Grand Theatre", short: "Choreographed experience. Theatrical public spaces. Destination dining.", long: "Public spaces are stages. Grand lobbies, dramatic pools, signature restaurants as destinations. The experience is layered and sequential. Architecture is expressive.", radar: [60, 95, 50, 85, 65], keywords: ["spectacle", "dramatic", "social", "destination", "theatrical", "stage", "energy", "vibrant", "celebrat", "grand", "arrival", "choreograph"] },
  village: { name: "The Cultural Village", short: "Inseparable from place. Local materials and traditions are structural.", long: "The architecture speaks the language of the region. Programming connects guests to place through food, art, and community. Could not exist anywhere else.", radar: [55, 65, 60, 50, 95], keywords: ["local", "authentic", "craft", "heritage", "place", "tradition", "artisan", "community", "indigenous", "vernacular", "rooted", "story", "cultural"] },
  oasis: { name: "The Wellness Oasis", short: "The entire property is therapeutic. The spa is the reason for being.", long: "Architecture, landscape, light, and water are designed to heal. Programming is clinical in quality but sensorial in delivery. Biophilic design principles govern every decision.", radar: [70, 55, 88, 45, 75], keywords: ["heal", "wellness", "therapeu", "nature", "biophilic", "water", "calm", "restor", "mindful", "breath", "holistic", "spa", "meditat"] },
  estate: { name: "The Branded Estate", short: "Dual identity: resort experience + residential permanence.", long: "Residential and hotel components each have distinct peak experiences while sharing a unified design language. Community-building for residents and privacy calibration are critical.", radar: [60, 72, 55, 75, 60], keywords: ["residen", "estate", "community", "owner", "home", "belonging", "legacy", "private", "club", "family", "investment", "permanent"] },
  club: { name: "The Social Club", short: "Public spaces dominate. The energy of the crowd is the product.", long: "Pools, beach clubs, and restaurants designed for atmosphere and social interaction. Architecture is bold. The guest values scene, curation, and cultural relevance.", radar: [45, 90, 45, 90, 40], keywords: ["social", "pool", "beach", "club", "scene", "energy", "music", "night", "crowd", "vibe", "party", "lounge", "curated"] },
};
var AK = Object.keys(ARCHETYPES);

/* ═══ CLIMATE & CONTEXT ═══ */
var CLIMATES = [
  { id: "tropical", label: "Tropical" }, { id: "desert", label: "Desert" },
  { id: "coastal", label: "Coastal" }, { id: "mountain", label: "Mountain" }, { id: "temperate", label: "Temperate" },
];
var CONTEXTS = [
  { id: "resort", label: "Resort / Rural" }, { id: "urban", label: "Urban" },
  { id: "periurban", label: "Periurban" }, { id: "island", label: "Island" },
];

/* ═══ TOUCHPOINTS ═══ */
var DEFAULT_TP = [
  { id: "lobby", label: "Arrival Lobby", cat: "welcome", w: 1.0 },
  { id: "porte", label: "Porte-Cochere", cat: "welcome", w: 0.8 },
  { id: "garden_arr", label: "Garden Arrival", cat: "welcome", w: 1.2 },
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
  { id: "yoga", label: "Yoga / Meditation", cat: "wellness", w: 1.1 },
  { id: "hammam", label: "Hammam / Thermal", cat: "wellness", w: 1.4 },
  { id: "plunge", label: "Hydrotherapy", cat: "wellness", w: 1.2 },
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
var CATS = { welcome: "First Impression", gastronomy: "Gastronomy", wellness: "Wellness", active: "Active Leisure", outdoor: "Outdoor Immersion", cultural: "Cultural Depth" };
var CK = Object.keys(CATS);

/* ═══ BENCHMARK RANGES ═══ */
var RNG = {
  spatial: [{ max: 100, label: "Standard" }, { max: 150, label: "Premium" }, { max: 220, label: "Luxury" }, { max: 300, label: "Ultra-Luxury" }, { max: 400, label: "Iconic" }],
  coverage: [{ max: 15, label: "Ultra-Low" }, { max: 25, label: "Ultra-Luxury" }, { max: 35, label: "Luxury" }, { max: 50, label: "Dense" }],
  density: [{ max: 5, label: "Sanctuary" }, { max: 10, label: "Exclusive" }, { max: 20, label: "Resort" }, { max: 40, label: "Dense" }],
  pool: [{ max: 3, label: "Minimal" }, { max: 8, label: "Standard" }, { max: 15, label: "Generous" }, { max: 25, label: "Iconic" }],
  amenity: [{ max: 20, label: "Lean" }, { max: 40, label: "Standard" }, { max: 60, label: "Rich" }, { max: 80, label: "Iconic" }],
};

/* ═══ NARRATIVE ANALYSIS ═══ */
function analyzeNarrative(purpose, drivers, highlights) {
  var allText = (purpose + " " + drivers + " " + highlights).toLowerCase();
  var scores = {};
  AK.forEach(function(k) {
    var a = ARCHETYPES[k];
    var score = 0;
    a.keywords.forEach(function(kw) {
      if (allText.indexOf(kw) >= 0) score += 10;
    });
    scores[k] = Math.min(score, 100);
  });
  // Extract key themes
  var themes = [];
  if (allText.match(/nature|landscape|garden|jungle|forest|ocean|mountain|biophilic/)) themes.push("Nature Integration");
  if (allText.match(/local|craft|artisan|heritage|tradition|indigenous|vernacular/)) themes.push("Cultural Rootedness");
  if (allText.match(/wellness|heal|spa|therap|mindful|restor|holistic/)) themes.push("Wellness Philosophy");
  if (allText.match(/sustain|eco|green|conserv|regenerat|responsible/)) themes.push("Sustainability Commitment");
  if (allText.match(/communit|belonging|social|gather|connect|togeth/)) themes.push("Community Building");
  if (allText.match(/privacy|seclu|intimate|exclusive|retreat|solitude/)) themes.push("Privacy Architecture");
  if (allText.match(/culinar|gastronom|food|farm|kitchen|chef|dining/)) themes.push("Culinary Identity");
  if (allText.match(/art|museum|gallery|sculpt|install|creative/)) themes.push("Art Integration");
  if (allText.match(/water|pool|ocean|river|lake|spring|hydro/)) themes.push("Water as Design Element");
  if (allText.match(/light|shadow|dawn|dusk|sun|glow|luminous/)) themes.push("Light as Material");
  return { scores: scores, themes: themes };
}

/* ═══ PENTAGON ═══ */
function Pentagon(props) {
  var metrics = props.metrics, ghosts = props.ghosts, labels = props.labels, size = props.size || 400;
  var cx = size / 2, r = size * 0.34, n = labels.length;
  var angles = [];
  for (var i = 0; i < n; i++) angles.push((Math.PI * 2 * i) / n - Math.PI / 2);
  var pt = function(a, v) { return { x: cx + r * (v / 100) * Math.cos(a), y: cx + r * (v / 100) * Math.sin(a) }; };
  var makePath = function(v) { return v.map(function(val, i) { return (i === 0 ? "M" : "L") + " " + pt(angles[i], val).x + " " + pt(angles[i], val).y; }).join(" ") + " Z"; };
  var uid = "pg" + n + size + (props.id || "");
  return (
    <svg viewBox={"0 0 " + size + " " + size} style={{ width: "100%", maxWidth: size, display: "block", margin: "0 auto" }}>
      <defs><linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2a2420" stopOpacity="0.06" /><stop offset="100%" stopColor="#2a2420" stopOpacity="0.015" /></linearGradient></defs>
      {[20,40,60,80,100].map(function(l) { return <polygon key={l} points={angles.map(function(a) { return pt(a,l).x+","+pt(a,l).y; }).join(" ")} fill="none" stroke={l===100?"rgba(0,0,0,0.07)":"rgba(0,0,0,0.025)"} strokeWidth="0.5" />; })}
      {angles.map(function(a,i) { return <line key={i} x1={cx} y1={cx} x2={pt(a,105).x} y2={pt(a,105).y} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />; })}
      {ghosts && ghosts.map(function(g,gi) { return <path key={gi} d={makePath(g.values)} fill="none" stroke={"rgba(0,0,0,"+(g.hl?0.14:0.03)+")"} strokeWidth={g.hl?1.5:0.7} strokeDasharray={g.hl?"7 5":"3 4"} />; })}
      <path d={makePath(metrics)} fill={"url(#"+uid+")"} stroke="#2a2420" strokeWidth="2" strokeLinejoin="round" />
      {metrics.map(function(v,i) { var p=pt(angles[i],v); return <g key={i}><circle cx={p.x} cy={p.y} r="4" fill="rgba(42,36,32,0.06)" /><circle cx={p.x} cy={p.y} r="2.5" fill="#2a2420" /></g>; })}
      {labels.map(function(label,i) {
        var p=pt(angles[i], n===5?118:116); var lines=label.split("\n");
        return <g key={i}>{lines.map(function(line,li) { return <text key={li} x={p.x} y={p.y+li*11-(lines.length-1)*4.5} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,0,0,0.7)" fontSize="8.5" fontFamily="'Cormorant Garamond',Georgia,serif" letterSpacing="0.07em">{line.toUpperCase()}</text>; })}</g>;
      })}
    </svg>
  );
}

/* ═══ CONTEXT BAR ═══ */
function CtxBar(props) {
  var pct = Math.min((props.value / props.max) * 100, 100);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: "#5a5248", letterSpacing: "0.1em" }}>{props.label.toUpperCase()}</span>
        <span style={{ fontSize: 15, color: "#1a1815", fontWeight: 400 }}>{typeof props.value==="number"?(props.value%1===0?props.value:props.value.toFixed(1)):props.value}{props.unit&&<span style={{fontSize:10,color:"#6a5e4e",marginLeft:2}}>{props.unit}</span>}</span>
      </div>
      <div style={{ position: "relative", height: 22, display: "flex", borderRadius: 2, overflow: "hidden" }}>
        {props.ranges.map(function(rng,i) { var prev=i>0?props.ranges[i-1].max:0; return <div key={i} style={{width:((rng.max-prev)/props.max)*100+"%",background:"rgba(0,0,0,"+(0.018+i*0.014)+")",borderRight:i<props.ranges.length-1?"1px solid rgba(255,255,255,0.8)":"none",position:"relative"}}><span style={{position:"absolute",bottom:-15,left:"50%",transform:"translateX(-50%)",fontSize:7.5,color:"#7a6e62",whiteSpace:"nowrap"}}>{rng.label}</span></div>; })}
        <div style={{ position: "absolute", left: pct+"%", top: 0, bottom: 0, width: 2.5, background: "#1a1815", borderRadius: 1, transform: "translateX(-1px)", transition: "left 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function EDI() {
  var _s = useState(0), step = _s[0], setStep = _s[1];
  var _pn = useState(""), pn = _pn[0], setPn = _pn[1];
  var _loc = useState(""), loc = _loc[0], setLoc = _loc[1];
  var _cl = useState(""), clim = _cl[0], setClim = _cl[1];
  var _ct = useState(""), ctx = _ct[0], setCtx = _ct[1];
  var _tier = useState(""), tier = _tier[0], setTier = _tier[1];
  // Areas
  var _grA = useState(""), grArea = _grA[0], setGrArea = _grA[1];
  var _amA = useState(""), amArea = _amA[0], setAmArea = _amA[1];
  var _siA = useState(""), siteArea = _siA[0], setSiteArea = _siA[1];
  var _plA = useState(""), poolArea = _plA[0], setPoolArea = _plA[1];
  var _opA = useState(""), openExp = _opA[0], setOpenExp = _opA[1];
  var _laA = useState(""), landExp = _laA[0], setLandExp = _laA[1];
  // Key mix (custom)
  var _km = useState([
    { id: "v1", label: "Private Villas", size: "250", count: "" },
    { id: "v2", label: "Premium Suites", size: "120", count: "" },
    { id: "v3", label: "Junior Suites", size: "75", count: "" },
    { id: "v4", label: "Deluxe Rooms", size: "55", count: "" },
  ]), keys = _km[0], setKeys = _km[1];
  // Touchpoints
  var _tp = useState(DEFAULT_TP), allTP = _tp[0], setAllTP = _tp[1];
  var _stp = useState(new Set()), sTP = _stp[0], setSTP = _stp[1];
  var _newTp = useState(""), newTpLabel = _newTp[0], setNewTpLabel = _newTp[1];
  var _newTpCat = useState("welcome"), newTpCat = _newTpCat[0], setNewTpCat = _newTpCat[1];
  // Narrative
  var _pur = useState(""), purpose = _pur[0], setPurpose = _pur[1];
  var _drv = useState(""), drivers = _drv[0], setDrivers = _drv[1];
  var _dhl = useState(""), designHL = _dhl[0], setDesignHL = _dhl[1];
  // Other
  var _adr = useState(""), adr = _adr[0], setAdr = _adr[1];
  var _as = useState(0), aScore = _as[0], setAScore = _as[1];
  var _fd = useState(true), fade = _fd[0], setFade = _fd[1];
  var _sa = useState("sanctuary"), selArch = _sa[0], setSelArch = _sa[1];
  var _sb = useState(""), selBrand = _sb[0], setSelBrand = _sb[1];

  var tk = useMemo(function() { return keys.reduce(function(s,k) { return s + (parseInt(k.count) || 0); }, 0); }, [keys]);
  var go = function(s) { setFade(false); setTimeout(function() { setStep(s); setFade(true); }, 180); };
  var togTP = function(id) { setSTP(function(p) { var n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };

  var calc = useMemo(function() {
    var k = tk || 1;
    var grV = parseFloat(grArea) || 0, amV = parseFloat(amArea) || 0, saV = parseFloat(siteArea) || 0;
    var plV = parseFloat(poolArea) || 0, opV = parseFloat(openExp) || 0, laV = parseFloat(landExp) || 0;
    var gfaV = grV + amV;
    // Spatial metrics
    var spatialRaw = gfaV > 0 ? gfaV / k : 0;
    var spatial = Math.min((spatialRaw / 350) * 100, 100);
    var grPerKey = grV / k;
    var amPerKey = amV / k;
    var siteCoverage = saV > 0 ? (gfaV / saV) * 100 : 0;
    var landscapeRatio = saV > 0 ? ((saV - gfaV) / saV) * 100 : 0;
    var landscape = Math.min((landscapeRatio / 85) * 100, 100);
    var density = saV > 0 ? k / (saV / 10000) : 0;
    var poolRatio = plV / k;
    var openPerKey = opV / k;
    var landPerKey = laV / k;
    var outdoorTotal = opV + laV;
    var outdoorRatio = gfaV > 0 ? (outdoorTotal / gfaV) * 100 : 0;
    var balance = Math.min((outdoorRatio / 60) * 100, 100);
    // Luxury mix weight
    var luxWeight = 0;
    keys.forEach(function(kt) {
      var sz = parseFloat(kt.size) || 0;
      var ct = parseInt(kt.count) || 0;
      if (sz >= 200) luxWeight += ct * 1.8;
      else if (sz >= 100) luxWeight += ct * 1.4;
      else if (sz >= 70) luxWeight += ct * 1.1;
      else luxWeight += ct * 0.9;
    });
    var luxMix = k > 0 ? Math.min((luxWeight / k) * 8, 15) : 0;
    // Touchpoints
    var wTP = allTP.filter(function(t) { return sTP.has(t.id); }).reduce(function(s,t) { return s + t.w; }, 0);
    var richness = Math.min((wTP / 30) * 100, 100);
    var tpByCategory = {};
    allTP.forEach(function(t) { if (sTP.has(t.id)) tpByCategory[t.cat] = (tpByCategory[t.cat] || 0) + 1; });
    var tpScores = {};
    CK.forEach(function(ck) {
      var catTPs = allTP.filter(function(t) { return t.cat === ck; });
      var maxW = catTPs.reduce(function(s,t) { return s + t.w; }, 0);
      var selW = catTPs.filter(function(t) { return sTP.has(t.id); }).reduce(function(s,t) { return s + t.w; }, 0);
      tpScores[ck] = maxW > 0 ? Math.min((selW / maxW) * 120, 100) : 0;
    });
    // Narrative analysis
    var narrAnalysis = analyzeNarrative(purpose, drivers, designHL);
    var narrativeDepth = 0;
    if (purpose.length > 15) narrativeDepth += 35;
    if (drivers.length > 15) narrativeDepth += 35;
    if (designHL.length > 10) narrativeDepth += 30;
    narrativeDepth = Math.min(narrativeDepth, 100);
    // EDI Score
    var raw = spatial * 0.22 + richness * 0.22 + landscape * 0.16 + balance * 0.16 + narrativeDepth * 0.24 * (narrativeDepth / 100) + luxMix;
    var ediScore = Math.min(Math.round(raw), 100);
    var ediTier = "Standard";
    if (ediScore >= 88) ediTier = "Ultra-Luxury Icon"; else if (ediScore >= 74) ediTier = "Ultra-Luxury"; else if (ediScore >= 60) ediTier = "Luxury+"; else if (ediScore >= 44) ediTier = "Luxury"; else if (ediScore >= 28) ediTier = "Premium";
    // Archetype matching (metrics + narrative keywords)
    var pr = [spatial, richness, landscape, balance, narrativeDepth];
    var bestArch = "sanctuary", bestScore = -Infinity;
    Object.entries(ARCHETYPES).forEach(function(entry) {
      var akey = entry[0], a = entry[1];
      var metricDist = a.radar.reduce(function(s,v,i) { return s + Math.pow(v - pr[i], 2); }, 0);
      var metricScore = 100 - Math.sqrt(metricDist) / 2;
      var narrativeScore = narrAnalysis.scores[akey] || 0;
      var combined = metricScore * 0.6 + narrativeScore * 0.4;
      if (combined > bestScore) { bestScore = combined; bestArch = akey; }
    });
    var reasons = [];
    if (spatial >= 75) reasons.push("high spatial generosity");
    if (richness >= 70) reasons.push("rich experiential programming");
    if (landscape >= 70) reasons.push("strong landscape immersion");
    if (balance >= 65) reasons.push("prominent outdoor experiences");
    if (narrativeDepth >= 65) reasons.push("deep narrative foundation");
    if (narrAnalysis.themes.length > 0) reasons.push("narrative themes: " + narrAnalysis.themes.slice(0,3).join(", "));
    var archReason = "Matched based on: " + (reasons.length > 0 ? reasons.join("; ") : "overall profile balance") + ".";
    // Area balance takeaway
    var areaInsights = [];
    if (amPerKey > 0 && grPerKey > 0) {
      var amenityToRoom = amV / grV;
      if (amenityToRoom >= 0.8) areaInsights.push("Amenity-to-guestroom ratio of " + (amenityToRoom).toFixed(1) + ":1 indicates an experience-rich property where the public realm rivals the private.");
      else if (amenityToRoom >= 0.5) areaInsights.push("Amenity-to-guestroom ratio of " + (amenityToRoom).toFixed(1) + ":1 is solid. The public experience has significant presence.");
      else areaInsights.push("Amenity-to-guestroom ratio of " + (amenityToRoom).toFixed(1) + ":1 is room-dominant. Consider expanding amenity footprint for stronger experiential positioning.");
    }
    if (outdoorTotal > 0 && amV > 0) {
      var outToIn = outdoorTotal / amV;
      if (outToIn >= 1.0) areaInsights.push("Outdoor experiences exceed indoor amenities -- this is a landscape-led project where the site IS the experience.");
      else if (outToIn >= 0.5) areaInsights.push("Balanced indoor-outdoor programming. The property transitions fluidly between enclosed and open experiences.");
      else areaInsights.push("Indoor-dominant programming. Consider expanding outdoor experiences to leverage site assets.");
    }
    if (poolRatio >= 12) areaInsights.push("Generous pool-to-key ratio creates water as an architectural element, not just an amenity.");
    if (landPerKey >= 20) areaInsights.push("Landscape experience area per key is exceptional -- trails, gardens, and outdoor moments will define the guest journey.");
    // Merged insights + recommendations
    var insights = [];
    areaInsights.forEach(function(a) { insights.push({ text: a }); });
    if (spatialRaw > 0 && spatialRaw < 140) insights.push({ text: spatialRaw.toFixed(0) + " m2/key is below ultra-luxury threshold (220+). Reduce keys or expand program." });
    if (spatialRaw >= 250) insights.push({ text: spatialRaw.toFixed(0) + " m2/key -- iconic generosity. Core narrative asset." });
    if (!tpByCategory.welcome || tpByCategory.welcome < 3) insights.push({ text: "Layer the arrival: minimum 3 chapters -- anticipation, transition, reveal. Each engages a different sense." });
    if (!tpByCategory.cultural || tpByCategory.cultural < 2) insights.push({ text: "Build cultural infrastructure. Local artists, artisan residency, cultural programming. Ultra-luxury guests seek meaning." });
    if (narrativeDepth < 60) insights.push({ text: "Deepen the design story. What is THIS place, and no other? The narrative must be specific enough to only exist here." });
    if (siteCoverage > 30 && saV > 0) insights.push({ text: siteCoverage.toFixed(0) + "% site coverage exceeds ultra-luxury targets (15-25%). Compact service cores, disperse guest components." });
    if (density > 12 && saV > 0) insights.push({ text: density.toFixed(1) + " keys/ha is dense. Sanctuary: 2-5, Exclusive: 5-10." });
    if (poolRatio > 0 && poolRatio < 5 && ctx !== "urban") insights.push({ text: poolRatio.toFixed(1) + " m2/key pool area is minimal. Target 10-15 for ultra-luxury." });
    if (sTP.size >= 15 && spatialRaw >= 200) insights.push({ text: "High generosity + rich touchpoints: multiple discovery layers without saturation." });
    if (tpByCategory.cultural >= 3) insights.push({ text: "Strong cultural infrastructure differentiates from purely hedonistic resorts." });
    // Value proposition
    var vpParts = [];
    if (spatialRaw >= 220) vpParts.push("exceptional spatial generosity (" + spatialRaw.toFixed(0) + " m2/key)");
    if (narrativeDepth >= 70 && narrAnalysis.themes.length >= 2) vpParts.push("a deeply articulated narrative rooted in " + narrAnalysis.themes.slice(0,2).join(" and ").toLowerCase());
    if (sTP.size >= 18) vpParts.push("rich experiential programming across " + sTP.size + " touchpoints");
    if (tpByCategory.cultural >= 3) vpParts.push("strong cultural infrastructure");
    if (landscapeRatio >= 75) vpParts.push("radical landscape immersion (" + landscapeRatio.toFixed(0) + "% of site)");
    if (poolRatio >= 10) vpParts.push("generous water experiences (" + poolRatio.toFixed(1) + " m2/key)");
    if (outdoorTotal > amV) vpParts.push("outdoor-dominant experience design");
    if (purpose.length > 15) vpParts.push('a clear purpose: "' + purpose.substring(0, 80) + (purpose.length > 80 ? '..."' : '"'));
    var archN = ARCHETYPES[bestArch].name;
    var valueProposition = vpParts.length > 1 ? "Positioned as " + archN + ", this project differentiates through " + vpParts.slice(0,3).join(", ") + (vpParts.length > 3 ? ". Further supported by " + vpParts.slice(3,5).join(" and ") : "") + "." : "The project requires stronger spatial and narrative commitments to establish a clear value proposition.";
    // Experience emphasis
    var sortedCats = CK.map(function(ck) { return { k: ck, s: tpScores[ck] || 0 }; }).sort(function(a,b) { return b.s - a.s; }).filter(function(x) { return x.s > 20; });
    var emphLabels = { welcome: "Journey-Focused", gastronomy: "Gastronomy-Led", wellness: "Wellness-Centered", active: "Activity-Rich", outdoor: "Nature-Immersive", cultural: "Culturally Rooted" };
    var expEmphLabel = sortedCats.length > 0 ? emphLabels[sortedCats[0].k] : "Undefined";
    if (sortedCats.length > 1 && sortedCats[1].s > sortedCats[0].s * 0.7) expEmphLabel += ", " + emphLabels[sortedCats[1].k];

    return { spatial: spatial, richness: richness, landscape: landscape, balance: balance, narrativeDepth: narrativeDepth, spatialRaw: spatialRaw, grPerKey: grPerKey, amPerKey: amPerKey, siteCoverage: siteCoverage, density: density, poolRatio: poolRatio, openPerKey: openPerKey, landPerKey: landPerKey, landscapeRatio: landscapeRatio, outdoorRatio: outdoorRatio, ediScore: ediScore, ediTier: ediTier, insights: insights, tpByCategory: tpByCategory, tpScores: tpScores, bestArch: bestArch, archReason: archReason, tpCount: sTP.size, valueProposition: valueProposition, narrAnalysis: narrAnalysis, expEmphLabel: expEmphLabel };
  }, [tk, keys, grArea, amArea, siteArea, poolArea, openExp, landExp, sTP, allTP, clim, ctx, tier, purpose, drivers, designHL]);

  // Highlights from dual-pentagon correlation
  var highlights = useMemo(function() {
    var h = [], c = calc;
    if (c.spatial >= 70 && c.tpScores.outdoor >= 50) h.push("Exceptional spatial generosity combined with strong outdoor programming creates a landscape-led experience where architecture frames nature.");
    if (c.richness >= 60 && c.tpScores.gastronomy >= 60) h.push("Rich experiential density anchored by gastronomy -- food and beverage positioned as a destination driver, not just amenity.");
    if (c.narrativeDepth >= 70 && c.tpScores.cultural >= 50) h.push("Deep narrative paired with cultural infrastructure creates an experience rooted in place -- the hardest quality for competitors to replicate.");
    if (c.spatial >= 60 && c.richness >= 60 && c.landscape >= 60) h.push("Rare balance: spatial generosity with rich programming AND landscape integration. Multiple discovery layers without saturation.");
    if (c.tpScores.welcome >= 60 && c.narrativeDepth >= 50) h.push("Layered arrival sequence backed by narrative depth. The first impression becomes a promise the property delivers on.");
    if (c.poolRatio >= 10 && c.tpScores.wellness >= 50) h.push("Generous water surface with wellness programming -- a therapeutic landscape extending beyond the spa. Water becomes architecture.");
    if (c.landscapeRatio >= 75) h.push("Over 75% landscape preservation. In this context, restraint IS the luxury.");
    if (c.narrAnalysis.themes.length >= 3) h.push("Narrative coherence across " + c.narrAnalysis.themes.length + " design themes: " + c.narrAnalysis.themes.slice(0,4).join(", ") + ". This creates a multi-layered story.");
    if (h.length === 0) h.push("The project has potential for differentiation through clearer spatial commitments and a more articulated narrative.");
    return h.slice(0, 5);
  }, [calc]);

  useEffect(function() {
    if (step === 5) {
      var c = 0, t = calc.ediScore;
      var iv = setInterval(function() { c++; if (c >= t) { c = t; clearInterval(iv); } setAScore(c); }, 14);
      // Auto-select first brand in tier
      if (!selBrand && tier) {
        var tierData = TIERS.find(function(t) { return t.id === tier; });
        if (tierData) setSelBrand(Object.keys(tierData.benchmarks)[0]);
      }
      return function() { clearInterval(iv); };
    }
  }, [step, calc.ediScore, tier, selBrand]);

  /* STYLES */
  var I = { width: "100%", padding: "10px 12px", background: "#faf9f7", border: "1px solid #e2dfd8", borderRadius: 2, color: "#1a1815", fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" };
  var L = { display: "block", marginBottom: 4, fontSize: 9, color: "#5a5248", letterSpacing: "0.15em" };
  var B = { padding: "11px 26px", border: "1px solid #d6d2ca", background: "#fff", color: "#3a3428", fontSize: 10, letterSpacing: "0.17em", fontFamily: "inherit", cursor: "pointer", borderRadius: 2, transition: "all 0.2s" };
  var bh = function(e, on) { e.target.style.background = on ? "#f4f1ec" : "#fff"; };
  var navB = function(back, next, label) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 14, borderTop: "1px solid #e6e2dc" }}>
        {back !== null ? <button style={Object.assign({}, B, { opacity: 0.5 })} onClick={function() { go(back); }}>BACK</button> : <div />}
        <button style={Object.assign({}, B, { background: "#faf9f7" })} onClick={function() { go(next); }} onMouseEnter={function(e) { bh(e, true); }} onMouseLeave={function(e) { bh(e, false); }}>{label || "CONTINUE"}</button>
      </div>
    );
  };
  var sH = function(n, total, t, sub) {
    return (
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.3em", color: "#7a6e62", marginBottom: 6 }}>{"STEP " + n + " OF " + total}</div>
        <h2 style={{ fontSize: 22, fontWeight: 300, color: "#1a1815", margin: 0 }}>{t}</h2>
        {sub && <p style={{ fontSize: 11.5, color: "#5a5248", marginTop: 4 }}>{sub}</p>}
      </div>
    );
  };

  /* S0: Project + Tier */
  var S0 = function() {
    return (
      <div style={{ maxWidth: 510, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36, paddingTop: 8 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.4em", color: "#7a6e62", marginBottom: 12 }}>CONCEPT PHASE EVALUATION</div>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: "#1a1815", margin: 0, lineHeight: 1.1 }}>Experience<br /><span style={{ fontWeight: 400 }}>Density Index</span></h1>
          <div style={{ width: 30, height: 1, background: "#d6d2ca", margin: "14px auto" }} />
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          <div><label style={L}>PROJECT NAME</label><input style={I} placeholder="Riviera Maya Resort & Residences" value={pn} onChange={function(e) { setPn(e.target.value); }} /></div>
          <div><label style={L}>LOCATION</label><input style={I} placeholder="Tulum, Mexico" value={loc} onChange={function(e) { setLoc(e.target.value); }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><label style={L}>CLIMATE</label><div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{CLIMATES.map(function(c) { return <button key={c.id} onClick={function() { setClim(c.id); }} style={{ padding: "6px 10px", borderRadius: 2, cursor: "pointer", border: "1px solid " + (clim === c.id ? "#8a7e6e" : "#e2dfd8"), background: clim === c.id ? "#f0ece6" : "#fff", fontFamily: "inherit", fontSize: 10.5, color: clim === c.id ? "#1a1815" : "#6a5e4e" }}>{c.label}</button>; })}</div></div>
            <div><label style={L}>CONTEXT</label><div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{CONTEXTS.map(function(c) { return <button key={c.id} onClick={function() { setCtx(c.id); }} style={{ padding: "6px 10px", borderRadius: 2, cursor: "pointer", border: "1px solid " + (ctx === c.id ? "#8a7e6e" : "#e2dfd8"), background: ctx === c.id ? "#f0ece6" : "#fff", fontFamily: "inherit", fontSize: 10.5, color: ctx === c.id ? "#1a1815" : "#6a5e4e" }}>{c.label}</button>; })}</div></div>
          </div>
          <div>
            <label style={L}>POSITIONING</label>
            <div style={{ display: "grid", gap: 4 }}>
              {TIERS.map(function(t) { return (
                <button key={t.id} onClick={function() { setTier(t.id); setSelBrand(""); }} style={{ padding: "8px 12px", borderRadius: 2, cursor: "pointer", border: "1px solid " + (tier === t.id ? "#8a7e6e" : "#e2dfd8"), background: tier === t.id ? "#f0ece6" : "#fff", fontFamily: "inherit", textAlign: "left" }}>
                  <div style={{ fontSize: 12, color: tier === t.id ? "#1a1815" : "#6a5e4e", fontWeight: 400 }}>{t.label}</div>
                  <div style={{ fontSize: 9, color: "#7a6e62", marginTop: 1 }}>{t.desc}</div>
                </button>
              ); })}
            </div>
          </div>
        </div>
        {navB(null, 1, "AREAS")}
      </div>
    );
  };

  /* S1: Areas */
  var S1 = function() {
    return (
      <div style={{ maxWidth: 510, margin: "0 auto" }}>
        {sH(2, 5, "Area Program", "Spatial allocation defines the guest experience before a single touchpoint is designed.")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={L}>GUESTROOMS GROSS (M2)</label><input style={I} type="number" placeholder="16,000" value={grArea} onChange={function(e) { setGrArea(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>All key types, gross area</div></div>
          <div><label style={L}>AMENITIES GROSS (M2)</label><input style={I} type="number" placeholder="8,000" value={amArea} onChange={function(e) { setAmArea(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Spa, F&B, lobby, fitness, BOH</div></div>
          <div><label style={L}>SITE AREA (M2)</label><input style={I} type="number" placeholder="80,000" value={siteArea} onChange={function(e) { setSiteArea(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Entire plot</div></div>
          <div><label style={L}>POOL / WATER SURFACE (M2)</label><input style={I} type="number" placeholder="3,000" value={poolArea} onChange={function(e) { setPoolArea(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>All pools, plunge, hydro</div></div>
          <div><label style={L}>OPEN EXPERIENCES (M2)</label><input style={I} type="number" placeholder="4,000" value={openExp} onChange={function(e) { setOpenExp(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Terraces, pool decks, outdoor dining</div></div>
          <div><label style={L}>LANDSCAPE EXPERIENCES (M2)</label><input style={I} type="number" placeholder="6,000" value={landExp} onChange={function(e) { setLandExp(e.target.value); }} /><div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Gardens, farms, labyrinths, trails</div></div>
        </div>
        {navB(0, 2, "KEY MIX")}
      </div>
    );
  };

  /* S2: Custom Key Mix */
  var S2 = function() {
    var addKey = function() { setKeys(keys.concat([{ id: "k" + Date.now(), label: "", size: "", count: "" }])); };
    var removeKey = function(idx) { setKeys(keys.filter(function(_,i) { return i !== idx; })); };
    var updateKey = function(idx, field, val) { var n = keys.slice(); n[idx] = Object.assign({}, n[idx]); n[idx][field] = val; setKeys(n); };
    return (
      <div style={{ maxWidth: 510, margin: "0 auto" }}>
        {sH(3, 5, "Key Mix", "Customize room types, sizes, and counts.")}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {keys.map(function(kt, idx) { return (
            <div key={kt.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 2, border: "1px solid #e2dfd8", background: parseInt(kt.count) > 0 ? "#faf9f7" : "#fff" }}>
              <input style={Object.assign({}, I, { flex: 1, padding: "6px 8px", fontSize: 12 })} placeholder="Room type name" value={kt.label} onChange={function(e) { updateKey(idx, "label", e.target.value); }} />
              <input style={Object.assign({}, I, { width: 60, textAlign: "center", padding: "6px" })} type="number" placeholder="m2" value={kt.size} onChange={function(e) { updateKey(idx, "size", e.target.value); }} />
              <input style={Object.assign({}, I, { width: 50, textAlign: "center", padding: "6px" })} type="number" placeholder="qty" value={kt.count} onChange={function(e) { updateKey(idx, "count", e.target.value); }} />
              <button onClick={function() { removeKey(idx); }} style={{ border: "none", background: "none", color: "#b0a494", cursor: "pointer", fontSize: 14, padding: "2px 4px" }}>x</button>
            </div>
          ); })}
        </div>
        <button onClick={addKey} style={Object.assign({}, B, { width: "100%", marginTop: 8, fontSize: 9 })} onMouseEnter={function(e) { bh(e, true); }} onMouseLeave={function(e) { bh(e, false); }}>+ ADD KEY TYPE</button>
        <div style={{ marginTop: 12, textAlign: "center", padding: "8px", border: "1px solid #e2dfd8", borderRadius: 2 }}>
          <div style={{ fontSize: 8, color: "#6a5e4e", letterSpacing: "0.16em" }}>TOTAL KEYS</div>
          <span style={{ fontSize: 24, color: "#1a1815", fontWeight: 300 }}>{tk}</span>
        </div>
        {navB(1, 3, "TOUCHPOINTS")}
      </div>
    );
  };

  /* S3: Touchpoints + custom */
  var S3 = function() {
    var addCustomTP = function() {
      if (!newTpLabel.trim()) return;
      var newTP = { id: "custom_" + Date.now(), label: newTpLabel.trim(), cat: newTpCat, w: 1.1 };
      setAllTP(allTP.concat([newTP]));
      setSTP(function(p) { var n = new Set(p); n.add(newTP.id); return n; });
      setNewTpLabel("");
    };
    return (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {sH(4, 5, "Experience Touchpoints", "Select and add experiential moments.")}
        {Object.entries(CATS).map(function(entry) {
          return (
            <div key={entry[0]} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "#5a5248", marginBottom: 4 }}>{entry[1].toUpperCase()}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {allTP.filter(function(t) { return t.cat === entry[0]; }).map(function(tp) { var s = sTP.has(tp.id); return (
                  <button key={tp.id} onClick={function() { togTP(tp.id); }} style={{ padding: "5px 10px", borderRadius: 11, fontSize: 10.5, cursor: "pointer", fontFamily: "inherit", border: "1px solid " + (s ? "#8a7e6e" : "#e2dfd8"), background: s ? "#ede9e2" : "#fff", color: s ? "#1a1815" : "#7a6e62" }}>
                    {s && <span style={{ marginRight: 3, fontSize: 8 }}>+</span>}{tp.label}
                  </button>
                ); })}
              </div>
            </div>
          );
        })}
        <div style={{ borderTop: "1px solid #e6e2dc", paddingTop: 12, marginTop: 8 }}>
          <div style={{ fontSize: 9, color: "#5a5248", letterSpacing: "0.12em", marginBottom: 6 }}>ADD CUSTOM TOUCHPOINT</div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <input style={Object.assign({}, I, { flex: 1, padding: "6px 8px", fontSize: 11 })} placeholder="Touchpoint name..." value={newTpLabel} onChange={function(e) { setNewTpLabel(e.target.value); }} />
            <select style={Object.assign({}, I, { width: 100, padding: "6px", fontSize: 10 })} value={newTpCat} onChange={function(e) { setNewTpCat(e.target.value); }}>
              {CK.map(function(ck) { return <option key={ck} value={ck}>{CATS[ck]}</option>; })}
            </select>
            <button onClick={addCustomTP} style={Object.assign({}, B, { padding: "6px 12px", fontSize: 9 })}>ADD</button>
          </div>
        </div>
        {navB(2, 4, "NARRATIVE")}
      </div>
    );
  };

  /* S4: Narrative + Sketches + ADR */
  var S4 = function() {
    return (
      <div style={{ maxWidth: 510, margin: "0 auto" }}>
        {sH(5, 5, "Design Narrative", "The story that gives coherence. These words shape your archetype and value proposition.")}
        <div style={{ marginBottom: 14 }}>
          <label style={L}>PURPOSE STATEMENT</label>
          <textarea style={Object.assign({}, I, { minHeight: 56, resize: "vertical", fontFamily: "inherit" })} placeholder="To create a place where guests rediscover connection to nature, culture, and themselves" value={purpose} onChange={function(e) { setPurpose(e.target.value); }} />
          <div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Why does this project exist? What transformation does it offer?</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={L}>DESIGN DRIVERS</label>
          <textarea style={Object.assign({}, I, { minHeight: 56, resize: "vertical", fontFamily: "inherit" })} placeholder="1. Landscape-first  2. Sensory transitions  3. Local craft as structure" value={drivers} onChange={function(e) { setDrivers(e.target.value); }} />
          <div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>3-5 principles guiding every design decision</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={L}>DESIGN HIGHLIGHTS</label>
          <textarea style={Object.assign({}, I, { minHeight: 56, resize: "vertical", fontFamily: "inherit" })} placeholder="Biophilic architecture, local stone and reclaimed hardwood, cenote-inspired water features, living walls, sensory transitions through light and shadow..." value={designHL} onChange={function(e) { setDesignHL(e.target.value); }} />
          <div style={{ fontSize: 8.5, color: "#7a6e62", marginTop: 2 }}>Key design features, materials, spatial strategies, sensory elements</div>
        </div>
        <div style={{ padding: "8px 12px", border: "1px solid #e2dfd8", borderRadius: 2, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 20, color: "#1a1815", fontWeight: 300 }}>{calc.narrativeDepth}<span style={{ fontSize: 10, color: "#6a5e4e" }}>/100</span></div>
            <div style={{ flex: 1, height: 3, background: "#e6e2dc", borderRadius: 2 }}><div style={{ height: "100%", width: calc.narrativeDepth + "%", background: "#8a7e6e", borderRadius: 2, transition: "width 0.5s" }} /></div>
          </div>
          {calc.narrAnalysis.themes.length > 0 && <div style={{ fontSize: 9, color: "#5a5248", marginTop: 6 }}>Detected themes: {calc.narrAnalysis.themes.join(", ")}</div>}
        </div>
        <div><label style={L}>MARKET ADR REFERENCE (OPTIONAL)</label><input style={I} placeholder="Ultra-Luxury: $800-$2,500 / Luxury: $400-$800" value={adr} onChange={function(e) { setAdr(e.target.value); }} /></div>
        {navB(3, 5, "CALCULATE EDI")}
      </div>
    );
  };

  /* S5: RESULTS */
  var S5 = function() {
    var arch = ARCHETYPES[calc.bestArch];
    var sa = ARCHETYPES[selArch];
    var tpRadar = CK.map(function(ck) { return calc.tpScores[ck]; });
    var tierData = TIERS.find(function(t) { return t.id === tier; });
    var brands = tierData ? tierData.benchmarks : {};
    var brandKeys = Object.keys(brands);
    var selB = brands[selBrand];
    var mainMetrics = [calc.spatial, calc.richness, calc.landscape, calc.balance, calc.narrativeDepth];
    // Section title style
    var secTitle = { fontSize: 13, fontWeight: 500, color: "#1a1815", letterSpacing: "0.1em", marginBottom: 6 };
    // Section box style
    var secBox = { padding: "16px 18px", border: "1px solid #e2dfd8", borderRadius: 3, marginTop: 16 };
    // Intro text style
    var introText = { fontSize: 11, color: "#4a4238", lineHeight: 1.6, marginBottom: 10 };
    // Experience profile paragraph
    var topCats = CK.map(function(ck) { return { k: ck, s: calc.tpScores[ck] || 0 }; }).sort(function(a,b) { return b.s - a.s; });
    var strongCats = topCats.filter(function(x) { return x.s >= 40; });
    var weakCats = topCats.filter(function(x) { return x.s > 0 && x.s < 25; });
    var expProfileText = "The project's experiential shape is " + (strongCats.length >= 3 ? "well-rounded, with depth across " + strongCats.length + " categories" : strongCats.length >= 1 ? "concentrated, with strength in " + strongCats.map(function(x) { return CATS[x.k]; }).join(" and ") : "still emerging") + "." + (weakCats.length > 0 ? " " + weakCats.map(function(x) { return CATS[x.k]; }).join(" and ") + (weakCats.length === 1 ? " shows" : " show") + " opportunity for development." : "") + " The hexagonal profile below reveals WHERE experiential depth is concentrated -- not just how many touchpoints exist, but how the guest journey is weighted.";

    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center", paddingTop: 2 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.35em", color: "#7a6e62" }}>EXPERIENCE DENSITY INDEX</div>
          <h2 style={{ fontSize: 20, fontWeight: 300, color: "#1a1815", margin: "3px 0 0" }}>{pn || "Untitled"}</h2>
          <div style={{ fontSize: 10, color: "#5a5248", marginTop: 2 }}>{(CLIMATES.find(function(c) { return c.id === clim; }) || {}).label || ""} {(CONTEXTS.find(function(c) { return c.id === ctx; }) || {}).label || ""}{loc ? " -- " + loc : ""} {tk} Keys</div>
        </div>

        {/* EDI SCORE */}
        <div style={Object.assign({}, secBox, { textAlign: "center", marginTop: 12 })}>
          <div style={{ fontSize: 8.5, color: "#6a5e4e", letterSpacing: "0.1em" }}>EXPERIENCE DENSITY INDEX</div>
          <div style={{ fontSize: 38, color: "#1a1815", fontWeight: 300, marginTop: 2 }}>{aScore}</div>
          <div style={{ fontSize: 10, color: "#4a4238", letterSpacing: "0.12em" }}>{calc.ediTier.toUpperCase()}</div>
        </div>

        {/* 1. KEY METRICS (moved to top) */}
        <div style={secBox}>
          <div style={secTitle}>KEY METRICS</div>
          <div style={introText}>Spatial metrics provide the quantitative foundation for positioning. These ratios -- derived from the area program and key count -- determine the physical generosity of the guest experience and benchmark the project against industry standards.</div>
          <CtxBar label="Spatial Generosity (GFA/Key)" value={calc.spatialRaw} max={400} ranges={RNG.spatial} unit=" m2/key" />
          <CtxBar label="Site Coverage" value={calc.siteCoverage} max={50} ranges={RNG.coverage} unit="%" />
          <CtxBar label="Density" value={calc.density} max={40} ranges={RNG.density} unit=" keys/ha" />
          <CtxBar label="Pool Ratio" value={calc.poolRatio} max={25} ranges={RNG.pool} unit=" m2/key" />
          <CtxBar label="Amenity Ratio" value={calc.amPerKey} max={80} ranges={RNG.amenity} unit=" m2/key" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 4 }}>
            {[
              ["LANDSCAPE", calc.landscapeRatio.toFixed(0) + "%", "of site"],
              ["OUTDOOR / INDOOR", calc.outdoorRatio.toFixed(0) + "%", "experience ratio"],
              ["NARRATIVE", String(calc.narrativeDepth), calc.narrativeDepth >= 80 ? "articulated" : calc.narrativeDepth >= 50 ? "developing" : "needs work"],
            ].map(function(arr, i) { return (
              <div key={i} style={{ padding: "8px 9px", border: "1px solid #e6e2dc", borderRadius: 2 }}>
                <div style={{ fontSize: 7.5, color: "#6a5e4e", letterSpacing: "0.08em" }}>{arr[0]}</div>
                <div style={{ fontSize: 16, color: "#1a1815", fontWeight: 300 }}>{arr[1]}</div>
                <div style={{ fontSize: 8, color: "#7a6e62" }}>{arr[2]}</div>
              </div>
            ); })}
          </div>
        </div>

        {/* 2. DESIGN DNA PENTAGON */}
        <div style={secBox}>
          <div style={secTitle}>DESIGN DNA</div>
          <div style={introText}>The Design DNA pentagon maps the project across five fundamental dimensions of hospitality design. The solid shape represents this project's profile; dashed outlines show archetype references. The closer the overlap with an archetype, the stronger the alignment with that positioning strategy.</div>
          <Pentagon id="dna" metrics={mainMetrics} ghosts={AK.map(function(k) { return { values: ARCHETYPES[k].radar, hl: k === selArch }; })} labels={["Spatial\nGenerosity", "Experience\nRichness", "Landscape\nImmersion", "Outdoor\nExperiences", "Narrative\nDepth"]} size={400} />
          <div style={{ textAlign: "center", fontSize: 9, color: "#6a5e4e", marginTop: -2 }}>Solid -- your project / Dashed -- {sa.name}</div>
        </div>

        {/* 3. ARCHETYPE + EMPHASIS */}
        <div style={secBox}>
          <div style={secTitle}>EXPERIENCE ARCHETYPE</div>
          <div style={introText}>Based on the intersection of spatial metrics, experiential programming, and narrative analysis, the project aligns most closely with the following archetype. This classification is not prescriptive -- it reflects where the design decisions are pointing.</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
            <div style={{ fontSize: 17, color: "#1a1815", fontWeight: 300 }}>{arch.name}</div>
            <div style={{ fontSize: 10, color: "#5a5248", fontStyle: "italic" }}>{calc.expEmphLabel}</div>
          </div>
          <div style={{ fontSize: 11, color: "#3a3428", lineHeight: 1.6, marginTop: 6 }}>{arch.long}</div>
          <div style={{ fontSize: 10, color: "#5a5248", fontStyle: "italic", marginTop: 4 }}>{calc.archReason}</div>
          <div style={{ borderTop: "1px solid #e6e2dc", marginTop: 10, paddingTop: 8 }}>
            <div style={{ fontSize: 8, color: "#6a5e4e", letterSpacing: "0.1em", marginBottom: 4 }}>COMPARE ARCHETYPE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{AK.map(function(k) { return <button key={k} onClick={function() { setSelArch(k); }} style={{ padding: "3px 8px", borderRadius: 10, fontSize: 9, cursor: "pointer", fontFamily: "inherit", border: "1px solid " + (selArch === k ? "#8a7e6e" : "#e2dfd8"), background: selArch === k ? "#ede9e2" : "#fff", color: selArch === k ? "#1a1815" : "#6a5e4e" }}>{ARCHETYPES[k].name}</button>; })}</div>
          </div>
        </div>

        {/* 4. VALUE PROPOSITION */}
        <div style={Object.assign({}, secBox, { borderLeft: "3px solid #8a7e6e" })}>
          <div style={secTitle}>VALUE PROPOSITION</div>
          <div style={introText}>Generated from the correlation of spatial data, touchpoint programming, narrative themes, and positioning tier. This is not a tagline -- it is a strategic synthesis of what the project offers and why it matters.</div>
          <div style={{ fontSize: 12.5, color: "#1a1815", lineHeight: 1.65, fontStyle: "italic" }}>{calc.valueProposition}</div>
        </div>

        {adr && <div style={secBox}><div style={secTitle}>MARKET ADR REFERENCE</div><div style={{ fontSize: 11, color: "#3a3428" }}>{adr}</div></div>}

        {/* 5. EXPERIENCE PROFILE HEXAGON */}
        <div style={secBox}>
          <div style={secTitle}>EXPERIENCE PROFILE</div>
          <div style={introText}>{expProfileText}</div>
          <Pentagon id="exp" metrics={tpRadar} ghosts={null} labels={CK.map(function(ck) { return CATS[ck]; })} size={320} />
          <div style={{ textAlign: "center", fontSize: 9, color: "#6a5e4e", marginTop: -2 }}>{sTP.size} touchpoints -- weighted coverage per category</div>
        </div>

        {/* 6. BRAND BENCHMARK PENTAGON */}
        {tierData && <div style={secBox}>
          <div style={secTitle}>{"BRAND POSITIONING -- " + tierData.label.toUpperCase()}</div>
          <div style={introText}>{"This pentagon compares the project against established " + tierData.label + " brands. Each dashed outline represents a brand's typical design DNA. Use this to identify where the project exceeds, matches, or falls below the competitive set in each dimension."}</div>
          <Pentagon id="brand" metrics={mainMetrics} ghosts={brandKeys.map(function(bk) { return { values: brands[bk].radar, hl: bk === selBrand }; })} labels={["Spatial\nGenerosity", "Experience\nRichness", "Landscape\nImmersion", "Outdoor\nExperiences", "Narrative\nDepth"]} size={380} />
          <div style={{ textAlign: "center", fontSize: 9, color: "#6a5e4e", marginTop: -2 }}>Solid -- your project / Dashed -- {selB ? selB.name : ""}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", marginTop: 8 }}>
            {brandKeys.map(function(bk) { return <button key={bk} onClick={function() { setSelBrand(bk); }} style={{ padding: "3px 8px", borderRadius: 10, fontSize: 9, cursor: "pointer", fontFamily: "inherit", border: "1px solid " + (selBrand === bk ? "#8a7e6e" : "#e2dfd8"), background: selBrand === bk ? "#ede9e2" : "#fff", color: selBrand === bk ? "#1a1815" : "#6a5e4e" }}>{brands[bk].name}</button>; })}
          </div>
          {selB && <div style={{ fontSize: 10, color: "#4a4238", textAlign: "center", marginTop: 4 }}>{selB.note}</div>}
        </div>}

        {/* 7. NARRATIVE THEMES */}
        {calc.narrAnalysis.themes.length > 0 && <div style={secBox}>
          <div style={secTitle}>NARRATIVE THEMES</div>
          <div style={introText}>These themes were detected from the purpose statement, design drivers, and design highlights. They represent the conceptual DNA of the project and directly influence archetype matching and value proposition generation.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{calc.narrAnalysis.themes.map(function(t, i) { return <span key={i} style={{ padding: "4px 10px", borderRadius: 10, fontSize: 10.5, border: "1px solid #d6d2ca", color: "#3a3428" }}>{t}</span>; })}</div>
        </div>}

        {/* 8. TOUCHPOINT MAP (with intro + each program listed) */}
        <div style={secBox}>
          <div style={secTitle}>TOUCHPOINT MAP</div>
          <div style={introText}>The touchpoint map inventories every programmed experiential moment across six categories. Coverage bars show selected touchpoints against the total available in each category. Below each category, the specific programs are listed -- these are the designed moments that collectively define the guest journey.</div>
          {Object.entries(CATS).map(function(entry) {
            var ct = calc.tpByCategory[entry[0]] || 0;
            var m = allTP.filter(function(t) { return t.cat === entry[0]; }).length;
            var selected = allTP.filter(function(t) { return t.cat === entry[0] && sTP.has(t.id); });
            return (
              <div key={entry[0]} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ fontSize: 11, color: "#1a1815", fontWeight: 500, flex: 1 }}>{entry[1]}</div>
                  <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: m }).map(function(_, i) { return <div key={i} style={{ width: 7, height: 7, borderRadius: 1, background: i < ct ? "rgba(0,0,0,0.22)" : "rgba(0,0,0,0.04)" }} />; })}</div>
                  <div style={{ fontSize: 10, color: "#4a4238", width: 20, textAlign: "right" }}>{ct + "/" + m}</div>
                </div>
                {selected.length > 0 && <div style={{ paddingLeft: 8, borderLeft: "1px solid #e6e2dc" }}>
                  <div style={{ fontSize: 10, color: "#5a5248", lineHeight: 1.7 }}>{selected.map(function(t) { return t.label; }).join(" / ")}</div>
                </div>}
              </div>
            );
          })}
        </div>

        {/* 9. INSIGHTS & RECOMMENDATIONS */}
        {calc.insights.length > 0 && <div style={secBox}>
          <div style={secTitle}>INSIGHTS & RECOMMENDATIONS</div>
          <div style={introText}>Derived from the correlation of spatial metrics, touchpoint coverage, area ratios, and narrative analysis. Each insight identifies either a strength to leverage or an opportunity to strengthen the project's positioning.</div>
          {calc.insights.map(function(ins, i) { return <div key={i} style={{ padding: "8px 12px", marginBottom: 5, borderLeft: "2px solid #8a7e6e", fontSize: 11, color: "#2a2420", lineHeight: 1.55 }}>{ins.text}</div>; })}
        </div>}

        {/* 10. PROJECT HIGHLIGHTS */}
        <div style={Object.assign({}, secBox, { background: "#faf9f7" })}>
          <div style={secTitle}>PROJECT HIGHLIGHTS</div>
          <div style={introText}>These highlights emerge from the cross-reference of all three pentagon diagrams -- Design DNA, Experience Profile, and Brand Positioning. They represent what makes this specific project distinct and defensible in its competitive landscape.</div>
          {highlights.map(function(h, i) { return <div key={i} style={{ padding: "8px 12px", marginBottom: 5, borderLeft: "2px solid #1a1815", fontSize: 11.5, color: "#1a1815", lineHeight: 1.6, fontStyle: "italic" }}>{h}</div>; })}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 24, paddingTop: 10, borderTop: "1px solid #e2dfd8", flexWrap: "wrap" }}>
          {[["PROJECT", 0], ["AREAS", 1], ["KEYS", 2], ["TOUCHPOINTS", 3], ["NARRATIVE", 4]].map(function(arr) {
            return <button key={arr[1]} style={Object.assign({}, B, { fontSize: 9, padding: "5px 10px" })} onClick={function() { go(arr[1]); }} onMouseEnter={function(e) { bh(e, true); }} onMouseLeave={function(e) { bh(e, false); }}>{arr[0]}</button>;
          })}
          <button style={Object.assign({}, B, { fontSize: 9, padding: "5px 14px", background: "#ede9e2" })} onClick={function() { window.print(); }} onMouseEnter={function(e) { e.target.style.background = "#e4e0d8"; }} onMouseLeave={function(e) { e.target.style.background = "#ede9e2"; }}>PRINT / PDF</button>
        </div>
      </div>
    );
  };

  var steps = [S0, S1, S2, S3, S4, S5];
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#1a1815", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap");*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:rgba(0,0,0,0.3)}input:focus,textarea:focus{border-color:#8a7e6e!important}select:focus{border-color:#8a7e6e!important;outline:none}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}textarea{font-family:"Cormorant Garamond",Georgia,serif}@media print{.no-print{display:none!important}}'}</style>
      <div className="no-print" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 1.5, background: "#e2dfd8" }}>
        <div style={{ height: "100%", width: ((step + 1) / 6) * 100 + "%", background: "#8a7e6e", transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <div style={{ padding: "20px 22px 44px", maxWidth: 840, margin: "0 auto", opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.2s, transform 0.2s" }}>
        {steps[step]()}
      </div>
    </div>
  );
}
