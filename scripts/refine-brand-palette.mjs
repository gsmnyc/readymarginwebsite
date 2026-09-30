import fs from "node:fs";
import path from "node:path";

// Only the supplied core colors generate the website's color ramps.
const core = { ink: "#222222", paper: "#F4F1E8", gold: "#E7C14B", stone: "#D5D5CC" };
const mix = (a, b, weight) => "#" + [1, 3, 5].map((offset) => Math.round(parseInt(a.slice(offset, offset + 2), 16) * weight + parseInt(b.slice(offset, offset + 2), 16) * (1 - weight)).toString(16).padStart(2, "0")).join("").toUpperCase();
const colors = { ...core,
  "paper-soft": mix(core.paper, core.stone, .65),
  "stone-light": mix(core.stone, core.paper, .65),
  "stone-muted": mix(core.stone, core.ink, .3),
  "stone-mid": mix(core.stone, core.ink, .65),
  "stone-on-ink": mix(core.stone, core.ink, .8),
  "ink-surface": mix(core.ink, core.stone, .95),
  "ink-raised": mix(core.ink, core.stone, .88),
  "ink-border": mix(core.ink, core.stone, .75),
  "gold-soft": mix(core.gold, core.paper, .12),
  "gold-light": mix(core.gold, core.paper, .25),
  "gold-mid": mix(core.gold, core.paper, .5),
  "gold-deep": mix(core.gold, core.ink, .7),
  "gold-ink": mix(core.gold, core.ink, .4),
  "gold-dark-soft": mix(core.gold, core.ink, .15),
  "gold-dark-mid": mix(core.gold, core.ink, .25),
};
const mapping = {
  "#222":"ink", "#222222":"ink", "#fff":"paper", "#fffefa":"paper", "#f4f1e8":"paper", "#e7c14b":"gold", "#d5d5cc":"stone",
  "#e9e5d9":"paper-soft", "#596058":"stone-muted", "#4a5147":"stone-muted", "#94998e":"stone-mid",
  "#b8bdb1":"stone-on-ink", "#b9bdb1":"stone-on-ink", "#aeb5a6":"stone-on-ink",
  "#2b2e28":"ink-surface", "#34382f":"ink-raised", "#44493e":"ink-border", "#45493f":"ink-border", "#45473e":"ink-border", "#515345":"ink-border", "#586050":"ink-border", "#626353":"stone-mid",
  "#f6e8b6":"gold-light", "#eed586":"gold-mid", "#fbf5df":"gold-soft", "#ad851d":"gold-deep", "#795a08":"gold-ink", "#49432b":"gold-dark-soft",
  "#d7e3d4":"paper-soft", "#afcaa8":"gold-mid", "#203d2c":"ink", "#365c42":"ink-raised", "#296547":"stone-muted", "#303e31":"ink-raised",
  "#d6e1e7":"stone-light", "#edf2f4":"paper", "#293f50":"ink", "#415f74":"gold-ink", "#2d3c46":"ink-surface",
  "#efd9ca":"gold-light", "#e2b99c":"gold-mid", "#92563b":"gold-ink", "#613b2b":"ink", "#faefe8":"gold-soft", "#47392f":"gold-dark-mid", "#a63030":"gold-ink", "#f1a7a1":"gold-mid",
};
const cssHex = (hex) => {
  const key = hex.toLowerCase();
  if (mapping[key]) return `var(--brand-${mapping[key]})`;
  if (key === "#0003") return "color-mix(in srgb, var(--brand-ink) 20%, transparent)";
  const full = key.length === 5 ? "#" + [...key.slice(1)].map(x => x + x).join("") : key;
  if (full.length === 9) {
    const base = full.slice(0, 7);
    const token = mapping[base];
    if (token) return `color-mix(in srgb, var(--brand-${token}) ${+(parseInt(full.slice(7),16)/255*100).toFixed(2)}%, transparent)`;
  }
  throw new Error(`Unmapped CSS color ${hex}`);
};
function walk(directory, visitor) { for (const item of fs.readdirSync(directory, {withFileTypes:true})) { const file = path.join(directory,item.name); if (item.isDirectory()) walk(file,visitor); else visitor(file); } }
walk("app", (file) => {
  if (file.endsWith(".css") && !file.endsWith("brand-colors.css")) {
    let source=fs.readFileSync(file,"utf8").replace(/#[0-9a-f]{3,8}\b/gi,cssHex);
    source=source.replaceAll("--tint-green", "--tint-stone").replaceAll("--tint-blue", "--tint-paper").replaceAll("--tint-clay", "--tint-gold-soft").replaceAll("--accent-clay", "--accent-gold");
    fs.writeFileSync(file,source);
  }
});
// The guide documents the same restricted system; keep other guide content.
const filename="content/brand-guidelines.json";
const data=JSON.parse(fs.readFileSync(filename,"utf8"));
data.palettes=[
  {id:"neutral",name:"Paper, stone & ink",role:"Core neutrals and their mixes for surfaces, type and borders.",colors:[
    {step:"50",name:"Paper",hex:colors.paper},{step:"100",name:"Paper shade",hex:colors["paper-soft"]},{step:"200",name:"Stone",hex:colors.stone},{step:"400",name:"Stone shade",hex:colors["stone-mid"]},{step:"600",name:"Muted ink",hex:colors["stone-muted"]},{step:"900",name:"Ink",hex:colors.ink}]},
  {id:"gold",name:"Ready gold",role:"Only gold-to-paper tints and gold-to-ink shades extend the signature color.",colors:[
    {step:"50",name:"Soft gold",hex:colors["gold-soft"]},{step:"100",name:"Light gold",hex:colors["gold-light"]},{step:"200",name:"Mid gold",hex:colors["gold-mid"]},{step:"400",name:"Ready gold",hex:colors.gold},{step:"600",name:"Deep gold",hex:colors["gold-deep"]},{step:"900",name:"Gold ink",hex:colors["gold-ink"]}]},
];
data.semantic=[{id:"positive",name:"Complete",hex:colors.ink,background:colors["paper-soft"],use:"Use a check icon and an explicit complete label."},{id:"attention",name:"Needs review",hex:colors["gold-ink"],background:colors["gold-light"],use:"Use a review icon and a next-step label."},{id:"risk",name:"Issue to resolve",hex:colors.ink,background:colors["gold-mid"],use:"Use an issue icon and a specific explanation. Color alone never signals status."}];
data.compositions=[{id:"signature",name:"Paper & gold",note:"Paper, ink and gold are the primary identity.",background:colors.paper,foreground:colors.ink,accent:colors.gold,colors:Object.values(core)}, {id:"ink",name:"Ink & gold",note:"Reverse panels use ink, paper and gold.",background:colors.ink,foreground:colors.paper,accent:colors.gold,colors:[colors.ink,colors.paper,colors.gold]}, {id:"gold",name:"Gold & ink",note:"Use ink text on gold and its lighter tints.",background:colors["gold-light"],foreground:colors.ink,accent:colors["gold-ink"],colors:[colors["gold-light"],colors.ink,colors.gold]}, {id:"stone",name:"Stone & paper",note:"Neutral panels use only mixes of the core paper, stone and ink.",background:colors["paper-soft"],foreground:colors.ink,accent:colors["gold-ink"],colors:[colors["paper-soft"],colors.stone,colors.ink,colors.gold]}];
fs.writeFileSync(filename,JSON.stringify(data,null,2)+"\n");
const guideFile="app/brand-guidelines/guide.tsx";
let guide=fs.readFileSync(guideFile,"utf8").replace(/#[0-9a-f]{6}\b/gi,(hex)=>mapping[hex.toLowerCase()]?colors[mapping[hex.toLowerCase()]]:hex);
guide=guide.replace("ink, deep forest or midnight", "ink").replace("Five families. Six tones each.","Two families. Core colors and their tints and shades.").replace("one supporting accent 5%", "stone 5%").replace("campaign panels may use a single supporting palette", "campaign panels use the same core colors and their hues").replace("Paper on deep forest","Paper on ink").replace("Burnt earth on blush","Gold ink on light gold").replace("Cloud on midnight","Paper on ink");
fs.writeFileSync(guideFile,guide);
const lines=Object.entries(colors).map(([key,hex])=>`  --brand-${key}: ${hex};`).join("\n");
fs.writeFileSync("app/brand-colors.css",`/* Core brand colors plus hues mixed only from those four colors. */\n:root {\n${lines}\n}\n`);
console.log("Restricted application styles and guide colors to four core colors and their mixes.");
