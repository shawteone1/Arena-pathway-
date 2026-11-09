CREATE TABLE discovery_findings(id TEXT PRIMARY KEY, status TEXT NOT NULL, first_seen TEXT NOT NULL, last_seen TEXT NOT NULL, payload_json TEXT NOT NULL);
CREATE TABLE discovery_finding_reviews(id INTEGER PRIMARY KEY, finding_id TEXT NOT NULL REFERENCES discovery_findings(id), at TEXT NOT NULL, reviewer TEXT NOT NULL, reason TEXT NOT NULL, payload_json TEXT NOT NULL);
