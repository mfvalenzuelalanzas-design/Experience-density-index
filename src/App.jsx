import { useState, useMemo } from "react";

var ARCH={sanctuary:{name:"The Sanctuary",dna:[95,80,88,30,92],kw:["silence","privacy","retreat","minimal","solitude","nature","escape","sanctuary","contemplat","stillness","vast","seclu"]},theatre:{name:"The Grand Theatre",dna:[60,65,50,95,45],kw:["spectacle","dramatic","social","destination","theatrical","stage","energy","vibrant","celebrat","grand","choreograph"]},village:{name:"The Cultural Village",dna:[55,95,60,65,70],kw:["local","authentic","craft","heritage","place","tradition","artisan","community","indigenous","vernacular","rooted","cultural"]},oasis:{name:"The Wellness Oasis",dna:[70,75,85,55,80],kw:["heal","wellness","therapeu","nature","biophilic","water","calm","restor","mindful","holistic","spa","meditat"]},estate:{name:"The Branded Estate",dna:[60,60,55,72,50],kw:["residen","estate","community","owner","home","belonging","legacy","club","family","investment","permanent"]},club:{name:"The Social Club",dna:[45,40,42,90,35],kw:["social","pool","beach","club","scene","energy","music","night","vibe","party","lounge","curated"]}};
var AK=Object.keys(ARCH);
var CLIMATES=[{id:"tropical",l:"Tropical"},{id:"desert",l:"Desert"},{id:"coastal",l:"Coastal"},{id:"mountain",l:"Mountain"},{id:"temperate",l:"Temperate"}];
var SETTINGS=[{id:"urban",l:"Urban"},{id:"rural",l:"Rural"},{id:"periurban",l:"Periurban"}];
var TYPOS=[{id:"dispersed",l:"Dispersed / Pavilions",n:"Low-rise across landscape"},{id:"village_cl",l:"Village Cluster",n:"Grouped around courtyards"},{id:"consolidated",l:"Consolidated Building",n:"Single mid-rise"},{id:"tower",l:"Tower / High-Rise",n:"Vertical, minimal footprint"},{id:"hybrid",l:"Hybrid",n:"Mixed typologies"}];
var ASPS=[
  {id:"ultra",l:"Ultra-Luxury",spatial:[220,400],density:[1,8],coverage:[5,25],pool:[10,25],fnbK:[10,20],wellK:[8,15],pubK:[12,25],bohPct:[15,22],green:[60,85],ref:"Aman, One&Only, Six Senses, Cheval Blanc"},
  {id:"luxury",l:"Luxury",spatial:[140,220],density:[8,15],coverage:[20,35],pool:[5,10],fnbK:[6,12],wellK:[4,8],pubK:[8,15],bohPct:[12,18],green:[45,65],ref:"Four Seasons, Rosewood, Mandarin Oriental"},
  {id:"upper",l:"Upper Upscale",spatial:[90,140],density:[15,25],coverage:[30,45],pool:[3,8],fnbK:[4,8],wellK:[3,5],pubK:[5,10],bohPct:[10,15],green:[30,50],ref:"Edition, Nobu, W Hotels, Fasano"},
  {id:"lifestyle",l:"Lifestyle",spatial:[60,100],density:[20,35],coverage:[30,55],pool:[2,5],fnbK:[3,6],wellK:[2,4],pubK:[4,8],bohPct:[8,14],green:[20,40],ref:"1Hotels, Ace, Soho House"},
];
var GUESTS=[
  {id:"couples",l:"Couples",kh:"Suites/villas with private terraces and plunge pools.",tpN:["priv_din","spa","inf_pool","wine","mirador","out_spa"]},
  {id:"families",l:"Families",kh:"2BR units, interconnecting rooms, ground-floor.",tpN:["kids","main_pool","casual","water_sp","trails","cycling"]},
  {id:"multigen",l:"Multi-Generational",kh:"Unit variety. Estate villas 3+ bedrooms.",tpN:["kids","priv_din","main_pool","trails","casual","library"]},
  {id:"hnwi",l:"HNWI / UHNWI",kh:"300+ m2 villas. Butler. Extreme privacy.",tpN:["priv_din","spa","water_arr","ritual","wine","sig_scent"]},
  {id:"wellness_g",l:"Wellness Seekers",kh:"Spa-grade amenities. Quiet orientation.",tpN:["spa","yoga","thermal","plunge","out_spa","mindful"]},
  {id:"adventure",l:"Adventure Seekers",kh:"Flexible rooms. Gear storage.",tpN:["water_sp","adventure","trails","nat_feat","cycling","fire"]},
  {id:"cultural",l:"Cultural Explorers",kh:"Local identity. Artisan details.",tpN:["cook","atelier","art","heritage","spirits","music"]},
  {id:"social",l:"Social / Scene-Driven",kh:"Compact rooms. Big public spaces.",tpN:["bar","beach","main_pool","music","pool_bar","inf_pool"]},
];
var DTP=[
  {id:"lobby",l:"Arrival Lobby",c:"welcome",w:1.0},{id:"porte",l:"Porte-Cochere",c:"welcome",w:0.8},{id:"garden_arr",l:"Garden Arrival Path",c:"welcome",w:1.2},{id:"water_arr",l:"Water Arrival",c:"welcome",w:1.5},{id:"ritual",l:"Welcome Ritual",c:"welcome",w:1.3},{id:"concierge",l:"Concierge Pavilion",c:"welcome",w:0.9},{id:"scenic_app",l:"Scenic Approach",c:"welcome",w:1.1},{id:"sig_scent",l:"Signature Scent / Sound",c:"welcome",w:1.0},
  {id:"sig_rest",l:"Signature Restaurant",c:"gastronomy",w:1.4},{id:"casual",l:"All-Day Dining",c:"gastronomy",w:0.8},{id:"bar",l:"Bar / Lounge",c:"gastronomy",w:1.0},{id:"pool_bar",l:"Pool / Beach Bar",c:"gastronomy",w:0.9},{id:"priv_din",l:"Private Dining",c:"gastronomy",w:1.3},{id:"wine",l:"Wine Cellar / Tasting Room",c:"gastronomy",w:1.2},{id:"farm",l:"Farm-to-Table Experience",c:"gastronomy",w:1.4},{id:"rooftop",l:"Rooftop Dining",c:"gastronomy",w:1.1},
  {id:"spa",l:"Spa & Treatment Center",c:"wellness",w:1.3},{id:"gym",l:"Fitness Center",c:"wellness",w:0.6},{id:"yoga",l:"Yoga / Movement Studio",c:"wellness",w:1.1},{id:"thermal",l:"Thermal Circuit / Hammam",c:"wellness",w:1.4},{id:"plunge",l:"Hydrotherapy / Plunge Pools",c:"wellness",w:1.2},{id:"out_spa",l:"Outdoor Treatment Pavilions",c:"wellness",w:1.3},{id:"recovery",l:"Recovery / Biohacking Lab",c:"wellness",w:1.1},{id:"mindful",l:"Meditation / Mindfulness Garden",c:"wellness",w:1.0},
  {id:"main_pool",l:"Main Swimming Pool",c:"active",w:0.8},{id:"inf_pool",l:"Adults-Only / Infinity Pool",c:"active",w:1.1},{id:"beach",l:"Beach Club",c:"active",w:1.3},{id:"kids",l:"Kids Club / Family Zone",c:"active",w:0.7},{id:"tennis",l:"Tennis / Padel Courts",c:"active",w:0.7},{id:"water_sp",l:"Water Sports Center",c:"active",w:1.0},{id:"adventure",l:"Adventure / Excursion Hub",c:"active",w:1.1},{id:"cycling",l:"Cycling / E-Bike Station",c:"active",w:0.8},
  {id:"trails",l:"Botanical Trails / Gardens",c:"outdoor",w:1.2},{id:"mirador",l:"Mirador / Scenic Viewpoint",c:"outdoor",w:1.3},{id:"fire",l:"Fire Pit / Outdoor Gathering",c:"outdoor",w:1.1},{id:"nat_feat",l:"Natural Feature (cenote, cliff)",c:"outdoor",w:1.6},{id:"org_farm",l:"Organic Farm / Kitchen Garden",c:"outdoor",w:1.2},{id:"obs",l:"Observatory / Stargazing Deck",c:"outdoor",w:1.4},{id:"treehouse",l:"Treehouse / Canopy Experience",c:"outdoor",w:1.3},{id:"labyrinth",l:"Labyrinth / Sensory Walk",c:"outdoor",w:1.0},
  {id:"art",l:"Art Gallery / Exhibition Space",c:"cultural",w:1.3},{id:"library",l:"Library / Reading Room",c:"cultural",w:1.0},{id:"cook",l:"Cooking School / Workshop",c:"cultural",w:1.2},{id:"atelier",l:"Artisan Atelier / Craft Studio",c:"cultural",w:1.3},{id:"spirits",l:"Spirits Room / Mixology Lab",c:"cultural",w:1.1},{id:"music",l:"Music / Performance Venue",c:"cultural",w:1.2},{id:"cinema",l:"Cinema / Screening Room",c:"cultural",w:0.9},{id:"heritage",l:"Heritage / Cultural Center",c:"cultural",w:1.3},
];
var CATS={welcome:"First Impression",gastronomy:"Gastronomy",wellness:"Wellness",active:"Active Leisure",outdoor:"Outdoor Immersion",cultural:"Cultural & Social"};
var CK=Object.keys(CATS);
var GENERIC=["luxury","world-class","unique","exceptional","premier","bespoke","curated","elevated","unparalleled","exclusive","stunning","breathtaking","extraordinary","magnificent","state-of-the-art"];

