// Explicit local redirects only; never accept a user-supplied destination.
export function legacySiemDestination(path,params=new URLSearchParams()){
 const legacy={ '/demos/parent':['family','everyday'],'/demos/coach':['coach','command'],'/demos/college':['college','everyday'] };
 if(path!=='/siem'&&!Object.hasOwn(legacy,path))return null;
 const [scenario,mode]=legacy[path]||['family','everyday'];
 const result=new URLSearchParams({scenario,mode});
 if(path==='/siem')for(const [key,allowed] of Object.entries({scenario:['family','parent','coach','college'],mode:['everyday','command','display'],section:['day','calendar','messages','family','settings']}))if(allowed.includes(params.get(key)))result.set(key,params.get(key));
 return '/my-ap?'+result;
}
