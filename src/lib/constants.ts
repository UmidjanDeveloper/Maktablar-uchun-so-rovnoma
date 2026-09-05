/**
 * ============================================================
 *  KELAJAK EGASI — Loyihaning barcha statik ma'lumotlari
 *  Bu fayl ham ilova (frontend/API), ham `prisma/seed.ts`
 *  tomonidan ishlatiladi — yagona manba (single source of truth).
 * ============================================================
 */

/**
 * Xatirchi tumanidagi mahallalar (fuqarolar yig'inlari) — 70 ta.
 *
 * Manba: tuman hokimligining "Xatirchi tumanidagi mahalla raislarining
 * RO'YXATI" rasmiy hujjati. Nomlar kirill alifbosidan lotinga o'girilgan.
 *
 * Ro'yxat o'zgarsa (yangi MFY tashkil etilsa yoki nomi o'zgarsa), uni
 * shu yerda emas, admin panel orqali yangilash tavsiya etiladi:
 * /admin/settings -> Mahallalar. Bu yerdagi ro'yxat faqat boshlang'ich
 * (seed) ma'lumot sifatida ishlatiladi.
 */
export const MAHALLALAR: string[] = [
  'Avoqli',
  'Alisher Navoiy',
  'Amir Temur',
  'Angidon',
  'Baxshijar',
  'Binokor',
  "Bog'ishamol",
  "Bog'chakalon",
  "Bo'g'irdoq",
  'Bunyodkor',
  'Galabek',
  'Guliston',
  'Damariq',
  'Dehqonobod',
  "Do'stlik",
  'Jaloyir',
  'Zarafshon',
  'Zarbdor',
  'Ikrom Karvon',
  'Istiqlol',
  'Kattasoy',
  'Koriz Arab',
  "Ko'ksaroy",
  'Qoracha',
  "Qo'rg'ontepa",
  "Qo'rg'oncha",
  'Quchchi',
  "Qo'shchinor",
  'Langar',
  "M.Ulug'bek",
  'Madaniyat',
  'Maydon',
  'Miyonqol',
  'Mirdosh',
  'Mirishkor',
  'Mustaqillik',
  'Navbahor',
  "Navro'z",
  'Nayman',
  'Novja',
  'Oq-oltin',
  'Oqtepa',
  'Olmazor',
  'Oltinobod',
  'Oltinsoy',
  'Paraxun',
  'Paxtakor',
  'Polvonota',
  'Samarqand',
  'Sangijuman',
  'Saroy',
  'Tamabaxrin',
  'Tasmachi',
  'Tinchlik',
  'Toshquloq',
  'Uyshun',
  'Uchqora',
  'Uchtepa',
  'Farovon',
  'Fidokor',
  'Xonaqa',
  "Xo'jaqulobod",
  "Xo'jaqo'rg'on",
  "Chag'atoy",
  'Changir',
  'Chechak ota',
  'Chinobod',
  'Yangi',
  'Yangi qurilish',
  'Yangirabod',
];

/**
 * Xatirchi tumanidagi umumta'lim maktablari — 94 ta.
 *
 * Manba: tuman xalq ta'limi bo'limining rasmiy ro'yxati.
 * Nomlar hujjatdagidek saqlangan; faqat quyidagilar tuzatilgan:
 *   - turli apostroflar bitta ' belgisiga keltirildi
 *   - "88-IDUM" kirill alifbosidan lotinga o'girildi
 *   - "Xatirchi tumsni" -> "Xatirchi tumani" (imlo xatosi)
 *   - "FANINICHUQURLASHTIRIB" -> "FANINI CHUQURLASHTIRIB"
 *
 * Ro'yxatdagi ba'zi maktablar nomi boshqa shaklda yozilgan (15, 20, 31,
 * 53, 88-IDUM), shuning uchun tartiblash nom ichidagi BIRINCHI raqam
 * bo'yicha amalga oshiriladi — `schoolSortKey` ga qarang.
 *
 * Ro'yxat o'zgarsa — admin panel orqali yangilang:
 * /admin/settings -> Maktablar.
 */
