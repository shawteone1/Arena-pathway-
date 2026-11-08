import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { catalog, sports, sections, validateCatalog } from './src/catalog.mjs';
import {photography,brand} from './src/presentation.mjs';
import { layout, home, sportPage, builder, myPathway, dataPage, credits } from './src/views.mjs';
const assets = { 'style.css':'text/css; charset=utf-8', 'app.js':'text/javascript; charset=utf-8', 'state.js':'text/javascript; charset=utf-8', 'stadium.jpg':'image/jpeg' };
assets['fonts/barlow-condensed-bold.ttf']='font/ttf';
for(const p of Object.values(photography)){assets[p.asset]='image/webp';assets[p.smallAsset]='image/webp';}
if(brand.status==='ready')for(const key of ['desktopAsset','mobileAsset','faviconAsset','appleTouchAsset']){const path=brand[key];assets[path]=path.endsWith('.webp')?'image/webp':'image/png';}
export function createServer() {
 return http.createServer(async (req,res) => {
  const headers = { 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'" };
  const send = (status, body, type='text/html; charset=utf-8') => { res.writeHead(status,{...headers,'Content-Type':type});res.end(req.method==='HEAD'?undefined:body); };
  if (!['GET','HEAD'].includes(req.method)) {res.setHeader('Allow','GET, HEAD');return send(405,'Method not allowed','text/plain');}
  try {
   const url=new URL(req.url,'http://localhost'), path=url.pathname;
   if(path.startsWith('/assets/')) {
    const name=path.slice(8);if(!Object.hasOwn(assets,name))return send(404,'Not found','text/plain');
    return send(200,await readFile(new URL('./public/'+name,import.meta.url)),assets[name]);
   }
   if(path==='/health')return send(200,JSON.stringify({ok:true,version:'0.7.0-development'}),'application/json');
   if(path==='/api/catalog')return send(200,JSON.stringify(catalog),'application/json');
   if(path==='/api/coverage')return send(200,JSON.stringify(validateCatalog()),'application/json');
   if(path==='/')return send(200,home());
   if(path==='/build')return send(200,builder());
   if(path==='/my-pathway')return send(200,myPathway());
   if(path==='/data')return send(200,dataPage());
   if(path==='/credits')return send(200,credits());
   const m=path.match(/^\/sports\/([a-z]+)(?:\/([a-z]+))?\/?$/);
   if(m&&sports.includes(m[1])&&(!m[2]||sections.includes(m[2])))return send(200,sportPage(m[1],m[2],url.searchParams));
   return send(404,layout('Page not found','<main id="main" class="section"><h1>Off the beaten path.</h1><p>This page doesn’t exist.</p><a class="button" href="/">BACK TO HOME</a></main>'));
  } catch(error) {console.error(error);send(500,'Something went wrong. Please try again.','text/plain');}
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const report=validateCatalog();if(!report.valid)throw Error(report.errors.join('\n'));
 createServer().listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Arena Pathway: http://localhost:'+(Number(process.env.PORT)||3000)));
}
