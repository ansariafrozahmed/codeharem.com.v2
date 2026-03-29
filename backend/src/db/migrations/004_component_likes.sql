-- Migration: 004_component_likes
-- Description: Track which users liked which components

CREATE TABLE IF NOT EXISTS component_likes (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, component_id)
);

CREATE INDEX IF NOT EXISTS idx_component_likes_component ON component_likes(component_id);
