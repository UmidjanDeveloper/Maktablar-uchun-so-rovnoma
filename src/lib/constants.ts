/**
 * ============================================================
 *  KELAJAK EGASI — Loyihaning barcha statik ma'lumotlari
 *  Bu fayl ham ilova (frontend/API), ham `prisma/seed.ts`
 *  tomonidan ishlatiladi — yagona manba (single source of truth).
 * ============================================================
 */

/** Xatirchi tumanidagi mahallalar */
export const MAHALLALAR: string[] = [
  "Angidon",
  "Langar",
  "Altintov",
  "Uzunquduq",
  "Bog'ishamol",
  "Oltinsoy",
  "Kattasoy",
  "Changir",
  "Nayman",
  "Guliston",
  "Xo'jaqo'rg'on",
  "Yangi",
  "Bo'g'irdoq",
  "Navbaxor",
  "Chinobod",
  "Binokor",
  "Chechak ota",
  "Qoracha",
  "Mustaqillik",
  "Xuddon",
  "Oqoltin",
  "Koriz-Arab",
  "Galabek",
  "Jazoyir",
  "Olmazor",
  "Xo'jaqulobod",
  "Ko'ksaroy",
  "Fidokor",
  "Jaloyir",
  "M.Ulug'bek",
  "Toshquloq",
  "Paxtakor",
  "Yangirabod",
  "Yangirabot",
];

/** Tumandagi 50 ta maktab: "1-maktab" ... "50-maktab" */
export const MAKTABLAR: string[] = Array.from(
  { length: 50 },
  (_, i) => `${i + 1}-maktab`
);

/** Ro'yxatda yo'q maktab uchun zaxira variant */
export const BOSHQA_MAKTAB = 'Boshqa';

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