function localNarr(pur,slo,drv,hl){
  var all=(pur+" "+slo+" "+drv+" "+hl).toLowerCase();
  var sc={};AK.forEach(function(k){var s=0;ARCH[k].kw.forEach(function(w){if(all.indexOf(w)>=0)s+=10;});sc[k]=Math.min(s,100);});
  var th=[];
  if(all.match(/nature|landscape|garden|jungle|forest|ocean|mountain|biophilic/))th.push("Nature Integration");
  if(all.match(/local|craft|artisan|heritage|tradition|indigenous|vernacular/))th.push("Cultural Rootedness");
  if(all.match(/wellness|heal|spa|therap|mindful|restor|holistic/))th.push("Wellness Philosophy");
  if(all.match(/sustain|eco|green|conserv|regenerat|responsible/))th.push("Sustainability");
  if(all.match(/privacy|seclu|intimate|exclusive|retreat|solitude/))th.push("Privacy Architecture");
  if(all.match(/culinar|gastronom|food|farm|kitchen|chef|dining/))th.push("Culinary Identity");
  if(all.match(/art|museum|gallery|sculpt|install|creative/))th.push("Art Integration");
  if(all.match(/water|pool|ocean|river|lake|spring|hydro/))th.push("Water as Design");
  var gf=GENERIC.filter(function(w){return all.indexOf(w)>=0;});
  var sf=[];(all.match(/\b(stone|wood|concrete|steel|glass|bamboo|rattan|teak|limestone|terrazzo|brass|copper|ceramic|clay|silk|linen|marble|basalt|coral|thatch|adobe|rammed earth|corten|cedar|oak|walnut|mahogany|laterite|sandstone|volcanic)\b/g)||[]).forEach(function(w){if(sf.indexOf(w)<0)sf.push(w);});
  var q=0;if(pur.length>15)q+=22;if(pur.length>60)q+=8;if(slo.length>5)q+=8;if(drv.length>15)q+=22;if(drv.length>80)q+=8;if(hl.length>10)q+=16;if(hl.length>60)q+=6;q+=Math.min(sf.length*4,16);q-=gf.length*3;q=Math.max(0,Math.min(100,q));
  return {sc:sc,th:th,q:q,gf:gf,sf:sf};
}