export const MAKTABLAR: string[] = [
  "1-sonli umumiy o'rta ta'lim maktabi",
  "2-sonli umumiy o'rta ta'lim maktabi",
  "3-sonli umumiy o'rta ta'lim maktabi",
  "4-sonli umumiy o'rta ta'lim maktabi",
  "5-sonli umumiy o'rta ta'lim maktabi",
  "6-sonli umumiy o'rta ta'lim maktabi",
  "7-sonli ayrim fanlar chuqur o'qitiladigan sinflari mavjud umumiy o'rta ta'lim maktabi",
  "8-sonli umumiy o'rta ta'lim maktabi",
  "9-sonli umumiy o'rta ta'lim maktabi",
  "10-sonli umumiy o'rta ta'lim maktabi",
  "11-sonli umumiy o'rta ta'lim maktabi",
  "12-sonli umumiy o'rta ta'lim maktabi",
  "13-sonli umumiy o'rta ta'lim maktabi",
  "14-sonli umumiy o'rta ta'lim maktabi",
  "16-sonli umumiy o'rta ta'lim maktabi",
  "17-sonli umumiy o'rta ta'lim maktabi",
  "18-sonli umumiy o'rta ta'lim maktabi",
  "19-sonli umumiy o'rta ta'lim maktabi",
  "Xatirchi tumani 21-sonli umumiy o'rta ta'lim maktabi",
  "Xatirchi tumani 22-sonli umumiy o'rta ta'lim maktabi",
  "23-sonli umumiy o'rta ta'lim maktabi",
  "24-sonli umumiy o'rta ta'lim maktabi",
  "25-sonli umumiy o'rta ta'lim maktabi",
  "26-sonli umumiy o'rta ta'lim maktabi",
  "27-sonli umumiy o'rta ta'lim maktabi",
  "28-sonli umumiy o'rta ta'lim maktabi",
  "29-sonli umumiy o'rta ta'lim maktabi",
  "30-sonli umumiy o'rta ta'lim maktabi",
  "32-sonli umumiy o'rta ta'lim maktabi",
  "33-sonli umumiy o'rta ta'lim maktabi",
  "34-sonli umumiy o'rta ta'lim maktabi",
  "35-sonli umumiy o'rta ta'lim maktabi",
  "36-sonli umumiy o'rta ta'lim maktabi",
  "Xatirchi tumani 37-sonli umumiy o'rta ta'lim maktabi",
  "38-sonli umumiy o'rta ta'lim maktabi",
  "39-sonli umumiy o'rta ta'lim maktabi",
  "40-sonli umumiy o'rta ta'lim maktabi",
  "41-sonli umumiy o'rta ta'lim maktabi",
  "42-sonli umumiy o'rta ta'lim maktabi",
  "43-sonli umumiy o'rta ta'lim maktabi",
  "44-sonli umumiy o'rta ta'lim maktabi",
  "45-sonli umumiy o'rta ta'lim maktabi",
  "46-sonli umumiy o'rta ta'lim maktabi",
  "47-sonli umumiy o'rta ta'lim maktabi",
  "48-sonli umumiy o'rta ta'lim maktabi",
  "49-sonli umumiy o'rta ta'lim maktabi",
  "50-sonli umumiy o'rta ta'lim maktabi",
  "Xatirchi tuman 51-sonli umumiy o'rta ta'lim maktabi",
  "52-sonli umumiy o'rta ta'lim maktabi",
  "54-sonli umumiy o'rta ta'lim maktabi",
  "55-sonli umumiy o'rta ta'lim maktabi",
  "56-sonli umumiy o'rta ta'lim maktabi",
  "57-sonli umumiy o'rta ta'lim maktabi",
  "58-sonli umumiy o'rta ta'lim maktabi",
  "59-sonli umumiy o'rta ta'lim maktabi",
  "60-sonli umumiy o'rta ta'lim maktabi",
  "61-sonli umumiy o'rta ta'lim maktabi",
  "62-sonli umumiy o'rta ta'lim maktabi",
  "63-sonli umumiy o'rta ta'lim maktabi",
  "64-sonli umumiy o'rta ta'lim maktabi",
  "65-sonli umumiy o'rta ta'lim maktabi",
  "66-sonli umumiy o'rta ta'lim maktabi",
  "67-sonli umumiy o'rta ta'lim maktabi",
  "68-sonli umumiy o'rta ta'lim maktabi",
  "69-sonli umumiy o'rta ta'lim maktabi",
  "70-sonli umumiy o'rta ta'lim maktabi",
  "71-sonli umumiy o'rta ta'lim maktabi",
  "72-sonli umumiy o'rta ta'lim maktabi",
  "73-sonli umumiy o'rta ta'lim maktabi",
  "74-sonli umumiy o'rta ta'lim maktabi",
  "75-sonli umumiy o'rta ta'lim maktabi",
  "76-sonli umumiy o'rta ta'lim maktabi",
  "77-sonli umumiy o'rta ta'lim maktabi",
  "78-sonli umumiy o'rta ta'lim maktabi",
  "79-sonli umumiy o'rta ta'lim maktabi",
  "80-sonli umumiy o'rta ta'lim maktabi",
  "81-sonli umumiy o'rta ta'lim maktabi",
  "82-sonli umumiy o'rta ta'lim maktabi",
  "83-sonli umumiy o'rta ta'lim maktabi",
  "84-sonli umumiy o'rta ta'lim maktabi",
  "85-sonli umumiy o'rta ta'lim maktabi",
  "86-sonli umumiy o'rta ta'lim maktabi",
  "87-sonli umumiy o'rta ta'lim maktabi",
  "88-sonli umumiy o'rta ta'lim maktabi",
  "89-sonli umumiy o'rta ta'lim maktabi",
  "90-sonli umumiy o'rta ta'lim maktabi",
  "91-sonli umumiy o'rta ta'lim maktabi",
  "92-sonli umumiy o'rta ta'lim maktabi",
  "31- umumiy o'rta ta'lim maktabi",
  "53- umumiy o'rta ta'lim maktabi",
  '88-IDUM',
  "Ixtisoslashtirilgan ta'lim muassasalari agentligi tizimidagi Xatirchi tuman ixtisoslashtirilgan maktabi",
  "O'ZB. RES. MAKTABGACHA VA MAKTAB TA'LIMI VAZIRLIGI NAVOIY VILOYATI XATIRCHI TUMANI 20-INFORMATIKA VA AXBOROT TEXNOLOGIYALARI FANINI CHUQURLASHTIRIB O'QITISHGA IXTISOSLASHTIRILGAN DAVLAT UMUMTA'LIM MAKTABI",
  "Xatirchi tumani 15-umumiy o'rta ta'lim maktabi",
];

