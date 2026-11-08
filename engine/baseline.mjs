import {catalog} from '../src/catalog.mjs';
import {entity} from './models.mjs';
export function baselineEntities(){
 const orgs=[...catalog.organizations,...catalog.schools].map(r=>entity({id:r.id,kind:'organization',name:r.name,sport:r.sport||null,sports:r.sport?[r.sport]:[...new Set(catalog.teams.filter(t=>t.organizationId===r.id).map(t=>t.sport))],aliases:r.aliases||[],state:'CO',city:r.city,category:r.kind,summary:r.summary,evidenceIds:r.sourceIds.map(s=>'legacy-'+s),legacy:true,reviewStatus:'verified',lastVerifiedAt:catalog.updatedAt}));
 const leagues=catalog.leagues.map(r=>entity({...r,kind:'league',evidenceIds:r.sourceIds.map(s=>'legacy-'+s),legacy:true,reviewStatus:'verified',lastVerifiedAt:catalog.updatedAt}));
 const organizerOrgs=catalog.leagues.filter(l=>catalog.teams.some(t=>t.organizationId===l.id)).map(l=>entity({id:'legacy-organizer-'+l.id,kind:'organization',name:l.name+' organizer',sports:[l.sport],state:'CO',category:'league-organizer',evidenceIds:l.sourceIds.map(s=>'legacy-'+s),legacy:true,reviewStatus:'verified',lastVerifiedAt:catalog.updatedAt}));
 const teams=catalog.teams.map(r=>entity({...r,organizationId:catalog.leagues.some(l=>l.id===r.organizationId)?'legacy-organizer-'+r.organizationId:r.organizationId,leagueId:catalog.leagues.some(l=>l.id===r.organizationId)?r.organizationId:null,kind:'team',evidenceIds:r.sourceIds.map(s=>'legacy-'+s),legacy:true,reviewStatus:'verified',lastVerifiedAt:catalog.updatedAt}));
 const divisions=catalog.divisions.map(r=>entity({...r,kind:'division',evidenceIds:r.sourceIds.map(s=>'legacy-'+s),legacy:true,reviewStatus:'verified',lastVerifiedAt:catalog.updatedAt}));
 return [...orgs,...organizerOrgs,...leagues,...teams,...divisions];
}
export function seedBaseline(store){if(store.entities().length)return;store.transaction(()=>{
 store.register({id:'legacy-reviewed-catalog',title:'Preserved reviewed catalog'});
 for(const source of catalog.sources)store.db.prepare('INSERT OR IGNORE INTO evidence VALUES(?,?,?,?,?)').run('legacy-'+source.id,'legacy-reviewed-catalog',source.url,catalog.updatedAt,JSON.stringify({id:'legacy-'+source.id,sourceId:'legacy-reviewed-catalog',url:source.url,fetchedAt:catalog.updatedAt,facts:{summary:source.evidence}}));
 for(const e of baselineEntities())store.db.prepare('INSERT OR IGNORE INTO entities(id,kind,sport,review_status,locked,payload_json) VALUES(?,?,?,?,1,?)').run(e.id,e.kind,e.sport||null,'verified',JSON.stringify(e));
 });}
