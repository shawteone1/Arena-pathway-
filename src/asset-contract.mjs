import {createHash} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
// Revalidate every asset; the page revision prevents mixed stylesheet generations in preview proxies.
const publicURL=new URL('../public/',import.meta.url);
export const assetRevision=createHash('sha256').update(readdirSync(publicURL).filter(n=>/\.(css|js)$/.test(n)).sort().map(n=>readFileSync(new URL(n,publicURL))).join('\n')).digest('hex').slice(0,16);
// Only the recovery shell is inline. Its CSP hash permits it even if stylesheet delivery fails.
export const recoveryCSS='[hidden]{display:none!important}body{margin:0}#asset-health{font:16px/1.5 system-ui,sans-serif;background:#fff4db;color:#172a42;padding:16px 24px;border-bottom:3px solid #a52a3b}#asset-health button{font:inherit;min-height:44px;padding:8px 16px;margin:8px;border:0;border-radius:8px;background:#172a42;color:white}#asset-health p{margin:0}';
export const recoveryStyleHash=createHash('sha256').update(recoveryCSS).digest('base64');