export interface ProfessionSeed {
  name: string;
  category: string;
  icon: string;
}

/** Kasblar katalogi — emoji ikonkalari bolalar uchun qiziqarli qilib tanlangan */
export const KASBLAR: ProfessionSeed[] = [
  { name: "Dasturchi", category: "IT & Texnologiya", icon: "💻" },
  { name: "Sun'iy Intellekt mutaxassisi", category: "IT & Texnologiya", icon: "🤖" },
  { name: "Kiberxavfsizlik mutaxassisi", category: "IT & Texnologiya", icon: "🛡️" },
  { name: "Grafik Dizayner", category: "IT & Texnologiya", icon: "🎨" },
  { name: "Mobil ilova yaratuvchi", category: "IT & Texnologiya", icon: "📱" },
  { name: "O'yin yaratuvchi", category: "IT & Texnologiya", icon: "🎮" },
  { name: "Shifokor", category: "Tibbiyot", icon: "🩺" },
  { name: "Jarroh", category: "Tibbiyot", icon: "🏥" },
  { name: "Stomatolog", category: "Tibbiyot", icon: "🦷" },
  { name: "Hamshira", category: "Tibbiyot", icon: "💉" },
  { name: "Psixolog", category: "Tibbiyot", icon: "🧠" },
  { name: "Farmatsevt", category: "Tibbiyot", icon: "💊" },
  { name: "Veterinar", category: "Tibbiyot", icon: "🐾" },
  { name: "O'qituvchi", category: "Ta'lim & Ilm", icon: "📚" },
  { name: "Olim", category: "Ta'lim & Ilm", icon: "🔬" },
  { name: "Tarbiyachi", category: "Ta'lim & Ilm", icon: "👶" },
  { name: "Harbiy xizmatchi", category: "Harbiy & Huquq", icon: "🎖️" },
  { name: "IIB xodimi", category: "Harbiy & Huquq", icon: "👮" },
  { name: "Huquqshunos", category: "Harbiy & Huquq", icon: "⚖️" },
  { name: "Qutqaruvchi (FVV)", category: "Harbiy & Huquq", icon: "🚒" },
  { name: "Muhandis", category: "Muhandislik", icon: "⚙️" },
  { name: "Arxitektor", category: "Muhandislik", icon: "🏗️" },
  { name: "Quruvchi", category: "Muhandislik", icon: "👷" },
  { name: "Elektrchi", category: "Muhandislik", icon: "💡" },
  { name: "Uchuvchi", category: "Muhandislik", icon: "✈️" },
  { name: "Rassom", category: "Ijodkorlik", icon: "🖌️" },
  { name: "Musiqachi", category: "Ijodkorlik", icon: "🎵" },
  { name: "Jurnalist", category: "Ijodkorlik", icon: "🎤" },
  { name: "Bloger/Youtuber", category: "Ijodkorlik", icon: "🎥" },
  { name: "Oshpaz", category: "Ijodkorlik", icon: "👨‍🍳" },
  { name: "Tikuvchi/Dizayner", category: "Ijodkorlik", icon: "✂️" },
  { name: "Fermer", category: "Tadbirkorlik", icon: "🚜" },
  { name: "Tadbirkor", category: "Tadbirkorlik", icon: "💼" },
  { name: "Bank xodimi", category: "Tadbirkorlik", icon: "🏦" },
  { name: "Sportchi/Murabbiy", category: "Tadbirkorlik", icon: "⚽" },
];

