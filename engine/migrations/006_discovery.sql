CREATE TABLE source_config_versions(source_id TEXT NOT NULL REFERENCES sources(id), revision INTEGER NOT NULL, sha256 TEXT NOT NULL, recorded_at TEXT NOT NULL, payload_json TEXT NOT NULL, PRIMARY KEY(source_id,revision));
CREATE TABLE source_expectation_versions(source_id TEXT NOT NULL REFERENCES sources(id), revision INTEGER NOT NULL, sha256 TEXT NOT NULL, recorded_at TEXT NOT NULL, payload_json TEXT NOT NULL, PRIMARY KEY(source_id,revision));
CREATE TABLE run_source_versions(run_id TEXT PRIMARY KEY REFERENCES runs(id), source_id TEXT NOT NULL REFERENCES sources(id), config_revision INTEGER NOT NULL, expectation_revision INTEGER);
CREATE TABLE discovery_configuration_versions(name TEXT NOT NULL, revision INTEGER NOT NULL, sha256 TEXT NOT NULL, recorded_at TEXT NOT NULL, payload_json TEXT NOT NULL, PRIMARY KEY(name,revision));
CREATE TABLE discovery_tasks(id TEXT PRIMARY KEY, source_id TEXT NOT NULL REFERENCES sources(id), run_id TEXT NOT NULL REFERENCES runs(id), status TEXT NOT NULL, payload_json TEXT NOT NULL);
CREATE TABLE discovery_reconciliations(id INTEGER PRIMARY KEY, at TEXT NOT NULL, baseline_sha256 TEXT NOT NULL, payload_json TEXT NOT NULL);
