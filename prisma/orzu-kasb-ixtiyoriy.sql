ALTER TABLE "Student" ALTER COLUMN "dreamJob" DROP NOT NULL;
ALTER TABLE "Student" ALTER COLUMN "jobCategory" DROP NOT NULL;

SELECT
  count(*) AS jami_anketalar,
  count(*) FILTER (WHERE "dreamJob" IS NOT NULL) AS kasb_tanlaganlar,
  count(*) FILTER (WHERE cardinality("barriers") > 0) AS tosiq_borlar
FROM "Student";
