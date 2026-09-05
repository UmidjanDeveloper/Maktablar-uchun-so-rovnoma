-- =====================================================================
--  KELAJAK EGASI - Supabase uchun boshlang'ich sozlash
--  Xatirchi tumani, Navoiy viloyati
--
--  QANDAY ISHLATISH:
--    1. Supabase loyihangizni oching
--    2. Chap menyudan  SQL Editor  ni tanlang
--    3. Ushbu faylning HAMMASINI nusxalab, oynaga qo'ying
--    4. Pastdagi  RUN  tugmasini bosing
--
--  Bu fayl bajaradi:
--    - 4 ta jadval yaratadi (Student, Mahalla, School, Profession)
--    - 70 ta mahalla, 94 ta maktab, 35 ta kasbni yozadi
--    - Demo (soxta) anketalar QO'SHILMAYDI - baza toza qoladi
--
--  Faylni qayta ishga tushirish xavfsiz: mavjud yozuvlar takrorlanmaydi.
-- =====================================================================


-- ---------------------------------------------------------------------
--  1-QISM. Jadvallarni yaratish
-- ---------------------------------------------------------------------

-- CreateTable
CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT,
    "parentPhone" TEXT,
    "region" TEXT NOT NULL DEFAULT 'Navoiy',
    "district" TEXT NOT NULL DEFAULT 'Xatirchi',
    "mahalla" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "favoriteSubjects" TEXT[],
    "clubs" TEXT[],
    "dreamJob" TEXT NOT NULL,
    "jobCategory" TEXT NOT NULL,
    "motivation" TEXT,
    "inspiration" TEXT,
    "studyAbroad" TEXT,
    "futureContribution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dedupeKey" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Mahalla" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mahalla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Profession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Student_dedupeKey_key" ON "Student"("dedupeKey");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_mahalla_idx" ON "Student"("mahalla");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_school_idx" ON "Student"("school");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_grade_idx" ON "Student"("grade");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_gender_idx" ON "Student"("gender");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_jobCategory_idx" ON "Student"("jobCategory");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_dreamJob_idx" ON "Student"("dreamJob");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_createdAt_idx" ON "Student"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Student_firstName_lastName_school_grade_idx" ON "Student"("firstName", "lastName", "school", "grade");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Mahalla_name_key" ON "Mahalla"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "School_name_key" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Profession_name_key" ON "Profession"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Profession_category_idx" ON "Profession"("category");


-- ---------------------------------------------------------------------
--  2-QISM. Mahallalar - 70 ta
--  Manba: tuman hokimligining mahalla raislari ro'yxati
-- ---------------------------------------------------------------------

