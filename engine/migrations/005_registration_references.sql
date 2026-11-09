CREATE TABLE registration_opportunities(id TEXT PRIMARY KEY, program_id TEXT NOT NULL REFERENCES participation_programs(id), organization_id TEXT NOT NULL REFERENCES entities(id), availability_status TEXT NOT NULL, payload_json TEXT NOT NULL);
CREATE INDEX registration_program_idx ON registration_opportunities(program_id);
