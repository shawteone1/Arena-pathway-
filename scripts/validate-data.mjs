import {validateCatalog} from '../src/catalog.mjs';
const r=validateCatalog();
console.log('Catalog:',r.valid?'PASS':'FAIL');
console.log('Counts:',JSON.stringify(r.counts));
for(const i of r.importReports)console.log(`${i.label}: ${i.imported}/${i.expected} — ${i.status}`);
console.log('Quality:',JSON.stringify(r.quality));
for(const error of r.errors)console.error(error);
if(!r.valid)process.exitCode=1;
