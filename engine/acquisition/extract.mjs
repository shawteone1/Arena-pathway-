import{publicHTML}from'./public-fragment.mjs';
import{publicQualificationEvidence}from'./qualification.mjs';
import{readFileSync}from'node:fs';import{createHash}from'node:crypto';
export const extractionVersion=createHash('sha256').update([import.meta.url,'../adapters/html.mjs','../adapters/json.mjs','../adapters/csi.mjs','../adapters/pdf.mjs','../adapters/index.mjs','./pages.mjs','./qualification.mjs','./public-fragment.mjs'].map(p=>readFileSync(new URL(p,import.meta.url))).join('\n')).digest('hex');
import{load}from'cheerio';import{createAdapters,extractResponse}from'../adapters/index.mjs';
const text=s=>String(s||'').replace(/\\r\\n|\\n|\\r/g,' ').replace(/\s+/g,' ').trim();
const scrub=s=>text(s).replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,'[contact omitted]').replace(/\b\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g,'[contact omitted]');
const safeLink=(input,base)=>{if(typeof input!=='string'||!input.trim())return null;try{const u=new URL(input,base);if(u.protocol!=='https:'||u.username||u.password||/roster|athlete|swimmer|login|signin|account|checkout|register|signup|mailto|javascript/i.test(u.pathname))return null;u.hash='';return u.href;}catch{return null;}};
function classification(context){
 const t=text(context);const statePattern=/(?:,\s*(?:CO|Colorado)\b|\bCO\s+\d{5}\b|\b(?:throughout|across|in|serving|northern|southern|western|central)\s+Colorado\b|\bColorado Springs\b)/i;const stateMatch=t.match(statePattern);const snippets={state:stateMatch?t.slice(Math.max(0,stateMatch.index-55),stateMatch.index+stateMatch[0].length+70):null,youth:t.match(/.{0,55}(?:\byouth\b|\bjunior(?:s)?\b|\bages?\s+\d+).{0,70}/i)?.[0]||null};return {confidence:'candidate-only; page/card context requires review',qualificationEvidence:snippets,youthEligible:/\byouth\b|\bjunior(?:s)?\b|\bU(?:8|10|12|14|16|18)\b|\b(?:K|[1-8])\s*(?:through|[-–])\s*(?:8|12)\b|\b(?:middle|elementary) school\b|\bages?\s+(?:[3-9]|1[0-8])\b/i.test(t)?true:null,state:stateMatch?'CO':null,ageGradeText:t.match(/(?:ages?\s+\d+\s*(?:through|[-–])\s*\d+|\b(?:[1-9]|1[0-2])(?:st|nd|rd|th)?\s*(?:through|[-–])\s*(?:[1-9]|1[0-2])(?:st|nd|rd|th)?\s*grade|\bK\s*(?:through|[-–])\s*8\b)/i)?.[0]||null,participationLevel:/\brecreational\b/i.test(t)?'recreational':/\bcompetitive\b/i.test(t)?'competitive':null};
}
export function extractAcquisition(response,source){
 if(source.adapter==='legacy-engine'){
  const parsed=extractResponse(response,{...source,adapter:source.legacyAdapter},createAdapters());return{paginationURLs:(parsed.paginationLinks||[]).map(l=>l.url),records:parsed.rows.filter(r=>!r.sport||r.sport===source.sport).map(r=>({nativeId:r.scopeKey?r.scopeKey+':'+r.nativeId:String(r.nativeId),name:r.name,kind:r.kind,url:r.url?safeLink(r.url,response.url):null,classification:{youthEligible:null,state:r.state||null},reportedProgramFacts:r.programFacts||null,reportedProgramType:r.programType||null,reportedGenders:r.genders||[],reportedDivision:r.division||null,reportedSeason:r.season||null,reportedParticipants:r.kind==='event'?[r.homeName,r.awayName]:[],reportedStartDate:r.startDate||null,reportedDateText:r.sourceDateText||null,reportedTimeText:r.sourceTimeText||null,reportedLocation:r.locationName||null,reportedOrganizationName:r.organizationName||null,evidenceText:'Structured existing adapter record; parent/season verification remains separate.'})),links:parsed.links,issues:parsed.issues,partial:parsed.paginationUnresolved,declaredCount:null,sourceDate:null};
 }
 // A supported public wrapper contributes only its published HTML, never config strings.
 const projected=publicHTML(response.body);if(!projected.html)return{records:[],links:[],issues:['PROFILE_JSON_WRAPPER_REQUIRES_ADAPTER'],partial:true,sourceDate:null,declaredCount:null};
 const $=load(projected.html);$('script,style,form,input,noscript').remove();$('p,h1,h2,h3,h4,li,td,div,section,br').after(' ');
 const links=[];for(const a of $('a[href]').toArray()){if($(a).closest('footer,[class*="footer"]').length)continue;const u=safeLink($(a).attr('href'),response.url),label=text($(a).text());if(u&&(/club|program|lacrosse|volley|association|league|schedule|division|about|youth|location|facilit|website|official|home/i.test(label+' '+u)||(new URL(u).origin===new URL(response.url).origin&&new URL(u).pathname==='/'))&&!/facebook|instagram|twitter|youtube|linkedin|pinterest|google|wix|shopify|donate|privacy|terms|cookie/i.test(u))links.push({url:u,title:label.slice(0,120)});}
 $('nav').remove();
 const content=text(($('main').length?$('main'):$('body')).text());
 const sourceDate=$('meta[property="article:modified_time"]').attr('content')||null;let declaredCount=null;if(source.declaredCountPattern){const match=content.match(new RegExp(source.declaredCountPattern,'i'));declaredCount=match?Number(match[1]):null;if(!Number.isInteger(declaredCount)||declaredCount<0)declaredCount=null;}
 const records=[],issues=[];
 const push=(record,context)=>records.push({...record,name:text(record.name),classification:{...classification(context),...(record.classification||{})},evidenceText:scrub(context).slice(0,150)});
 if(source.adapter==='scoped-table'){
  if(!content.includes(source.expectedHeader)){issues.push('LAYOUT_REQUIRED_HEADER_MISSING');return{records,links,issues,partial:true,sourceDate,declaredCount};}
  for(const row of $(source.rowSelector).toArray()){const cells=$(row).find('td'),name=text(cells.eq(source.nameColumn||0).text()),href=cells.eq(source.linkColumn||0).find('a[href]').first().attr('href');if(!name)continue;const url=safeLink(href,response.url);push({nativeId:url||name,name,kind:'organization',url,classification:{youthEligible:null,state:null},reportedTeamCount:cells.length>1?Number(text(cells.eq(1).text()))||null:null},name);}
 }else if(source.adapter==='scoped-cards'){
  for(const heading of $(source.headingSelector||'h3').toArray()){
   let card=$(heading);while(card.parent().length&&card.parent().find(source.headingSelector||'h3').length===1)card=card.parent();
   const context=text(card.text()),name=text($(heading).text()),url=safeLink(card.find('a[href]').first().attr('href'),response.url);
   const kind=/turf rentals|facility|sports performance/i.test(context)?'facility':/sport leagues/i.test(context)?'league':/governing association|governing body/i.test(context)?'association':'organization';push({nativeId:url||name,name,kind,url},context);
  }if(!records.length)issues.push('LAYOUT_CARDS_MISSING');
 }else{
  const generic=/^(?:home|about(?: us)?|welcome|programs?|teams?|contact(?: us)?)$/i;
  const genericTitle=/^(?:home|about(?: us)?|welcome|programs?|teams?|contact(?: us)?|what we do)$/i;
  const parts=text($('title').text()).split(/\s*[|–]\s*/);const sportName=new RegExp(source.sport==='swimming'?'swim':source.sport,'i');
  let name=source.nameSelector?text($(source.nameSelector).first().text()):parts.find(p=>!genericTitle.test(p)&&sportName.test(p))||parts.find(p=>!genericTitle.test(p))||$('meta[property="og:site_name"]').attr('content');
  if(!name||name.length>150||!new RegExp(source.sport==='swimming'?'swim':source.sport==='basketball'?'basketball':source.sport,'i').test(content+' '+text($('body').text())+' '+text($('title').text()))){issues.push('LAYOUT_OR_SPORT_EVIDENCE_MISSING');}
  else{push({nativeId:'profile',name,kind:['facility','league','association','program','event','registration'].includes(source.type)?source.type:'organization',url:response.url,publicQualificationEvidence:publicQualificationEvidence($,response)},content);
   for(const h of $('h2,h3').toArray()){const name=text($(h).text());if(!name||name.length>85||!/youth|\b\d{2,4}\b|girls|boys|development|tryouts?|camps?|junior|masters/i.test(name))continue;if(/roster|player profiles/i.test(name))continue;push({nativeId:'section:'+name,name,kind:/tryouts?|registration/i.test(name)?'registration':'program',url:response.url,reportedParent:'profile'},name+' '+text($(h).next('p').text()));}
  }
 }
 // Only public aggregate schema is emitted. No rosters, personal contacts or arbitrary source objects.
 const paginationURLs=$('a[rel=next][href],.pagination a.next[href]').toArray().map(e=>safeLink($(e).attr('href'),response.url)).filter(Boolean);if(declaredCount!==null&&records.length>declaredCount)issues.push('SOURCE_DECLARED_COUNT_EXCEEDED');
 const unique=new Map();for(const r of records.filter(r=>r.name)){if(unique.has(r.nativeId)){issues.push('DUPLICATE_NATIVE_SOURCE_ROW');continue;}unique.set(r.nativeId,r);}
 return{paginationURLs,records:[...unique.values()],links:[...new Map(links.map(l=>[l.url,l])).values()],issues,partial:issues.length>0||!!$('a[rel=next],.pagination a.next').length,declaredCount,sourceDate};
}
