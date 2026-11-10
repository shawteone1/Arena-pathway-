// Scoped public evidence, never automatic verification. No rosters or personal contacts.
import{hash,normalize}from'../models.mjs';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const safe=s=>clean(s).replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,'[contact omitted]').replace(/\b\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g,'[contact omitted]');
const month='(?:January|February|March|April|May|June|July|August|September|October|November|December)';
export function datedRange(text){
 const m=text.match(new RegExp('('+month+'\\s+\\d{1,2}),?\\s+(\\d{4})\\s*(?:[-–—]|through|to)\\s*('+month+'\\s+\\d{1,2}),?\\s+(\\d{4})','i'));
 if(!m)return null;const start=new Date(m[1]+', '+m[2]+' 00:00:00 UTC'),end=new Date(m[3]+', '+m[4]+' 23:59:59 UTC');if(!Number.isFinite(+start)||!Number.isFinite(+end)||end<start)return null;return{start:start.toISOString(),end:end.toISOString(),publishedText:m[0]};
}
export function publicQualificationEvidence($,response){
 const facts=[];const add=(type,value,selector,context)=>{if(!value)return;const fact={type,value,selector,context:safe(context).slice(0,180),url:response.url,bodySha256:response.sha256,retrievedAt:response.fetchedAt};fact.id='claim-'+hash([type,value,selector,response.url,response.sha256]).slice(0,20);if(!facts.some(f=>f.id===fact.id))facts.push(fact);};
 const brand=$('meta[property="og:site_name"]').attr('content');if(brand&&brand.length<140)add('organization-name',safe(brand),'meta[property="og:site_name"]',brand);
 const title=clean(($('head > title').first().text()||$('title').first().text()));if(title&&title.length<180)add('page-title',safe(title),'title',title);
 // Explicit address elements may sit outside main content. They are location claims only, not automatic service-area proof.
 const nodes=$('address,[itemprop="address"],main p,main h1,main h2,main h3,main li,article p,article h1,article h2,article h3,body p,body h1,body h2,body h3').toArray();
 for(let i=0;i<nodes.length;i++){const el=nodes[i],t=clean($(el).text());if(t.length<3||t.length>900)continue;const segments=[];let n=$(el);while(n.length&&n[0].tagName){const tag=n[0].tagName,index=n.parent().children(tag).toArray().indexOf(n[0])+1;segments.unshift(tag+':nth-of-type('+Math.max(index,1)+')');n=n.parent();}const selector=segments.join(' > ');
  if(/^h1$/.test(el.tagName))add('page-heading',safe(t),selector,t);
  const geo=t.match(/(?:\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2},\s*(?:CO|Colorado)\b(?:\s+\d{5})?|\b(?:northern|southern|western|central)\s+Colorado(?:\s+Springs)?\b|\bColorado Springs\b|\b(?:serving|located|based|throughout)\b[^.!?]{0,55}\bColorado\b)/i);
  if(geo)add('published-colorado-location',geo[0],selector,geo[0]);
  const youth=t.match(/\b(?:youth\s+through\s+high\s+school|youth\s+(?:lacrosse|volleyball|programs?|sports?|training)|(?:boys|girls)\s+(?:and\s+(?:boys|girls)\s+)?youth|ages?\s+(?:[3-9]|1[0-8])\s*(?:[-–]|through|to)\s*(?:[3-9]|1[0-8])|K\s*(?:[-–]|through|to)\s*8|(?:[1-9]|1[0-2])(?:st|nd|rd|th)?\s*(?:[-–]|through|to)\s*(?:[1-9]|1[0-2])(?:st|nd|rd|th)?\s*grades?)\b/i);
  if(youth)add('published-youth-program',youth[0],selector,youth[0]);
  const range=datedRange(t);if(range)add('published-date-range',range,selector,range.publishedText);
 }
 return facts;
}
export function assessQualification(row,source,reviews=[],asOf=new Date().toISOString(),context={records:[],sources:[]}){
 const record=row.record,facts=record.publicQualificationEvidence||[],now=Date.parse(asOf),review=reviews.find(r=>r.recordId===row.id&&r.recordVersion===row.current_version&&r.bodySha256===record.evidence.bodySha256),reasons=[];
 const usable=!!(record.kind==='organization'&&source&&source.seenRecordIds?.includes(row.id)&&source.retrieval_status!=='failed'&&row.lifecycle==='observed'&&Number.isFinite(Date.parse(record.evidence.retrievedAt))&&now-Date.parse(record.evidence.retrievedAt)>=0&&now-Date.parse(record.evidence.retrievedAt)<=30*86400000);
 const relationships={identity:['publisher-identity'],geography:['organization-location','program-service-area'],youthProgram:['organization-operated-youth-program'],currentProgram:['same-published-youth-program']};
 const decision=(key,type)=>{
  const d=review?.decisions?.[key];if(!review?.reviewer||!review?.reason||review.sport!==record.sport||!Number.isFinite(Date.parse(review.reviewedAt))||Date.parse(review.reviewedAt)>now||Date.parse(review.reviewedAt)<Date.parse(record.evidence.retrievedAt)||!relationships[key]?.includes(d?.relationship))return null;
  let candidate=row,origin=source;
  if(d.recordId&&d.recordId!==row.id){
   candidate=context.records.find(r=>r.id===d.recordId);origin=context.sources.find(s=>s.id===candidate?.source_id);
   if(!candidate||!origin||candidate.current_version!==d.recordVersion||candidate.record.evidence.bodySha256!==d.bodySha256||candidate.lifecycle!=='observed'||origin.retrieval_status==='failed'||!origin.seenRecordIds?.includes(candidate.id))return null;
   const from=new URL(record.evidence.url),to=new URL(candidate.record.evidence.url);const linked=(source.observedLinks||[]).some(l=>l.url===to.href)||(origin.observedLinks||[]).some(l=>l.url===from.href);
   if(key==='identity'||from.hostname.replace(/^www\./,'')!==to.hostname.replace(/^www\./,'')||!linked)return null;
   const age=now-Date.parse(candidate.record.evidence.retrievedAt);if(!Number.isFinite(age)||age<0||age>30*86400000||Date.parse(review.reviewedAt)<Date.parse(candidate.record.evidence.retrievedAt))return null;
  }
  const f=(candidate.record.publicQualificationEvidence||[]).find(f=>f.id===d.claimId&&f.type===type&&f.bodySha256===candidate.record.evidence.bodySha256&&f.url===candidate.record.evidence.url);
  if(key==='identity'&&(!d.confirmedName||!normalize(String(f?.value||'')).includes(normalize(d.confirmedName))))return null;
  return f?{decision:d,fact:f}:null;
 };
 const identity=decision('identity','organization-name')||decision('identity','page-title')||decision('identity','page-heading'),geo=decision('geography','published-colorado-location')||(()=>{const d=decision('geography','page-title');return d&&/,[\s]*(?:CO|Colorado)\b/.test(String(d.fact.value))?d:null;})(),youth=decision('youthProgram','published-youth-program'),period=decision('currentProgram','published-date-range');
 const verifiedOrganization=!!identity&&usable,qualifiedColoradoYouthOrganization=verifiedOrganization&&!!geo&&!!youth;
 const currentYouthProgram=qualifiedColoradoYouthOrganization&&!!period&&period.decision.relationship==='same-published-youth-program'&&period.decision.youthClaimId===youth.fact.id&&now>=Date.parse(period.fact.value.start)&&now<=Date.parse(period.fact.value.end);
 if(record.kind!=='organization')reasons.push('Record is not an organization; retain program/team/source-candidate classification');if(!usable)reasons.push('Source stale/failed, record missing, or retrieval time invalid');if(!identity)reasons.push('Organization identity not independently reviewed');if(!geo)reasons.push('Colorado location/service relationship not reviewed');if(!youth)reasons.push('Organization-operated youth program not reviewed');if(!currentYouthProgram)reasons.push('Dated current youth offering not proven');reasons.push('Current registration availability not verified');
 const designation=['youth','community'].includes(review?.participationDesignation)?review.participationDesignation:null;if(!designation)reasons.push('Participation designation not reviewed for publication');
 return{participationDesignation:designation,qualificationScope:'Reviewed identity, Colorado and published youth evidence; current offering separately assessed',recordId:row.id,name:identity?.decision.confirmedName||record.name,sport:record.sport,verifiedOrganization,qualifiedColoradoYouthOrganization,currentYouthProgram,publicationEligibility:{organizationProfile:qualifiedColoradoYouthOrganization&&!!designation,currentProgram:currentYouthProgram&&!!designation,registrationOpen:false},reviewer:review?.reviewer||null,reasons,evidence:[identity,geo,youth,period].filter(Boolean).map(d=>({...d.fact,selectorKind:/:public-block-/.test(d.fact.selector)?'legacy-public-block-index':'css-in-published-html-projection'}))};
}
