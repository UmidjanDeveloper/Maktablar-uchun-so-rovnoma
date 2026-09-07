-- ============================================================
--  «Hal qilindi» tugmasi uchun ikkita yangi ustun
--
--  Supabase -> SQL Editor da bir marta ishga tushiring.
--  Mavjud anketalarga tegmaydi: hammasi «hal qilinmagan»
--  holatida qoladi, ya'ni hech qanday ma'lumot yo'qolmaydi.
-- ============================================================

ALTER TABLE "Student"
  ADD COLUMN IF NOT EXISTS "helpResolved" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Student"
  ADD COLUMN IF NOT EXISTS "helpResolvedAt" TIMESTAMP(3);

-- Yordam panelida hal qilinmaganlarni tez ajratish uchun
CREATE INDEX IF NOT EXISTS "Student_helpResolved_idx"
  ON "Student" ("helpResolved");

-- ── Tekshirish ──
-- Quyidagi so'rov xatosiz ishlasa, hammasi joyida.
SELECT
  count(*)                                        AS jami_anketalar,
  count(*) FILTER (WHERE cardinality("barriers") > 0) AS tosiqli,
  count(*) FILTER (WHERE "helpResolved")          AS hal_qilingan
FROM "Student";
