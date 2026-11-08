import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const supplied=process.argv[2];
if(!supplied)throw Error('Usage: npm run prepare:brand -- "/absolute/path/Interlocked AP Letterman Patch Logo.png". Inspect the supplied artwork before running.');
const source=resolve(supplied), bytes=readFileSync(source);
if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('The supplied source must be the approved PNG original.');
function magick(args){const result=spawnSync('magick',args,{encoding:'utf8'});if(result.error)throw Error('ImageMagick (magick) is required for deterministic asset optimization.');if(result.status!==0)throw Error(result.stderr||'ImageMagick failed');return result.stdout;}
const [width,height]=magick(['identify','-format','%w %h',source]).trim().split(/\s+/).map(Number);
if(!width||!height)throw Error('Could not determine source dimensions.');
const original=join(root,'design/brand/Interlocked AP Letterman Patch Logo.png');
if(existsSync(original)&&!readFileSync(original).equals(bytes))throw Error('A different approved original is already retained. Review the existing asset before replacing it.');
mkdirSync(dirname(original),{recursive:true});if(source!==original)copyFileSync(source,original);
const out=join(root,'public/brand');mkdirSync(out,{recursive:true});
// Format/size derivatives only. No tracing, cropping, recoloring, distortion,
// background removal or generative changes. The original is retained unchanged.
magick([source,'-resize','256x256>','-define','webp:lossless=true',join(out,'ap-desktop.webp')]);
magick([source,'-resize','128x128>','-define','webp:lossless=true',join(out,'ap-mobile.webp')]);
magick([source,'-resize','64x64','-background','none','-gravity','center','-extent','64x64',join(out,'favicon.png')]);
magick([source,'-resize','180x180','-background','none','-gravity','center','-extent','180x180',join(out,'apple-touch-icon.png')]);
const manifest={status:'ready',sourceFilename:'Interlocked AP Letterman Patch Logo.png',sourceSha256:createHash('sha256').update(bytes).digest('hex'),desktopAsset:'brand/ap-desktop.webp',mobileAsset:'brand/ap-mobile.webp',faviconAsset:'brand/favicon.png',appleTouchAsset:'brand/apple-touch-icon.png',width,height};
writeFileSync(join(root,'src/brand.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared faithful web derivatives. Original SHA-256:',manifest.sourceSha256);
