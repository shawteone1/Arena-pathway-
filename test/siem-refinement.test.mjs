import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {siemPlatformPage} from '../src/siem-platform-view.mjs';
const base='cd976233a2d4815ff6cc1b233a6684449fa9988c';
test('UX v2.1 leaves event model, fixtures, adapters, contracts and application behavior modules byte-identical',()=>{
 const files=execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(p=>p.startsWith('engine/')||p.startsWith('data/')||/^scripts\/(data-|reconcile-|validate-|ingest)/.test(p)||p==='public/siem-model.js'||p==='public/siem-platform-model.js'||p==='public/siem-platform-fixtures.js'||p==='public/siem.js'||p==='public/state.js'||p==='public/app.js'||p==='src/views.mjs'||p==='src/unified-directory.mjs'||p==='src/engine-directory.mjs'||p.startsWith('public/brand/')||p.startsWith('design/brand/')||p==='docs/SIEM-UX-V2-CONTRACT.md'||p==='docs/PRODUCT-NORTH-STAR.md'||p==='AGENTS.md');
 const server=readFileSync('server.mjs','utf8').replace("'siem-family-fixtures.js',",'').replace("'siem-platform-boot.js',",'');assert.equal(server,execFileSync('git',['show',base+':server.mjs'],{encoding:'utf8'}),'Only the family fixture and startup bootstrap assets may be added to the existing server allowlist');
 for(const f of files)assert.deepEqual(readFileSync(f),execFileSync('git',['show',base+':'+f],{maxBuffer:40e6}),f);
});
test('refined shell retains all three modes, named sidebar toggle, approved branding and demo boundary',()=>{
 const html=siemPlatformPage();for(const label of ['Everyday View','Command Center','Display Mode'])assert.ok(html.includes('aria-label="'+label+'"'));assert.match(html,/aria-controls="platform-modes"/);assert.match(html,/id="platform-sidebar-toggle"/);assert.match(html,/ap-desktop.webp/);assert.match(html,/ILLUSTRATIVE DEMO/);assert.match(html,/Fictional data. No live providers/);
});
