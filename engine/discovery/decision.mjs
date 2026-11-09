import {readFileSync} from 'node:fs';
export const defaultDecisionTree=JSON.parse(readFileSync(new URL('../../data/discovery/decision-tree.json',import.meta.url)));
export function discoveryDecision(source,tree,observations={}){
 const sport=tree.sports[source.sport];if(!sport)throw Error('Sport requires a registered discovery policy: '+source.sport);
 const structure=source.discoveryStructure||tree.adapterStructures[source.adapter];const policy=tree.structures[structure];if(!policy||!sport.structures.includes(structure))throw Error('Unsupported organizational structure for '+source.id);
 return {sourceId:source.id,sport:source.sport,structure,scope:source.scope,steps:policy.steps.map(action=>({action,status:['verify-archive-hash','retain-original-evidence-date'].includes(action)&&observations.archiveVerified?'observed':['extract-members','replay-reviewed-identities'].includes(action)&&observations.rows>0?'observed':action==='traverse-pages'&&observations.frontierResolved?'observed':action==='reconcile-coverage'&&observations.scopeReconciled?'observed':'requires-evidence'})),classificationRequirements:sport.classificationRequirements,automaticPublication:false,reason:'Discovery observations do not authorize classification, ownership or current availability.'};
}

export function sourceDecisionPlans(source,observations={},tree=defaultDecisionTree){const sports=source.sports?.length?source.sports:[source.sport].filter(Boolean);if(!sports.length)throw Error('Source sport policy is required');return sports.map(sport=>discoveryDecision({...source,sport},tree,observations));}
