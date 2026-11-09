import {load} from 'cheerio';
import {csiRows} from './csi.mjs';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
export function relevantLinks(html,url,source){const $=load(html),links=[];for(const node of $('a[href],iframe[src]').toArray()){
 const raw=$(node).attr('href')||$(node).attr('src');let u;try{u=new URL(raw,url);}catch{continue;}
 if(!['https:','http:'].includes(u.protocol))continue;
 u.hash='';const title=clean($(node).text());if(/roster|registration|login|sign.in|athletes|officials|coaches|award|contact|signup|social|facebook|instagram/i.test(title+' '+u.pathname))continue;
 if(new RegExp(source.followPattern||'teams|clubs|membership|division|schedule|standings|competition','i').test(title+' '+u.pathname)||node.tagName==='iframe'&&/script.google.com/.test(u.hostname))links.push({url:u.href,title});
 }return [...new Map(links.map(l=>[l.url,l])).values()];}
export function extractHTML(html,url,source){
 if(source.adapter==='csi-clubs')return csiRows(String(html));
 const $=load(html),rows=[],issues=[];const adapter=source.adapter;
 if(adapter==='mhsl'){
  const table=$('table').filter((_,t)=>$(t).find('table').length===0&&/MHSL DIVISION ALIGNMENT/.test($(t).text())).first();let division=null;
  table.find('tr').each((_,tr)=>{let cells=$(tr).children('td,th').toArray();if(cells.length<3)return;const first=clean($(cells[0]).text());if(/^[A-D]$/.test(first)){division=first;cells=cells.slice(1);}if(!division||cells.length!==3)return;const name=clean($(cells[0]).text()),code=clean($(cells[2]).text());if(!name||!code)return;rows.push({nativeId:code,name,division,season:'2026',kind:'team',url:$(cells[0]).find('a[href]').attr('href')||null});});
 }else if(adapter==='links'){
  const seen=new Set();for(const a of $(source.selector||'main a[href]').toArray()){const name=clean($(a).text()),href=$(a).attr('href');if(!name||!href||!new RegExp(source.namePattern||'.').test(name)||/roster|contact|register/i.test(href))continue;const key=new URL(href,url).href;if(seen.has(key))continue;seen.add(key);rows.push({nativeId:source.codeFromURL?key.split('/').filter(Boolean).at(-1):name,name,kind:source.entityKind||'organization',url:key});}
 }else if(adapter==='goldcrown-programs'){
  let genders=[];for(const node of $('h1,h2,h3,h4,p').toArray()){const text=clean($(node).text());if(node.tagName!=='p'&&/BOYS|GIRLS/i.test(text))genders=/BOYS.*GIRLS|GIRLS.*BOYS/i.test(text)?['boys','girls']:/GIRLS/i.test(text)?['girls']:['boys'];
   if(node.tagName!=='p'||!/Grades:/i.test(text))continue;const name=text.split(/Grades:/i)[0].trim().replace(/^Team:\s*/i,''),gradeText=text.match(/Grades:\s*(.*?)(?:When:|Where:|Info:|Register:|$)/i)?.[1]?.trim()||'',rowGenders=/boys.*girls|girls.*boys/i.test(gradeText)?['boys','girls']:/boys/i.test(gradeText)?['boys']:/girls/i.test(gradeText)?['girls']:genders;
   if(!name)continue;const venue=text.match(/Where:\s*(.*?)(?:Register:|Info:|$)/i)?.[1]?.trim()||null,dateText=text.match(/When:\s*(.*?)(?:Where:|Info:|Register:|$)/i)?.[1]?.trim()||null,registrationURLs=$(node).find('a[href]').toArray().map(a=>$(a).attr('href')).filter(h=>/^https:\/\//.test(h)&&!/mailto|cloudflare|email/i.test(h));
   rows.push({nativeId:rowGenders.join('-')+':'+name,name,kind:'organization',category:'program-provider',programFacts:{designation:'youth',genders:rowGenders,ageGradeText:gradeText,venue,dateText,seasonLabel:'2026–2027 as published on source page',registrationURLs,feeder:/feeder/i.test(name)},originalRow:{name,gradeText,venue,dateText,registrationURLs}});
  }if(!rows.length)issues.push('NO_FEEDER_PROGRAM_ROWS');
 }else if(adapter==='hdn-programs'){

  const headings=$('h1,h2,h3,h4,h5,h6').toArray().map(n=>clean($(n).text()));
  for(let i=0;i<headings.length;i++){const match=headings[i].match(/^(GIRLS|BOYS)\s+(.+)/i);if(!match)continue;
   const observed=headings[i+1];if(!observed||/^(?:BOYS|GIRLS|Competitive|Local|Recreational)/i.test(observed))continue;
   const name=source.rowAliases?.[observed]||observed,ageGradeText=match[2],practiceArea=headings[i+2]||null,levelText=headings[i+3]||null,travelText=headings[i+4]||null;
   rows.push({nativeId:match[1].toLowerCase()+':'+observed,name,kind:'organization',category:'program-provider',programFacts:{genders:[match[1].toLowerCase()],ageGradeText,practiceArea,levelText,travelText,designation:'youth'},originalRow:{name:observed,heading:headings[i],practiceArea,levelText,travelText}});
  }
  if(!rows.length)issues.push('NO_ENDORSED_PROGRAM_ROWS');
 }else if(adapter==='named-elements'){

  for(const node of $(source.selector).toArray()){const name=clean($(node).text());if(name)rows.push({nativeId:name,name,kind:source.entityKind||'team',season:source.season||null});}
 }else if(adapter==='association-list'){
  let names=[];if(source.listContains){const list=$('ul').filter((_,el)=>$(el).text().includes(source.listContains)).last();names=list.children('li').toArray().map(el=>clean($(el).text()).replace(/\s*\([A-Z]+\)\s*$/,''));}
  else {const heading=$('h2').filter((_,el)=>clean($(el).text())===source.memberHeading).first();names=heading.nextUntil('h2','h3').toArray().map(el=>clean($(el).text()));}
  for(const name of names.filter(Boolean))rows.push({name,nativeId:name,kind:'team',summary:source.memberSummary});
  const text=$('body').text();for(const profile of source.profiles||[])if(profile.requiredText.every(t=>new RegExp(t,'i').test(text)))rows.push({...profile,nativeId:profile.name,kind:profile.kind||'team'});
  if(!names.length)issues.push('MEMBERSHIP_SECTION_MISSING');
 }else if(adapter==='league-list'){
  const text=$(source.selector||'main').text();for(const label of source.namedLeagues||[])if(text.includes(label))rows.push({nativeId:label,name:label,kind:'league'});
 }else if(adapter==='profile'){
  const text=$(source.selector||'body').text();for(const profile of source.profiles||[]){if(profile.requiredText.every(t=>new RegExp(t,'i').test(text))){const registrationURL=profile.programFacts?.registration?.url;const found=registrationURL?$('a[href]').toArray().find(a=>{try{const actual=new URL($(a).attr('href'),url),expected=new URL(registrationURL);return actual.origin===expected.origin&&actual.pathname===expected.pathname;}catch{return false;}}):null;if(registrationURL&&!found){issues.push('REGISTRATION_REFERENCE_MISSING:'+profile.name);continue;}rows.push({...profile,originalRow:{...(profile.originalRow||{}),name:profile.name,...(found?{registrationURL:$(found).attr('href')}: {})},nativeId:profile.nativeId||profile.name,kind:profile.kind||'organization'});}else issues.push('PROFILE_EVIDENCE_MISSING:'+profile.name);}
 }else if(adapter==='college'){
  const seen=new Set();for(const a of $('a[href]').toArray()){const href=$(a).attr('href')||'';const m=href.match(/\/sports\/(mens|womens)-(basketball|volleyball|lacrosse|swimming[^/?#]*)\/?$/i);if(!m)continue;const gender=m[1]==='mens'?'men':'women',sport=m[2].startsWith('swimming')?'swimming':m[2];if(!source.sports.includes(sport))continue;const key=sport+'-'+gender;if(seen.has(key))continue;seen.add(key);rows.push({nativeId:key,name:source.organizationName+' '+gender+'’s '+(sport==='swimming'?'Swimming & Diving':sport[0].toUpperCase()+sport.slice(1)),kind:'team',sport,genders:[gender],organizationName:source.organizationName,programType:sport==='swimming'?'collegiate-swimming':sport==='volleyball'?'indoor-volleyball':sport==='lacrosse'?'field-lacrosse':'basketball',url:new URL(href,url).href});}
  if(source.sports.includes('swimming')&&$('a[href="/sports/swimming"]').length)rows.push({nativeId:'swimming-unknown',name:source.organizationName+' Swimming',kind:'team',sport:'swimming',genders:[],organizationName:source.organizationName,programType:'collegiate-swimming',url:new URL('/sports/swimming',url).href});
 }else if(adapter==='standings'){
  $('table').each((ti,table)=>{const headers=$(table).find('tr').first().find('th,td').map((_,c)=>clean($(c).text())).get();const index=headers.findIndex(s=>/^team$|^school$/i.test(s));if(index<0||ti>0&&$(table).attr('data-parsed')==='true')return;$(table).find('tr').slice(1).each((ri,tr)=>{const cell=$(tr).children('th,td').eq(index);const name=clean(cell.text()).replace(/^\d+\s+/,'');if(name&&!/bye|unattached/i.test(name))rows.push({scopeKey:new URL(url).pathname.split('/').filter(Boolean).slice(-2).join(':'),competitionName:$('h1').first().text().trim()||source.competitionName,nativeId:source.pageNativePrefix?source.pageNativePrefix+'-'+name:name,name,kind:'team',levels:/HIGH SCHOOL/i.test($('h1').first().text())?['high-school']:source.levels||[],division:new URL(url).pathname.split('/').at(-1)||null,season:source.season||null,organizationName:source.organizationName||name,url:cell.find('a[href]').attr('href')||null});});});
 }else if(adapter==='json-feed'){
  throw Error('Use extractJSON for documented public JSON endpoints');
 }else if(adapter==='team-scores'){
  // Organization summaries only. Never enumerate swimmer/athlete result rows.
  $(source.selector||'table.team-scores tr').each((i,tr)=>{const c=$(tr).children('td');if(c.length<2)return;rows.push({nativeId:clean(c.eq(source.codeColumn||0).text()),name:clean(c.eq(source.nameColumn||1).text()),kind:'organization',discoveryOnly:true,state:null});});
 }else if(adapter==='discovery'){}else throw Error('Unknown HTML adapter '+adapter);
 if(adapter==='standings'&&source.extractEvents){
  $('table').each((ti,t)=>{const h=$(t).find('tr').first().children('th,td').map((_,c)=>clean($(c).text())).get();if(h.join('|')!=='Date|Time|Home|Away|Location')return;$(t).find('tr').slice(1).each((i,tr)=>{const c=$(tr).children('td');if(c.length!==5)return;const date=clean(c.eq(0).text()),home=clean(c.eq(2).text()),away=clean(c.eq(3).text());if(!date||!home||!away)return;rows.push({scopeKey:new URL(url).pathname.split('/').filter(Boolean).slice(-2).join(':'),nativeId:'game-'+i,name:home+' vs '+away,kind:'event',sourceDateText:date,sourceTimeText:clean(c.eq(1).text()),homeName:home,awayName:away,locationName:clean(c.eq(4).text()),division:new URL(url).pathname.split('/').at(-1),competitionName:$('h1').first().text().trim(),season:source.season||null,startDate:source.season&&/^\d{4}$/.test(source.season)&&/^(?:[A-Za-z]+ )?(\d{1,2})\/(\d{1,2})$/.test(date)?(()=>{const m=date.match(/(\d{1,2})\/(\d{1,2})/);return source.season+'-'+m[1].padStart(2,'0')+'-'+m[2].padStart(2,'0');})():null});});});
 }
 const paginationUnresolved=$('a[rel=next],button[aria-label*="Next"],.pagination a.next').filter((_,e)=>!$(e).attr('disabled')&&$(e).attr('aria-disabled')!=='true').length>0;
 const providerLinks=adapter==='hdn-programs'?$('a[href]').toArray().flatMap(a=>{try{const u=new URL($(a).attr('href'),url);return u.protocol==='https:'&&u.hostname!==new URL(url).hostname&&!/facebook|instagram|twitter|youtube|tiktok|wix|google|twitch|mailto|paypal/i.test(u.hostname)&&!/roster|login|register|signup|checkout|athlete/i.test(u.pathname)?[{url:u.href,title:'Related provider/site candidate; membership and ownership require review'}]:[];}catch{return [];}}):[];
 const paginationLinks=$('a[rel=next][href],.pagination a.next[href]').filter((_,e)=>$(e).attr('aria-disabled')!=='true').toArray().map(e=>({url:new URL($(e).attr('href'),url).href,title:'Next membership page',pagination:true}));
 return {rows,issues,paginationUnresolved,paginationLinks,links:[...new Map([...relevantLinks(html,url,source),...providerLinks,...paginationLinks].map(link=>[link.url,link])).values()]};
}
