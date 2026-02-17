import { useState, useMemo } from "react";

/* ═══ ARCHETYPES ═══ */
var ARCH = {
  sanctuary: { name: "The Sanctuary", long: "Sparse programming is intentional. Privacy and vast landscape are the luxury. Every villa is a world unto itself.", dna: [95, 80, 88, 30, 92], kw: ["silence","privacy","retreat","minimal","solitude","nature","escape","sanctuary","contemplat","stillness","horizon","vast","seclu"] },
  theatre: { name: "The Grand Theatre", long: "Public spaces are stages. Grand lobbies, dramatic pools, signature restaurants. Layered, sequential, expressive.", dna: [60, 65, 50, 95, 45], kw: ["spectacle","dramatic","social","destination","theatrical","stage","energy","vibrant","celebrat","grand","arrival","choreograph"] },
  village: { name: "The Cultural Village", long: "Architecture speaks the language of the region. Programming connects guests to place through food, art, community.", dna: [55, 95, 60, 65, 70], kw: ["local","authentic","craft","heritage","place","tradition","artisan","community","indigenous","vernacular","rooted","story","cultural"] },
  oasis: { name: "The Wellness Oasis", long: "Architecture, landscape, light, and water designed to heal. Clinical quality, sensorial delivery.", dna: [70, 75, 85, 55, 80], kw: ["heal","wellness","therapeu","nature","biophilic","water","calm","restor","mindful","breath","holistic","spa","meditat"] },
  estate: { name: "The Branded Estate", long: "Residential and hotel with distinct experiences sharing unified design. Community and privacy calibration.", dna: [60, 60, 55, 72, 50], kw: ["residen","estate","community","owner","home","belonging","legacy","private","club","family","investment","permanent"] },
  club: { name: "The Social Club", long: "Pools, clubs, restaurants for atmosphere and interaction. Bold architecture. Scene, curation, relevance.", dna: [45, 40, 42, 90, 35], kw: ["social","pool","beach","club","scene","energy","music","night","crowd","vibe","party","lounge","curated"] },
};
var AK = Object.keys(ARCH);
var CLIMATES = [{id:"tropical",label:"Tropical"},{id:"desert",label:"Desert"},{id:"coastal",label:"Coastal"},{id:"mountain",label:"Mountain"},{id:"temperate",label:"Temperate"}];
var SETTINGS = [{id:"urban",label:"Urban"},{id:"rural",label:"Rural"},{id:"periurban",label:"Periurban"}];
var TYPOS = [
  {id:"dispersed",label:"Dispersed / Pavilions",note:"Villas across landscape. Low-rise, high land use."},
  {id:"village_cl",label:"Village Cluster",note:"Low-rise around courtyards. Intimate scale."},
  {id:"consolidated",label:"Consolidated Building",note:"Single mid-rise. Efficient footprint."},
  {id:"tower",label:"Tower / High-Rise",note:"Vertical. Minimal footprint."},
  {id:"hybrid",label:"Hybrid",note:"Mixed: tower + villas, building + pavilions."},
];
var ASPS = [
  {id:"ultra",label:"Ultra-Luxury",spatial:[220,400],density:[1,8],coverage:[5,25],pool:[10,25],amenity:[40,80],tp:[16,36],fnbK:[10,20],wellK:[8,15],pubK:[12,25],bohPct:[15,22],ref:"Aman, One&Only, Six Senses, Cheval Blanc"},
  {id:"luxury",label:"Luxury",spatial:[140,220],density:[8,15],coverage:[20,35],pool:[5,10],amenity:[25,40],tp:[12,20],fnbK:[6,12],wellK:[4,8],pubK:[8,15],bohPct:[12,18],ref:"Four Seasons, Rosewood, Mandarin Oriental"},
  {id:"upper",label:"Upper Upscale",spatial:[90,140],density:[15,25],coverage:[30,45],pool:[3,8],amenity:[15,25],tp:[8,14],fnbK:[4,8],wellK:[3,5],pubK:[5,10],bohPct:[10,15],ref:"Edition, Nobu, W Hotels, Fasano"},
  {id:"lifestyle",label:"Lifestyle",spatial:[60,100],density:[20,35],coverage:[30,55],pool:[2,5],amenity:[10,20],tp:[5,12],fnbK:[3,6],wellK:[2,4],pubK:[4,8],bohPct:[8,14],ref:"1Hotels, Ace, Soho House"},
];
var GUESTS = [
  {id:"couples",label:"Couples",keyHint:"Suites/villas with private terraces and plunge pools.",tpNeeds:["priv_din","spa","inf_pool","wine","mirador","out_spa"],areaNeeds:{wellness:"high",fnb:"high",public:"low"},typoFit:["dispersed","village_cl"],narrKw:["intima","privac","romantic","seclud","retreat","sunset"],note:"Intimate scale, adults-only zones, privacy-first design."},
  {id:"families",label:"Families",keyHint:"2-bedroom units, interconnecting rooms, ground-floor access.",tpNeeds:["kids","pool","casual","water_sp","garden","cycling"],areaNeeds:{public:"high",fnb:"mid",wellness:"low"},typoFit:["village_cl","dispersed","hybrid"],narrKw:["family","children","play","discover","togeth","safe","adventure"],note:"Kids club essential. Multiple pools. Casual dining flexibility."},
  {id:"multigen",label:"Multi-Generational",keyHint:"Variety of sizes. Estate villas with 3+ bedrooms.",tpNeeds:["kids","priv_din","pool","garden","casual","library"],areaNeeds:{public:"high",fnb:"high",wellness:"mid"},typoFit:["dispersed","hybrid"],narrKw:["family","generation","togeth","gather","share","legacy"],note:"Shared and separate experiences. Programming across all ages."},
  {id:"hnwi",label:"HNWI / UHNWI",keyHint:"Large villas 300+ m2. Butler service infrastructure. Extreme privacy.",tpNeeds:["priv_din","spa","water_arr","ritual","wine","sig_scent"],areaNeeds:{wellness:"high",fnb:"high",public:"mid"},typoFit:["dispersed"],narrKw:["exclu","bespoke","privat","butler","person","curator"],note:"Bespoke, privacy-first, experiential exclusivity. Low density critical."},
  {id:"wellness_g",label:"Wellness Seekers",keyHint:"Rooms with spa-grade amenities. Quiet orientation. Natural materials.",tpNeeds:["spa","yoga","hammam","plunge","out_spa","mindful","recovery"],areaNeeds:{wellness:"critical",fnb:"mid",public:"low"},typoFit:["dispersed","village_cl","consolidated"],narrKw:["wellness","heal","restor","mindful","breath","holistic","therap","natur"],note:"Wellness area must be substantial. Clinical + sensorial."},
  {id:"adventure",label:"Adventure Seekers",keyHint:"Flexible rooms. Gear storage. Outdoor showers.",tpNeeds:["water_sp","adventure","garden","nat_feat","cycling","fire"],areaNeeds:{public:"mid",fnb:"mid",wellness:"low"},typoFit:["dispersed","village_cl"],narrKw:["adventure","explor","active","discover","wild","trail","excursion","outdoor"],note:"Excursion hub. Water sports. Trails. Active programming."},
  {id:"cultural",label:"Cultural Explorers",keyHint:"Rooms reflecting local identity. Artisan details.",tpNeeds:["cook","craft_s","art","heritage","spirits","music"],areaNeeds:{public:"high",fnb:"high",wellness:"low"},typoFit:["village_cl","consolidated"],narrKw:["cultur","heritage","artisan","craft","local","tradition","story","indigenous"],note:"Cooking school, atelier, heritage programming essential."},
  {id:"social",label:"Social / Scene-Driven",keyHint:"Compact rooms. Investment in public spaces and F&B.",tpNeeds:["bar","beach","pool","music","pool_bar","inf_pool"],areaNeeds:{fnb:"critical",public:"high",wellness:"low"},typoFit:["consolidated","tower","hybrid"],narrKw:["social","scene","energy","vibe","nightli","music","crowd","curated"],note:"Pool scene, nightlife, F&B as social infrastructure."},
];

