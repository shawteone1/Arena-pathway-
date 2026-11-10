// Public Duda-style fragment responses observed on normal permitted page requests.
// Project only published HTML/head metadata. Never execute SSR, scripts, CSS or configuration.
export function publicHTML(body){
 const text=body.toString('utf8');if(!/^\s*[\[{]/.test(text))return{html:text,format:'html'};
 let j;try{j=JSON.parse(text);}catch{return{html:text,format:'html'};}
 if(!j||Array.isArray(j)||typeof j.content!=='string'||!/^\s*<div\b[^>]*\bdmwrapped=["']true["']/i.test(j.content)||typeof j.page_title!=='string'||typeof j.isHomePage!=='boolean'||typeof j.uuid!=='string'||!/^[-\da-f]{32,36}$/i.test(j.uuid)||typeof j.headsection!=='string')return{html:null,format:'unsupported-json'};
 return{html:j.headsection+'\n'+j.content,format:'public-html-fragment'};
}
