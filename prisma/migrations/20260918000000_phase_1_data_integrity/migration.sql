ALTER TABLE "users"
  ADD COLUMN "is_root_admin" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;

-- The repository's seeded administrator is the root account. Confirm this is
-- the intended protected account before applying this migration in production.
UPDATE "users"
SET "is_root_admin" = true
WHERE "id" = 'admin-1' OR "email" = 'admin@pfa.org';

CREATE UNIQUE INDEX "wildlife_cases_case_number_key" ON "wildlife_cases"("case_number");
