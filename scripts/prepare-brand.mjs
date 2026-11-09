import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync,mkdtempSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolve,dirname,join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const supplied=process.argv[2];
if(!supplied)throw Error('Usage: npm run prepare:brand -- "/absolute/path/Interlocked AP Letterman Patch Logo.png". Inspect the supplied artwork before running.');
const source=resolve(supplied),bytes=readFileSync(source);
if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('The supplied source must be the approved PNG original.');
const sourceSha256=createHash('sha256').update(bytes).digest('hex');
function magick(args){const result=spawnSync('magick',args,{encoding:'utf8'});if(result.error)throw Error('ImageMagick (magick) is required for deterministic asset optimization.');if(result.status!==0)throw Error(result.stderr||'ImageMagick failed');return result.stdout;}
const [sourceWidth,sourceHeight]=magick(['identify','-format','%w %h',source]).trim().split(/\s+/).map(Number);
// These bounds were reviewed against this exact supplied presentation board.
// The entire embroidered patch and its shadow are retained. The top-left board
// annotation lies outside the logo and is excluded using an adjacent, unaltered piece of the source background.
const crop={x:310,y:45,width:900,height:805};
const excludedPresentationLabel={x:0,y:0,width:80,height:30,backgroundSourceX:390,backgroundSourceY:45};
if(sourceWidth!==1536||sourceHeight!==1024)throw Error('Unexpected source dimensions; inspect artwork and review crop bounds before preparing assets.');
const original=join(root,'design/brand/Interlocked AP Letterman Patch Logo.png');
if(existsSync(original)&&!readFileSync(original).equals(bytes))throw Error('A different approved original is already retained. Review the existing asset before replacing it.');
mkdirSync(dirname(original),{recursive:true});if(source!==original)copyFileSync(source,original);
const out=join(root,'public/brand');mkdirSync(out,{recursive:true});
const temp=mkdtempSync(join(tmpdir(),'arena-brand-'));
try{
 const patch=join(temp,'approved-patch.png');
 magick([source,'-crop',`${crop.width}x${crop.height}+${crop.x}+${crop.y}`,'+repage',patch]);
 const background=join(temp,'source-background.png');
 magick([source,'-crop','80x30+390+45','+repage',background]);
 magick([patch,background,'-geometry','+0+0','-compose','Over','-composite',patch]);
 // Non-generative format/size derivatives. No tracing, recoloring, rotation,
 // letterform edits, distortion or removal of the patch's cream border.
 magick([patch,'-resize','256x256>','-define','webp:lossless=true',join(out,'ap-desktop.webp')]);
 magick([patch,'-resize','128x128>','-define','webp:lossless=true',join(out,'ap-mobile.webp')]);
 magick([patch,'-resize','900x900>','-define','webp:lossless=true',join(out,'ap-homepage.webp')]);
 magick([patch,'-resize','64x64','-background','none','-gravity','center','-extent','64x64',join(out,'favicon.png')]);
 magick([patch,'-resize','180x180','-background','none','-gravity','center','-extent','180x180',join(out,'apple-touch-icon.png')]);
 const files=['ap-desktop.webp','ap-mobile.webp','ap-homepage.webp','favicon.png','apple-touch-icon.png'];
 const derivatives=Object.fromEntries(files.map(file=>{const path='brand/'+file;const [width,height]=magick(['identify','-format','%w %h',join(out,file)]).trim().split(/\s+/).map(Number);return [path,{width,height,sha256:createHash('sha256').update(readFileSync(join(out,file))).digest('hex')}];}));
 const manifest={status:'ready',sourceFilename:'Interlocked AP Letterman Patch Logo.png',sourceSha256,sourceWidth,sourceHeight,crop,excludedPresentationLabel,desktopAsset:'brand/ap-desktop.webp',mobileAsset:'brand/ap-mobile.webp',homepageAsset:'brand/ap-homepage.webp',faviconAsset:'brand/favicon.png',appleTouchAsset:'brand/apple-touch-icon.png',width:crop.width,height:crop.height,derivatives};
 writeFileSync(join(root,'src/brand.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('Prepared approved-logo derivatives. Retained original SHA-256:',sourceSha256);
}finally{rmSync(temp,{recursive:true,force:true});}
