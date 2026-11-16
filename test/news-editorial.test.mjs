import test from 'node:test';
import assert from 'node:assert/strict';
import {imageCandidates,normalizeFeed} from '../src/rss-feed.mjs';
import {approvedArticleImage} from '../public/news-editorial.js';
import {createServer} from '../server.mjs';
import {readFile} from 'node:fs/promises';
test('media thumbnails, image enclosures, groups and embedded images are unapproved metadata only',()=>{
 const raw={'media:thumbnail':{'@_url':'https://photos.example/thumb.jpg'},'media:group':{'media:content':[{'@_url':'https://photos.example/photo.jpg','@_medium':'image'},{'@_url':'https://photos.example/movie.mp4','@_medium':'video'}]},enclosure:{'@_url':'https://photos.example/enclosure.webp','@_type':'image/webp'},description:'<img src="https://photos.example/embedded.jpg"><img src="javascript:alert(1)">'};
 const images=imageCandidates(raw);assert.equal(images.length,4);assert.ok(images.every(i=>i.displayApproved===false));assert.deepEqual(images.map(i=>i.origin),['media:thumbnail','media:content','enclosure','embedded-image']);assert.equal(imageCandidates({'media:thumbnail':{'@_url':'http://photos.example/insecure.jpg'}}).length,0);
});
test('image metadata is bounded, deduplicated and survives RSS and Atom normalization',()=>{
 assert.equal(imageCandidates({'media:thumbnail':Array.from({length:12},(_,i)=>({'@_url':'https://photos.example/'+i+'.jpg'}))}).length,6);
 assert.equal(imageCandidates({enclosure:{'@_url':'https://photos.example/x.jpg','@_type':'image/jpeg'},description:'<img src="https://photos.example/x.jpg">'}).length,1);
 const source={id:'test',sport:'swimming',name:'Test',coverage:[]};
 for(const xml of ['<rss xmlns:media="http://search.yahoo.com/mrss/"><channel><item><title>Meet result</title><link>https://news.example/story</link><pubDate>2026-11-12</pubDate><media:thumbnail url="https://photos.example/photo.jpg"/></item></channel></rss>','<feed><entry><title>Meet result</title><link href="https://news.example/story"/><published>2026-11-12</published><link rel="enclosure" type="image/jpeg" href="https://photos.example/photo.jpg"/></entry></feed>'])assert.equal(normalizeFeed(xml,source)[0].imageCandidates[0].displayApproved,false);
});
test('publisher image requires explicit article-specific approval, local asset and licensing',()=>{
 const item={url:'https://news.example/story',image:{url:'/assets/editorial/story.webp',articleURL:'https://news.example/story',credit:'Photographer',license:'Permission recorded',permitted:true}};
 assert.equal(approvedArticleImage(item),item.image);
 for(const change of [{permitted:false},{articleURL:'https://news.example/other'},{credit:''},{license:''},{url:'https://publisher.example/image.jpg'},{url:'/assets/editorial/../secret.jpg'}])assert.equal(approvedArticleImage({...item,image:{...item.image,...change}}),null);
 assert.equal(approvedArticleImage({url:item.url,imageCandidates:[{url:'https://photos.example/x.jpg',displayApproved:true}]}),null);
});
test('photography endpoint reuses licensed AP manifest, serves all four sports and no stadium fallback',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../src/photography.json',import.meta.url)));
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 try{
  const photos=await(await fetch(base+'/api/news-photography')).json();assert.deepEqual(Object.keys(photos).sort(),['basketball','lacrosse','swimming','volleyball']);
  for(const [sport,p] of Object.entries(photos)){assert.deepEqual(p,manifest[sport]);for(const asset of [p.asset,p.smallAsset]){const r=await fetch(base+'/assets/'+asset);assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/image\/webp/);}}
  const js=await fetch(base+'/assets/news-editorial.js');assert.equal(js.status,200);assert.match(js.headers.get('content-type'),/javascript/);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
