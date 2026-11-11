import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createServer} from '../server.mjs';
import {home,builder,advancedBuilder,sportPage,layout} from '../src/views.mjs';
import {catalog,sports} from '../src/catalog.mjs';
import {photography,brand,swimProgram} from '../src/presentation.mjs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
test('reviewed catalog and catalog queries remain byte-preserved while participation behavior evolves',()=>{
 const hashes=JSON.parse(read('test/fixtures/v06-preserved.json'));
 // Profile state and workspace interactions intentionally change for independent module choices.
 // Their behavior, migration and persistence are covered by application and pathway regression tests.
 for(const path of ['data/catalog.json','src/catalog.mjs'])assert.equal(createHash('sha256').update(readFileSync(new URL(path,root))).digest('hex'),hashes[path],path);
});
test('homepage is an umbrella editorial experience with a single five-destination Sports menu',()=>{
 const html=home();const nav=html.match(/<nav aria-label="Sports">(.*?)<\/nav>/s)[1];
 assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]),['/sports/lacrosse','/sports/volleyball','/sports/basketball','/sports/swimming','/build']);
 assert.match(html,/YOUR SPORT\.<br><span>YOUR PATH\.<\/span><br>ONE PLACE\./);
 assert.match(html,/01 \/ DISCOVERY/);assert.match(html,/02 \/ DEVELOPMENT/);assert.match(html,/03 \/ OPPORTUNITY/);
 assert.ok(!html.includes('sport-grid'));assert.ok(!html.includes('class="letterman"'));
 assert.match(html,/photos\/stadium.webp/);assert.match(html,/id="sports"/);
});
test('generic A is not rendered and only approved artwork is used when the brand is ready',()=>{
 for(const html of [home(),builder(),layout('Test','')]){assert.ok(!html.includes('/assets/a.svg'));assert.ok(!html.includes('letterman A'));assert.ok(!html.includes('>AP<'));}
 if(brand.status==='ready'){
  assert.match(brand.sourceSha256,/^[a-f0-9]{64}$/);for(const key of ['desktopAsset','mobileAsset','faviconAsset','appleTouchAsset'])assert.ok(existsSync(new URL('public/'+brand[key],root)));
  assert.ok(layout('Test','').includes(brand.faviconAsset));
 }else{assert.equal(brand.status,'awaiting-original');assert.equal(brand.sourceSha256,null);assert.ok(!layout('Test','').includes('rel="icon"'));}
});
test('sport landing pages retain sections, use their own images and emphasize View All Teams',()=>{
 for(const s of sports){const html=sportPage(s,undefined,new URLSearchParams());assert.ok(html.includes('photos/'+s+'.webp'));assert.match(html,/role="search"/);for(const section of ['youth','tryouts','camps','community'])assert.ok(html.includes(`/sports/${s}/${section}`));assert.ok(html.includes('result-count'));}
});
test('directories separate participation categories, group clubs first and retain explicit team searches',()=>{
 const html=sportPage('lacrosse','teams',new URLSearchParams());
 for(const path of ['youth','high-school','college','adult','community'])assert.ok(html.includes(`/sports/lacrosse/${path}`));
 assert.ok(html.includes('Youth Clubs &amp; Programs'));assert.ok(!html.includes('data-record="du"'));assert.ok(!html.includes('data-record="cll"'));
 const teams=sportPage('lacrosse','teams',new URLSearchParams('kind=team'));assert.ok(teams.includes('group-team'));assert.ok(!teams.includes('id="group-club"'));
 assert.match(html,/role="search"/);assert.match(html,/name="kind"/);assert.match(html,/name="city"/);
});
test('swimming classification follows explicit catalog evidence without inventing summer status',()=>{
 assert.deepEqual(catalog.organizations.filter(o=>swimProgram(o)==='year-round').map(o=>o.id).sort(),['dsa','loveland']);
 assert.equal(swimProgram(catalog.organizations.find(o=>o.id==='fst')),'unclassified');
 assert.equal(swimProgram(catalog.organizations.find(o=>o.id==='mhsl-wc3')),'unclassified');
 assert.equal(catalog.organizations.filter(o=>swimProgram(o)==='summer-league').length,0);
 let html=sportPage('swimming','teams',new URLSearchParams('program=year-round&q=Foothills'));assert.ok(html.includes('data-record="fst"'));assert.ok(html.includes('swim-csi-embedded')); // New explicit CSI Year Round evidence updates the presentation without rewriting the preserved catalog.
 html=sportPage('swimming','teams',new URLSearchParams('program=year-round&q=Denver%20Swim'));assert.ok(html.includes('data-record="dsa"'));
 html=sportPage('swimming','teams',new URLSearchParams('program=summer-league'));assert.ok(html.includes('Summer-league programs'));assert.ok(!html.includes('data-record="dsa"'));assert.ok(!html.includes('data-record="fst"'));
});
test('onboarding retains every existing interaction hook and media defaults while exposing journey chapters',()=>{
 const html=advancedBuilder();for(const id of ['pathway-form','role','nickname','parent-controls','guardian','sport','region','goal','media-enabled','media-options','form-status'])assert.ok(html.includes(`id="${id}"`));
 for(const id of ['your-start','your-direction','your-sources'])assert.ok(html.includes(`id="${id}"`));
 assert.ok(!html.match(/<input[^>]*id="media-enabled"[^>]*checked/));assert.match(html,/id="media-options" hidden/);
 assert.equal((html.match(/name="interests"/g)||[]).length,5);assert.equal((html.match(/name="media-source"/g)||[]).length,catalog.mediaSources.length);
});
test('requested palette, iPhone input sizing, responsive assets and keyboard focus have structural coverage',()=>{
 const css=read('public/style.css');for(const color of ['#111827','#F3EFE6','#A52A3B','#B1B5BC'])assert.ok(css.includes(color));assert.ok(!/--gold|#e1b56b|#edbd68/i.test(css));
 assert.match(css,/@media\(max-width:650px\)/);assert.match(css,/@media\(max-width:1024px\)/);assert.match(css,/font-size: 16px/);assert.match(css,/min-height:48px/);assert.match(css,/focus-visible/);assert.match(css,/prefers-reduced-motion/);assert.ok(!/overflow-x:\s*hidden/.test(css));
 for(const key of ['stadium',...sports]){const p=photography[key];assert.ok(p.page.startsWith('https://commons.wikimedia.org/'));assert.ok(p.artist);assert.ok(p.license);for(const asset of [p.asset,p.smallAsset])assert.ok(existsSync(new URL('public/'+asset,root)));assert.match(home(),/srcset=/);}
 // Structural checks only: no screenshot or touch-interaction pass is implied.
});
test('new responsive photos, font assets and version are served without broad filesystem exposure',async t=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 for(const p of Object.values(photography))for(const path of [p.asset,p.smallAsset]){const response=await fetch(base+'/assets/'+path);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/webp');await response.arrayBuffer();}
 assert.equal((await fetch(base+'/assets/fonts/barlow-condensed-bold.ttf')).status,200);assert.equal((await fetch(base+'/assets/../src/brand.json')).status,404);assert.equal((await fetch(base+'/assets/a.svg')).status,404);
 assert.equal((await (await fetch(base+'/health')).json()).version,'0.7.0-development');
});
test('primary text and action palette pairs meet WCAG AA normal-text contrast',()=>{
 const luminance=hex=>{const rgb=hex.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];};
 for(const [foreground,background] of [['#111827','#F3EFE6'],['#FFFFFF','#A52A3B'],['#B1B5BC','#111827'],['#595D64','#F3EFE6']]){const a=luminance(foreground),b=luminance(background);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${foreground} on ${background}`);}
 // Photographic overlays still need real-browser contrast and visual review.
});
test('approved AP original is retained exactly and all derivative bytes match the reviewed manifest',()=>{
 assert.equal(brand.status,'ready');
 const original=readFileSync(new URL('design/brand/Interlocked AP Letterman Patch Logo.png',root));
 assert.equal(createHash('sha256').update(original).digest('hex'),'e6416a5689f562260f3f15ed272c5427e04e7a77bcc387cb2436dccc7659f9ce');
 assert.equal(brand.sourceSha256,createHash('sha256').update(original).digest('hex'));
 assert.deepEqual([brand.sourceWidth,brand.sourceHeight],[1536,1024]);
 assert.deepEqual(brand.crop,{x:310,y:45,width:900,height:805});
 for(const [path,info] of Object.entries(brand.derivatives)){
  assert.equal(createHash('sha256').update(readFileSync(new URL('public/'+path,root))).digest('hex'),info.sha256,path);
  if(path.endsWith('.webp'))assert.ok(Math.abs(info.height-info.width*brand.height/brand.width)<=1,'aspect ratio: '+path);
 }
 assert.deepEqual([brand.derivatives[brand.faviconAsset].width,brand.derivatives[brand.faviconAsset].height],[64,64]);
 assert.deepEqual([brand.derivatives[brand.appleTouchAsset].width,brand.derivatives[brand.appleTouchAsset].height],[180,180]);
});
test('homepage, shared navigation, mobile picture source and browser icons use approved asset paths',async t=>{
 const html=home();assert.ok(html.includes(brand.homepageAsset));assert.ok(html.includes('alt="Approved Arena Pathway interlocked AP letterman patch"'));
 for(const page of [html,builder(),sportPage('swimming',undefined,new URLSearchParams())]){
  assert.ok(page.includes(`<source media="(max-width:650px)" srcset="/assets/${brand.mobileAsset}">`));
  assert.ok(page.includes('src="/assets/'+brand.desktopAsset+'"'));
  assert.ok(page.includes('href="/assets/'+brand.faviconAsset+'"'));
  assert.ok(page.includes('href="/assets/'+brand.appleTouchAsset+'"'));
 }
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const base='http://127.0.0.1:'+server.address().port;
 for(const key of ['desktopAsset','mobileAsset','homepageAsset','faviconAsset','appleTouchAsset']){
  const path=brand[key],response=await fetch(base+'/assets/'+path);assert.equal(response.status,200);
  assert.equal(response.headers.get('content-type'),path.endsWith('.webp')?'image/webp':'image/png');
  assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex'),brand.derivatives[path].sha256);
 }
});