/**
 * Kasb yo'nalishlari — 3-qadamdagi tablar uchun.
 * `label` — bolaga ko'rinadigan qisqa nom, `value` — bazadagi to'liq nom.
 */
export const KASB_KATEGORIYALARI: { label: string; value: string; icon: string }[] = [
  { label: 'IT', value: 'IT & Texnologiya', icon: '💻' },
  { label: 'Tibbiyot', value: 'Tibbiyot', icon: '🩺' },
  { label: 'Harbiy', value: 'Harbiy & Huquq', icon: '🎖️' },
  { label: "Ta'lim", value: "Ta'lim & Ilm", icon: '📚' },
  { label: 'Muhandislik', value: 'Muhandislik', icon: '⚙️' },
  { label: 'Ijodkorlik', value: 'Ijodkorlik', icon: '🎨' },
  { label: 'Tadbirkorlik', value: 'Tadbirkorlik', icon: '💼' },
];

/** Maktab fanlari — 2-qadamdagi ko'p tanlovli chiplar */
export const FANLAR: { name: string; icon: string }[] = [
  { name: 'Matematika', icon: '➗' },
  { name: 'Fizika', icon: '🧲' },
  { name: 'Biologiya', icon: '🌿' },
  { name: 'Kimyo', icon: '⚗️' },
  { name: 'Tarix', icon: '🏛️' },
  { name: 'Ona tili', icon: '📖' },
  { name: 'Ingliz tili', icon: '🇬🇧' },
  { name: 'Informatika', icon: '🖥️' },
  { name: 'Sport', icon: '🏃' },
  { name: 'Rasm', icon: '🖼️' },
];

