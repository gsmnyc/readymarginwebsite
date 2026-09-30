import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const root=process.cwd();
const directory=path.join(root,"release","brand-site");
await fs.mkdir(directory,{recursive:true});
const entry=path.join(directory,"entry.tsx");
await fs.writeFile(entry,`import { createRoot } from 'react-dom/client'; import { BrandGuide } from ${JSON.stringify(path.join(root,"app/brand-guidelines/guide").replaceAll("\\","/"))}; createRoot(document.getElementById('root')!).render(<BrandGuide assetRoot='./assets' downloadRoot='./downloads' portable />);`);
await build({entryPoints:[entry],outfile:path.join(directory,"app.js"),bundle:true,minify:true,format:"iife",jsx:"automatic",platform:"browser",define:{"process.env.NODE_ENV":'"production"'},alias:{"@":root},external:["/brand-guide/*"]});
await fs.copyFile(path.join(directory,"app.js"),"public/brand-guide/site/app.js");
let css=await fs.readFile(path.join(directory,"app.css"),"utf8");
css=css.replaceAll("/brand-guide/PlusJakartaSans-variable.woff2","./assets/PlusJakartaSans-variable.woff2");
await fs.writeFile("public/brand-guide/site/app.css",`*{box-sizing:border-box}body{margin:0}button,a{touch-action:manipulation}button{cursor:pointer}\n${css}`);
const data=JSON.parse(await fs.readFile("content/brand-guidelines.json","utf8"));
const tokens={$description:"Ready Margin core colors and hues derived from them",color:Object.fromEntries(data.palettes.map(f=>[f.id,Object.fromEntries(f.colors.map(c=>[c.step,{$type:"color",$value:c.hex,$description:c.name}]))])),semantic:Object.fromEntries(data.semantic.map(c=>[c.id,{$type:"color",$value:c.hex,$description:c.use}])),typography:{family:{$type:"fontFamily",$value:"Plus Jakarta Sans"}}};
for(const target of ["public/brand-guide/downloads/ready-margin-tokens.json","public/brand-guide/site/downloads/ready-margin-tokens.json"]) await fs.writeFile(target,JSON.stringify(tokens,null,2)+"\n");
console.log("Standalone brand reference and color tokens rebuilt from the restricted palette.");
