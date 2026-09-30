import fs from 'node:fs/promises';
const root='public/brand-guide/site';
await fs.cp('deliverables/ready-margin-brand-guidelines/website',root,{recursive:true});
console.log('Isolated website preview ready.');