/* ═══ TOUCHPOINTS (8 per category, 6 categories) ═══ */
var DTP = [
  {id:"lobby",label:"Arrival Lobby",cat:"welcome",w:1.0},{id:"porte",label:"Porte-Cochere",cat:"welcome",w:0.8},{id:"garden_arr",label:"Garden Arrival Path",cat:"welcome",w:1.2},{id:"water_arr",label:"Water Arrival",cat:"welcome",w:1.5},{id:"ritual",label:"Welcome Ritual",cat:"welcome",w:1.3},{id:"concierge",label:"Concierge Pavilion",cat:"welcome",w:0.9},{id:"scenic_app",label:"Scenic Approach Road",cat:"welcome",w:1.1},{id:"sig_scent",label:"Signature Scent / Sound",cat:"welcome",w:1.0},
  {id:"sig_rest",label:"Signature Restaurant",cat:"gastronomy",w:1.4},{id:"casual",label:"All-Day Dining",cat:"gastronomy",w:0.8},{id:"bar",label:"Bar / Lounge",cat:"gastronomy",w:1.0},{id:"pool_bar",label:"Pool / Beach Bar",cat:"gastronomy",w:0.9},{id:"priv_din",label:"Private Dining",cat:"gastronomy",w:1.3},{id:"wine",label:"Wine Cellar / Tasting",cat:"gastronomy",w:1.2},{id:"farm",label:"Farm-to-Table",cat:"gastronomy",w:1.4},{id:"bfast",label:"Breakfast Venue",cat:"gastronomy",w:0.6},
  {id:"spa",label:"Spa & Wellness Center",cat:"wellness",w:1.3},{id:"gym",label:"Fitness Center",cat:"wellness",w:0.6},{id:"yoga",label:"Yoga / Meditation Pavilion",cat:"wellness",w:1.1},{id:"hammam",label:"Hammam / Thermal Circuit",cat:"wellness",w:1.4},{id:"plunge",label:"Hydrotherapy / Plunge",cat:"wellness",w:1.2},{id:"out_spa",label:"Outdoor Treatments",cat:"wellness",w:1.3},{id:"recovery",label:"Recovery / Cryotherapy",cat:"wellness",w:1.1},{id:"mindful",label:"Mindfulness Garden",cat:"wellness",w:1.0},
  {id:"pool",label:"Main Pool",cat:"active",w:0.8},{id:"inf_pool",label:"Adults-Only Pool",cat:"active",w:1.1},{id:"beach",label:"Beach Club",cat:"active",w:1.3},{id:"kids",label:"Kids Club",cat:"active",w:0.7},{id:"tennis",label:"Tennis / Padel",cat:"active",w:0.7},{id:"water_sp",label:"Water Sports Center",cat:"active",w:1.0},{id:"adventure",label:"Adventure / Excursion Hub",cat:"active",w:1.1},{id:"cycling",label:"Cycling / E-Bikes",cat:"active",w:0.8},
  {id:"garden",label:"Botanical Gardens / Trails",cat:"outdoor",w:1.2},{id:"mirador",label:"Mirador / Viewpoint",cat:"outdoor",w:1.3},{id:"fire",label:"Fire Pit / Gathering",cat:"outdoor",w:1.1},{id:"nat_feat",label:"Natural Feature",cat:"outdoor",w:1.6},{id:"org_farm",label:"Organic Farm / Kitchen Garden",cat:"outdoor",w:1.2},{id:"obs",label:"Observatory / Stargazing",cat:"outdoor",w:1.4},{id:"treehouse",label:"Treehouse / Canopy Walk",cat:"outdoor",w:1.3},{id:"labyrinth",label:"Labyrinth / Sensory Walk",cat:"outdoor",w:1.0},
  {id:"art",label:"Art Gallery / Exhibition",cat:"cultural",w:1.3},{id:"library",label:"Library / Reading Room",cat:"cultural",w:1.0},{id:"cook",label:"Cooking School",cat:"cultural",w:1.2},{id:"craft_s",label:"Artisan Atelier",cat:"cultural",w:1.3},{id:"spirits",label:"Spirits / Mixology Lab",cat:"cultural",w:1.1},{id:"music",label:"Music / Performance Venue",cat:"cultural",w:1.2},{id:"cinema",label:"Cinema / Screening Room",cat:"cultural",w:0.9},{id:"heritage",label:"Heritage Workshop",cat:"cultural",w:1.3},
];
var CATS = {welcome:"First Impression",gastronomy:"Gastronomy",wellness:"Wellness",active:"Active Leisure",outdoor:"Outdoor Immersion",cultural:"Cultural & Social"};
var CK = Object.keys(CATS);

/* ═══ NARRATIVE ═══ */
var GENERIC = ["luxury","world-class","unique","exceptional","premier","bespoke","curated","elevated","unparalleled","exclusive","stunning","breathtaking","extraordinary","magnificent","state-of-the-art"];
var SPECRE = /\b(stone|wood|concrete|steel|glass|bamboo|rattan|teak|limestone|terrazzo|brass|copper|ceramic|clay|silk|linen|cotton|marble|basalt|obsidian|coral|thatch|adobe|rammed earth|corten|zinc|cedar|oak|walnut|pine|mahogany|palapa|volcanic|laterite|sandstone)\b/g;
function narrate(pur, slo, drv, hl) {
  var all = (pur+" "+slo+" "+drv+" "+hl).toLowerCase();
  var sc = {}; AK.forEach(function(k) { var s=0; ARCH[k].kw.forEach(function(w){if(all.indexOf(w)>=0)s+=10;}); sc[k]=Math.min(s,100); });
  var th = [];
  if(all.match(/nature|landscape|garden|jungle|forest|ocean|mountain|biophilic/))th.push("Nature Integration");
  if(all.match(/local|craft|artisan|heritage|tradition|indigenous|vernacular/))th.push("Cultural Rootedness");
  if(all.match(/wellness|heal|spa|therap|mindful|restor|holistic/))th.push("Wellness Philosophy");
  if(all.match(/sustain|eco|green|conserv|regenerat|responsible/))th.push("Sustainability");
  if(all.match(/communit|belonging|social|gather|connect|togeth/))th.push("Community Building");
  if(all.match(/privacy|seclu|intimate|exclusive|retreat|solitude/))th.push("Privacy Architecture");
  if(all.match(/culinar|gastronom|food|farm|kitchen|chef|dining/))th.push("Culinary Identity");
  if(all.match(/art|museum|gallery|sculpt|install|creative/))th.push("Art Integration");
  if(all.match(/water|pool|ocean|river|lake|spring|hydro/))th.push("Water as Design");
  if(all.match(/light|shadow|dawn|dusk|sun|glow|luminous/))th.push("Light as Material");
  var gf = GENERIC.filter(function(w){return all.indexOf(w)>=0;});
  var sf = []; (all.match(SPECRE)||[]).forEach(function(w){if(sf.indexOf(w)<0)sf.push(w);});
  var ws = all.split(/\s+/).filter(function(w){return w.length>4;}); var wm={}; ws.forEach(function(w){wm[w]=(wm[w]||0)+1;});
  var rp = Object.keys(wm).filter(function(w){return wm[w]>=3&&GENERIC.indexOf(w)<0;});
  var q=0; if(pur.length>15)q+=22; if(pur.length>60)q+=8; if(slo.length>5)q+=8; if(drv.length>15)q+=22; if(drv.length>80)q+=8; if(hl.length>10)q+=16; if(hl.length>60)q+=6; q+=Math.min(sf.length*4,16); q-=gf.length*3; q-=rp.length*2; q=Math.max(0,Math.min(100,q));
  return {sc:sc,th:th,q:q,gf:gf,sf:sf,rp:rp};
}

