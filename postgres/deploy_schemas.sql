-- DEPLOY DATABASE TABLES

\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/login.sql'

-- ADD SEED DATA
\i '/docker-entrypoint-initdb.d/seed/seed.sql'