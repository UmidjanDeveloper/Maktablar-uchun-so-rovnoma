ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "wantedCourses" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "wantedLanguages" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "travelWillingness" TEXT;
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "barriers" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "availableTimes" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "homeTech" TEXT;

SELECT
  count(*) AS jami_anketalar,
  count(*) FILTER (WHERE cardinality("wantedCourses") > 0) AS kurs_javobi_borlar,
  count(*) FILTER (WHERE "travelWillingness" IS NOT NULL) AS masofa_javobi_borlar
FROM "Student";
