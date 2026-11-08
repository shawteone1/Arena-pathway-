CREATE TABLE IF NOT EXISTS http_rate_limits(origin TEXT PRIMARY KEY, next_allowed_at INTEGER NOT NULL);
