import {execFileSync} from 'node:child_process';
export const uxFiles=new Set(['server.mjs','src/views.mjs','src/unified-directory.mjs','src/unified-views.mjs','src/progressive-directory.mjs','public/state.js','public/app.js','public/siem.js','public/siem-platform-model.js']); // Nov 12: additive event categories/local source; domain and fixtures remain frozen.
export function preservedBytes(base,file,options={}){
 let ref=base;
 if(file.startsWith('engine/')||file.startsWith('data/')||/^scripts\/(data-|reconcile-|validate-|ingest)/.test(file)){
  try{execFileSync('git',['cat-file','-e','5470bca:'+file],{stdio:'ignore'});ref='5470bca';}catch{}
 }
 // Preserve the latest My AP navigation in the retired renderer too.
 if(['src/release-views.mjs','src/siem-view.mjs','public/siem-model.js'].includes(file))ref='332ba1b';
 const original=execFileSync('git',['show',ref+':'+file],options);
 if(file==='src/release-views.mjs'){const next=original.toString().replace("'/build','Choose your pathway modules'","'/recruiting','Explore recruiting'");return typeof original==='string'?next:Buffer.from(next);}
 return original;
}