/* ═══ COMPONENTS ═══ */
function Hex(p) {
  var m=p.metrics,gh=p.ghosts,lb=p.labels,sz=p.size||300,id=p.id||"p";
  var cx=sz/2,rd=sz*0.33,n=lb.length;
  var an=[]; for(var i=0;i<n;i++)an.push((Math.PI*2*i)/n-Math.PI/2);
  var pt=function(a,v){return{x:cx+rd*(v/100)*Math.cos(a),y:cx+rd*(v/100)*Math.sin(a)};};
  var mp=function(v){return v.map(function(val,i){return(i===0?"M":"L")+" "+pt(an[i],val).x+" "+pt(an[i],val).y;}).join(" ")+" Z";};
  return(<svg viewBox={"0 0 "+sz+" "+sz} style={{width:"100%",maxWidth:sz,display:"block",margin:"0 auto"}}>
    <defs><linearGradient id={"g"+id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2a2420" stopOpacity="0.07"/><stop offset="100%" stopColor="#2a2420" stopOpacity="0.02"/></linearGradient></defs>
    {[20,40,60,80,100].map(function(l){return <polygon key={l} points={an.map(function(a){return pt(a,l).x+","+pt(a,l).y;}).join(" ")} fill="none" stroke={l===100?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.025)"} strokeWidth="0.5"/>;})}{an.map(function(a,i){return <line key={i} x1={cx} y1={cx} x2={pt(a,105).x} y2={pt(a,105).y} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5"/>;})}{gh&&gh.map(function(g,gi){return <path key={gi} d={mp(g.values)} fill="none" stroke={"rgba(0,0,0,"+(g.hl?0.16:0.03)+")"} strokeWidth={g.hl?1.5:0.6} strokeDasharray={g.hl?"6 4":"3 4"}/>;})}<path d={mp(m)} fill={"url(#g"+id+")"} stroke="#2a2420" strokeWidth="1.8" strokeLinejoin="round"/>{m.map(function(v,i){var pp=pt(an[i],v);return <circle key={i} cx={pp.x} cy={pp.y} r="2.5" fill="#2a2420"/>;})}{lb.map(function(label,i){var pp=pt(an[i],n<=5?122:120);var lines=label.split("\n");return <g key={i}>{lines.map(function(line,li){return <text key={li} x={pp.x} y={pp.y+li*10-(lines.length-1)*4} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,0,0,0.65)" fontSize="7.5" fontFamily="'Cormorant Garamond',Georgia,serif" letterSpacing="0.05em">{line}</text>;})}</g>;})}</svg>);
}
function MSl(p) {
  var pct=Math.min((p.value/p.max)*100,100),tgt=p.target;
  return(<div style={{marginBottom:20}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:"#5a5248",letterSpacing:"0.08em"}}>{p.label.toUpperCase()}</span><span style={{fontSize:13,color:"#1a1815"}}>{typeof p.value==="number"?(p.value%1===0?p.value:p.value.toFixed(1)):p.value}<span style={{fontSize:9,color:"#7a6e62",marginLeft:2}}>{p.unit}</span></span></div><div style={{position:"relative",height:18,borderRadius:2,overflow:"hidden",background:"rgba(0,0,0,0.02)"}}>{p.ranges&&p.ranges.map(function(rng,i){var prev=i>0?p.ranges[i-1].max:0;return <div key={i} style={{position:"absolute",left:(prev/p.max)*100+"%",width:((rng.max-prev)/p.max)*100+"%",height:"100%",background:"rgba(0,0,0,"+(0.016+i*0.014)+")",borderRight:i<p.ranges.length-1?"1px solid rgba(255,255,255,0.7)":"none"}}><span style={{position:"absolute",bottom:-13,left:"50%",transform:"translateX(-50%)",fontSize:7,color:"#8a7e6e",whiteSpace:"nowrap"}}>{rng.label}</span></div>;})}{tgt&&<div style={{position:"absolute",left:(tgt[0]/p.max)*100+"%",width:((tgt[1]-tgt[0])/p.max)*100+"%",height:"100%",background:"rgba(138,126,110,0.12)",borderLeft:"1px dashed #8a7e6e",borderRight:"1px dashed #8a7e6e"}}/>}<div style={{position:"absolute",left:pct+"%",top:0,bottom:0,width:2,background:"#1a1815",borderRadius:1}}/></div>{tgt&&<div style={{fontSize:8,color:"#8a7e6e",marginTop:12}}>Target: {tgt[0]}-{tgt[1]}{p.unit||""} ({p.value>=tgt[0]&&p.value<=tgt[1]?"within target":p.value<tgt[0]?"below by "+(tgt[0]-p.value).toFixed(1):"above target"})</div>}{p.note&&<div style={{fontSize:9,color:"#6a5e4e",lineHeight:1.5,marginTop:4,fontStyle:"italic"}}>{p.note}</div>}</div>);
}
var RNG={spatial:[{max:100,label:"Standard"},{max:150,label:"Premium"},{max:220,label:"Luxury"},{max:300,label:"Ultra-Lux"},{max:400,label:"Iconic"}],coverage:[{max:15,label:"Ultra-Low"},{max:25,label:"Ultra-Lux"},{max:35,label:"Luxury"},{max:50,label:"Dense"}],density:[{max:5,label:"Sanctuary"},{max:10,label:"Exclusive"},{max:20,label:"Resort"},{max:40,label:"Dense"}],pool:[{max:3,label:"Minimal"},{max:8,label:"Standard"},{max:15,label:"Generous"},{max:25,label:"Iconic"}],amenity:[{max:20,label:"Lean"},{max:40,label:"Standard"},{max:60,label:"Rich"},{max:80,label:"Iconic"}]};
function sd(a){var m=a.reduce(function(s,v){return s+v;},0)/a.length;return Math.sqrt(a.reduce(function(s,v){return s+Math.pow(v-m,2);},0)/a.length);}

/* ═══ MAIN ═══ */
export default function EDI() {
  var _s=useState(0),step=_s[0],setStep=_s[1];
  var _f=useState(true),fade=_f[0],setFade=_f[1];
  var _pn=useState(""),pn=_pn[0],setPn=_pn[1];
  var _loc=useState(""),loc=_loc[0],setLoc=_loc[1];
  var _cl=useState(""),clim=_cl[0],setClim=_cl[1];
  var _se=useState(""),setting=_se[0],setSetting=_se[1];
  var _ty=useState(""),typo=_ty[0],setTypo=_ty[1];
  var _asp=useState(""),aspiration=_asp[0],setAsp=_asp[1];
  var _gg=useState([]),gst=_gg[0],setGst=_gg[1];
  // Program areas: {area, levels}
  var _pub=useState({a:"",l:"1"}),pub=_pub[0],setPub=_pub[1];
  var _fnb=useState({a:"",l:"1"}),fnb=_fnb[0],setFnb=_fnb[1];
  var _well=useState({a:"",l:"1"}),well=_well[0],setWell=_well[1];
  var _mice=useState({a:"",l:"1"}),mice=_mice[0],setMice=_mice[1];
  var _boh=useState({a:"",l:"1"}),boh=_boh[0],setBoh=_boh[1];
  var _siA=useState(""),siteArea=_siA[0],setSiteArea=_siA[1];
  var _plA=useState(""),poolArea=_plA[0],setPoolArea=_plA[1];
  var _km=useState([{id:"v1",label:"Private Villas",size:"250",count:"",levels:"1"},{id:"v2",label:"Premium Suites",size:"120",count:"",levels:"1"},{id:"v3",label:"Junior Suites",size:"75",count:"",levels:"1"},{id:"v4",label:"Deluxe Rooms",size:"55",count:"",levels:"1"}]),keys=_km[0],setKeys=_km[1];
  var _tp=useState(DTP),allTP=_tp[0],setAllTP=_tp[1];
  var _stp=useState(new Set()),sTP=_stp[0],setSTP=_stp[1];
  var _ntl=useState(""),ntl=_ntl[0],setNtl=_ntl[1];
  var _ntc=useState("welcome"),ntc=_ntc[0],setNtc=_ntc[1];
  var _pur=useState(""),pur=_pur[0],setPur=_pur[1];
  var _slo=useState(""),slo=_slo[0],setSlo=_slo[1];
  var _drv=useState(""),drv=_drv[0],setDrv=_drv[1];
  var _dhl=useState(""),dhl=_dhl[0],setDhl=_dhl[1];
  var _selA=useState("sanctuary"),selA=_selA[0],setSelA=_selA[1];

  var tk=useMemo(function(){return keys.reduce(function(s,k){return s+(parseInt(k.count)||0);},0);},[keys]);
  var togTP=function(id){setSTP(function(p){var n=new Set(p);if(n.has(id))n.delete(id);else n.add(id);return n;});};
  var togG=function(id){setGst(function(p){return p.indexOf(id)>=0?p.filter(function(g){return g!==id;}):p.concat([id]);});};
  var go=function(n){setFade(false);setTimeout(function(){setStep(n);setFade(true);},120);};

  var C = useMemo(function() {
    var k=tk||1;
    var pubV=parseFloat(pub.a)||0, fnbV=parseFloat(fnb.a)||0, wellV=parseFloat(well.a)||0, miceV=parseFloat(mice.a)||0, bohV=parseFloat(boh.a)||0;
    var pubL=Math.max(parseInt(pub.l)||1,1), fnbL=Math.max(parseInt(fnb.l)||1,1), wellL=Math.max(parseInt(well.l)||1,1), miceL=Math.max(parseInt(mice.l)||1,1), bohL=Math.max(parseInt(boh.l)||1,1);
    var saV=parseFloat(siteArea)||0, plV=parseFloat(poolArea)||0;
    var grGross=0, grFoot=0, largeKeys=0, smallKeys=0;
    keys.forEach(function(kt){var sz=parseFloat(kt.size)||0,ct=parseInt(kt.count)||0,lv=Math.max(parseInt(kt.levels)||1,1); grGross+=sz*ct; grFoot+=(sz*ct)/lv; if(sz>=100)largeKeys+=ct; else smallKeys+=ct;});
    var amGross = pubV+fnbV+wellV+miceV;
    var gfaV = grGross+amGross;
    var amFoot = pubV/pubL + fnbV/fnbL + wellV/wellL + miceV/miceL;
    var totalFoot = grFoot + amFoot + bohV/bohL;
    var siteCov = saV>0?(totalFoot/saV)*100:0;
    var openExp = saV>0?Math.max(saV-totalFoot-plV,0):0;
    var spatialRaw = gfaV>0?gfaV/k:0;
    var amPerKey = amGross/k;
    var density = saV>0?k/(saV/10000):0;
    var poolRatio = plV/k;
    var outdoorArea = openExp+plV;
    var ioRatio = (gfaV+outdoorArea)>0?(outdoorArea/(gfaV+outdoorArea))*100:0;
    var landscapeRatio = saV>0?(openExp/saV)*100:0;
    // Per-key program ratios
    var fnbPerKey=fnbV/k, wellPerKey=wellV/k, pubPerKey=pubV/k, micePerKey=miceV/k;
    var bohPct = (gfaV+bohV)>0?(bohV/(gfaV+bohV))*100:0;
    // Program distribution
    var totalProg = pubV+fnbV+wellV+miceV+bohV;
    var progDist = {pub:totalProg>0?(pubV/totalProg)*100:0, fnb:totalProg>0?(fnbV/totalProg)*100:0, well:totalProg>0?(wellV/totalProg)*100:0, mice:totalProg>0?(miceV/totalProg)*100:0, boh:totalProg>0?(bohV/totalProg)*100:0};

    // Touchpoints
    var wTP=allTP.filter(function(t){return sTP.has(t.id);}).reduce(function(s,t){return s+t.w;},0);
    var tpByCat={}; allTP.forEach(function(t){if(sTP.has(t.id))tpByCat[t.cat]=(tpByCat[t.cat]||0)+1;});
    var tpScores={}; CK.forEach(function(ck){var catTPs=allTP.filter(function(t){return t.cat===ck;}); var maxW=catTPs.reduce(function(s,t){return s+t.w;},0); var selW=catTPs.filter(function(t){return sTP.has(t.id);}).reduce(function(s,t){return s+t.w;},0); tpScores[ck]=maxW>0?Math.min((selW/maxW)*120,100):0;});
    // Narrative
    var nr = narrate(pur,slo,drv,dhl);
    // DNA Pentagon
    var dnaSp=Math.min((spatialRaw/350)*100,100), dnaNr=nr.q, dnaIO=Math.min((ioRatio/80)*100,100);
    var dnaRich=Math.min((wTP/30)*100,100);
    var dnaLand=saV>0?Math.min((landscapeRatio/80)*100,100)*0.6+(tpScores.outdoor||0)*0.4:0;
    var dnaM=[dnaSp,dnaNr,dnaIO,dnaRich,dnaLand];
    var expM=CK.map(function(ck){return tpScores[ck];});
    var dnaSD=sd(dnaM.filter(function(v){return v>0;}));
    var expSD=sd(expM.filter(function(v){return v>0;}));

    // Positioning
    var posS=0;
    if(spatialRaw>=220)posS+=22;else if(spatialRaw>=140)posS+=16;else if(spatialRaw>=90)posS+=9;
    if(density>0&&density<=8)posS+=18;else if(density<=15)posS+=12;else if(density<=25)posS+=6;
    if(siteCov>0&&siteCov<=25)posS+=14;else if(siteCov<=35)posS+=9;
    if(sTP.size>=16)posS+=14;else if(sTP.size>=12)posS+=10;else if(sTP.size>=8)posS+=5;
    if(nr.q>=55)posS+=14;else if(nr.q>=40)posS+=9;
    if(poolRatio>=10)posS+=6;else if(poolRatio>=5)posS+=3;
    if(amPerKey>=40)posS+=6;else if(amPerKey>=25)posS+=3;
    if(ioRatio>=70)posS+=6;else if(ioRatio>=40)posS+=3;
    var pos="Standard",posRef="Conventional hotels";
    if(posS>=78){pos="Ultra-Luxury";posRef="Aman, One&Only, Six Senses, Cheval Blanc";}
    else if(posS>=55){pos="Luxury";posRef="Four Seasons, Rosewood, Mandarin Oriental";}
    else if(posS>=35){pos="Upper Upscale";posRef="Edition, Nobu, W Hotels";}
    else if(posS>=18){pos="Lifestyle";posRef="1Hotels, Ace, Soho House";}
    var aspD=ASPS.find(function(a){return a.id===aspiration;});

    // Archetype
    var bA="sanctuary",bAS=-Infinity;
    Object.entries(ARCH).forEach(function(e){var md=e[1].dna.reduce(function(s,v,i){return s+Math.pow(v-dnaM[i],2);},0);var ms=100-Math.sqrt(md)/2;var ns=nr.sc[e[0]]||0;var c=ms*0.55+ns*0.45;if(c>bAS){bAS=c;bA=e[0];}});
    var aR=[];
    if(dnaSp>=70)aR.push("spatial generosity");if(dnaRich>=70)aR.push("rich programming");if(dnaLand>=65)aR.push("landscape immersion");if(dnaNr>=60)aR.push("narrative depth");if(nr.th.length>0)aR.push(nr.th.slice(0,2).join(", "));
    var archR=aR.length>0?aR.join(" + "):"overall balance";
    var sortC=CK.map(function(ck){return{k:ck,s:tpScores[ck]||0};}).sort(function(a,b){return b.s-a.s;}).filter(function(x){return x.s>20;});
    var empL={welcome:"Journey-Focused",gastronomy:"Gastronomy-Led",wellness:"Wellness-Centered",active:"Activity-Rich",outdoor:"Nature-Immersive",cultural:"Culturally Rooted"};
    var expE=sortC.length>0?empL[sortC[0].k]:"--";
    if(sortC.length>1&&sortC[1].s>sortC[0].s*0.7)expE+=", "+empL[sortC[1].k];

    // ═══ DEEP CORRELATIONS & INSIGHTS ═══
    var ins=[];
    // 1. Aspiration gaps
    if(aspD){
      if(spatialRaw>0&&spatialRaw<aspD.spatial[0])ins.push("POSITIONING GAP: "+spatialRaw.toFixed(0)+" m2/key vs "+aspD.label+" target "+aspD.spatial[0]+"-"+aspD.spatial[1]+". Reduce keys by ~"+Math.max(1,Math.round(k-gfaV/aspD.spatial[0]))+" or add "+Math.round(aspD.spatial[0]*k-gfaV)+" m2.");
      if(density>0&&density>aspD.density[1])ins.push("POSITIONING GAP: Density "+density.toFixed(1)+" keys/ha exceeds "+aspD.label+" range "+aspD.density[0]+"-"+aspD.density[1]+".");
      if(siteCov>0&&siteCov>aspD.coverage[1])ins.push("POSITIONING GAP: Coverage "+siteCov.toFixed(0)+"% exceeds "+aspD.label+" target "+aspD.coverage[0]+"-"+aspD.coverage[1]+"%.");
      if(sTP.size>0&&sTP.size<aspD.tp[0])ins.push("POSITIONING GAP: "+sTP.size+" touchpoints vs "+aspD.label+" minimum "+aspD.tp[0]+".");
      if(fnbV>0&&fnbPerKey<aspD.fnbK[0])ins.push("PROGRAM GAP: F&B at "+fnbPerKey.toFixed(1)+" m2/key vs "+aspD.label+" benchmark "+aspD.fnbK[0]+"-"+aspD.fnbK[1]+" m2/key. Undersized for "+((tpByCat.gastronomy||0))+" gastronomy touchpoints.");
      if(wellV>0&&wellPerKey<aspD.wellK[0])ins.push("PROGRAM GAP: Wellness at "+wellPerKey.toFixed(1)+" m2/key vs "+aspD.label+" benchmark "+aspD.wellK[0]+"-"+aspD.wellK[1]+" m2/key.");
      if(bohV>0&&bohPct<aspD.bohPct[0])ins.push("OPERATIONS: BOH at "+bohPct.toFixed(1)+"% vs "+aspD.label+" requirement "+aspD.bohPct[0]+"-"+aspD.bohPct[1]+"%. Insufficient service infrastructure for this tier.");
    }
    // 2. Specialization warnings
    if(dnaM.filter(function(v){return v>5;}).length>=4&&dnaSD<12)ins.push("WARNING: Design DNA shows flat distribution (std dev "+dnaSD.toFixed(0)+"). The project lacks a clear spatial signature. Strong projects have peaks and valleys.");
    if(expM.filter(function(v){return v>5;}).length>=5&&expSD<10)ins.push("WARNING: Experience Profile evenly spread. A project that excels at everything excels at nothing. Deepen 2-3 categories.");
    // 3. Touchpoint vs area mismatches
    if((tpByCat.gastronomy||0)>=4&&fnbV>0&&fnbPerKey<6)ins.push("MISMATCH: "+tpByCat.gastronomy+" gastronomy touchpoints but only "+fnbPerKey.toFixed(1)+" m2/key of F&B area. Either reduce F&B touchpoints or expand the area. Each restaurant needs ~150-300 m2 at luxury level.");
    if((tpByCat.wellness||0)>=4&&wellV>0&&wellPerKey<4)ins.push("MISMATCH: "+tpByCat.wellness+" wellness touchpoints but only "+wellPerKey.toFixed(1)+" m2/key of wellness area. Hammam alone needs 200+ m2. Thermal circuits need 400+.");
    if((tpByCat.cultural||0)>=3&&pubV>0&&pubPerKey<8)ins.push("MISMATCH: "+tpByCat.cultural+" cultural/social touchpoints but limited public area ("+pubPerKey.toFixed(1)+" m2/key). Galleries, libraries, and ateliers need dedicated space.");
    // 4. Typology correlations
    if(typo==="dispersed"&&density>12)ins.push("TYPOLOGY CONFLICT: Dispersed pavilion layout with "+density.toFixed(1)+" keys/ha density. Pavilion typology needs <10 keys/ha for meaningful landscape buffers between units.");
    if(typo==="tower"&&siteCov>30)ins.push("TYPOLOGY CONFLICT: Tower typology should yield <20% coverage. "+siteCov.toFixed(0)+"% suggests the tower footprint or podium is oversized.");
    if((typo==="tower"||typo==="consolidated")&&ioRatio>65)ins.push("Strong indoor/outdoor balance ("+ioRatio.toFixed(0)+"%) despite vertical typology. Ensure rooftop programming, terraces, and vertical gardens deliver on this ratio.");
    // 5. Climate correlations
    if(clim==="tropical"&&ioRatio<30&&gfaV>0)ins.push("CLIMATE MISMATCH: Tropical climate but only "+ioRatio.toFixed(0)+"% outdoor ratio. Tropical settings demand 50%+ outdoor experience. Covered outdoor spaces, pavilion dining, garden circulation.");
    if(clim==="desert"&&plV>0&&poolRatio>12)ins.push("CLIMATE NOTE: Desert setting with "+poolRatio.toFixed(1)+" m2/key water. Consider water sustainability narrative -- treated water, natural springs, or wadi-inspired water features to justify this volume.");
    if((clim==="mountain"||clim==="temperate")&&!sTP.has("fire")&&sTP.size>5)ins.push("Consider fire pit / outdoor gathering for "+clim+" climate. These become social anchors in cooler settings (Amangiri, Aman-i-Khas).");
    // 6. Setting correlations
    if(setting==="urban"&&density<10&&saV>0)ins.push("Low density ("+density.toFixed(1)+" keys/ha) for urban setting is extremely rare and premium. Aman Tokyo achieves this through vertical efficiency. Validate that land economics support this.");
    if(setting==="rural"&&siteCov>30)ins.push("Rural setting with "+siteCov.toFixed(0)+"% coverage. Rural luxury should preserve the landscape that justified the location. Aman rural properties: 8-15%.");
    // 7. GUEST CORRELATIONS
    var guestIns=[];
    gst.forEach(function(gid){
      var gd=GUESTS.find(function(g){return g.id===gid;}); if(!gd)return;
      // Touchpoint gaps
      var missTPs=gd.tpNeeds.filter(function(tid){return!sTP.has(tid);});
      if(missTPs.length>0){var labels=missTPs.map(function(tid){var tp=allTP.find(function(t){return t.id===tid;});return tp?tp.label:tid;});guestIns.push({group:gd.label,type:"touchpoint",msg:"Missing critical touchpoints: "+labels.join(", ")+". "+gd.note});}
      // Area program alignment
      if(gd.areaNeeds.wellness==="critical"&&wellPerKey<4&&wellV>=0)guestIns.push({group:gd.label,type:"area",msg:"Wellness area at "+wellPerKey.toFixed(1)+" m2/key is insufficient. "+gd.label+" guests expect 8-15 m2/key of wellness space (treatment rooms, thermal circuits, movement studios)."});
      if(gd.areaNeeds.fnb==="critical"&&fnbPerKey<5)guestIns.push({group:gd.label,type:"area",msg:"F&B area at "+fnbPerKey.toFixed(1)+" m2/key is insufficient. "+gd.label+" guests need multiple distinctive venues. Target 8-15 m2/key."});
      if(gd.areaNeeds.fnb==="high"&&fnbPerKey<4&&fnbV>0)guestIns.push({group:gd.label,type:"area",msg:"F&B area may be undersized for "+gd.label+". Target 6-12 m2/key for diverse dining experiences."});
      if(gd.areaNeeds.public==="high"&&pubPerKey<6&&pubV>0)guestIns.push({group:gd.label,type:"area",msg:"Public areas at "+pubPerKey.toFixed(1)+" m2/key may limit "+gd.label+" experience. Lounges, kids areas, and gathering spaces need 8-15 m2/key."});
      // Typology fit
      if(gd.typoFit.indexOf(typo)<0&&typo)guestIns.push({group:gd.label,type:"typology",msg:gd.label+" guests typically prefer "+(gd.typoFit.map(function(t){return(TYPOS.find(function(ty){return ty.id===t;})||{}).label||t;}).join(" or "))+". Current "+((TYPOS.find(function(t){return t.id===typo;})||{}).label||"")+" typology may create friction."});
      // Key mix check
      if(gid==="families"||gid==="multigen"){var has2BR=keys.some(function(kt){return(parseInt(kt.count)||0)>0&&(kt.label.toLowerCase().match(/2.?bed|family|villa|residence/)||parseFloat(kt.size)>=120);});if(!has2BR&&tk>0)guestIns.push({group:gd.label,type:"keymix",msg:"No 2+ bedroom or family-sized units detected in key mix. "+gd.label+" guests need multi-room options (120+ m2)."});}
      if(gid==="hnwi"){var hasLarge=keys.some(function(kt){return(parseInt(kt.count)||0)>0&&parseFloat(kt.size)>=250;});if(!hasLarge&&tk>0)guestIns.push({group:gd.label,type:"keymix",msg:"No large villas (250+ m2) with inventory detected. HNWI guests expect 300+ m2 private villas."});if(density>8&&saV>0)guestIns.push({group:gd.label,type:"density",msg:"Density "+density.toFixed(1)+" keys/ha too high for HNWI privacy expectations. Target <8 keys/ha (Aman: 2-5)."});}
      if(gid==="social"){if(pubPerKey<8&&pubV>0)guestIns.push({group:gd.label,type:"area",msg:"Social guests need generous public areas (10-20 m2/key). Current "+pubPerKey.toFixed(1)+" m2/key limits the social infrastructure."});if(fnbPerKey<6&&fnbV>0)guestIns.push({group:gd.label,type:"area",msg:"Social guests need significant F&B investment (8-15 m2/key). Current "+fnbPerKey.toFixed(1)+" m2/key."});}
      // Narrative resonance
      var allNarr=(pur+" "+slo+" "+drv+" "+dhl).toLowerCase();
      var narrHits=gd.narrKw.filter(function(w){return allNarr.indexOf(w)>=0;});
      if(narrHits.length===0&&(pur.length+drv.length)>30)guestIns.push({group:gd.label,type:"narrative",msg:"Narrative does not reference "+gd.label+" guest values. Consider weaving keywords like "+gd.narrKw.slice(0,3).join(", ")+" into purpose and drivers."});
    });
    // 8. Luxury key mix weight
    var luxW=0; keys.forEach(function(kt){var sz=parseFloat(kt.size)||0,ct=parseInt(kt.count)||0;if(sz>=200)luxW+=ct*1.8;else if(sz>=100)luxW+=ct*1.4;else if(sz>=70)luxW+=ct*1.1;else luxW+=ct*0.9;});
    var luxMix=k>0?luxW/k:0;
    if(aspD&&aspD.id==="ultra"&&luxMix<1.3&&tk>0)ins.push("KEY MIX: Luxury weight "+luxMix.toFixed(2)+" (1.0=standard). Ultra-luxury positioning needs >1.4 (majority of keys >100 m2). "+largeKeys+" of "+k+" keys are 100+ m2 ("+(largeKeys/k*100).toFixed(0)+"%).");
    // General
    if(siteCov>30&&saV>0)ins.push(siteCov.toFixed(0)+"% coverage. Ultra-luxury: 8-15%, Luxury: 20-32%. Consider multi-level program or site expansion.");
    if(density>12&&saV>0)ins.push(density.toFixed(1)+" keys/ha. Aman: 2-5, One&Only: 5-8, Four Seasons: 10-18. Privacy drops above 15.");
    if(nr.q<50&&(pur.length+drv.length)>20)ins.push("Narrative quality "+nr.q+"/100."+(nr.gf.length>0?" Avoid: \""+nr.gf.slice(0,3).join("\", \"")+"\". Replace with specific materials and references.":"")+(nr.rp.length>0?" Repetitive: \""+nr.rp.slice(0,2).join("\", \"")+"\".":" Use specific materials, place names, techniques."));
    // Value prop
    var vpP=[];
    if(spatialRaw>=220)vpP.push("exceptional spatial generosity ("+spatialRaw.toFixed(0)+" m2/key)");
    if(nr.q>=60&&nr.th.length>=2)vpP.push("a narrative rooted in "+nr.th.slice(0,2).join(" and ").toLowerCase());
    if(sTP.size>=18)vpP.push("rich programming across "+sTP.size+" touchpoints");
    if(landscapeRatio>=70)vpP.push("radical landscape immersion ("+landscapeRatio.toFixed(0)+"% open)");
    if(poolRatio>=10)vpP.push("generous water experiences");
    if(slo.length>3)vpP.push('"'+slo+'"');
    var archN=ARCH[bA].name;
    var vp=vpP.length>1?"Positioned as "+archN+" -- currently reading as "+pos+(aspD&&pos!==aspD.label?" (aspirational: "+aspD.label+")":"")+" -- differentiating through "+vpP.slice(0,3).join(", ")+(vpP.length>3?". Supported by "+vpP.slice(3,5).join(" and "):"")+"." : "Requires stronger spatial and narrative commitments.";
    // Highlights
    var hl=[];
    if(dnaSp>=70&&tpScores.outdoor>=50)hl.push("Spatial generosity + outdoor programming: architecture frames nature. Aman's philosophy where built form defers to landscape.");
    if(dnaRich>=60&&tpScores.gastronomy>=60)hl.push("Rich density anchored by gastronomy -- F&B as destination driver. One&Only and Cheval Blanc model.");
    if(dnaNr>=65&&nr.th.length>=2)hl.push("Narrative coherence ("+nr.th.slice(0,2).join(", ")+"). Rosewood's 'sense of place' -- hardest advantage to copy.");
    if(dnaIO>=65&&dnaLand>=60)hl.push("Outdoor-dominant with strong landscape. The site IS the experience.");
    if(tpScores.cultural>=50&&dnaNr>=50)hl.push("Cultural infrastructure + narrative depth. Cannot be replicated elsewhere.");
    if(poolRatio>=10&&tpScores.wellness>=50)hl.push("Water + wellness: therapeutic landscape beyond the spa. Water as architecture.");
    if(wellV>0&&wellPerKey>=8&&tpScores.wellness>=60)hl.push("Wellness area investment ("+wellPerKey.toFixed(1)+" m2/key) matches programming depth ("+((tpByCat.wellness||0))+" touchpoints). Rare alignment -- most projects under-build for their wellness ambitions.");
    if(fnbV>0&&fnbPerKey>=8&&(tpByCat.gastronomy||0)>=4)hl.push("F&B area ("+fnbPerKey.toFixed(1)+" m2/key) supports "+((tpByCat.gastronomy||0))+" dining venues. Each venue has room to develop distinct character rather than competing for space.");
    if(hl.length===0)hl.push("Strengthen spatial commitments and narrative specificity to establish a defensible position.");
    return{grGross:grGross,grFoot:grFoot,totalFoot:totalFoot,gfaV:gfaV,amGross:amGross,spatialRaw:spatialRaw,amPerKey:amPerKey,siteCov:siteCov,openExp:openExp,landscapeRatio:landscapeRatio,density:density,poolRatio:poolRatio,ioRatio:ioRatio,fnbPerKey:fnbPerKey,wellPerKey:wellPerKey,pubPerKey:pubPerKey,micePerKey:micePerKey,bohPct:bohPct,progDist:progDist,dnaM:dnaM,expM:expM,nr:nr,pos:pos,posRef:posRef,aspD:aspD,bA:bA,archR:archR,expE:expE,tpByCat:tpByCat,tpScores:tpScores,ins:ins,guestIns:guestIns,hl:hl.slice(0,6),vp:vp,luxMix:luxMix,largeKeys:largeKeys,smallKeys:smallKeys};
  },[tk,keys,pub,fnb,well,mice,boh,siteArea,poolArea,sTP,allTP,pur,slo,drv,dhl,aspiration,gst,clim,setting,typo]);

  var I={width:"100%",padding:"8px 10px",background:"#faf9f7",border:"1px solid #e2dfd8",borderRadius:2,color:"#1a1815",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  var Lb={display:"block",marginBottom:3,fontSize:8,color:"#5a5248",letterSpacing:"0.14em"};
  var SB={padding:"16px 18px",border:"1px solid #e2dfd8",borderRadius:3,marginTop:16};
  var ST={fontSize:13,fontWeight:500,color:"#1a1815",letterSpacing:"0.1em",marginBottom:6};
  var IT={fontSize:11,color:"#4a4238",lineHeight:1.6,marginBottom:10};
  var chip=function(on){return{padding:"5px 9px",borderRadius:2,cursor:"pointer",border:"1px solid "+(on?"#8a7e6e":"#e2dfd8"),background:on?"#f0ece6":"#fff",fontFamily:"inherit",fontSize:10,color:on?"#1a1815":"#6a5e4e"};};
  var navB=function(prev,next,label){return <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>{prev>=0?<button onClick={function(){go(prev);}} style={{padding:"8px 18px",border:"1px solid #d6d2ca",background:"#fff",color:"#6a5e4e",fontSize:9,letterSpacing:"0.12em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>BACK</button>:<div/>}<button onClick={function(){go(next);}} style={{padding:"8px 22px",border:"1px solid #d6d2ca",background:"#ede9e2",color:"#3a3428",fontSize:9,letterSpacing:"0.12em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>{label||"NEXT"}</button></div>;};
  var arch=ARCH[C.bA];
  var aspD=C.aspD;

  var progRow=function(label,desc,st,setSt){return <div style={{display:"flex",gap:6,alignItems:"flex-end",marginBottom:6}}><div style={{flex:1}}><label style={Lb}>{label}</label><input style={I} type="number" placeholder="m2" value={st.a} onChange={function(e){setSt({a:e.target.value,l:st.l});}}/><div style={{fontSize:7.5,color:"#7a6e62",marginTop:1}}>{desc}</div></div><div style={{width:50}}><label style={Lb}>LEVELS</label><input style={Object.assign({},I,{textAlign:"center"})} type="number" placeholder="1" value={st.l} onChange={function(e){setSt({a:st.a,l:e.target.value});}}/></div></div>;};

  /* ═ STEPS ═ */
  var steps=[
    /* 0: PROJECT */
    function(){return <div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:8,letterSpacing:"0.35em",color:"#7a6e62"}}>EXPERIENCE DENSITY INDEX</div><h2 style={{fontSize:20,fontWeight:300}}>Project Overview</h2></div><div style={{display:"grid",gap:10}}><div><label style={Lb}>PROJECT NAME</label><input style={I} placeholder="Riviera Maya Resort" value={pn} onChange={function(e){setPn(e.target.value);}}/></div><div><label style={Lb}>LOCATION</label><input style={I} placeholder="Tulum, Mexico" value={loc} onChange={function(e){setLoc(e.target.value);}}/></div><div><label style={Lb}>CLIMATE</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{CLIMATES.map(function(c){return <button key={c.id} onClick={function(){setClim(c.id);}} style={chip(clim===c.id)}>{c.label}</button>;})}</div></div><div><label style={Lb}>SETTING</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{SETTINGS.map(function(c){return <button key={c.id} onClick={function(){setSetting(c.id);}} style={chip(setting===c.id)}>{c.label}</button>;})}</div></div><div><label style={Lb}>TYPOLOGY</label><div style={{display:"grid",gap:3}}>{TYPOS.map(function(t){return <button key={t.id} onClick={function(){setTypo(t.id);}} style={Object.assign({},chip(typo===t.id),{textAlign:"left",padding:"6px 10px"})}><span style={{fontWeight:typo===t.id?500:400}}>{t.label}</span><span style={{fontSize:9,color:"#7a6e62",marginLeft:6}}>{t.note}</span></button>;})}</div></div><div><label style={Lb}>ASPIRATIONAL POSITIONING</label><div style={{fontSize:9,color:"#7a6e62",marginBottom:4}}>Where should this project compete? Sets benchmark targets for all metrics.</div><div style={{display:"grid",gap:3}}>{ASPS.map(function(a){return <button key={a.id} onClick={function(){setAsp(a.id);}} style={Object.assign({},chip(aspiration===a.id),{textAlign:"left",padding:"6px 10px"})}><span style={{fontWeight:aspiration===a.id?500:400}}>{a.label}</span><span style={{fontSize:9,color:"#7a6e62",marginLeft:6}}>{a.ref}</span></button>;})}</div></div><div><label style={Lb}>TARGET GUEST GROUPS (select all that apply)</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{GUESTS.map(function(g){var on=gst.indexOf(g.id)>=0;return <button key={g.id} onClick={function(){togG(g.id);}} style={chip(on)}>{g.label}</button>;})}</div>{gst.length>0&&<div style={{fontSize:9,color:"#6a5e4e",marginTop:4,fontStyle:"italic"}}>{GUESTS.filter(function(g){return gst.indexOf(g.id)>=0;}).map(function(g){return g.note;}).join(" ")}</div>}</div></div>{navB(-1,1)}</div>;},
    /* 1: PROGRAM */
    function(){return <div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:16}}><h2 style={{fontSize:20,fontWeight:300}}>Program Areas</h2><div style={{fontSize:10,color:"#5a5248"}}>Guestroom area is auto-calculated from key mix. Enter zero for categories not applicable.</div></div>{progRow("PUBLIC AREAS / GUEST SERVICES","Arrival lobby, lounges, public WCs, kids areas, library, retail",pub,setPub)}{progRow("F&B","All restaurants, bars, kitchens, service areas",fnb,setFnb)}{progRow("WELLNESS (SPA + FITNESS)","Spa, treatment rooms, thermal circuit, gym, yoga studio",well,setWell)}{progRow("MEETINGS & EVENTS (MICE)","Ballroom, meeting rooms, pre-function, breakout",mice,setMice)}{progRow("BOH + ENGINEERING","Receiving, laundry, storage, staff, waste, plant, admin, security",boh,setBoh)}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}><div><label style={Lb}>SITE AREA (M2)</label><input style={I} type="number" placeholder="80,000" value={siteArea} onChange={function(e){setSiteArea(e.target.value);}}/></div><div><label style={Lb}>POOL / WATER (M2)</label><input style={I} type="number" placeholder="3,000" value={poolArea} onChange={function(e){setPoolArea(e.target.value);}}/></div></div>{C.totalFoot>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:12,textAlign:"center",padding:"10px 0",borderTop:"1px solid #e6e2dc"}}><div><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>TOTAL GFA</div><div style={{fontSize:14,color:"#1a1815",fontWeight:300}}>{C.gfaV.toFixed(0)}</div></div><div><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>FOOTPRINT</div><div style={{fontSize:14,color:"#1a1815",fontWeight:300}}>{C.totalFoot.toFixed(0)}</div></div><div><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>COVERAGE</div><div style={{fontSize:14,color:"#1a1815",fontWeight:300}}>{C.siteCov.toFixed(1)}%</div></div><div><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>OPEN AREA</div><div style={{fontSize:14,color:"#1a1815",fontWeight:300}}>{C.openExp.toFixed(0)}</div></div></div>}{navB(0,2)}</div>;},
    /* 2: KEYS */
    function(){return <div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:12}}><h2 style={{fontSize:20,fontWeight:300}}>Key Mix</h2></div><div style={{display:"flex",gap:4,padding:"0 0 6px",fontSize:8,color:"#7a6e62",letterSpacing:"0.08em"}}><span style={{flex:1}}>TYPE</span><span style={{width:50,textAlign:"center"}}>M2</span><span style={{width:40,textAlign:"center"}}>QTY</span><span style={{width:38,textAlign:"center"}}>LEVELS</span><span style={{width:16}}></span></div>{keys.map(function(kt,idx){return <div key={kt.id} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 5px",borderRadius:2,border:"1px solid #e2dfd8",marginBottom:3,background:parseInt(kt.count)>0?"#faf9f7":"#fff"}}><input style={Object.assign({},I,{flex:1,padding:"5px 6px",fontSize:11})} placeholder="Type" value={kt.label} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{label:e.target.value});setKeys(n);}}/><input style={Object.assign({},I,{width:50,textAlign:"center",padding:"5px"})} type="number" placeholder="m2" value={kt.size} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{size:e.target.value});setKeys(n);}}/><input style={Object.assign({},I,{width:40,textAlign:"center",padding:"5px"})} type="number" placeholder="qty" value={kt.count} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{count:e.target.value});setKeys(n);}}/><input style={Object.assign({},I,{width:38,textAlign:"center",padding:"5px"})} type="number" placeholder="lvl" value={kt.levels} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{levels:e.target.value});setKeys(n);}}/><button onClick={function(){setKeys(keys.filter(function(_,j){return j!==idx;}));}} style={{border:"none",background:"none",color:"#b0a494",cursor:"pointer",fontSize:13,width:16}}>x</button></div>;})}<button onClick={function(){setKeys(keys.concat([{id:"k"+Date.now(),label:"",size:"",count:"",levels:"1"}]));}} style={{width:"100%",marginTop:4,padding:"7px",border:"1px solid #e2dfd8",background:"#fff",color:"#6a5e4e",fontSize:9,letterSpacing:"0.12em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>+ ADD KEY TYPE</button><div style={{marginTop:6,textAlign:"center"}}><span style={{fontSize:18,color:"#1a1815",fontWeight:300}}>{tk}</span><span style={{fontSize:8,color:"#6a5e4e"}}> keys</span>{C.grGross>0&&<span style={{fontSize:8,color:"#7a6e62",marginLeft:10}}>GROSS: {C.grGross.toFixed(0)} m2 / FOOTPRINT: {C.grFoot.toFixed(0)} m2</span>}</div>{gst.length>0&&<div style={{marginTop:10,padding:"8px 10px",border:"1px solid #e6e2dc",borderRadius:2,fontSize:9,color:"#5a5248",lineHeight:1.6}}><span style={{fontSize:8,color:"#6a5e4e",letterSpacing:"0.08em"}}>GUEST-INFORMED KEY MIX</span><br/>{GUESTS.filter(function(g){return gst.indexOf(g.id)>=0;}).map(function(g){return g.label+": "+g.keyHint;}).join(" ")}</div>}{navB(1,3)}</div>;},
    /* 3: TOUCHPOINTS */
    function(){return <div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:12}}><h2 style={{fontSize:20,fontWeight:300}}>Touchpoints</h2></div>{Object.entries(CATS).map(function(entry){return <div key={entry[0]} style={{marginBottom:12}}><div style={{fontSize:9,letterSpacing:"0.12em",color:"#5a5248",marginBottom:3}}>{entry[1].toUpperCase()}</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{allTP.filter(function(t){return t.cat===entry[0];}).map(function(tp){var s=sTP.has(tp.id);return <button key={tp.id} onClick={function(){togTP(tp.id);}} style={{padding:"4px 8px",borderRadius:10,fontSize:10,cursor:"pointer",fontFamily:"inherit",border:"1px solid "+(s?"#8a7e6e":"#e2dfd8"),background:s?"#ede9e2":"#fff",color:s?"#1a1815":"#7a6e62"}}>{tp.label}</button>;})}</div></div>;})}<div style={{borderTop:"1px solid #e6e2dc",paddingTop:8,marginTop:4}}><div style={{display:"flex",gap:4}}><input style={Object.assign({},I,{flex:1,padding:"5px 7px",fontSize:10})} placeholder="Custom touchpoint..." value={ntl} onChange={function(e){setNtl(e.target.value);}}/><select style={Object.assign({},I,{width:90,padding:"5px",fontSize:9})} value={ntc} onChange={function(e){setNtc(e.target.value);}}>{CK.map(function(ck){return <option key={ck} value={ck}>{CATS[ck]}</option>;})}</select><button onClick={function(){if(!ntl.trim())return;var np={id:"c"+Date.now(),label:ntl.trim(),cat:ntc,w:1.1};setAllTP(allTP.concat([np]));setSTP(function(p){var n=new Set(p);n.add(np.id);return n;});setNtl("");}} style={{padding:"5px 10px",border:"1px solid #d6d2ca",background:"#fff",color:"#4a4238",fontSize:9,fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>ADD</button></div></div>{navB(2,4)}</div>;},
    /* 4: NARRATIVE */
    function(){return <div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:12}}><h2 style={{fontSize:20,fontWeight:300}}>Narrative</h2><div style={{fontSize:10,color:"#5a5248"}}>Be specific. Use materials, place names, techniques -- not adjectives.</div></div><div style={{display:"grid",gap:12}}><div><label style={Lb}>PURPOSE STATEMENT</label><textarea style={Object.assign({},I,{minHeight:56,resize:"vertical"})} placeholder="Why does this project exist?" value={pur} onChange={function(e){setPur(e.target.value);}}/></div><div><label style={Lb}>T-SHIRT SLOGAN</label><input style={I} placeholder="One sentence. If a guest wore it, what would it say?" value={slo} onChange={function(e){setSlo(e.target.value);}}/></div><div><label style={Lb}>DESIGN DRIVERS</label><textarea style={Object.assign({},I,{minHeight:56,resize:"vertical"})} placeholder="3-5 principles: 'Rammed earth walls referencing local vernacular...'" value={drv} onChange={function(e){setDrv(e.target.value);}}/></div><div><label style={Lb}>DESIGN HIGHLIGHTS</label><textarea style={Object.assign({},I,{minHeight:56,resize:"vertical"})} placeholder="Materials, spatial strategies, sensory elements..." value={dhl} onChange={function(e){setDhl(e.target.value);}}/></div></div>{C.nr.q>0&&<div style={{marginTop:12,padding:"10px 12px",border:"1px solid #e6e2dc",borderRadius:2,background:"#faf9f7"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:8,color:"#6a5e4e",letterSpacing:"0.08em"}}>QUALITY</span><div style={{flex:1,height:3,background:"#e6e2dc",borderRadius:2}}><div style={{height:"100%",width:C.nr.q+"%",background:C.nr.q>=60?"#6a7e5e":"#8a7e6e",borderRadius:2}}/></div><span style={{fontSize:14,color:"#1a1815",fontWeight:300}}>{C.nr.q}</span></div>{C.nr.sf.length>0&&<div style={{fontSize:8.5,color:"#5a6e4a",marginTop:4}}>Materials: {C.nr.sf.join(", ")}</div>}{C.nr.gf.length>0&&<div style={{fontSize:8.5,color:"#8a6050",marginTop:2}}>Generic: {C.nr.gf.join(", ")}</div>}{C.nr.th.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{C.nr.th.map(function(t,i){return <span key={i} style={{padding:"2px 7px",borderRadius:8,fontSize:9,border:"1px solid #d6d2ca",color:"#3a3428"}}>{t}</span>;})}</div>}</div>}{navB(3,5,"CALCULATE")}</div>;},
    /* 5: RESULTS */
    function(){
      var gI=C.guestIns;
      return <div style={{maxWidth:720,margin:"0 auto"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:8,letterSpacing:"0.35em",color:"#7a6e62"}}>EXPERIENCE DENSITY INDEX</div><h1 style={{fontSize:22,fontWeight:300,margin:"4px 0"}}>{pn||"Untitled"}</h1><div style={{fontSize:10,color:"#5a5248"}}>{(CLIMATES.find(function(c){return c.id===clim;})||{}).label||""} {(SETTINGS.find(function(c){return c.id===setting;})||{}).label||""} {(TYPOS.find(function(t){return t.id===typo;})||{}).label||""}{loc?" -- "+loc:""} -- {tk} Keys</div>{gst.length>0&&<div style={{fontSize:9,color:"#6a5e4e",marginTop:2}}>Target: {gst.map(function(gid){return(GUESTS.find(function(g){return g.id===gid;})||{}).label||"";}).join(", ")}</div>}</div>
        {/* Positioning */}
        <div style={Object.assign({},SB,{textAlign:"center"})}><div style={{fontSize:10,color:"#6a5e4e",letterSpacing:"0.12em"}}>CALCULATED POSITIONING</div><div style={{fontSize:28,color:"#1a1815",fontWeight:300,marginTop:2}}>{C.pos}</div>{aspD&&C.pos!==aspD.label&&<div style={{fontSize:10,color:"#8a6050",marginTop:4}}>Aspirational: {aspD.label}. Gaps identified below.</div>}{aspD&&C.pos===aspD.label&&<div style={{fontSize:10,color:"#5a6e4a",marginTop:4}}>Aligned with {aspD.label} aspiration.</div>}<div style={{fontSize:9,color:"#5a5248",fontStyle:"italic",marginTop:4}}>Reference: {C.posRef}</div></div>
        {/* Key Metrics */}
        <div style={SB}><div style={ST}>KEY METRICS</div><div style={IT}>Black marker = this project. Shaded zone = aspirational target range.{aspD?" Based on "+aspD.label+" benchmarks ("+aspD.ref+").":""}</div><MSl label="Spatial Generosity" value={C.spatialRaw} max={400} ranges={RNG.spatial} unit=" m2/key" target={aspD?aspD.spatial:null} note={C.spatialRaw>=300?"Iconic. Aman: 300-500 m2/key.":C.spatialRaw>=220?"Ultra-luxury. One&Only: 220-280 m2/key.":C.spatialRaw>=140?"Luxury. Four Seasons: 160-220 m2/key.":C.spatialRaw>=90?"Upper upscale. Edition: 100-140 m2/key.":"Below 90 m2/key."}/><MSl label="Site Coverage" value={C.siteCov} max={50} ranges={RNG.coverage} unit="%" target={aspD?aspD.coverage:null} note={C.siteCov<=15?"Exceptional. Amanoi: 8%.":C.siteCov<=25?"Ultra-luxury. Six Senses: 15-22%.":C.siteCov<=35?"Luxury. Four Seasons: 25-32%.":"Dense. Above 35%."}/><MSl label="Density" value={C.density} max={40} ranges={RNG.density} unit=" keys/ha" target={aspD?aspD.density:null} note={C.density<=5?"Sanctuary. Amangiri: ~2.":C.density<=10?"Exclusive. One&Only: 5-8.":C.density<=20?"Resort. Four Seasons: 10-18.":"Dense. Above 20."}/><MSl label="Pool Ratio" value={C.poolRatio} max={25} ranges={RNG.pool} unit=" m2/key" target={aspD?aspD.pool:null} note={C.poolRatio>=15?"Iconic. Amanzoe: 18+.":C.poolRatio>=10?"Generous. One&Only: 10-15.":C.poolRatio>=5?"Standard luxury. Four Seasons: 5-10.":"Minimal."}/><MSl label="Amenity Ratio" value={C.amPerKey} max={80} ranges={RNG.amenity} unit=" m2/key" target={aspD?aspD.amenity:null} note={C.amPerKey>=50?"Experience-dominant. One&Only scale.":C.amPerKey>=30?"Rich. Four Seasons: 30-50 m2/key.":C.amPerKey>=15?"Adequate. Upper upscale.":"Lean."}/><div style={{padding:"10px 12px",border:"1px solid #e6e2dc",borderRadius:2,marginTop:6}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"center"}}><div><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>OPEN EXPERIENCE</div><div style={{fontSize:15,color:"#1a1815",fontWeight:300}}>{C.openExp.toFixed(0)} m2</div></div><div><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>INDOOR/OUTDOOR</div><div style={{fontSize:15,color:"#1a1815",fontWeight:300}}>{C.ioRatio.toFixed(0)}% outdoor</div></div><div><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>TOUCHPOINTS</div><div style={{fontSize:15,color:"#1a1815",fontWeight:300}}>{sTP.size}</div></div></div></div></div>
        {/* Program Balance */}
        <div style={SB}><div style={ST}>PROGRAM BALANCE</div><div style={IT}>How area is distributed across program categories. Ratios per key reveal investment priorities and help identify where the built program supports or contradicts the experiential ambitions.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{[["F&B",C.fnbPerKey,aspD?aspD.fnbK:null,"m2/key"],["Wellness",C.wellPerKey,aspD?aspD.wellK:null,"m2/key"],["Public",C.pubPerKey,aspD?aspD.pubK:null,"m2/key"]].map(function(r){var inRange=r[2]&&r[1]>=r[2][0]&&r[1]<=r[2][1];return <div key={r[0]} style={{textAlign:"center",padding:"8px 6px",border:"1px solid #e6e2dc",borderRadius:2}}><div style={{fontSize:7,color:"#6a5e4e",letterSpacing:"0.08em"}}>{r[0].toUpperCase()}</div><div style={{fontSize:16,color:"#1a1815",fontWeight:300}}>{r[1].toFixed(1)}<span style={{fontSize:9,color:"#7a6e62"}}> {r[3]}</span></div>{r[2]&&<div style={{fontSize:8,color:inRange?"#5a6e4a":"#8a6050"}}>Target: {r[2][0]}-{r[2][1]}</div>}</div>;})}</div>{C.micePerKey>0&&<div style={{marginTop:8,fontSize:10,color:"#5a5248"}}>MICE: {C.micePerKey.toFixed(1)} m2/key. {C.micePerKey>=3?"Significant events capacity. Consider acoustic isolation from guest areas.":"Modest events space."}</div>}{C.bohPct>0&&<div style={{fontSize:10,color:aspD&&C.bohPct<aspD.bohPct[0]?"#8a6050":"#5a5248",marginTop:4}}>BOH: {C.bohPct.toFixed(1)}% of total built area.{aspD?" "+aspD.label+" benchmark: "+aspD.bohPct[0]+"-"+aspD.bohPct[1]+"%.":""}{aspD&&C.bohPct<aspD.bohPct[0]?" Under-serviced -- risk of operational bottlenecks.":""}</div>}</div>
        {/* Design DNA */}
        <div style={SB}><div style={ST}>DESIGN DNA</div><div style={IT}>Five hard design decisions. Dashed lines show archetype profiles. A peaked profile indicates specialization -- flat profiles indicate a project that hasn't committed to a spatial identity.</div><Hex id="dna" metrics={C.dnaM} ghosts={AK.map(function(kk){return{values:ARCH[kk].dna,hl:kk===selA};})} labels={["SPATIAL\nGENEROSITY","NARRATIVE\nDEPTH","INDOOR / OUTDOOR\nBALANCE","EXPERIENCE\nRICHNESS","LANDSCAPE\nIMMERSION"]} size={420}/><div style={{textAlign:"center",fontSize:9,color:"#6a5e4e",marginTop:2}}>Solid -- project / Dashed -- {(ARCH[selA]||{}).name}</div><div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",marginTop:8}}>{AK.map(function(kk){return <button key={kk} onClick={function(){setSelA(kk);}} style={{padding:"3px 8px",borderRadius:10,fontSize:9,cursor:"pointer",fontFamily:"inherit",border:"1px solid "+(selA===kk?"#8a7e6e":"#e2dfd8"),background:selA===kk?"#ede9e2":"#fff",color:selA===kk?"#1a1815":"#6a5e4e"}}>{ARCH[kk].name}</button>;})}</div></div>
        {/* Archetype */}
        <div style={SB}><div style={ST}>EXPERIENCE ARCHETYPE</div><div style={IT}>Determined by intersecting design metrics and narrative keywords.</div><div style={{fontSize:17,color:"#1a1815",fontWeight:300}}>{arch.name}</div><div style={{fontSize:11,color:"#3a3428",lineHeight:1.6,marginTop:4}}>{arch.long}</div><div style={{fontSize:10,color:"#5a5248",fontStyle:"italic",marginTop:4}}>Matched: {C.archR}</div><div style={{fontSize:10,color:"#5a5248",marginTop:2}}>Experience emphasis: {C.expE}</div></div>
        {/* Value Prop */}
        <div style={Object.assign({},SB,{borderLeft:"3px solid #8a7e6e"})}><div style={ST}>VALUE PROPOSITION</div><div style={{fontSize:12.5,color:"#1a1815",lineHeight:1.65,fontStyle:"italic"}}>{C.vp}</div>{slo&&<div style={{fontSize:11,color:"#5a5248",marginTop:6}}>"{slo}"</div>}</div>
        {/* Experience Profile */}
        <div style={SB}><div style={ST}>EXPERIENCE PROFILE</div><div style={IT}>Six categories of experiential programming. Distinctive projects show clear peaks. Even distribution suggests the project hasn't committed to an experiential identity.</div><Hex id="exp" metrics={C.expM} ghosts={null} labels={["FIRST\nIMPRESSION","GASTRONOMY","WELLNESS","ACTIVE\nLEISURE","OUTDOOR\nIMMERSION","CULTURAL\n& SOCIAL"]} size={400}/><div style={{textAlign:"center",fontSize:9,color:"#6a5e4e",marginTop:2}}>{sTP.size} touchpoints -- weighted coverage per category</div></div>
        {/* Guest Alignment */}
        {gI.length>0&&<div style={SB}><div style={ST}>GUEST ALIGNMENT</div><div style={IT}>Cross-referencing target guest profiles against key mix, program areas, touchpoints, typology, and narrative. Each finding identifies a specific gap between who the project is designed for and what it currently delivers.</div>{(function(){var byGroup={};gI.forEach(function(gi){if(!byGroup[gi.group])byGroup[gi.group]=[];byGroup[gi.group].push(gi);});return Object.entries(byGroup).map(function(entry){return <div key={entry[0]} style={{marginBottom:10}}><div style={{fontSize:11,color:"#1a1815",fontWeight:500,marginBottom:4}}>{entry[0]}</div>{entry[1].map(function(gi,i){var icons={touchpoint:"TP",area:"AREA",typology:"TYPO",keymix:"KEYS",density:"DENSITY",narrative:"NARR"};return <div key={i} style={{padding:"8px 10px",marginBottom:4,borderLeft:"2px solid "+(gi.type==="keymix"||gi.type==="density"?"#8a6050":"#8a7e6e"),fontSize:10.5,color:"#2a2420",lineHeight:1.55}}><span style={{fontSize:8,color:"#7a6e62",letterSpacing:"0.06em",marginRight:4}}>{icons[gi.type]||"--"}</span>{gi.msg}</div>;})}</div>;});})()}</div>}
        {/* Narrative */}
        {C.nr.th.length>0&&<div style={SB}><div style={ST}>NARRATIVE THEMES</div><div style={IT}>Quality: {C.nr.q}/100.{C.nr.gf.length>0?" Generic: "+C.nr.gf.join(", ")+".":""}{C.nr.sf.length>0?" Materials: "+C.nr.sf.join(", ")+".":""}</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{C.nr.th.map(function(t,i){return <span key={i} style={{padding:"4px 10px",borderRadius:10,fontSize:10.5,border:"1px solid #d6d2ca",color:"#3a3428"}}>{t}</span>;})}</div></div>}
        {/* Touchpoints */}
        <div style={SB}><div style={ST}>TOUCHPOINT MAP</div>{Object.entries(CATS).map(function(entry){var sel=allTP.filter(function(t){return t.cat===entry[0]&&sTP.has(t.id);});return sel.length>0?<div key={entry[0]} style={{marginBottom:8}}><div style={{fontSize:11,color:"#1a1815",fontWeight:500}}>{entry[1]}</div><div style={{fontSize:10,color:"#5a5248",paddingLeft:8,borderLeft:"1px solid #e6e2dc",marginTop:2}}>{sel.map(function(t){return t.label;}).join(" / ")}</div></div>:null;})}</div>
        {/* Insights */}
        {C.ins.length>0&&<div style={SB}><div style={ST}>INSIGHTS & RECOMMENDATIONS</div><div style={IT}>Grounded in brand benchmarks{aspD?" and "+aspD.label+" targets":""}, cross-referencing spatial data, touchpoints, narrative quality, program distribution, guest profiles, typology, and climate.</div>{C.ins.map(function(ins,i){var isGap=ins.indexOf("POSITIONING GAP")===0||ins.indexOf("PROGRAM GAP")===0;var isWarn=ins.indexOf("WARNING")===0;var isMis=ins.indexOf("MISMATCH")===0;var isOps=ins.indexOf("OPERATIONS")===0;var isTypo=ins.indexOf("TYPOLOGY")===0;var isClim=ins.indexOf("CLIMATE")===0;return <div key={i} style={{padding:"10px 12px",marginBottom:5,borderLeft:"2px solid "+(isGap?"#8a6050":isWarn||isMis?"#8a7050":isOps||isTypo||isClim?"#6a7e8e":"#8a7e6e"),fontSize:11,color:"#2a2420",lineHeight:1.6,background:(isGap?"rgba(138,96,80,0.04)":isWarn||isMis?"rgba(138,112,80,0.04)":"transparent")}}>{ins}</div>;})}</div>}
        {/* Highlights */}
        <div style={Object.assign({},SB,{background:"#faf9f7"})}><div style={ST}>PROJECT HIGHLIGHTS</div>{C.hl.map(function(h,i){return <div key={i} style={{padding:"10px 12px",marginBottom:5,borderLeft:"2px solid #1a1815",fontSize:11.5,color:"#1a1815",lineHeight:1.6,fontStyle:"italic"}}>{h}</div>;})}</div>
        {/* Nav */}
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:24,paddingTop:12,borderTop:"1px solid #e2dfd8",flexWrap:"wrap"}}>{[["PROJECT",0],["PROGRAM",1],["KEYS",2],["TOUCHPOINTS",3],["NARRATIVE",4]].map(function(arr){return <button key={arr[1]} style={{padding:"6px 12px",border:"1px solid #d6d2ca",background:"#fff",color:"#5a5248",fontSize:9,letterSpacing:"0.1em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}} onClick={function(){go(arr[1]);}}>{arr[0]}</button>;})}<button style={{padding:"6px 16px",border:"1px solid #d6d2ca",background:"#ede9e2",color:"#3a3428",fontSize:9,letterSpacing:"0.1em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}} onClick={function(){window.print();}}>PRINT / PDF</button></div>
      </div>;}
  ];
  return(<div style={{minHeight:"100vh",background:"#fff",color:"#1a1815",fontFamily:"'Cormorant Garamond',Georgia,serif"}}><style>{'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap");*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:rgba(0,0,0,0.25)}input:focus,textarea:focus{border-color:#8a7e6e!important;outline:none}select:focus{border-color:#8a7e6e!important;outline:none}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}textarea{font-family:"Cormorant Garamond",Georgia,serif}@media print{.no-print{display:none!important}}'}</style><div className="no-print" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:1.5,background:"#e2dfd8"}}><div style={{height:"100%",width:((step+1)/6)*100+"%",background:"#8a7e6e",transition:"width 0.5s"}}/></div><div style={{padding:"20px 22px 44px",maxWidth:800,margin:"0 auto",opacity:fade?1:0,transform:fade?"translateY(0)":"translateY(8px)",transition:"opacity 0.15s,transform 0.15s"}}>{steps[step]()}</div></div>);
}
