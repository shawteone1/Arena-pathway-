import {spawnSync} from 'node:child_process';
export function extractClubText(text,source){
 if(!['official-club-list','team-scores-only'].includes(source.documentScope))throw Error('PDF scope requires a non-athlete reviewed classification');
 // "Through Event 44" is a team-summary heading, not an individual-result row.
 if(source.documentScope==='team-scores-only'&&/(?:^|\n)\s*Event\s+\d+|Name\s+Age|Seed\s+Time|Finals\s+Time/i.test(text))throw Error('Athlete results detected; request a team-summary-only document');
 const rows=[],issues=[];const scoped=source.combinedOnly?text.split(/(?:Women|Men)\s*-\s*Team Rankings/i)[0]:text;
 for(const line of scoped.split('\n')){const m=line.match(new RegExp(source.rowPattern));if(!m)continue;const [_,code,name,city]=m;rows.push({nativeId:code.trim(),name:name.trim(),city:city?.trim()||null,kind:source.entityKind||'organization',discoveryOnly:source.documentScope==='team-scores-only',...(source.documentScope==='team-scores-only'?{state:null}:{})});}
 if(!rows.length)issues.push('NO_RECOGNIZED_CLUB_ROWS');return {rows,issues,paginationUnresolved:false,links:[]};
}
export function extractClubPDF(body,source){
 if(!['official-club-list','team-scores-only'].includes(source.documentScope))throw Error('PDF scope requires a non-athlete reviewed classification');
 const r=spawnSync('pdftotext',['-layout','-','-'],{input:body,maxBuffer:8*1024*1024});if(r.status!==0)throw Error('pdftotext required or document unreadable');return extractClubText(r.stdout.toString(),source);
}
