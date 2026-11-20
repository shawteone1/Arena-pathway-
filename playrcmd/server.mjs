import {activeBrand,brandAssetNames} from './brand.mjs';
import http from 'node:http';
import reviewConfig from './review.config.json' with {type:'json'};
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {landing,demoPage,integrations,roleSelector} from './views.mjs';
import {hostedController,hostedTour} from './controller-adapter.mjs';
import {networkProjection} from './network.mjs';
// Explicit smallest SIEM dependency closure, not the AP application asset registry.
export const sharedAssets=new Set(['playrcmd-onboarding.js','playrcmd-roles.js','siem-platform.css','style.css','fonts/barlow-condensed-bold.ttf','siem-platform.js','siem-platform-model.js','siem-platform-fixtures.js','siem-family-fixtures.js','siem-additions.js','siem-guidance.js','siem-calendar.js','local-family-calendar.js','siem.js','siem-model.js','state.js','athlete-lifecycle.js','recurring-plans.js','regions.js','meet-sessions.js']);
export const brandAssets=new Map(brandAssetNames.map(name=>[activeBrand.base+name,new URL('./public/brand/'+activeBrand.sport+'/'+name,import.meta.url)]));
export function createPlayRcmdServer(){return http.createServer(async(req,res)=>{
 const send=(status,body,type='text/html; charset=utf-8')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"});res.end(req.method==='HEAD'?undefined:body);};
 if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');return send(405,'Method not allowed','text/plain');}
 try{const url=new URL(req.url,'http://localhost'),path=url.pathname;
 if(path==='/')return send(200,landing());
 if(path==='/roles')return send(200,roleSelector());
 if(path==='/api/network')return send(200,JSON.stringify(networkProjection(url.searchParams)),'application/json');
 if(path==='/demo'){
  if(!['family','local','college','coach'].includes(url.searchParams.get('scenario'))){url.searchParams.set('scenario','family');res.setHeader('Location','/demo?'+url.searchParams);return send(302,'Continue to fictional family demo.','text/plain');}
  return send(200,demoPage(false,url.searchParams.get('scenario')));
 }
 if(path==='/setup')return send(200,demoPage(true));
 if(path==='/integrations')return send(200,integrations());
 if(path==='/health')return send(200,JSON.stringify({ok:true,product:'PlayRcmd',version:'1.0.0',mode:'fictional-demo'}),'application/json');
 // Existing controllers expect this read-only shape. No directory or production data exposed.
 if(path==='/api/catalog')return send(200,JSON.stringify({opportunities:[],sources:[],organizations:[]}), 'application/json');
 let file=brandAssets.get(path);
 if(path.startsWith('/assets/')&&sharedAssets.has(path.slice(8)))file=new URL('../public/'+path.slice(8),import.meta.url);
 if(['/playrcmd/onboarding.js','/playrcmd/onboarding.css','/playrcmd/polish.css','/playrcmd/dm-sans-regular.ttf','/playrcmd/dm-sans-bold.ttf','/playrcmd/landing-polish.js','/playrcmd/enterprise-stadium.jpg','/playrcmd/style.css','/playrcmd/adapter.js','/playrcmd/role-tools.js','/playrcmd/favicon.svg'].includes(path))file=new URL('./public/'+path.split('/').pop(),import.meta.url);
 if(file&&path==='/assets/siem-guidance.js')return send(200,hostedTour(await readFile(file,'utf8')),'text/javascript');
 if(file&&path==='/assets/siem-platform.js')return send(200,hostedController(await readFile(file,'utf8')),'text/javascript');
 if(file){const type=file.pathname.endsWith('.webp')?'image/webp':file.pathname.endsWith('.png')?'image/png':file.pathname.endsWith('.ico')?'image/x-icon':file.pathname.endsWith('.css')?'text/css':file.pathname.endsWith('.js')?'text/javascript':file.pathname.endsWith('.svg')?'image/svg+xml':file.pathname.endsWith('.jpg')?'image/jpeg':'font/ttf';return send(200,await readFile(file),type);}
 return send(404,'PlayRcmd: page not found.','text/plain');
 }catch(error){console.error(error);return send(500,'Unable to load demonstration.','text/plain');}
 });}
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PLAYRCMD_PORT||reviewConfig.port);createPlayRcmdServer().listen(port,process.env.PLAYRCMD_HOST||reviewConfig.host,()=>console.log(`PlayRcmd local review: http://127.0.0.1:${port}`));}
