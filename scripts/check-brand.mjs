import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {brand} from '../src/presentation.mjs';
const errors=[];
if(brand.status!=='ready')errors.push('Approved logo original is missing. Do not mark the visual redesign complete.');
if(brand.status==='ready'){
 const original=new URL('../design/brand/Interlocked AP Letterman Patch Logo.png',import.meta.url);
 if(!existsSync(original))errors.push('Retained approved original missing');
 else if(createHash('sha256').update(readFileSync(original)).digest('hex')!==brand.sourceSha256)errors.push('Approved original SHA-256 mismatch');
 for(const k of ['desktopAsset','mobileAsset','faviconAsset','appleTouchAsset'])if(!brand[k]||!existsSync(new URL('../public/'+brand[k],import.meta.url)))errors.push('Missing '+k);
 if(!brand.width||!brand.height)errors.push('Missing intrinsic logo dimensions');
}
if(errors.length){errors.forEach(e=>console.error('BLOCKED:',e));process.exitCode=1;}else console.log('Approved source, source hash and all web treatments verified. Visual fidelity still requires manual comparison.');
