import {execFileSync} from 'node:child_process';
export const uxFiles=new Set(['server.mjs','src/views.mjs','src/unified-directory.mjs','src/unified-views.mjs','src/progressive-directory.mjs','public/state.js','public/app.js','public/siem.js']);
export function preservedBytes(base,file,options={}){
 let ref=base;
 if(file.startsWith('engine/')||file.startsWith('data/')||/^scripts\/(data-|reconcile-|validate-|ingest)/.test(file)){
  try{execFileSync('git',['cat-file','-e','5470bca:'+file],{stdio:'ignore'});ref='5470bca';}catch{}
 }
 // Preserve the latest My AP navigation in the retired renderer too.
 if(['src/release-views.mjs','src/siem-view.mjs','public/siem-model.js'].includes(file))ref='332ba1b';
 return execFileSync('git',['show',ref+':'+file],options);
}
