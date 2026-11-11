// Search areas overlap intentionally; source geography is never rewritten.
export const searchRegions=[['all','All Colorado'],['denver-metro','Denver Metro'],['south-denver-dtc','South Denver/DTC (Arapahoe/Aurora/Douglas)'],['colorado-springs-metro','Colorado Springs Metro'],['southern-colorado','Southern Colorado'],['boulder-metro','Boulder Metro'],['northern-colorado','Northern Colorado']];
export function inSearchRegion(record,region){
 if(!region||region==='all')return true;if(region==='unknown')return !record.region;
 const text=[record.city,...(record.cities||[]),record.serviceArea,record.region].filter(Boolean).join(' ').toLowerCase();
 const south=/arapahoe|aurora|douglas|centennial|englewood|littleton|highlands ranch|parker|castle rock|lone tree|greenwood village|dtc/;
 const springs=/colorado springs|pikes.peak|fountain|monument|el paso|woodland park/;
 const north=/northern.front.range|northern colorado|fort collins|loveland|windsor|greeley|longmont|broomfield/;
 if(region==='south-denver-dtc')return south.test(text);
 if(region==='denver-metro')return /denver|arvada|lakewood|golden|westminster|thornton|broomfield|commerce city/.test(text)||south.test(text);
 if(region==='colorado-springs-metro')return springs.test(text);
 if(region==='southern-colorado')return springs.test(text)||/pueblo|southern colorado|southeast|southwest|san.luis|durango|alamosa|trinidad|canon city/.test(text);
 if(region==='boulder-metro')return /boulder|longmont|louisville|lafayette|superior/.test(text);
 if(region==='northern-colorado')return north.test(text);
 return record.region===region;
}
