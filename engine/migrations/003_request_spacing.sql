ALTER TABLE http_rate_limits ADD COLUMN last_scheduled_at INTEGER NOT NULL DEFAULT 0;
