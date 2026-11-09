import {load} from 'cheerio';
// Parse a published Apps Script page's static HTML payload; never execute publisher JavaScript.
export function csiRows(html){
 let $=load(html);const config=html.match(/goog\.script\.init\(("(?:\\.|[^"\\])*")/s);
 if(config){const literal=config[1].replace(/\\x([0-9a-f]{2})/ig,'\\u00$1');const settings=JSON.parse(JSON.parse(literal));if(typeof settings.userHtml!=='string')throw Error('Public club HTML is missing');$=load(settings.userHtml);}
 const rows=[],links=[];let ignoredMetadata=0;
 $('table').each((_,table)=>{const headers=$(table).find('tr').first().find('th,td').map((_,e)=>$(e).text().trim()).get();if(headers.slice(0,3).join('|')!=='Team|Code|Type')return;
  $(table).find('tr').slice(1).each((_,tr)=>{const cells=$(tr).children('td');const name=cells.eq(0).text().replace(/\s+/g,' ').trim(),code=cells.eq(1).text().trim(),type=cells.eq(2).text().trim(),website=cells.eq(0).find('a[href]').attr('href')||null;
   if(!/^[A-Z0-9]{1,6}$/.test(code)){if(/^Safe Sport Status/i.test(name)){ignoredMetadata++;return;}rows.push({nativeId:'unresolved-code:'+name,name,kind:'organization',discoveryOnly:true,state:null,originalRow:{name,code,type,website}});return;}
   const programType=type==='Year Round'?'year-round-usa-swimming':type==='Seasonal'?'seasonal-usa-swimming':type==='Collegiate Only'?'collegiate-swimming':'unknown';
   rows.push({nativeId:code,name,kind:'organization',category:type==='Collegiate Only'?'school':'club',programFacts:{designation:type==='Collegiate Only'?'college':'youth',swimType:type==='Year Round'?'year-round-competitive':type==='Seasonal'?'seasonal-competitive':type==='Collegiate Only'?'collegiate':'unknown',programType,clubCode:code,membershipType:type,website},originalRow:{name,code,type,website}});
   if(website)links.push({url:website,title:name+' official club programs',clubCode:code});
  });
 });
 return {rows,links,issues:rows.length?[]:['PUBLIC_CSI_TABLE_MISSING'],paginationUnresolved:false,ignoredMetadata};
}
