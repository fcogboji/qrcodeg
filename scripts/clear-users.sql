-- Removes all registered app users (Auth.js credentials).
-- Sessions are JWT cookies; clients may still hold old cookies until cleared or AUTH_SECRET rotates.
DELETE FROM "User";
