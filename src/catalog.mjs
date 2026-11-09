import { readFileSync } from 'node:fs';
export const sports = ['lacrosse', 'volleyball', 'basketball', 'swimming'];
export const sections = ['teams', 'tryouts', 'camps', 'community'];
export const catalog = JSON.parse(readFileSync(new URL('../data/catalog.json', import.meta.url), 'utf8'));
export const titleCase = s => s[0].toUpperCase() + s.slice(1);
export const sourceFor = record => catalog.sources.find(s => s.id === record.sourceIds[0]);
export function freshness(source, now = new Date()) {
  const age = (now - new Date(source.reviewedAt + 'T00:00:00Z')) / 86400000;
  return age > 90 ? 'Review overdue' : 'Source reviewed';
}
export function directoryRows(sport) {
  return [...catalog.organizations.filter(o => o.sport === sport),
    ...catalog.teams.filter(t => t.sport === sport).map(t => {
      const parent = [...catalog.organizations, ...catalog.schools, ...catalog.leagues].find(o => o.id === t.organizationId);
      return { ...t, kind: 'team', city: parent.city, state: parent.state,
        summary: t.summary || `${parent.name} · ${t.division || 'Division unconfirmed'} · ${t.season || 'Season unconfirmed'}` };
    }), ...catalog.leagues.filter(l => l.sport === sport), ...catalog.divisions.filter(d => d.sport === sport),
    ...catalog.schools.filter(s => catalog.teams.some(t => t.organizationId === s.id && t.sport === sport))];
}
export const normalize = s => s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
export function validateCatalog(data = catalog) {
  const errors = [];
  const records = [...data.organizations, ...data.teams, ...data.schools, ...data.leagues, ...data.divisions, ...data.opportunities, ...data.communities];
  const ids = new Set(); const sourceIds = new Set(data.sources.map(s => s.id));
  const requiredFields = { organizations: ['id','name','sport','city','state','kind','summary'], schools: ['id','name','city','state','kind','summary'], teams: ['id','name','sport','organizationId'], leagues: ['id','name','sport','state','kind','summary'], divisions: ['id','name','sport','leagueId'], opportunities: ['id','name','sport','kind','summary','status'], communities: ['id','name','sport','kind','summary'] };
  const missingFields = [];
  for (const [collection, fields] of Object.entries(requiredFields)) {
    for (const record of data[collection]) {
      for (const field of fields) if (!record[field]) missingFields.push(`${collection}.${record.id}.${field}`);
    }
  }
  if (missingFields.length) errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  for (const s of data.sources) {
    if (!s.id || !s.title || !s.evidence || !s.scope || !/^https:\/\//.test(s.url) || !/^\d{4}-\d{2}-\d{2}$/.test(s.reviewedAt) || !Number.isFinite(Date.parse(s.reviewedAt))) errors.push(`Invalid source ${s.id}`);
  }
  if (sourceIds.size !== data.sources.length) errors.push('Duplicate source ID');
  for (const r of records) {
    if (!r.id || ids.has(r.id)) errors.push(`Duplicate or missing ID ${r.id}`);
    ids.add(r.id);
    if (!r.name || (!sports.includes(r.sport) && r.kind !== 'school')) errors.push(`Invalid record ${r.id}`);
    if (!r.sourceIds?.length || r.sourceIds.some(id => !sourceIds.has(id))) errors.push(`Missing provenance ${r.id}`);
    if (r.state && r.state !== 'CO') errors.push(`Non-Colorado record ${r.id}`);
  }
  const names = new Set();
  for (const r of data.organizations) {
    for (const name of [r.name, ...(r.aliases || [])]) {
      const key = `${r.sport}:${normalize(name)}`;
      if (names.has(key)) errors.push(`Duplicate organization/alias ${name}`);
      names.add(key);
    }
  }
  const teamNames = new Set();
  for (const t of data.teams) {
    const parent = [...data.organizations, ...data.schools, ...data.leagues].find(o => o.id === t.organizationId);
    if (!parent || (parent.sport && parent.sport !== t.sport)) errors.push(`Invalid team parent ${t.id}`);
    const key = [t.organizationId, normalize(t.name), t.season || 'unknown'].join(':');
    if (teamNames.has(key)) errors.push(`Duplicate team ${t.id}`);
    teamNames.add(key);
  }
  const importReports = data.imports.map(i => {
    const actual = (data[i.collection] || []).filter(r => r.sourceIds.includes(i.sourceId));
    const missing = i.expectedIds.filter(id => !actual.some(r => r.id === id));
    const unexpected = actual.filter(r => !i.expectedIds.includes(r.id)).map(r => r.id);
    if (missing.length) errors.push(`Incomplete import ${i.id}: ${missing.join(', ')}`);
    if (unexpected.length) errors.push(`Unreviewed import rows ${i.id}: ${unexpected.join(', ')}`);
    if (i.candidateCount && i.candidateCount !== i.expectedIds.length + (i.excluded?.length || 0)) errors.push(`Unreconciled candidate count ${i.id}`);
    if (!i.expectedIds.length || new Set(i.expectedIds).size !== i.expectedIds.length) errors.push(`Invalid import manifest ${i.id}`);
    return { ...i, imported: actual.length, expected: i.expectedIds.length, missing, unexpected };
  });
  for (const d of data.divisions) {
    if (!data.leagues.some(l => l.id === d.leagueId)) errors.push(`Unknown league ${d.id}`);
    if (d.memberIds.some(id => ![...data.organizations, ...data.teams].some(o => o.id === id))) errors.push(`Missing division member ${d.id}`);
  }
  for (const o of data.opportunities) {
    if (o.start && (!Number.isFinite(Date.parse(o.start)) || o.end < o.start)) errors.push(`Invalid event date ${o.id}`);
  }
  if (data.coverage.status !== 'partial' || data.coverage.statewideExpected !== null) errors.push('Statewide completeness requires a verified denominator');
  const quality = { missingRequiredFields: missingFields, seasonUnconfirmed: [...data.teams,...data.divisions].filter(r=>!r.season).length, sourceReviewsOverdue: data.sources.filter(s=>freshness(s)==='Review overdue').map(s=>s.id), needsReviewImports: data.imports.filter(i=>i.status==='needs-review').map(i=>i.id) };
  return { valid: !errors.length, errors, importReports, quality, counts: { organizations: data.organizations.length, teams: data.teams.length, schools: data.schools.length, leagues: data.leagues.length, divisions: data.divisions.length } };
}