INSERT INTO "Mahalla" ("id", "name") VALUES
  (gen_random_uuid()::text, 'Avoqli'),
  (gen_random_uuid()::text, 'Alisher Navoiy'),
  (gen_random_uuid()::text, 'Amir Temur'),
  (gen_random_uuid()::text, 'Angidon'),
  (gen_random_uuid()::text, 'Baxshijar'),
  (gen_random_uuid()::text, 'Binokor'),
  (gen_random_uuid()::text, 'Bog''ishamol'),
  (gen_random_uuid()::text, 'Bog''chakalon'),
  (gen_random_uuid()::text, 'Bo''g''irdoq'),
  (gen_random_uuid()::text, 'Bunyodkor'),
  (gen_random_uuid()::text, 'Galabek'),
  (gen_random_uuid()::text, 'Guliston'),
  (gen_random_uuid()::text, 'Damariq'),
  (gen_random_uuid()::text, 'Dehqonobod'),
  (gen_random_uuid()::text, 'Do''stlik'),
  (gen_random_uuid()::text, 'Jaloyir'),
  (gen_random_uuid()::text, 'Zarafshon'),
  (gen_random_uuid()::text, 'Zarbdor'),
  (gen_random_uuid()::text, 'Ikrom Karvon'),
  (gen_random_uuid()::text, 'Istiqlol'),
  (gen_random_uuid()::text, 'Kattasoy'),
  (gen_random_uuid()::text, 'Koriz Arab'),
  (gen_random_uuid()::text, 'Ko''ksaroy'),
  (gen_random_uuid()::text, 'Qoracha'),
  (gen_random_uuid()::text, 'Qo''rg''ontepa'),
  (gen_random_uuid()::text, 'Qo''rg''oncha'),
  (gen_random_uuid()::text, 'Quchchi'),
  (gen_random_uuid()::text, 'Qo''shchinor'),
  (gen_random_uuid()::text, 'Langar'),
  (gen_random_uuid()::text, 'M.Ulug''bek'),
  (gen_random_uuid()::text, 'Madaniyat'),
  (gen_random_uuid()::text, 'Maydon'),
  (gen_random_uuid()::text, 'Miyonqol'),
  (gen_random_uuid()::text, 'Mirdosh'),
  (gen_random_uuid()::text, 'Mirishkor'),
  (gen_random_uuid()::text, 'Mustaqillik'),
  (gen_random_uuid()::text, 'Navbahor'),
  (gen_random_uuid()::text, 'Navro''z'),
  (gen_random_uuid()::text, 'Nayman'),
  (gen_random_uuid()::text, 'Novja'),
  (gen_random_uuid()::text, 'Oq-oltin'),
  (gen_random_uuid()::text, 'Oqtepa'),
  (gen_random_uuid()::text, 'Olmazor'),
  (gen_random_uuid()::text, 'Oltinobod'),
  (gen_random_uuid()::text, 'Oltinsoy'),
  (gen_random_uuid()::text, 'Paraxun'),
  (gen_random_uuid()::text, 'Paxtakor'),
  (gen_random_uuid()::text, 'Polvonota'),
  (gen_random_uuid()::text, 'Samarqand'),
  (gen_random_uuid()::text, 'Sangijuman'),
  (gen_random_uuid()::text, 'Saroy'),
  (gen_random_uuid()::text, 'Tamabaxrin'),
  (gen_random_uuid()::text, 'Tasmachi'),
  (gen_random_uuid()::text, 'Tinchlik'),
  (gen_random_uuid()::text, 'Toshquloq'),
  (gen_random_uuid()::text, 'Uyshun'),
  (gen_random_uuid()::text, 'Uchqora'),
  (gen_random_uuid()::text, 'Uchtepa'),
  (gen_random_uuid()::text, 'Farovon'),
  (gen_random_uuid()::text, 'Fidokor'),
  (gen_random_uuid()::text, 'Xonaqa'),
  (gen_random_uuid()::text, 'Xo''jaqulobod'),
  (gen_random_uuid()::text, 'Xo''jaqo''rg''on'),
  (gen_random_uuid()::text, 'Chag''atoy'),
  (gen_random_uuid()::text, 'Changir'),
  (gen_random_uuid()::text, 'Chechak ota'),
  (gen_random_uuid()::text, 'Chinobod'),
  (gen_random_uuid()::text, 'Yangi'),
  (gen_random_uuid()::text, 'Yangi qurilish'),
  (gen_random_uuid()::text, 'Yangirabod')
ON CONFLICT ("name") DO NOTHING;


-- ---------------------------------------------------------------------
--  3-QISM. Maktablar - 94 ta
--  Manba: tuman xalq ta'limi bo'limining ro'yxati
-- ---------------------------------------------------------------------