/* ═══ PROGRAMMATIC ANALYSIS ENGINE ═══ */
function generateAnalysis(d){
  var C=d.C,aspD=C.aspD,aspL=aspD?aspD.l:"Not set",pos=C.pos;
  var inR=function(v,rng){return rng&&v>=rng[0]&&v<=rng[1];};
  var abv=function(v,rng){return rng&&v>rng[1];};
  var blw=function(v,rng){return rng&&v<rng[0];};

  /* POSITIONING DRIVERS */
  var drivers=[];
  if(C.spatialRaw>=220)drivers.push("Spatial generosity at "+C.spatialRaw.toFixed(0)+" m2/key places this firmly in ultra-luxury territory (220-400 m2/key standard).");
  else if(C.spatialRaw>=140)drivers.push("Spatial ratio of "+C.spatialRaw.toFixed(0)+" m2/key aligns with luxury standards (140-220 m2/key).");
  else if(C.spatialRaw>=90)drivers.push("Spatial ratio of "+C.spatialRaw.toFixed(0)+" m2/key reads upper upscale (90-140 m2/key standard).");
  else drivers.push("Spatial ratio of "+C.spatialRaw.toFixed(0)+" m2/key is below luxury thresholds (140+ m2/key).");

  if(C.density>0&&C.density<=8)drivers.push("Density of "+C.density.toFixed(1)+" keys/ha supports ultra-luxury privacy (1-8 keys/ha standard).");
  else if(C.density<=15)drivers.push("Density of "+C.density.toFixed(1)+" keys/ha is within luxury range (8-15 keys/ha).");
  else drivers.push("Density of "+C.density.toFixed(1)+" keys/ha exceeds luxury thresholds — consider whether site programming compensates.");

  if(C.siteCov>0&&C.siteCov<=25)drivers.push("Site coverage of "+C.siteCov.toFixed(1)+"% allows generous landscape integration (ultra-luxury: 5-25%).");
  else if(C.siteCov<=35)drivers.push("Coverage of "+C.siteCov.toFixed(1)+"% fits luxury parameters (20-35%).");
  else drivers.push("Coverage at "+C.siteCov.toFixed(1)+"% is dense — landscape immersion will be limited.");

  drivers.push("Touchpoint count of "+d.sTP.size+" "+(d.sTP.size>=16?"supports rich experiential programming (16+ for ultra-luxury).":d.sTP.size>=12?"meets luxury expectations (12-20).":"is below luxury thresholds — consider expanding experiential offerings."));
  drivers.push("Narrative quality scores "+C.nr.q+"/100"+(C.nr.q>=55?" — strong specificity and design intent.":" — could benefit from more material specificity and place-based language."));
  var pdText=drivers.join(" ");

  /* ARCHETYPE */
  var bA="sanctuary",bAS=-Infinity;
  Object.entries(ARCH).forEach(function(e){var md=e[1].dna.reduce(function(s,v,i){return s+Math.pow(v-C.dnaM[i],2);},0);var ms=100-Math.sqrt(md)/2;var ns=C.nr.sc[e[0]]||0;var cs=ms*0.55+ns*0.45;if(cs>bAS){bAS=cs;bA=e[0];}});
  var archName=ARCH[bA].name;
  var archText="The project's design decisions align most closely with "+archName+" archetype. ";
  if(bA==="sanctuary")archText+="At "+C.spatialRaw.toFixed(0)+" m2/key with "+C.density.toFixed(1)+" keys/ha density and "+C.greenPct.toFixed(0)+"% green coverage, the spatial signature emphasizes privacy and landscape immersion over programmatic density.";
  else if(bA==="village")archText+="The narrative emphasis on cultural rootedness, combined with "+d.sTP.size+" touchpoints across "+CK.filter(function(ck){return C.tpScores[ck]>30;}).length+" active categories, suggests a place-driven identity where local context shapes the guest experience.";
  else if(bA==="oasis")archText+="Wellness programming at "+C.wellPerKey.toFixed(1)+" m2/key"+(aspD&&aspD.wellK?" (target: "+aspD.wellK[0]+"-"+aspD.wellK[1]+")":" ")+"combined with "+C.ioRatio.toFixed(0)+"% outdoor ratio creates a restorative spatial framework.";
  else if(bA==="theatre")archText+="High experiential richness with "+d.sTP.size+" touchpoints and strong gastronomy/social programming suggests a destination-driven model where the property itself is the primary attraction.";
  else if(bA==="estate")archText+="The key mix and spatial ratios suggest a residential or community-oriented model where belonging and return visitation drive the experience.";
  else archText+="Strong social and active programming with "+C.pubPerKey.toFixed(1)+" m2/key public space suggests an energy-driven model where communal experiences define the brand.";

  /* POSITIONING */
  var posText="At "+C.spatialRaw.toFixed(0)+" m2/key, "+C.density.toFixed(1)+" keys/ha, and "+C.siteCov.toFixed(1)+"% coverage, this project positions as "+pos+". ";
  if(C.nr.th.length>0)posText+="The narrative brings "+C.nr.th.join(", ").toLowerCase()+" as thematic anchors";
  if(C.nr.sf.length>0)posText+=", grounded in material choices ("+C.nr.sf.join(", ")+")";
  posText+=". ";
  if(aspD&&pos!==aspL)posText+="To reach "+aspL+" positioning, the primary gaps are in "+(aspD.spatial&&C.spatialRaw<aspD.spatial[0]?"spatial generosity":"")+(aspD.density&&C.density>aspD.density[1]?", density control":"")+(aspD.coverage&&C.siteCov>aspD.coverage[1]?", site coverage":"")+(d.sTP.size<(aspD===ASPS[0]?16:12)?", touchpoint depth":"")+".";

  /* PRECEDENTS */
  var prec=[];
  var clim=d.clim,sett=d.setting,typo=d.typo;
  if(clim==="tropical"&&typo==="dispersed")prec.push("Comparable precedent in tropical dispersed typology — ultra-luxury tier operates at 220-400 m2/key with extensive landscape integration and pavilion-based architecture.");
  if(clim==="desert")prec.push("Desert climate precedents emphasize thermal comfort strategies, courtyard planning, and compressed outdoor programming during extreme seasons — indoor/outdoor ratio typically 50-65%.");
  if(clim==="coastal"&&(typo==="dispersed"||typo==="village_cl"))prec.push("Coastal dispersed resorts at this tier typically achieve 5-15% coverage with strong water-arrival sequences and shoreline programming.");
  if(clim==="mountain")prec.push("Mountain setting precedents leverage elevation, view corridors, and seasonal programming — observatory and trail touchpoints carry high experiential weight.");
  if(bA==="sanctuary")prec.push("Sanctuary-archetype properties at "+pos+" tier typically operate at "+C.density.toFixed(1)+" keys/ha with minimal shared programming and maximum spatial generosity per key.");
  if(bA==="oasis")prec.push("Wellness-forward properties benchmark at 8-15 m2/key wellness allocation with thermal circuits, outdoor treatments, and dedicated movement spaces as minimum program.");
  if(bA==="village")prec.push("Culture-driven resorts invest 15-25% of amenity area in cultural programming (ateliers, workshops, heritage centers) — this project allocates cultural touchpoints across "+CK.filter(function(ck){return ck==="cultural"&&C.tpScores[ck]>0;}).length+" active sub-programs.");
  if(d.tk>=60)prec.push("At "+d.tk+" keys, comparable properties balance scale with intimacy through clustered planning and sub-community design — each cluster typically serves 12-20 keys with dedicated amenity nodes.");
  if(prec.length<3)prec.push("Properties at "+pos+" tier with "+typo+" typology in "+clim+" climates typically operate with "+C.density.toFixed(1)+" keys/ha density and "+d.sTP.size+"+ curated touchpoints.");

  /* VALUE PROP */
  var vpText=(d.pur&&d.pur.length>10?d.pur.substring(0,120)+(d.pur.length>120?"...":""):"This project")+" — positioned as a "+d.tk+"-key "+pos+" "+(typo?TYPOS.find(function(t){return t.id===typo;}).l.toLowerCase():"")+" development";
  vpText+=" with "+C.spatialRaw.toFixed(0)+" m2/key spatial generosity and "+C.greenPct.toFixed(0)+"% green coverage. ";
  vpText+="The experience architecture delivers "+d.sTP.size+" curated touchpoints across "+CK.filter(function(ck){return C.tpScores[ck]>20;}).length+" active categories, ";
  vpText+="supported by "+C.fnbPerKey.toFixed(1)+" m2/key F&B, "+C.wellPerKey.toFixed(1)+" m2/key wellness, and "+C.pubPerKey.toFixed(1)+" m2/key public program.";

  /* GUEST FIT */
  var gfParts=[];
  d.gst.forEach(function(gid){
    var g=GUESTS.find(function(gg){return gg.id===gid;});if(!g)return;
    var met=0,miss=[];
    g.tpN.forEach(function(tid){if(d.sTP.has(tid))met++;else{var tp=d.allTP.find(function(t){return t.id===tid;});if(tp)miss.push(tp.l);}});
    var ratio=g.tpN.length>0?met/g.tpN.length:0;
    var txt=g.l+": "+Math.round(ratio*100)+"% touchpoint alignment ("+met+"/"+g.tpN.length+" expected touchpoints present).";
    if(miss.length>0)txt+=" Missing: "+miss.slice(0,3).join(", ")+".";
    if(gid==="hnwi"&&C.spatialRaw<220)txt+=" Spatial ratio of "+C.spatialRaw.toFixed(0)+" m2/key may underserve UHNWI expectations (220+ m2/key typical).";
    if(gid==="families"&&!d.sTP.has("kids"))txt+=" Consider dedicated kids programming to support family segments.";
    if(gid==="wellness_g"&&C.wellPerKey<6)txt+=" Wellness allocation at "+C.wellPerKey.toFixed(1)+" m2/key is below the 8-15 m2/key standard for wellness-positioned properties.";
    if(gid==="social"&&C.pubPerKey<8)txt+=" Public area ratio of "+C.pubPerKey.toFixed(1)+" m2/key may limit social programming capacity.";
    gfParts.push(txt);
  });
  var gfText=gfParts.join(" ");if(!gfText)gfText="No target guest groups selected. Guest alignment analysis requires guest group selection.";

  /* PROGRAM CRITIQUE */
  var pcParts=[];
  if(aspD){
    var checks=[["F&B",C.fnbPerKey,aspD.fnbK,"m2/key"],["Wellness",C.wellPerKey,aspD.wellK,"m2/key"],["Public",C.pubPerKey,aspD.pubK,"m2/key"],["BOH",C.bohPct,aspD.bohPct,"%"],["Pool",C.poolRatio,aspD.pool,"m2/key"]];
    checks.forEach(function(ch){
      if(inR(ch[1],ch[2]))pcParts.push(ch[0]+" at "+ch[1].toFixed(1)+ch[3]+" aligns with "+aspL+" standards ("+ch[2][0]+"-"+ch[2][1]+ch[3]+").");
      else if(blw(ch[1],ch[2]))pcParts.push(ch[0]+" at "+ch[1].toFixed(1)+ch[3]+" falls below "+aspL+" range ("+ch[2][0]+"-"+ch[2][1]+ch[3]+"). Consider increasing allocation to support experiential ambitions.");
      else if(abv(ch[1],ch[2]))pcParts.push(ch[0]+" at "+ch[1].toFixed(1)+ch[3]+" exceeds "+aspL+" benchmarks ("+ch[2][0]+"-"+ch[2][1]+ch[3]+") — verify this investment is justified by the experience program.");
    });
  }
  var grPct=C.gfaV>0?(C.grGross/C.gfaV)*100:0;
  pcParts.push("Guestroom allocation at "+grPct.toFixed(0)+"% of GFA"+(grPct<=55?" indicates strong amenity investment — typical of properties that prioritize experiential over room revenue.":grPct<=65?" is balanced between accommodation and amenity.":". Above 65% suggests room-revenue dependency — consider reallocating toward experiential program."));
  var pcText=pcParts.join(" ");

  /* NARRATIVE QUALITY */
  var nqParts=[];
  if(C.nr.q>=70)nqParts.push("Narrative scores "+C.nr.q+"/100 — strong specificity with clear design intent.");
  else if(C.nr.q>=45)nqParts.push("Narrative scores "+C.nr.q+"/100 — adequate but could deepen its specificity.");
  else nqParts.push("Narrative scores "+C.nr.q+"/100 — lacks the material and place-based specificity expected at "+pos+" tier.");
  if(C.nr.sf.length>0)nqParts.push("Material references ("+C.nr.sf.join(", ")+") ground the design in tangible choices.");
  else nqParts.push("No specific materials referenced — consider naming materials, techniques, or local elements that anchor the design to place.");
  if(C.nr.gf.length>0)nqParts.push("Generic terms detected ("+C.nr.gf.join(", ")+") — replace with specific, defensible language.");
  if(C.nr.th.length>0)nqParts.push("Thematic signals: "+C.nr.th.join(", ")+".");
  var nqText=nqParts.join(" ");

  /* CONTRADICTIONS */
  var contras=[];
  if(aspD&&pos!==aspL)contras.push("Aspirational positioning is "+aspL+" but calculated metrics place project at "+pos+". Key gaps: spatial ratio "+C.spatialRaw.toFixed(0)+" m2/key"+(aspD.spatial?" vs target "+aspD.spatial[0]+"-"+aspD.spatial[1]:"")+", density "+C.density.toFixed(1)+" keys/ha"+(aspD.density?" vs target "+aspD.density[0]+"-"+aspD.density[1]:"")+".");
  if(C.nr.th.indexOf("Privacy Architecture")>=0&&d.sTP.size>20)contras.push("Narrative emphasizes privacy and seclusion, but "+d.sTP.size+" touchpoints suggest a richly programmed social environment — these goals may conflict.");
  if(C.nr.th.indexOf("Wellness Philosophy")>=0&&C.wellPerKey<4)contras.push("Narrative signals wellness philosophy but wellness allocation is only "+C.wellPerKey.toFixed(1)+" m2/key — insufficient to deliver on the promise.");
  if(d.gst.indexOf("families")>=0&&d.gst.indexOf("hnwi")>=0&&C.pubPerKey<15)contras.push("Targeting both families and UHNWI requires careful spatial separation — public areas at "+C.pubPerKey.toFixed(1)+" m2/key may not support the zoning needed for both segments.");
  if(C.ioRatio<40&&(clim==="tropical"||clim==="coastal"))contras.push("Outdoor ratio of "+C.ioRatio.toFixed(0)+"% is low for "+clim+" climate, where 60-80% outdoor integration is typical at this tier.");
  if(C.greenPct>70&&d.sTP.size<10)contras.push("Green coverage at "+C.greenPct.toFixed(0)+"% is generous but only "+d.sTP.size+" touchpoints are programmed — the landscape may lack experiential activation.");
  if(typo==="tower"&&C.density<=8)contras.push("Tower typology at "+C.density.toFixed(1)+" keys/ha density is unusual — vertical building typically serves higher-density models.");
  if(contras.length===0)contras.push("No major contradictions detected. Inputs are internally consistent.");

  /* RECOMMENDATIONS */
  var recs=[];
  if(aspD&&C.spatialRaw<(aspD.spatial?aspD.spatial[0]:0))recs.push("Increase amenity GFA by approximately "+(((aspD.spatial?aspD.spatial[0]:0)-C.spatialRaw)*d.tk).toFixed(0)+" m2 to reach "+aspL+" spatial threshold of "+(aspD.spatial?aspD.spatial[0]:0)+" m2/key.");
  if(aspD&&aspD.fnbK&&C.fnbPerKey<aspD.fnbK[0])recs.push("Expand F&B program by "+((aspD.fnbK[0]-C.fnbPerKey)*d.tk).toFixed(0)+" m2 (from "+C.fnbPerKey.toFixed(1)+" to "+aspD.fnbK[0]+" m2/key) to meet "+aspL+" dining expectations.");
  if(aspD&&aspD.wellK&&C.wellPerKey<aspD.wellK[0])recs.push("Increase wellness allocation by "+((aspD.wellK[0]-C.wellPerKey)*d.tk).toFixed(0)+" m2 (from "+C.wellPerKey.toFixed(1)+" to "+aspD.wellK[0]+" m2/key) — consider thermal circuit or outdoor treatment additions.");
  if(d.sTP.size<16&&pos==="Ultra-Luxury")recs.push("Add "+(16-d.sTP.size)+" touchpoints to reach the 16+ threshold typical of ultra-luxury properties — prioritize categories with lowest scores in the experience profile.");
  if(C.poolRatio<5&&(clim==="tropical"||clim==="coastal"))recs.push("Pool ratio of "+C.poolRatio.toFixed(1)+" m2/key is below expectations for "+clim+" climate. Target 10-15 m2/key for "+aspL+" positioning.");
  if(C.nr.q<50)recs.push("Strengthen narrative from "+C.nr.q+"/100 by adding specific material references, place-based language, and removing generic descriptors. Target 60+ for "+aspL+" positioning.");
  if(grPct>65)recs.push("Guestroom allocation at "+grPct.toFixed(0)+"% of GFA is high — redistribute "+(((grPct-58)/100)*C.gfaV).toFixed(0)+" m2 toward amenity to strengthen experience density.");
  if(C.greenPct<(aspD&&aspD.green?aspD.green[0]:40))recs.push("Green coverage at "+C.greenPct.toFixed(0)+"% is below "+aspL+" target ("+(aspD&&aspD.green?aspD.green[0]+"-"+aspD.green[1]:40+"-60")+"%). Reduce building footprint through vertical stacking or consolidation.");
  var weakCats=CK.filter(function(ck){return C.tpScores[ck]<20&&C.tpScores[ck]>0;});
  if(weakCats.length>0)recs.push("Strengthen underdeveloped experience categories: "+weakCats.map(function(ck){return CATS[ck]+" ("+C.tpScores[ck].toFixed(0)+"%)";}).join(", ")+" — add 1-2 touchpoints per category.");
  if(recs.length<3)recs.push("Maintain current metric alignment. Focus optimization on narrative depth and guest-touchpoint coverage.");

  return {positioning_drivers:pdText,positioning:posText,precedents:prec,archetype:archText,value_prop:vpText,guest_fit:gfText,program_critique:pcText,narrative_quality:nqText,contradictions:contras,recommendations:recs};
}

