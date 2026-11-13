import {communityPage,resourcePage,lockedInPreview} from './src/consolidated-views.mjs';
import {legacySiemDestination} from './src/siem-navigation.mjs';
import {siemPlatformPage} from './src/siem-platform-view.mjs';
import {aboutPage,offeringsPage,collectivePage,soccerPreview} from './src/release-views.mjs';
import {siemPage} from './src/siem-view.mjs';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { sports, sections, validateCatalog } from './src/catalog.mjs';
import {catalog,engineCoverage,directoryRows,filterEngineRows} from './src/engine-directory.mjs';
import {clientCatalog,directory,reviewReport} from './src/unified-directory.mjs';
import {DESIGNATIONS} from './engine/participation.mjs';
import {engineCoverageHTML} from './src/engine-views.mjs';
import {photography,brand} from './src/presentation.mjs';
import { esc, layout, home, sportPage, builder, advancedBuilder, myPathway, dataPage, credits, organizationPage, classificationPage } from './src/views.mjs';
const assets = { 'style.css':'text/css; charset=utf-8', 'app.js':'text/javascript; charset=utf-8', 'state.js':'text/javascript; charset=utf-8', 'regions.js':'text/javascript; charset=utf-8', 'stadium.jpg':'image/jpeg' };
assets['siem-platform.css']='text/css; charset=utf-8';
for(const name of ['schedule-presentation.js','meet-sessions.js','swimming-progress.js','lockedin-demo.js','lockedin-demo-model.js','siem-guidance.js','college-research.js','athlete-journey.js','content-library.js','local-family-calendar.js','profile-qa.js','athlete-records.js','media-library.js','calendar-import.js','recurring-plans.js','siem-calendar.js','siem-platform-boot.js','siem-family-fixtures.js','siem-platform.js','siem-platform-model.js','siem-platform-fixtures.js','siem.js','siem-model.js','release-demo.js','release-demo-model.js'])assets[name]='text/javascript; charset=utf-8';
assets['fonts/barlow-condensed-bold.ttf']='font/ttf';
for(const p of Object.values(photography)){assets[p.asset]='image/webp';assets[p.smallAsset]='image/webp';}
if(brand.status==='ready')for(const key of ['desktopAsset','mobileAsset','homepageAsset','faviconAsset','appleTouchAsset']){const path=brand[key];assets[path]=path.endsWith('.webp')?'image/webp':'image/png';}
export function createServer() {
 return http.createServer(async (req,res) => {
  const headers = { 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'strict-origin-when-cross-origin', 'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'" };
  const send = (status, body, type='text/html; charset=utf-8') => { res.writeHead(status,{...headers,'Content-Type':type});res.end(req.method==='HEAD'?undefined:body); };
  if (!['GET','HEAD'].includes(req.method)) {res.setHeader('Allow','GET, HEAD');return send(405,'Method not allowed','text/plain');}
  try {
   const url=new URL(req.url,'http://localhost'), path=url.pathname;
   if(path.startsWith('/assets/')) {
    const name=path.slice(8);if(!Object.hasOwn(assets,name))return send(404,'Not found','text/plain');
    return send(200,await readFile(new URL('./public/'+name,import.meta.url)),assets[name]);
   }
   if(path==='/health')return send(200,JSON.stringify({ok:true,version:'0.7.0-development'}),'application/json');
   if(path==='/api/data/coverage')return send(200,JSON.stringify(engineCoverage),'application/json');
   if(path==='/api/data/classification')return send(200,JSON.stringify(reviewReport),'application/json');
   if(path==='/api/data/directory'){const sport=url.searchParams.get('sport')||'lacrosse',designation=url.searchParams.get('designation')||'youth';if(!sports.includes(sport)||!DESIGNATIONS.includes(designation))return send(400,'Invalid sport or designation','text/plain');return send(200,JSON.stringify(directory(sport,designation,url.searchParams)),'application/json');}
   if(path==='/data/classification')return send(200,classificationPage());
   const orgMatch=path.match(/^\/organizations\/([a-zA-Z0-9_-]+)\/?$/);if(orgMatch){const html=organizationPage(orgMatch[1],url.searchParams);if(html)return send(200,html);}
   if(path==='/data/engine')return send(200,layout('Colorado data coverage',engineCoverageHTML(esc),'data-engine'));
   if(path==='/api/reviewed-content')return send(200,await readFile(new URL('./data/content-review.json',import.meta.url)),'application/json');
   if(path==='/api/content-presentation')return send(200,await readFile(new URL('./data/content-presentation.json',import.meta.url)),'application/json');
   if(path==='/api/content-sources')return send(200,await readFile(new URL('./data/sport-content-sources.json',import.meta.url)),'application/json');
   if(path==='/api/catalog')return send(200,JSON.stringify(clientCatalog),'application/json');
   if(path==='/api/coverage')return send(200,JSON.stringify(validateCatalog()),'application/json');
   if(path==='/')return send(200,home());
   if(path==='/about')return send(200,aboutPage());
   if(path==='/offerings')return send(200,offeringsPage());
   if(path==='/collective-data')return send(200,collectivePage());
   if(path==='/soccer-center')return send(200,soccerPreview());
   const siemRedirect=legacySiemDestination(path,url.searchParams);if(siemRedirect){res.setHeader('Location',siemRedirect);return send(302,'Continue to My AP.','text/plain');}
   if(path==='/my-ap'||path==='/siem/platform')return send(200,siemPlatformPage());
   if(path==='/siem/setup')return send(200,siemPage());
   if(path==='/pathway/settings')return send(200,advancedBuilder());
   if(path==='/build')return send(200,builder());
   if(path==='/community')return send(200,communityPage(sports.includes(url.searchParams.get('sport'))?url.searchParams.get('sport'):''));
   if(path==='/locked-in-demo')return send(200,lockedInPreview());
   const resource=path.match(/^\/sports\/(lacrosse|volleyball|basketball|swimming)\/(news|development)$/);if(resource)return send(200,resourcePage(resource[1],resource[2]));
   if(path==='/recruiting')return send(200,myPathway({recruiting:true}));
   if(path==='/my-pathway')return send(200,myPathway());
   if(path==='/data')return send(200,dataPage());
   if(path==='/credits')return send(200,credits());
   const m=path.match(/^\/sports\/([a-z]+)(?:\/([a-z-]+))?\/?$/);
   if(m&&sports.includes(m[1])&&sports.includes(url.searchParams.get('sport'))&&url.searchParams.get('sport')!==m[1]){const target=url.searchParams.get('sport');url.searchParams.delete('sport');res.setHeader('Location','/sports/'+target+(m[2]?'/'+m[2]:'')+'?'+url.searchParams.toString());return send(302,'');}
   if(m&&sports.includes(m[1])&&(!m[2]||[...sections,...DESIGNATIONS,'schedules'].includes(m[2])))return send(200,sportPage(m[1],m[2],url.searchParams));
   return send(404,layout('Page not found','<main id="main" class="section"><h1>Off the beaten path.</h1><p>This page doesn’t exist.</p><a class="button" href="/">BACK TO HOME</a></main>'));
  } catch(error) {console.error(error);send(500,'Something went wrong. Please try again.','text/plain');}
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
 const report=validateCatalog();if(!report.valid)throw Error(report.errors.join('\n'));
 createServer().listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Arena Pathway: http://localhost:'+(Number(process.env.PORT)||3000)));
}
