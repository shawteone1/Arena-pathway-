import {extractHTML} from './html.mjs';
import {extractJSON} from './json.mjs';
import {extractClubPDF} from './pdf.mjs';
const html=['mhsl','pdf-team-scores','csi-clubs','goldcrown-programs','hdn-programs','named-elements','association-list','league-list','profile','college','standings','team-scores','discovery','links'];
export function createAdapters(){const adapters=new Map(html.map(name=>[name,(response,source)=>response.contentType.includes('pdf')?extractClubPDF(response.body,source):extractHTML(response.body.toString('utf8'),response.url,source)]));adapters.set('json-feed',(response,source)=>extractJSON(response.body.toString('utf8'),source,{url:response.url}));return adapters;}
export const defaultAdapters=createAdapters();
export function extractResponse(response,source,adapters=defaultAdapters){const adapter=adapters.get(source.adapter);if(!adapter)throw Error('Unregistered source adapter: '+source.adapter);return adapter(response,source);}
