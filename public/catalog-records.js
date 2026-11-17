// Shared lookup over the existing catalog and retained saves; no new record store.
const categories=['organizations','teams','schools','opportunities','communities','leagues','divisions','locations','programs','savedRecordArchive','registrationOpportunities'];
export function findCatalogRecord(catalog,id){for(const category of categories){const record=(catalog?.[category]||[]).find(r=>r.id===id);if(record)return record;}return undefined;}
