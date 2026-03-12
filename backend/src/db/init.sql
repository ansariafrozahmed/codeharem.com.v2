-- Master init script
-- Runs all migrations in order
-- Usage: psql -U postgres -d codeharemdb -f src/db/init.sql

\i src/db/migrations/000_init.sql
\i src/db/migrations/001_email_verification.sql