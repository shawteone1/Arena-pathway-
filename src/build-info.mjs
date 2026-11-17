import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
const git=(...args)=>{try{return execFileSync('git',args,{cwd,encoding:'utf8',timeout:3000,stdio:['ignore','pipe','ignore']}).trim();}catch{return null;}};
// Identify the running checkout, never an assumed deployment or package version.
const commit=git('rev-parse','HEAD');
const status=git('status','--porcelain','--untracked-files=normal');
export const buildInfo=Object.freeze({commit:commit||'unavailable',branch:git('branch','--show-current')||'unavailable',dirty:status===null?null:Boolean(status),startedAt:new Date().toISOString()});
export const reviewMode=process.env.AP_REVIEW==='1';
