/**
 * ============================================================
 *  KELAJAK EGASI — Ma'lumotlar bazasini boshlang'ich to'ldirish
 *  Ishga tushirish:  npm run db:seed
 *
 *  Bajaradi:
 *   1. Mahallalar, Maktablar, Kasblar kataloglarini yozadi
 *   2. Demo uchun 150 ta namunaviy o'quvchi anketasini yaratadi
 * ============================================================
 */
import { PrismaClient } from '@prisma/client';
import {
  MAHALLALAR,
  MAKTABLAR,
  KASBLAR,
  FANLAR,
  TOGARAKLAR,
  KERAKLI_KURSLAR_TEKIS,
  TILLAR,
  MASOFA_JAVOBLARI,
  TOSIQLAR,
  VAQT_JAVOBLARI,
  UY_TEXNIKASI,
  TIL_KERAK_EMAS,
  TOSIQ_YOQ,
} from '../src/lib/constants';
import { buildDedupeKey } from '../src/lib/dedupe';

const prisma = new PrismaClient();

/** Namunaviy o'g'il bola ismlari */
const OGIL_ISMLAR = [
  'Abdulloh', 'Muhammad', 'Sardor', 'Javohir', 'Diyorbek', 'Bekzod', 'Shohruh',
  'Aziz', 'Doniyor', 'Otabek', 'Islom', 'Jasur', 'Nodirbek', 'Ulug\'bek',
  'Sanjar', 'Xurshid', 'Bobur', 'Temur', 'Alisher', 'Farrux', 'Kamron',
  'Asadbek', 'Mirjalol', 'Ibrohim', 'Yusuf', 'Umar', 'Aslbek', 'Behruz',
];

/** Namunaviy qiz bola ismlari */
const QIZ_ISMLAR = [
  'Zilola', 'Madina', 'Sevinch', 'Nilufar', 'Gulnoza', 'Dilnoza', 'Shahzoda',
  'Malika', 'Zarina', 'Iroda', 'Nodira', 'Mohira', 'Sarvinoz', 'Ozoda',
  'Robiya', 'Sabina', 'Xadicha', 'Oysha', 'Muslima', 'Zaynab', 'Nafisa',
  'Dilfuza', 'Kamola', 'Munisa', 'Ra\'no', 'Shahnoza', 'Feruza', 'Laylo',
];

/** Namunaviy familiyalar */
const FAMILIYALAR = [
  'Karimov', 'Rahimov', 'Yusupov', 'Toshmatov', 'Ergashev', 'Sobirov',
  'Nazarov', 'Xolmatov', 'Islomov', 'Qodirov', 'Sultonov', 'Bekmurodov',
  'Jo\'rayev', 'Umarov', 'Xasanov', 'Aliyev', 'Tursunov', 'Mahmudov',
  'Normatov', 'Xudoyberdiyev', 'Ochilov', 'Ismoilov', 'Sattorov', 'Boboyev',
];

const ILHOM = ['Otam/Onam', "O'qituvchim", 'Internet', 'Kitob/Qahramon'];
const CHET_EL = ['Ha', "Yo'q", "O'ylab ko'rmaganman"];

const MOTIVATSIYALAR = [
  'Bu kasb menga juda qiziq va kelajagi porloq deb o\'ylayman.',
  'Otam shu sohada ishlaydi, men ham unga o\'xshashni xohlayman.',
  'Odamlarga foyda keltirishni istayman.',
  'Kichikligimdan shu sohaga qiziqaman.',
  'Bu kasb orqali mamlakatimizni rivojlantirishga hissa qo\'shmoqchiman.',
  'Internetdan ko\'p video ko\'rganman va juda yoqdi.',
  'O\'qituvchim menga bu sohani tavsiya qildi.',
  'Yaxshi daromad va qiziqarli ish deb bilaman.',
];

const HISSALAR = [
  'Mahallamizda bepul to\'garak ochmoqchiman.',
  'Yoshlarga o\'z kasbimni o\'rgataman.',
  'Mahallamizni obodonlashtirishga yordam beraman.',
  'Zamonaviy klinika ochmoqchiman.',
  'Bolalar uchun sport maydonchasi quraman.',
  'Mahalladagi kambag\'al oilalarga yordam beraman.',
  'Yangi ish o\'rinlari yarataman.',
  'Kutubxona va o\'quv markazi ochaman.',
];