/** To'garaklar */
export const TOGARAKLAR: { name: string; icon: string }[] = [
  { name: 'IT', icon: '💻' },
  { name: 'Sport', icon: '⚽' },
  { name: 'Musiqa', icon: '🎹' },
  { name: 'Til kurslari', icon: '🗣️' },
  { name: 'Hech qaysi', icon: '🚫' },
];

/** Sinflar (5-11) */
export const SINFLAR: number[] = [5, 6, 7, 8, 9, 10, 11];

/** Jins variantlari */
export const JINSLAR = ["O'g'il bola", 'Qiz bola'] as const;
export type Jins = (typeof JINSLAR)[number];

/** "Senga kim ilhom berdi?" variantlari */
export const ILHOMLANTIRUVCHILAR: { name: string; icon: string }[] = [
  { name: 'Otam/Onam', icon: '👨‍👩‍👦' },
  { name: "O'qituvchim", icon: '👩‍🏫' },
  { name: 'Internet', icon: '🌐' },
  { name: 'Kitob/Qahramon', icon: '📕' },
];

/** "Chet elda o'qishni xohlaysanmi?" variantlari */
export const CHET_EL_JAVOBLARI: { name: string; icon: string }[] = [
  { name: 'Ha', icon: '✅' },
  { name: "Yo'q", icon: '❌' },
  { name: "O'ylab ko'rmaganman", icon: '🤔' },
];

/** Standart hudud qiymatlari */
export const VILOYAT = 'Navoiy';
export const TUMAN = 'Xatirchi';

/**
 * Diagrammalar uchun kategoriyali ranglar palitrasi — yangi diagramma
 * qo'shilganda shu ro'yxatdan tartib bo'yicha rang olinadi.
 *
 * Ranglar `dataviz` validatori bilan tekshirilgan: yorqinlik diapazoni,
 * rang to'yinganligi, rang ko'rmaslik (CVD) uchun ajralish va oq fonda
 * kontrast — barcha tekshiruvlardan o'tgan.
 */
export const CHART_COLORS = [
  '#3366f2',
  '#ea580c',
  '#059669',
  '#8b5cf6',
  '#dc2626',
  '#0891b2',
  '#a16207',
  '#db2777',
];

/** Bitta seriyali diagrammalar uchun asosiy rang */
export const CHART_PRIMARY = '#3366f2';

/**
 * Ketma-ket (sequential) ranglar shkalasi — doiraviy diagrammalar uchun.
 * Ranglar yorqinlik bo'yicha ketma-ket joylashgan, shuning uchun rangni
 * ajrata olmaydigan foydalanuvchilar ham bo'laklarni farqlay oladi.
 */
export const RAMP_BLUE = [
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
];

export const RAMP_AMBER = [
  '#fed7aa',
  '#fdba74',
  '#fb923c',
  '#f97316',
  '#ea580c',
  '#dc2626',
  '#c2410c',
  '#9a3412',
  '#7c2d12',
  '#611c0c',
];

/**
 * Jins bo'yicha ranglar — barcha diagrammalarda bir xil bo'lishi uchun.
 * Ushbu juftlik ham CVD tekshiruvidan o'tgan (DeltaE 19.8 protan).
 */
export const GENDER_COLORS: Record<string, string> = {
  "O'g'il bola": '#3366f2',
  'Qiz bola': '#db2777',
};

/** Kasb nomiga qarab emoji topish uchun tezkor xarita */
export const KASB_ICON_MAP: Record<string, string> = KASBLAR.reduce(
  (acc, k) => {
    acc[k.name] = k.icon;
    return acc;
  },
  {} as Record<string, string>
);
