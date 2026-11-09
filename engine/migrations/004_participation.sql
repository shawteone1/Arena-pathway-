-- Additive classification model: imported entity/evidence payloads remain untouched.
CREATE TABLE participation_programs(id TEXT PRIMARY KEY, organization_id TEXT NOT NULL REFERENCES entities(id), sport TEXT NOT NULL, designation TEXT, review_status TEXT NOT NULL, payload_json TEXT NOT NULL);
CREATE TABLE team_programs(team_id TEXT PRIMARY KEY REFERENCES entities(id), program_id TEXT NOT NULL REFERENCES participation_programs(id), payload_json TEXT NOT NULL);
CREATE TABLE classification_reviews(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL REFERENCES entities(id), status TEXT NOT NULL, reason TEXT NOT NULL, payload_json TEXT NOT NULL);
CREATE TABLE classification_revisions(id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, reviewer TEXT NOT NULL, rationale TEXT NOT NULL, before_json TEXT, after_json TEXT NOT NULL);
CREATE TABLE canonical_identities(from_id TEXT PRIMARY KEY REFERENCES entities(id), to_id TEXT NOT NULL REFERENCES entities(id), payload_json TEXT NOT NULL);
CREATE TABLE program_evidence(program_id TEXT NOT NULL REFERENCES participation_programs(id), evidence_id TEXT NOT NULL REFERENCES evidence(id), PRIMARY KEY(program_id,evidence_id));
CREATE VIEW programs AS SELECT * FROM participation_programs;