INSERT INTO "School" ("id", "name") VALUES
  (gen_random_uuid()::text, '1-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '2-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '3-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '4-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '5-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '6-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '7-sonli ayrim fanlar chuqur o''qitiladigan sinflari mavjud umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '8-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '9-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '10-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '11-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '12-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '13-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '14-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '16-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '17-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '18-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '19-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, 'Xatirchi tumani 21-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, 'Xatirchi tumani 22-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '23-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '24-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '25-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '26-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '27-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '28-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '29-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '30-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '32-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '33-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '34-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '35-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '36-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, 'Xatirchi tumani 37-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '38-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '39-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '40-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '41-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '42-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '43-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '44-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '45-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '46-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '47-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '48-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '49-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '50-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, 'Xatirchi tuman 51-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '52-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '54-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '55-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '56-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '57-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '58-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '59-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '60-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '61-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '62-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '63-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '64-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '65-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '66-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '67-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '68-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '69-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '70-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '71-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '72-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '73-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '74-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '75-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '76-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '77-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '78-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '79-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '80-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '81-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '82-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '83-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '84-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '85-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '86-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '87-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '88-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '89-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '90-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '91-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '92-sonli umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '31- umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '53- umumiy o''rta ta''lim maktabi'),
  (gen_random_uuid()::text, '88-IDUM'),
  (gen_random_uuid()::text, 'Ixtisoslashtirilgan ta''lim muassasalari agentligi tizimidagi Xatirchi tuman ixtisoslashtirilgan maktabi'),
  (gen_random_uuid()::text, 'O''ZB. RES. MAKTABGACHA VA MAKTAB TA''LIMI VAZIRLIGI NAVOIY VILOYATI XATIRCHI TUMANI 20-INFORMATIKA VA AXBOROT TEXNOLOGIYALARI FANINI CHUQURLASHTIRIB O''QITISHGA IXTISOSLASHTIRILGAN DAVLAT UMUMTA''LIM MAKTABI'),
  (gen_random_uuid()::text, 'Xatirchi tumani 15-umumiy o''rta ta''lim maktabi')
ON CONFLICT ("name") DO NOTHING;


-- ---------------------------------------------------------------------
--  4-QISM. Kasblar - 35 ta, 7 ta yo'nalish bo'yicha
-- ---------------------------------------------------------------------

INSERT INTO "Profession" ("id", "name", "category", "icon") VALUES
  (gen_random_uuid()::text, 'Dasturchi', 'IT & Texnologiya', '💻'),
  (gen_random_uuid()::text, 'Sun''iy Intellekt mutaxassisi', 'IT & Texnologiya', '🤖'),
  (gen_random_uuid()::text, 'Kiberxavfsizlik mutaxassisi', 'IT & Texnologiya', '🛡️'),
  (gen_random_uuid()::text, 'Grafik Dizayner', 'IT & Texnologiya', '🎨'),
  (gen_random_uuid()::text, 'Mobil ilova yaratuvchi', 'IT & Texnologiya', '📱'),
  (gen_random_uuid()::text, 'O''yin yaratuvchi', 'IT & Texnologiya', '🎮'),
  (gen_random_uuid()::text, 'Shifokor', 'Tibbiyot', '🩺'),
  (gen_random_uuid()::text, 'Jarroh', 'Tibbiyot', '🏥'),
  (gen_random_uuid()::text, 'Stomatolog', 'Tibbiyot', '🦷'),
  (gen_random_uuid()::text, 'Hamshira', 'Tibbiyot', '💉'),
  (gen_random_uuid()::text, 'Psixolog', 'Tibbiyot', '🧠'),
  (gen_random_uuid()::text, 'Farmatsevt', 'Tibbiyot', '💊'),
  (gen_random_uuid()::text, 'Veterinar', 'Tibbiyot', '🐾'),
  (gen_random_uuid()::text, 'O''qituvchi', 'Ta''lim & Ilm', '📚'),
  (gen_random_uuid()::text, 'Olim', 'Ta''lim & Ilm', '🔬'),
  (gen_random_uuid()::text, 'Tarbiyachi', 'Ta''lim & Ilm', '👶'),
  (gen_random_uuid()::text, 'Harbiy xizmatchi', 'Harbiy & Huquq', '🎖️'),
  (gen_random_uuid()::text, 'IIB xodimi', 'Harbiy & Huquq', '👮'),
  (gen_random_uuid()::text, 'Huquqshunos', 'Harbiy & Huquq', '⚖️'),
  (gen_random_uuid()::text, 'Qutqaruvchi (FVV)', 'Harbiy & Huquq', '🚒'),
  (gen_random_uuid()::text, 'Muhandis', 'Muhandislik', '⚙️'),
  (gen_random_uuid()::text, 'Arxitektor', 'Muhandislik', '🏗️'),
  (gen_random_uuid()::text, 'Quruvchi', 'Muhandislik', '👷'),
  (gen_random_uuid()::text, 'Elektrchi', 'Muhandislik', '💡'),
  (gen_random_uuid()::text, 'Uchuvchi', 'Muhandislik', '✈️'),
  (gen_random_uuid()::text, 'Rassom', 'Ijodkorlik', '🖌️'),
  (gen_random_uuid()::text, 'Musiqachi', 'Ijodkorlik', '🎵'),
  (gen_random_uuid()::text, 'Jurnalist', 'Ijodkorlik', '🎤'),
  (gen_random_uuid()::text, 'Bloger/Youtuber', 'Ijodkorlik', '🎥'),
  (gen_random_uuid()::text, 'Oshpaz', 'Ijodkorlik', '👨‍🍳'),
  (gen_random_uuid()::text, 'Tikuvchi/Dizayner', 'Ijodkorlik', '✂️'),
  (gen_random_uuid()::text, 'Fermer', 'Tadbirkorlik', '🚜'),
  (gen_random_uuid()::text, 'Tadbirkor', 'Tadbirkorlik', '💼'),
  (gen_random_uuid()::text, 'Bank xodimi', 'Tadbirkorlik', '🏦'),
  (gen_random_uuid()::text, 'Sportchi/Murabbiy', 'Tadbirkorlik', '⚽')
ON CONFLICT ("name") DO NOTHING;


-- ---------------------------------------------------------------------
--  Tekshiruv - quyidagi natija chiqishi kerak:
--    mahallalar = 70,  maktablar = 94,  kasblar = 35,  anketalar = 0
-- ---------------------------------------------------------------------

SELECT
  (SELECT count(*) FROM "Mahalla")    AS mahallalar,
  (SELECT count(*) FROM "School")     AS maktablar,
  (SELECT count(*) FROM "Profession") AS kasblar,
  (SELECT count(*) FROM "Student")    AS anketalar;
