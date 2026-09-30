import fs from 'node:fs/promises';
import path from 'node:path';
const dir='deliverables/ready-margin-brand-guidelines/figma';
const skills='C:/Users/Admin/.codex/plugins/cache/openai-curated-remote/figma/15.0.0/skills';
const parsed=JSON.parse(await fs.readFile(path.join(dir,'build-input.json'),'utf8'));
const logos={};
function compact(n){if(n.svg){const key=n.form||(n.svg.includes('#F4F1E8')?'reverse':'primary');logos[key]=n.svg;n.svg=key;}if(n.children)n.children.forEach(compact);}
parsed.boards.forEach(b=>b.nodes.forEach(compact));
parsed.logos=logos;
const input=JSON.stringify(parsed);
let builder=await fs.readFile('scripts/figma-brand-builder.js.txt','utf8');
builder=builder.replace('INPUT',input).replace('HELPER_COLLECTION',await fs.readFile(`${skills}/figma-generate-library/scripts/createVariableCollection.js`,'utf8')).replace('HELPER_TOKENS',await fs.readFile(`${skills}/figma-generate-library/scripts/createSemanticTokens.js`,'utf8'));
builder=builder.replace(/\/\*[\s\S]*?\*\//g,'');
await fs.writeFile(path.join(dir,'mcp-builder.js'),builder);
await fs.writeFile(path.join(dir,'mcp-foundation.js'),builder.replace(input,JSON.stringify({...parsed,boards:parsed.boards.slice(0,4)})));
const portable=builder.replaceAll('figma.createAutoLayout(', 'createAutoLayout(');
const autoLayout=`function createAutoLayout(direction){const f=figma.createFrame();f.layoutMode=direction;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';return f;}`;
await fs.writeFile(path.join(dir,'code.js'),`(async()=>{\n${autoLayout}\n${portable}\n})().then(result=>{figma.closePlugin(result.alreadyExists?'Guidelines already exist.':'Ready Margin guidelines created.');}).catch(error=>{figma.closePlugin(error.message);});\n`);
try {
  const state=JSON.parse(await fs.readFile('brand-guidelines/figma-state.json','utf8'));
  const source=await fs.readFile('scripts/figma-brand-builder.js.txt','utf8');
  const helpers=source.slice(source.indexOf('function fill('),source.indexOf('// Construction masters'));
  const native=source.slice(source.indexOf('function native('),source.indexOf('const boardIds=[];'));
  const loop=source.slice(source.indexOf('const boardIds=[];'),source.lastIndexOf('return {createdNodeIds')).replace('200+(index%2)*1640','200+((index+OFFSET)%2)*1640').replace('Math.floor(index/2)','Math.floor((index+OFFSET)/2)');
  for(const [phase,start,end] of [[2,4,7],[3,7,10]]) {
    const context=`const {data,boards,logos}=${JSON.stringify({...parsed,boards:parsed.boards.slice(start,end)})};\nconst createdNodeIds=[];const remember=n=>{createdNodeIds.push(n.id);return n;};\nfunction hydrate(n){if(n.svg)n.svg=logos[n.svg];if(n.children)n.children.forEach(hydrate);}boards.forEach(b=>b.nodes.forEach(hydrate));\nawait Promise.all(['Regular','Medium','SemiBold'].map(style=>figma.loadFontAsync({family:'Plus Jakarta Sans',style})));\nconst page=await figma.getNodeByIdAsync(${JSON.stringify(state.pageId)});await figma.setCurrentPageAsync(page);\nconst vars=await figma.variables.getLocalVariablesAsync();const colorVars=Object.fromEntries(vars.filter(v=>v.variableCollectionId==='VariableCollectionId:3:36').map(v=>[v.name,v]));const spaceVars=Object.fromEntries(vars.filter(v=>v.variableCollectionId==='VariableCollectionId:3:75').map(v=>[v.name,v]));const hexMap={};data.palettes.forEach(f=>f.colors.forEach(c=>hexMap[c.hex]=colorVars[f.id+'/'+c.step]));data.semantic.filter(s=>s.id!=='attention').forEach(s=>hexMap[s.hex]=colorVars['status/'+s.id]);\nconst styles=Object.fromEntries((await figma.getLocalTextStylesAsync()).filter(s=>s.name.startsWith('Ready Margin / ')).map(s=>[s.name.slice(15),s]));\nconst swatch=await figma.getNodeByIdAsync(${JSON.stringify(state.components.swatch)});const labelKey=${JSON.stringify(state.components.swatchPropertyKeys.labelKey)},hexKey=${JSON.stringify(state.components.swatchPropertyKeys.hexKey)};const logoMasters={};for(const [name,id] of Object.entries(${JSON.stringify(state.components.logos)}))logoMasters[name]=await figma.getNodeByIdAsync(id);\nfunction hexToFigmaColor(h){h=h.replace('#','');return {r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255,a:1};}\n`;
    await fs.writeFile(path.join(dir,`mcp-phase-${phase}.js`),context+helpers+native+loop.replaceAll('OFFSET',String(start))+`return {createdNodeIds,pageId:page.id,boardIds,editableTextCount:page.findAllWithCriteria({types:['TEXT']}).length,instanceCount:page.findAllWithCriteria({types:['INSTANCE']}).length};`);
  }
} catch(error) {if(error.code!=='ENOENT')throw error;}
console.log(`Native Figma builder prepared: ${builder.length} characters.`);