/* ═══ COMPONENTS ═══ */
function Hex(p){
  var m=p.m,gh=p.gh,lb=p.lb,sz=p.sz||300,id=p.id||"p",cx=sz/2,rd=sz*0.33,n=lb.length;
  var an=[];for(var i=0;i<n;i++)an.push((Math.PI*2*i)/n-Math.PI/2);
  var pt=function(a,v){return {x:cx+rd*(v/100)*Math.cos(a),y:cx+rd*(v/100)*Math.sin(a)};};
  var mp=function(v){return v.map(function(val,i){return (i===0?"M":"L")+" "+pt(an[i],val).x+" "+pt(an[i],val).y;}).join(" ")+" Z";};
  return (
    <svg viewBox={"0 0 "+sz+" "+sz} style={{width:"100%",maxWidth:sz,display:"block",margin:"0 auto"}}>
      <defs><linearGradient id={"g"+id} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2a2420" stopOpacity="0.07"/><stop offset="100%" stopColor="#2a2420" stopOpacity="0.02"/></linearGradient></defs>
      {[20,40,60,80,100].map(function(lv){return (<polygon key={lv} points={an.map(function(a){return pt(a,lv).x+","+pt(a,lv).y;}).join(" ")} fill="none" stroke={lv===100?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.025)"} strokeWidth="0.5"/>);})}
      {an.map(function(a,i){return (<line key={i} x1={cx} y1={cx} x2={pt(a,105).x} y2={pt(a,105).y} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5"/>);})}
      {gh&&gh.map(function(g,gi){return (<path key={gi} d={mp(g.v)} fill="none" stroke={"rgba(0,0,0,"+(g.hl?0.16:0.03)+")"} strokeWidth={g.hl?1.5:0.6} strokeDasharray={g.hl?"6 4":"3 4"}/>);})}
      <path d={mp(m)} fill={"url(#g"+id+")"} stroke="#2a2420" strokeWidth="1.8" strokeLinejoin="round"/>
      {m.map(function(v,i){var pp=pt(an[i],v);return (<circle key={i} cx={pp.x} cy={pp.y} r="2.5" fill="#2a2420"/>);})}
      {lb.map(function(label,i){var pp=pt(an[i],n<=5?122:120);var lines=label.split("\n");return (<g key={i}>{lines.map(function(line,li){return (<text key={li} x={pp.x} y={pp.y+li*10-(lines.length-1)*4} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,0,0,0.65)" fontSize="7.5" fontFamily="'Cormorant Garamond',Georgia,serif" letterSpacing="0.05em">{line}</text>);})}</g>);})}
    </svg>
  );
}
function MSl(p){
  var pct=Math.min((p.value/p.max)*100,100),tgt=p.target;
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:9,color:"#5a5248",letterSpacing:"0.08em"}}>{p.label.toUpperCase()}</span>
        <span style={{fontSize:13,color:"#1a1815"}}>{typeof p.value==="number"?(p.value%1===0?p.value:p.value.toFixed(1)):p.value}<span style={{fontSize:9,color:"#7a6e62",marginLeft:2}}>{p.unit}</span></span>
      </div>
      <div style={{position:"relative",height:14,borderRadius:2,overflow:"hidden",background:"rgba(0,0,0,0.02)"}}>
        {p.ranges&&p.ranges.map(function(rng,i){var prev=i>0?p.ranges[i-1].max:0;return (<div key={i} style={{position:"absolute",left:(prev/p.max)*100+"%",width:((rng.max-prev)/p.max)*100+"%",height:"100%",background:"rgba(0,0,0,"+(0.016+i*0.014)+")"}}/>);})}
        {tgt&&(<div style={{position:"absolute",left:(tgt[0]/p.max)*100+"%",width:((tgt[1]-tgt[0])/p.max)*100+"%",height:"100%",background:"rgba(138,126,110,0.15)",borderLeft:"1px dashed #8a7e6e",borderRight:"1px dashed #8a7e6e"}}/>)}
        <div style={{position:"absolute",left:Math.max(0,pct-0.3)+"%",top:0,bottom:0,width:2,background:"#1a1815",borderRadius:1}}/>
      </div>
      {tgt&&(<div style={{fontSize:8,color:pct>=((tgt[0]/p.max)*100)&&pct<=((tgt[1]/p.max)*100)?"#5a6e4a":"#8a7e6e",marginTop:3}}>Target: {tgt[0]}-{tgt[1]}{p.unit||""}</div>)}
    </div>
  );
}
var RNG={spatial:[{max:100},{max:150},{max:220},{max:300},{max:400}],cov:[{max:15},{max:25},{max:35},{max:50}],dens:[{max:5},{max:10},{max:20},{max:40}],pool:[{max:3},{max:8},{max:15},{max:25}],fnb:[{max:4},{max:8},{max:14},{max:20}],well:[{max:3},{max:6},{max:10},{max:15}],pub:[{max:5},{max:10},{max:18},{max:25}],boh:[{max:8},{max:12},{max:18},{max:25}],green:[{max:20},{max:40},{max:60},{max:85}]};

/* ═══ MAIN ═══ */
export default function EDI(){
  var _s=useState(0),step=_s[0],setStep=_s[1];
  var _f=useState(true),fade=_f[0],setFade=_f[1];
  var _pn=useState(""),pn=_pn[0],setPn=_pn[1];
  var _loc=useState(""),loc=_loc[0],setLoc=_loc[1];
  var _cl=useState(""),clim=_cl[0],setClim=_cl[1];
  var _se=useState(""),setting=_se[0],setSetting=_se[1];
  var _ty=useState(""),typo=_ty[0],setTypo=_ty[1];
  var _asp=useState(""),aspiration=_asp[0],setAsp=_asp[1];
  var _gg=useState([]),gst=_gg[0],setGst=_gg[1];
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

  var C=useMemo(function(){
    var k=tk||1;
    var pubV=parseFloat(pub.a)||0,fnbV=parseFloat(fnb.a)||0,wellV=parseFloat(well.a)||0,miceV=parseFloat(mice.a)||0,bohV=parseFloat(boh.a)||0;
    var pubL=Math.max(parseInt(pub.l)||1,1),fnbL=Math.max(parseInt(fnb.l)||1,1),wellL=Math.max(parseInt(well.l)||1,1),miceL=Math.max(parseInt(mice.l)||1,1),bohL=Math.max(parseInt(boh.l)||1,1);
    var saV=parseFloat(siteArea)||0,plV=parseFloat(poolArea)||0;
    var grGross=0,grFoot=0;
    keys.forEach(function(kt){var sz=parseFloat(kt.size)||0,ct=parseInt(kt.count)||0,lv=Math.max(parseInt(kt.levels)||1,1);grGross+=sz*ct;grFoot+=(sz*ct)/lv;});
    var amGross=pubV+fnbV+wellV+miceV,gfaV=grGross+amGross;
    var amFoot=pubV/pubL+fnbV/fnbL+wellV/wellL+miceV/miceL;
    var totalFoot=grFoot+amFoot+bohV/bohL;
    var siteCov=saV>0?(totalFoot/saV)*100:0;
    var openExp=saV>0?Math.max(saV-totalFoot-plV,0):0;
    var greenPct=saV>0?(openExp/saV)*100:0;
    var spatialRaw=gfaV>0?gfaV/k:0,amPerKey=amGross/k,density=saV>0?k/(saV/10000):0,poolRatio=plV/k;
    var ioRatio=(gfaV+openExp+plV)>0?((openExp+plV)/(gfaV+openExp+plV))*100:0;
    var fnbPerKey=fnbV/k,wellPerKey=wellV/k,pubPerKey=pubV/k;
    var bohPct=(gfaV+bohV)>0?(bohV/(gfaV+bohV))*100:0;
    var wTP=allTP.filter(function(t){return sTP.has(t.id);}).reduce(function(s,t){return s+t.w;},0);
    var tpScores={};CK.forEach(function(ck){var catTPs=allTP.filter(function(t){return t.c===ck;});var maxW=catTPs.reduce(function(s,t){return s+t.w;},0);var selW=catTPs.filter(function(t){return sTP.has(t.id);}).reduce(function(s,t){return s+t.w;},0);tpScores[ck]=maxW>0?Math.min((selW/maxW)*120,100):0;});
    var nr=localNarr(pur,slo,drv,dhl);
    var dnaSp=Math.min((spatialRaw/350)*100,100),dnaNr=nr.q,dnaIO=Math.min((ioRatio/80)*100,100),dnaRich=Math.min((wTP/30)*100,100);
    var dnaLand=saV>0?Math.min(((openExp/saV)/0.8)*100,100)*0.6+(tpScores.outdoor||0)*0.4:0;
    var dnaM=[dnaSp,dnaNr,dnaIO,dnaRich,dnaLand];
    var expM=CK.map(function(ck){return tpScores[ck];});
    var posS=0;
    if(spatialRaw>=220)posS+=22;else if(spatialRaw>=140)posS+=16;else if(spatialRaw>=90)posS+=9;
    if(density>0&&density<=8)posS+=18;else if(density<=15)posS+=12;else if(density<=25)posS+=6;
    if(siteCov>0&&siteCov<=25)posS+=14;else if(siteCov<=35)posS+=9;
    if(sTP.size>=16)posS+=14;else if(sTP.size>=12)posS+=10;else if(sTP.size>=8)posS+=5;
    if(nr.q>=55)posS+=14;else if(nr.q>=40)posS+=9;
    if(poolRatio>=10)posS+=6;else if(poolRatio>=5)posS+=3;
    if(amPerKey>=40)posS+=6;else if(amPerKey>=25)posS+=3;
    if(ioRatio>=70)posS+=6;else if(ioRatio>=40)posS+=3;
    var pos="Standard",posRef="Conventional";
    if(posS>=78){pos="Ultra-Luxury";posRef="Aman, One&Only, Six Senses";}
    else if(posS>=55){pos="Luxury";posRef="Four Seasons, Rosewood";}
    else if(posS>=35){pos="Upper Upscale";posRef="Edition, Nobu";}
    else if(posS>=18){pos="Lifestyle";posRef="1Hotels, Ace";}
    var aspD=ASPS.find(function(a){return a.id===aspiration;});
    return {grGross,grFoot,totalFoot,gfaV,spatialRaw,amPerKey,siteCov,openExp,greenPct,density,poolRatio,ioRatio,fnbPerKey,wellPerKey,pubPerKey,bohPct,dnaM,expM,nr,pos,posRef,aspD,tpScores,sc:nr.sc};
  },[tk,keys,pub,fnb,well,mice,boh,siteArea,poolArea,sTP,allTP,pur,slo,drv,dhl,aspiration]);

  var ai=useMemo(function(){
    if(tk===0)return null;
    return generateAnalysis({pn,loc,clim,setting,typo,aspiration,gst,tk,keys,allTP,sTP,pur,slo,drv,dhl,siteArea,C});
  },[tk,pn,loc,clim,setting,typo,aspiration,gst,keys,allTP,sTP,pur,slo,drv,dhl,siteArea,C]);

  var I={width:"100%",padding:"8px 10px",background:"#faf9f7",border:"1px solid #e2dfd8",borderRadius:2,color:"#1a1815",fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  var Lb={display:"block",marginBottom:3,fontSize:8,color:"#5a5248",letterSpacing:"0.14em"};
  var SB={padding:"16px 18px",border:"1px solid #e2dfd8",borderRadius:3,marginTop:16};
  var ST={fontSize:13,fontWeight:500,color:"#1a1815",letterSpacing:"0.1em",marginBottom:4};
  var IT={fontSize:10.5,color:"#5a5248",lineHeight:1.5,marginBottom:10,fontStyle:"italic"};
  var ch=function(on){return {padding:"5px 9px",borderRadius:2,cursor:"pointer",border:"1px solid "+(on?"#8a7e6e":"#e2dfd8"),background:on?"#f0ece6":"#fff",fontFamily:"inherit",fontSize:10,color:on?"#1a1815":"#6a5e4e"};};
  var aspD=C.aspD;
  var navB=function(prev,next,label){return (<div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>{prev>=0?(<button onClick={function(){go(prev);}} style={{padding:"8px 18px",border:"1px solid #d6d2ca",background:"#fff",color:"#6a5e4e",fontSize:9,letterSpacing:"0.12em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>BACK</button>):(<div/>)}<button onClick={function(){go(next);}} style={{padding:"8px 22px",border:"1px solid #d6d2ca",background:"#ede9e2",color:"#3a3428",fontSize:9,letterSpacing:"0.12em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>{label||"NEXT"}</button></div>);};
  var progRow=function(label,desc,st,setSt){return (<div style={{display:"flex",gap:6,alignItems:"flex-end",marginBottom:6}}><div style={{flex:1}}><label style={Lb}>{label}</label><input style={I} type="number" placeholder="m2" value={st.a} onChange={function(e){setSt({a:e.target.value,l:st.l});}}/><div style={{fontSize:7.5,color:"#7a6e62",marginTop:1}}>{desc}</div></div><div style={{width:50}}><label style={Lb}>LVL</label><input style={Object.assign({},I,{textAlign:"center"})} type="number" placeholder="1" value={st.l} onChange={function(e){setSt({a:st.a,l:e.target.value});}}/></div></div>);};
  var AIS=function(title,content){if(!content)return null;if(Array.isArray(content)){return (<div style={SB}><div style={ST}>{title}</div>{content.map(function(item,i){return (<div key={i} style={{padding:"8px 12px",marginBottom:4,borderLeft:"2px solid #8a7e6e",fontSize:11,color:"#2a2420",lineHeight:1.6}}>{item}</div>);})}</div>);}return (<div style={SB}><div style={ST}>{title}</div><div style={{fontSize:11.5,color:"#2a2420",lineHeight:1.7}}>{content}</div></div>);};

  var steps=[
    function(){return (<div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:8,letterSpacing:"0.35em",color:"#7a6e62"}}>EXPERIENCE DENSITY INDEX</div><h2 style={{fontSize:20,fontWeight:300,margin:"4px 0"}}>Project Overview</h2></div><div style={{display:"grid",gap:10}}><div><label style={Lb}>PROJECT NAME</label><input style={I} placeholder="Riviera Maya Resort" value={pn} onChange={function(e){setPn(e.target.value);}}/></div><div><label style={Lb}>LOCATION</label><input style={I} placeholder="Tulum, Mexico" value={loc} onChange={function(e){setLoc(e.target.value);}}/></div><div><label style={Lb}>CLIMATE</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{CLIMATES.map(function(c){return (<button key={c.id} onClick={function(){setClim(c.id);}} style={ch(clim===c.id)}>{c.l}</button>);})}</div></div><div><label style={Lb}>SETTING</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{SETTINGS.map(function(c){return (<button key={c.id} onClick={function(){setSetting(c.id);}} style={ch(setting===c.id)}>{c.l}</button>);})}</div></div><div><label style={Lb}>TYPOLOGY</label><div style={{display:"grid",gap:3}}>{TYPOS.map(function(t){return (<button key={t.id} onClick={function(){setTypo(t.id);}} style={Object.assign({},ch(typo===t.id),{textAlign:"left",padding:"6px 10px"})}><span style={{fontWeight:typo===t.id?500:400}}>{t.l}</span><span style={{fontSize:9,color:"#7a6e62",marginLeft:6}}>{t.n}</span></button>);})}</div></div><div><label style={Lb}>ASPIRATIONAL POSITIONING</label><div style={{display:"grid",gap:3}}>{ASPS.map(function(a){return (<button key={a.id} onClick={function(){setAsp(a.id);}} style={Object.assign({},ch(aspiration===a.id),{textAlign:"left",padding:"6px 10px"})}><span style={{fontWeight:aspiration===a.id?500:400}}>{a.l}</span><span style={{fontSize:9,color:"#7a6e62",marginLeft:6}}>{a.ref}</span></button>);})}</div></div><div><label style={Lb}>TARGET GUESTS</label><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{GUESTS.map(function(g){return (<button key={g.id} onClick={function(){togG(g.id);}} style={ch(gst.indexOf(g.id)>=0)}>{g.l}</button>);})}</div></div></div>{navB(-1,1)}</div>);},
    function(){return (<div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:16}}><h2 style={{fontSize:20,fontWeight:300}}>Program Areas</h2></div>{progRow("PUBLIC AREAS","Lobby, lounges, kids areas, library, retail",pub,setPub)}{progRow("F&B","Restaurants, bars, kitchens, service",fnb,setFnb)}{progRow("WELLNESS","Spa, thermal, gym, yoga, treatments",well,setWell)}{progRow("MICE","Ballroom, meeting rooms, pre-function",mice,setMice)}{progRow("BOH + ENGINEERING","Receiving, laundry, storage, staff, plant",boh,setBoh)}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}><div><label style={Lb}>SITE AREA (M2)</label><input style={I} type="number" placeholder="80,000" value={siteArea} onChange={function(e){setSiteArea(e.target.value);}}/></div><div><label style={Lb}>POOL / WATER (M2)</label><input style={I} type="number" placeholder="3,000" value={poolArea} onChange={function(e){setPoolArea(e.target.value);}}/></div></div>{navB(0,2)}</div>);},
    function(){return (<div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:12}}><h2 style={{fontSize:20,fontWeight:300}}>Key Mix</h2></div><div style={{display:"flex",gap:4,padding:"0 0 6px",fontSize:8,color:"#7a6e62",letterSpacing:"0.08em"}}><span style={{flex:1}}>TYPE</span><span style={{width:50,textAlign:"center"}}>M2</span><span style={{width:40,textAlign:"center"}}>QTY</span><span style={{width:38,textAlign:"center"}}>LVL</span><span style={{width:16}}></span></div>{keys.map(function(kt,idx){return (<div key={kt.id} style={{display:"flex",alignItems:"center",gap:4,padding:"5px",borderRadius:2,border:"1px solid #e2dfd8",marginBottom:3}}><input style={Object.assign({},I,{flex:1,padding:"5px 6px",fontSize:11})} placeholder="Type" value={kt.label} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{label:e.target.value});setKeys(n);}}/><input style={Object.assign({},I,{width:50,textAlign:"center",padding:"5px"})} type="number" value={kt.size} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{size:e.target.value});setKeys(n);}}/><input style={Object.assign({},I,{width:40,textAlign:"center",padding:"5px"})} type="number" placeholder="qty" value={kt.count} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{count:e.target.value});setKeys(n);}}/><input style={Object.assign({},I,{width:38,textAlign:"center",padding:"5px"})} type="number" placeholder="1" value={kt.levels} onChange={function(e){var n=keys.slice();n[idx]=Object.assign({},n[idx],{levels:e.target.value});setKeys(n);}}/><button onClick={function(){setKeys(keys.filter(function(_,j){return j!==idx;}));}} style={{border:"none",background:"none",color:"#b0a494",cursor:"pointer",fontSize:13,width:16}}>x</button></div>);})}
    <button onClick={function(){setKeys(keys.concat([{id:"k"+Date.now(),label:"",size:"",count:"",levels:"1"}]));}} style={{width:"100%",marginTop:4,padding:"7px",border:"1px solid #e2dfd8",background:"#fff",color:"#6a5e4e",fontSize:9,letterSpacing:"0.12em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>+ ADD KEY TYPE</button><div style={{marginTop:6,textAlign:"center"}}><span style={{fontSize:18,fontWeight:300}}>{tk}</span><span style={{fontSize:8,color:"#6a5e4e"}}> keys</span></div>{navB(1,3)}</div>);},
    function(){return (<div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:12}}><h2 style={{fontSize:20,fontWeight:300}}>Touchpoints</h2></div>{Object.entries(CATS).map(function(entry){return (<div key={entry[0]} style={{marginBottom:12}}><div style={{fontSize:9,letterSpacing:"0.12em",color:"#5a5248",marginBottom:3}}>{entry[1].toUpperCase()}</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{allTP.filter(function(t){return t.c===entry[0];}).map(function(tp){var s=sTP.has(tp.id);return (<button key={tp.id} onClick={function(){togTP(tp.id);}} style={{padding:"4px 8px",borderRadius:10,fontSize:10,cursor:"pointer",fontFamily:"inherit",border:"1px solid "+(s?"#8a7e6e":"#e2dfd8"),background:s?"#ede9e2":"#fff",color:s?"#1a1815":"#7a6e62"}}>{tp.l}</button>);})}</div></div>);})}
    <div style={{borderTop:"1px solid #e6e2dc",paddingTop:8}}><div style={{display:"flex",gap:4}}><input style={Object.assign({},I,{flex:1,padding:"5px 7px",fontSize:10})} placeholder="Custom..." value={ntl} onChange={function(e){setNtl(e.target.value);}}/><select style={Object.assign({},I,{width:90,padding:"5px",fontSize:9})} value={ntc} onChange={function(e){setNtc(e.target.value);}}>{CK.map(function(ck){return (<option key={ck} value={ck}>{CATS[ck]}</option>);})}</select><button onClick={function(){if(!ntl.trim())return;var np={id:"c"+Date.now(),l:ntl.trim(),c:ntc,w:1.1};setAllTP(allTP.concat([np]));setSTP(function(p){var n=new Set(p);n.add(np.id);return n;});setNtl("");}} style={{padding:"5px 10px",border:"1px solid #d6d2ca",background:"#fff",fontSize:9,fontFamily:"inherit",cursor:"pointer",borderRadius:2}}>ADD</button></div></div>{navB(2,4)}</div>);},
    function(){return (<div style={{maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:12}}><h2 style={{fontSize:20,fontWeight:300}}>Narrative</h2></div><div style={{display:"grid",gap:12}}><div><label style={Lb}>PURPOSE STATEMENT</label><textarea style={Object.assign({},I,{minHeight:56,resize:"vertical"})} placeholder="Why does this project exist?" value={pur} onChange={function(e){setPur(e.target.value);}}/></div><div><label style={Lb}>T-SHIRT SLOGAN</label><input style={I} placeholder="One sentence..." value={slo} onChange={function(e){setSlo(e.target.value);}}/></div><div><label style={Lb}>DESIGN DRIVERS</label><textarea style={Object.assign({},I,{minHeight:56,resize:"vertical"})} placeholder="3-5 principles..." value={drv} onChange={function(e){setDrv(e.target.value);}}/></div><div><label style={Lb}>DESIGN HIGHLIGHTS</label><textarea style={Object.assign({},I,{minHeight:56,resize:"vertical"})} placeholder="Materials, spatial strategies..." value={dhl} onChange={function(e){setDhl(e.target.value);}}/></div></div>{C.nr.q>0&&(<div style={{marginTop:12,padding:"10px 12px",border:"1px solid #e6e2dc",borderRadius:2,background:"#faf9f7"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:8,color:"#6a5e4e",letterSpacing:"0.08em"}}>QUALITY</span><div style={{flex:1,height:3,background:"#e6e2dc",borderRadius:2}}><div style={{height:"100%",width:C.nr.q+"%",background:C.nr.q>=60?"#6a7e5e":"#8a7e6e",borderRadius:2}}/></div><span style={{fontSize:14,fontWeight:300}}>{C.nr.q}</span></div>{C.nr.sf.length>0&&(<div style={{fontSize:8.5,color:"#5a6e4a",marginTop:4}}>Materials: {C.nr.sf.join(", ")}</div>)}{C.nr.gf.length>0&&(<div style={{fontSize:8.5,color:"#8a6050",marginTop:2}}>Generic: {C.nr.gf.join(", ")}</div>)}{C.nr.th.length>0&&(<div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>{C.nr.th.map(function(t,i){return (<span key={i} style={{padding:"2px 7px",borderRadius:8,fontSize:9,border:"1px solid #d6d2ca",color:"#3a3428"}}>{t}</span>);})}</div>)}</div>)}{navB(3,5,"VIEW RESULTS")}</div>);},
    /* RESULTS */
    function(){
      var grPct=C.gfaV>0?(C.grGross/C.gfaV)*100:0;
      var segs=[{l:"Guestrooms",p:grPct,c:"#2a2420"},{l:"F&B",p:C.gfaV>0?((parseFloat(fnb.a)||0)/C.gfaV)*100:0,c:"#6a5e4e"},{l:"Wellness",p:C.gfaV>0?((parseFloat(well.a)||0)/C.gfaV)*100:0,c:"#8a7e6e"},{l:"Public",p:C.gfaV>0?((parseFloat(pub.a)||0)/C.gfaV)*100:0,c:"#a89e8e"},{l:"MICE",p:C.gfaV>0?((parseFloat(mice.a)||0)/C.gfaV)*100:0,c:"#c4baa8"}].filter(function(s){return s.p>0.5;});
      var aspGapLabels=["Spatial\nGenerosity","Site\nCoverage","Density","Pool\nRatio","F&B\nRatio","Wellness\nRatio","Public\nRatio","BOH\nRatio","Green\nArea"];
      var aspGapMax=[400,50,40,25,20,15,25,25,85];
      var aspGapAct=[C.spatialRaw,C.siteCov,C.density,C.poolRatio,C.fnbPerKey,C.wellPerKey,C.pubPerKey,C.bohPct,C.greenPct];
      var aspGapInv=[false,true,true,false,false,false,false,true,false];
      var normA=aspGapAct.map(function(v,i){var n=Math.min((v/aspGapMax[i])*100,100);if(aspGapInv[i])n=100-n;return Math.max(0,Math.min(100,n));});
      var normT=aspD?[aspD.spatial,aspD.coverage,aspD.density,aspD.pool,aspD.fnbK,aspD.wellK,aspD.pubK,aspD.bohPct,aspD.green].map(function(rng,i){var mid=(rng[0]+rng[1])/2;var n=Math.min((mid/aspGapMax[i])*100,100);if(aspGapInv[i])n=100-n;return Math.max(0,Math.min(100,n));}):null;
      var gsz=320,gcx=gsz/2,grd=gsz*0.32,gn=9;
      var gan=[];for(var gi=0;gi<gn;gi++)gan.push((Math.PI*2*gi)/gn-Math.PI/2);
      var gpt=function(a,v){return {x:gcx+grd*(v/100)*Math.cos(a),y:gcx+grd*(v/100)*Math.sin(a)};};
      var gmp=function(vals){return vals.map(function(v,i){return (i===0?"M":"L")+" "+gpt(gan[i],v).x+" "+gpt(gan[i],v).y;}).join(" ")+" Z";};

      return (<div style={{maxWidth:720,margin:"0 auto"}} id="edi-report">
      <div style={{textAlign:"center"}}><div style={{fontSize:8,letterSpacing:"0.35em",color:"#7a6e62"}}>EXPERIENCE DENSITY INDEX</div><h1 style={{fontSize:22,fontWeight:300,margin:"4px 0"}}>{pn||"Untitled"}</h1><div style={{fontSize:10,color:"#5a5248"}}>{(CLIMATES.find(function(c){return c.id===clim;})||{}).l||""} {(SETTINGS.find(function(c){return c.id===setting;})||{}).l||""} {(TYPOS.find(function(t){return t.id===typo;})||{}).l||""}{loc?" — "+loc:""} — {tk} Keys</div></div>
      {(pur||slo)&&(<div style={Object.assign({},SB,{textAlign:"center"})}>{slo&&(<div style={{fontSize:13,color:"#3a3428",fontStyle:"italic"}}>"{slo}"</div>)}{pur&&(<div style={{fontSize:11,color:"#5a5248",lineHeight:1.7,marginTop:slo?8:0,maxWidth:560,margin:slo?"8px auto 0":"0 auto"}}>{pur}</div>)}</div>)}
      <div style={Object.assign({},SB,{textAlign:"center"})}><div style={{fontSize:10,color:"#6a5e4e",letterSpacing:"0.12em"}}>CALCULATED POSITIONING</div><div style={{fontSize:28,fontWeight:300,marginTop:2}}>{C.pos}</div>{aspD&&C.pos!==aspD.l&&(<div style={{fontSize:10,color:"#8a6050",marginTop:4}}>Aspirational: {aspD.l}</div>)}{aspD&&C.pos===aspD.l&&(<div style={{fontSize:10,color:"#5a6e4a",marginTop:4}}>Aligned with {aspD.l}</div>)}</div>
      <div style={SB}><div style={ST}>KEY METRICS</div><div style={IT}>Black marker = project. Shaded zone = aspirational target.</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"8px 0 12px",marginBottom:8,borderBottom:"1px solid #e6e2dc"}}><span style={{fontSize:8,color:"#5a5248",letterSpacing:"0.08em"}}>TOTAL KEYS</span><div><span style={{fontSize:22,fontWeight:300}}>{tk}</span><span style={{fontSize:9,color:"#7a6e62",marginLeft:4}}>keys</span><span style={{fontSize:9,color:"#7a6e62",marginLeft:10}}>GFA {C.gfaV.toFixed(0)} m2</span><span style={{fontSize:9,color:"#7a6e62",marginLeft:10}}>Site {siteArea||0} m2</span></div></div>
        <MSl label="Spatial Generosity" value={C.spatialRaw} max={400} ranges={RNG.spatial} unit=" m2/key" target={aspD?aspD.spatial:null}/><MSl label="Site Coverage" value={C.siteCov} max={50} ranges={RNG.cov} unit="%" target={aspD?aspD.coverage:null}/><MSl label="Density" value={C.density} max={40} ranges={RNG.dens} unit=" keys/ha" target={aspD?aspD.density:null}/><MSl label="Pool Ratio" value={C.poolRatio} max={25} ranges={RNG.pool} unit=" m2/key" target={aspD?aspD.pool:null}/><MSl label="F&B Ratio" value={C.fnbPerKey} max={20} ranges={RNG.fnb} unit=" m2/key" target={aspD?aspD.fnbK:null}/><MSl label="Wellness Ratio" value={C.wellPerKey} max={15} ranges={RNG.well} unit=" m2/key" target={aspD?aspD.wellK:null}/><MSl label="Public Areas Ratio" value={C.pubPerKey} max={25} ranges={RNG.pub} unit=" m2/key" target={aspD?aspD.pubK:null}/><MSl label="BOH Ratio" value={C.bohPct} max={25} ranges={RNG.boh} unit="%" target={aspD?aspD.bohPct:null}/><MSl label="Green / Open Area" value={C.greenPct} max={85} ranges={RNG.green} unit="%" target={aspD?aspD.green:null}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
        <div style={SB}><div style={ST}>DESIGN DNA</div><div style={IT}>Peaked profiles = clear commitment. Flat = no spatial signature.</div><Hex id="dna" m={C.dnaM} gh={AK.map(function(k){return {v:ARCH[k].dna,hl:k===selA};})} lb={["SPATIAL\nGENEROSITY","NARRATIVE\nDEPTH","INDOOR/OUTDOOR\nBALANCE","EXPERIENCE\nRICHNESS","LANDSCAPE\nIMMERSION"]} sz={300}/><div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",marginTop:6}}>{AK.map(function(k){return (<button key={k} onClick={function(){setSelA(k);}} style={{padding:"2px 6px",borderRadius:8,fontSize:8,cursor:"pointer",fontFamily:"inherit",border:"1px solid "+(selA===k?"#8a7e6e":"#e2dfd8"),background:selA===k?"#ede9e2":"#fff",color:selA===k?"#1a1815":"#6a5e4e"}}>{ARCH[k].name}</button>);})}</div></div>
        <div style={SB}><div style={ST}>EXPERIENCE PROFILE</div><div style={IT}>Distinctive projects peak in 2-3 areas. Even = uncommitted.</div><Hex id="exp" m={C.expM} gh={null} lb={["FIRST\nIMPRESSION","GASTRONOMY","WELLNESS","ACTIVE\nLEISURE","OUTDOOR\nIMMERSION","CULTURAL\n& SOCIAL"]} sz={300}/><div style={{textAlign:"center",fontSize:9,color:"#6a5e4e",marginTop:6}}>{sTP.size} touchpoints</div></div>
      </div>
      {/* PROGRAM ALLOCATION */}
      {C.gfaV>0&&(<div style={SB}><div style={ST}>PROGRAM ALLOCATION</div><div style={IT}>Ultra-luxury: below 55% guestroom. Higher = less experiential investment.</div><div style={{display:"flex",height:28,borderRadius:2,overflow:"hidden",marginBottom:8}}>{segs.map(function(s,i){return (<div key={i} style={{width:s.p+"%",background:s.c,position:"relative"}}>{s.p>6&&(<span style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:8,color:"#fff",whiteSpace:"nowrap"}}>{s.p.toFixed(0)}%</span>)}</div>);})}</div><div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>{segs.map(function(s,i){return (<div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:1,background:s.c}}/><span style={{fontSize:9,color:"#3a3428"}}>{s.l} {s.p.toFixed(1)}%</span></div>);})}</div></div>)}
      {/* GUEST MATRIX */}
      {gst.length>0&&sTP.size>0&&(<div style={SB}><div style={ST}>GUEST–TOUCHPOINT ALIGNMENT</div><div style={IT}>Filled = aligned. Ring = partial. Empty = gap.</div><div style={{overflowX:"auto"}}><div style={{display:"grid",gridTemplateColumns:"110px repeat("+CK.length+", 1fr)",gap:0,minWidth:420}}><div style={{padding:"4px 6px"}}></div>{CK.map(function(ck){return (<div key={ck} style={{padding:"4px 2px",textAlign:"center",fontSize:7.5,color:"#6a5e4e",letterSpacing:"0.06em",borderBottom:"1px solid #e6e2dc"}}>{CATS[ck].toUpperCase()}</div>);})}{GUESTS.filter(function(g){return gst.indexOf(g.id)>=0;}).map(function(g){var needs={};CK.forEach(function(ck){needs[ck]={expected:0,met:0};});g.tpN.forEach(function(tid){var tp=allTP.find(function(t){return t.id===tid;});if(tp){needs[tp.c].expected++;if(sTP.has(tid))needs[tp.c].met++;}});return [<div key={g.id+"l"} style={{padding:"6px",fontSize:10,color:"#1a1815",borderBottom:"1px solid #f0ece6",display:"flex",alignItems:"center"}}>{g.l}</div>,CK.map(function(ck){var n=needs[ck];var ratio=n.expected>0?n.met/n.expected:0;return (<div key={g.id+ck} style={{padding:"6px 2px",textAlign:"center",borderBottom:"1px solid #f0ece6",display:"flex",justifyContent:"center",alignItems:"center"}}>{n.expected===0?(<span style={{width:8,height:8,borderRadius:4,background:"rgba(0,0,0,0.04)",display:"inline-block"}}/>):ratio>=0.6?(<span style={{width:10,height:10,borderRadius:5,background:"#2a2420",display:"inline-block"}}/>):ratio>0?(<span style={{width:10,height:10,borderRadius:5,border:"2px solid #2a2420",background:"transparent",display:"inline-block"}}/>):(<span style={{width:10,height:10,borderRadius:5,border:"2px solid #c4baa8",background:"transparent",display:"inline-block"}}/>)}</div>);})];})}</div></div></div>)}
      {/* ASPIRATIONAL GAP */}
      {aspD&&(<div style={SB}><div style={ST}>ASPIRATIONAL GAP ANALYSIS</div><div style={IT}>Solid = project. Dashed = aspirational midpoint.</div><svg viewBox={"0 0 "+gsz+" "+gsz} style={{width:"100%",maxWidth:gsz,display:"block",margin:"0 auto"}}>{[20,40,60,80,100].map(function(lv){return (<polygon key={lv} points={gan.map(function(a){return gpt(a,lv).x+","+gpt(a,lv).y;}).join(" ")} fill="none" stroke={"rgba(0,0,0,"+(lv===100?0.08:0.025)+")"} strokeWidth="0.5"/>);})}{gan.map(function(a,i){return (<line key={i} x1={gcx} y1={gcx} x2={gpt(a,105).x} y2={gpt(a,105).y} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5"/>);})}{normT&&(<path d={gmp(normT)} fill="rgba(138,126,110,0.06)" stroke="#8a7e6e" strokeWidth="1" strokeDasharray="6 4"/>)}<path d={gmp(normA)} fill="rgba(42,36,32,0.06)" stroke="#2a2420" strokeWidth="1.8" strokeLinejoin="round"/>{normA.map(function(v,i){var pp=gpt(gan[i],v);return (<circle key={i} cx={pp.x} cy={pp.y} r="2.5" fill="#2a2420"/>);})}{aspGapLabels.map(function(label,i){var pp=gpt(gan[i],118);var lines=label.split("\n");return (<g key={i}>{lines.map(function(line,li){return (<text key={li} x={pp.x} y={pp.y+li*10-(lines.length-1)*4} textAnchor="middle" dominantBaseline="middle" fill="rgba(0,0,0,0.6)" fontSize="7" fontFamily="'Cormorant Garamond',Georgia,serif">{line}</text>);})}</g>);})}</svg><div style={{display:"flex",gap:14,justifyContent:"center",marginTop:4}}><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:16,height:2,background:"#2a2420"}}/><span style={{fontSize:8,color:"#3a3428"}}>Project</span></div><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:16,height:0,borderTop:"2px dashed #8a7e6e"}}/><span style={{fontSize:8,color:"#6a5e4e"}}>{aspD.l} Target</span></div></div></div>)}
      {/* ANALYSIS */}
      {ai&&(<div>
        {AIS("POSITIONING ANALYSIS",ai.positioning_drivers)}
        {AIS("STRATEGIC POSITIONING",ai.positioning)}
        {ai.precedents&&AIS("PRECEDENT CONTEXT",ai.precedents)}
        {AIS("EXPERIENCE ARCHETYPE",ai.archetype)}
        {ai.value_prop&&(<div style={Object.assign({},SB,{borderLeft:"3px solid #8a7e6e"})}><div style={ST}>VALUE PROPOSITION</div><div style={{fontSize:12,color:"#1a1815",lineHeight:1.7,fontStyle:"italic"}}>{ai.value_prop}</div></div>)}
        {AIS("GUEST-EXPERIENCE FIT",ai.guest_fit)}
        {AIS("PROGRAM CRITIQUE",ai.program_critique)}
        {AIS("NARRATIVE ASSESSMENT",ai.narrative_quality)}
        {ai.contradictions&&ai.contradictions.length>0&&AIS("CONTRADICTIONS",ai.contradictions)}
        {ai.recommendations&&ai.recommendations.length>0&&AIS("RECOMMENDED MOVES",ai.recommendations)}
      </div>)}
      <div style={SB}><div style={ST}>TOUCHPOINT MAP</div>{Object.entries(CATS).map(function(entry){var sel=allTP.filter(function(t){return t.c===entry[0]&&sTP.has(t.id);});return sel.length>0?(<div key={entry[0]} style={{marginBottom:6}}><div style={{fontSize:10,color:"#1a1815",fontWeight:500}}>{entry[1]}</div><div style={{fontSize:10,color:"#5a5248",paddingLeft:8,borderLeft:"1px solid #e6e2dc",marginTop:2}}>{sel.map(function(t){return t.l;}).join(" / ")}</div></div>):null;})}</div>
      <div className="no-print" style={{display:"flex",justifyContent:"center",gap:6,marginTop:24,paddingTop:12,borderTop:"1px solid #e2dfd8",flexWrap:"wrap"}}>{[["PROJECT",0],["PROGRAM",1],["KEYS",2],["TOUCHPOINTS",3],["NARRATIVE",4]].map(function(arr){return (<button key={arr[1]} style={{padding:"6px 12px",border:"1px solid #d6d2ca",background:"#fff",color:"#5a5248",fontSize:9,letterSpacing:"0.1em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}} onClick={function(){go(arr[1]);}}>{arr[0]}</button>);})}<button style={{padding:"6px 16px",border:"1px solid #8a7e6e",background:"#2a2420",color:"#fff",fontSize:9,letterSpacing:"0.1em",fontFamily:"inherit",cursor:"pointer",borderRadius:2}} onClick={function(){window.print();}}>PRINT / PDF</button></div>
    </div>);}
  ];

  return (
    <div style={{minHeight:"100vh",background:"#fff",color:"#1a1815",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      <style>{'@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap");*{box-sizing:border-box}input::placeholder,textarea::placeholder{color:rgba(0,0,0,0.25)}input:focus,textarea:focus{border-color:#8a7e6e!important;outline:none}select:focus{border-color:#8a7e6e!important;outline:none}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}textarea{font-family:"Cormorant Garamond",Georgia,serif}.no-print{}@media print{.no-print{display:none!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}'}</style>
      <div className="no-print" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:1.5,background:"#e2dfd8"}}><div style={{height:"100%",width:((step+1)/6)*100+"%",background:"#8a7e6e",transition:"width 0.5s"}}/></div>
      <div style={{padding:"20px 22px 44px",maxWidth:800,margin:"0 auto",opacity:fade?1:0,transform:fade?"translateY(0)":"translateY(8px)",transition:"opacity 0.15s,transform 0.15s"}}>{steps[step]()}</div>
    </div>
  );
}
