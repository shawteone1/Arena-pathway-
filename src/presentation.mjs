import {readFileSync} from 'node:fs';
import {catalog} from './catalog.mjs';
export const photography=JSON.parse(readFileSync(new URL('./photography.json',import.meta.url),'utf8'));
export const brand=JSON.parse(readFileSync(new URL('./brand.json',import.meta.url),'utf8'));
export const entityLabels={club:'Club',team:'Team / collegiate program','swim-team':'Swim program',school:'School',league:'League',division:'Division',tryout:'Tryout / evaluation',camp:'Camp / development',community:'Community'};
// Presentation classification uses only explicit evidence already in the catalog.
// Do not infer summer or year-round operation from a league name or geography.
export function swimProgram(record){
  if(record.sport!=='swimming'||!['club','swim-team'].includes(record.kind))return null;
  const evidence=[record.summary,...record.sourceIds.map(id=>catalog.sources.find(s=>s.id===id)?.evidence||'')].join(' ');
  if(/\byear[ -]round\b/i.test(evidence))return 'year-round';
  if(/\bsummer[ -](?:league|swim)/i.test(evidence))return 'summer-league';
  return 'unclassified';
}