/** Massivdan tasodifiy element tanlaydi */
function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Massivdan 1..max tagacha takrorlanmaydigan tasodifiy elementlar tanlaydi */
function randMany<T>(arr: readonly T[], max: number): T[] {
  const count = 1 + Math.floor(Math.random() * max);
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

/** Oxirgi `days` kun ichida tasodifiy sana */
function randomDate(days: number): Date {
  const now = Date.now();
  return new Date(now - Math.floor(Math.random() * days * 24 * 60 * 60 * 1000));
}

/** Tasodifiy O'zbekiston telefon raqami */
function randomPhone(): string {
  const codes = ['90', '91', '93', '94', '95', '97', '98', '99', '88', '77'];
  const n = () => Math.floor(Math.random() * 10);
  return `+998${rand(codes)}${n()}${n()}${n()}${n()}${n()}${n()}${n()}`;
}

async function main() {
  console.log('🌱 Ma\'lumotlar bazasi to\'ldirilmoqda...\n');

  // ---------- 1. Mahallalar ----------
  await prisma.mahalla.createMany({
    data: MAHALLALAR.map((name) => ({ name })),
    skipDuplicates: true,
  });
  console.log(`✅ Mahallalar: ${MAHALLALAR.length} ta`);

  // ---------- 2. Maktablar ----------
  await prisma.school.createMany({
    data: MAKTABLAR.map((name) => ({ name })),
    skipDuplicates: true,
  });
  console.log(`✅ Maktablar: ${MAKTABLAR.length} ta`);

  // ---------- 3. Kasblar ----------
  await prisma.profession.createMany({
    data: KASBLAR,
    skipDuplicates: true,
  });
  console.log(`✅ Kasblar: ${KASBLAR.length} ta`);

  // ---------- 4. Demo o'quvchilar ----------
  const existing = await prisma.student.count();
  if (existing > 0) {
    console.log(`\nℹ️  Bazada allaqachon ${existing} ta anketa bor — demo ma'lumot qo'shilmadi.`);
    console.log('   Qayta yaratish uchun avval jadvalni tozalang.');
    return;
  }

  const fanNomlari = FANLAR.map((f) => f.name);
  const togarakNomlari = TOGARAKLAR.map((t) => t.name).filter((t) => t !== 'Hech qaysi');
  const kursNomlari = KERAKLI_KURSLAR_TEKIS.map((k) => k.name);
  const tilNomlari = TILLAR.map((t) => t.name).filter((t) => t !== TIL_KERAK_EMAS);
  const masofaNomlari = MASOFA_JAVOBLARI.map((m) => m.name);
  const tosiqNomlari = TOSIQLAR.map((t) => t.name).filter((t) => t !== TOSIQ_YOQ);
  const vaqtNomlari = VAQT_JAVOBLARI.map((v) => v.name);
  const texnikaNomlari = UY_TEXNIKASI.map((u) => u.name);

  // Takrorlanmas kalitlar to'plami — demo ma'lumotda ham
  // bir xil (ism + familiya + maktab + sinf + kun) uchramasligi uchun
  const usedKeys = new Set<string>();

  const makeStudent = () => {
    const isBoy = Math.random() > 0.48; // Taxminan 52% o'g'il bola
    const gender = isBoy ? "O'g'il bola" : 'Qiz bola';
    const firstName = isBoy ? rand(OGIL_ISMLAR) : rand(QIZ_ISMLAR);
    const lastName = rand(FAMILIYALAR) + (isBoy ? '' : 'a');
    const kasb = rand(KASBLAR);
    const school = rand(MAKTABLAR);
    const grade = 5 + Math.floor(Math.random() * 7);
    const createdAt = randomDate(60);

    const phone = Math.random() > 0.5 ? randomPhone() : null;
    const dedupeKey = buildDedupeKey(firstName, lastName, school, grade, phone, createdAt);
    // Kalit takrorlansa — boshqa o'quvchi yaratamiz
    if (usedKeys.has(dedupeKey)) return null;
    usedKeys.add(dedupeKey);

    return {
      firstName,
      lastName,
      gender,
      dedupeKey,
      phone,
      parentPhone: Math.random() > 0.6 ? randomPhone() : null,
      region: 'Navoiy',
      district: 'Xatirchi',
      mahalla: rand(MAHALLALAR),
      school,
      grade,
      favoriteSubjects: randMany(fanNomlari, 4),
      clubs: Math.random() > 0.25 ? randMany(togarakNomlari, 2) : ['Hech qaysi'],
      dreamJob: kasb.name,
      jobCategory: kasb.category,
      motivation: rand(MOTIVATSIYALAR),
      inspiration: rand(ILHOM),
      studyAbroad: rand(CHET_EL),
      futureContribution: rand(HISSALAR),
      // Ta'lim markazi savollari (4-qadam)
      wantedCourses: randMany(kursNomlari, 3),
      wantedLanguages:
        Math.random() > 0.2 ? randMany(tilNomlari, 2) : [TIL_KERAK_EMAS],
      travelWillingness: rand(masofaNomlari),
      barriers: Math.random() > 0.35 ? randMany(tosiqNomlari, 2) : [TOSIQ_YOQ],
      availableTimes: randMany(vaqtNomlari, 2),
      homeTech: rand(texnikaNomlari),
      createdAt,
    };
  };

  // Aynan 150 ta takrorlanmas anketa yig'amiz
  const students: NonNullable<ReturnType<typeof makeStudent>>[] = [];
  while (students.length < 150) {
    const student = makeStudent();
    if (student) students.push(student);
  }

  await prisma.student.createMany({ data: students });
  console.log(`✅ Demo anketalar: ${students.length} ta`);

  console.log('\n🎉 Tayyor! Endi `npm run dev` buyrug\'i bilan ilovani ishga tushiring.');
}

main()
  .catch((e) => {
    console.error('❌ Xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
