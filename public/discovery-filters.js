// Search presentation over reviewed fields only. No inference from names or websites.
import {inSearchRegion} from './regions.js';
export function locationMatches(record,params){
 const location=params.get('location');
 if(params.has('location')&&location!=='legacy'){
  if(location?.startsWith('city:')){const city=location.slice(5);return city==='unknown'?!record.city&&!(record.cities||[]).length:[record.city,...record.cities||[]].includes(city);}
  return inSearchRegion(record,location);
 }
 const city=params.get('city');
 return (!city||(city==='unknown'?!record.city&&!(record.cities||[]).length:[record.city,...record.cities||[]].includes(city)))&&inSearchRegion(record,params.get('region'));
}
export function classificationFor(record){
 const levels=record.levels||[];
 return {recreational:levels.includes('recreational'),competitive:levels.includes('competitive')||levels.includes('travel')};
}
export function classificationMatches(record,value){
 const c=classificationFor(record);
 return !value||value==='all'||value==='unknown'&&!c.recreational&&!c.competitive||value==='recreational'&&c.recreational||value==='competitive'&&c.competitive;
}
