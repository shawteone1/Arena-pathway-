import {sourceDecisionPlans} from './decision.mjs';
import {hash} from '../models.mjs';
import {attachRunVersions} from './registry.mjs';
// This adapter replays operator-reviewed public artifacts, never arbitrary web/private uploads.
export function replayReviewedArchive(store,source,snapshot,manifest){
 if(source.adapter!=='reviewed-archive'||!source.archivedEntityIds?.length)throw Error('Archive source must declare explicit reviewed IDs');
 if(source.snapshotSha256!==hash(snapshot))throw Error('Reviewed archive hash mismatch');
 if(!manifest?.reviewer||!manifest?.reviewedAt||!manifest?.evidenceURL||!manifest.expectedRecordIds?.length)throw Error('Independent reviewed replay expectation required');
 const selected=source.archivedEntityIds.map(id=>snapshot.entities.find(e=>e.id===id));
 if(selected.some(e=>!e||e.kind!=='organization'||e.reviewStatus!=='verified'||!e.sports.includes(source.sport)))throw Error('Archive identity is unverified, wrong sport or missing');
 if(selected.some(e=>e.evidenceIds.some(id=>!snapshot.evidence.some(v=>v.id===id)||!store.db.prepare('SELECT id FROM evidence WHERE id=?').get(id))))throw Error('Archive source evidence must be restored before replay');
 const runId=store.start(source);attachRunVersions(store,source,manifest,runId);const existing=new Set(store.entities().map(e=>e.id));
 const rows=selected.map(e=>({sourceRecordId:source.id+':'+e.id,entity:e,supportingEntities:[],decision:existing.has(e.id)?'duplicate':'import',reason:'Exact reviewed archive identity; original source evidence/date retained, no current-source claim.'}));
 const captured=manifest.expectedRecordIds.filter(id=>rows.some(r=>r.sourceRecordId===id)),missing=manifest.expectedRecordIds.filter(id=>!captured.includes(id));
 const report={discoveryPlan:sourceDecisionPlans(source,{archiveVerified:true,rows:rows.length}),sourceId:source.id,status:'partial',scope:source.scope,counts:{candidate:rows.length,imported:rows.filter(r=>r.decision==='import').length,duplicate:rows.filter(r=>r.decision==='duplicate').length,excluded:0,unresolved:0},expected:manifest.expectedRecordIds.length,captured:captured.length,missing,unexpected:rows.filter(r=>!manifest.expectedRecordIds.includes(r.sourceRecordId)).map(r=>r.sourceRecordId),errors:['ARCHIVE_REPLAY_NOT_CURRENT_DISCOVERY',...(missing.length?['MISSING_EXPECTED_ROWS']:[])],statewideComplete:false,pages:[],frontier:[],sourceConfig:source,independentExpectation:manifest,sourceConfigSha256:hash(source),expectationSha256:hash(manifest),latestVerificationDate:null,originalEvidenceDates:selected.flatMap(e=>e.evidenceIds.map(id=>snapshot.evidence.find(x=>x.id===id)?.fetchedAt)).filter(Boolean)};
 store.finish(runId,{rows,evidence:[],report});return {runId,report};
}
