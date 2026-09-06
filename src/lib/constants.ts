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

/**
 * Kasblar katalogi.
 *
 * Ikonka sifatida emoji saqlanadi — u faqat eksport fayllari uchun
 * zaxira belgi. Interfeysda kasb nomi bo'yicha SVG ikona chiziladi
 * (src/lib/icons.tsx). Yangi kasb qo'shsangiz, o'sha reyestrga ham
 * ikona qo'shing, aks holda zaxira ikona ko'rinadi.
 */
export const KASBLAR: ProfessionSeed[] = [
  // IT & Texnologiya
  { name: 'Dasturchi', category: 'IT & Texnologiya', icon: '💻' },
  { name: "Sun'iy Intellekt mutaxassisi", category: 'IT & Texnologiya', icon: '🤖' },
  { name: 'Kiberxavfsizlik mutaxassisi', category: 'IT & Texnologiya', icon: '🛡️' },
  { name: 'Grafik Dizayner', category: 'IT & Texnologiya', icon: '🎨' },
  { name: 'Mobil ilova yaratuvchi', category: 'IT & Texnologiya', icon: '📱' },
  { name: "O'yin yaratuvchi", category: 'IT & Texnologiya', icon: '🎮' },
  { name: 'Veb-dasturchi', category: 'IT & Texnologiya', icon: '🌐' },
  { name: "Ma'lumotlar tahlilchisi", category: 'IT & Texnologiya', icon: '📊' },
  { name: 'Tarmoq muhandisi', category: 'IT & Texnologiya', icon: '🕸️' },
  { name: 'Robototexnik', category: 'IT & Texnologiya', icon: '🦾' },
  { name: '3D modelchi', category: 'IT & Texnologiya', icon: '🧊' },
  { name: 'Dastur sinovchisi (QA)', category: 'IT & Texnologiya', icon: '🐞' },
  { name: 'Kompyuter ustasi', category: 'IT & Texnologiya', icon: '🔌' },
  { name: 'Dron uchuvchisi', category: 'IT & Texnologiya', icon: '🚁' },
  // Tibbiyot
  { name: 'Shifokor', category: 'Tibbiyot', icon: '🩺' },
  { name: 'Jarroh', category: 'Tibbiyot', icon: '🏥' },
  { name: 'Stomatolog', category: 'Tibbiyot', icon: '🦷' },
  { name: 'Hamshira', category: 'Tibbiyot', icon: '💉' },
  { name: 'Psixolog', category: 'Tibbiyot', icon: '🧠' },
  { name: 'Farmatsevt', category: 'Tibbiyot', icon: '💊' },
  { name: 'Veterinar', category: 'Tibbiyot', icon: '🐾' },
  { name: 'Pediatr', category: 'Tibbiyot', icon: '👶' },
  { name: 'Kardiolog', category: 'Tibbiyot', icon: '❤️' },
  { name: "Ko'z shifokori", category: 'Tibbiyot', icon: '👁️' },
  { name: 'Laborant', category: 'Tibbiyot', icon: '🧪' },
  { name: 'Rentgenolog', category: 'Tibbiyot', icon: '📡' },
  { name: 'Tez yordam feldsheri', category: 'Tibbiyot', icon: '🚑' },
  { name: 'Reabilitolog', category: 'Tibbiyot', icon: '🦯' },
  { name: 'Dietolog', category: 'Tibbiyot', icon: '🍎' },
  // Ta'lim & Ilm
  { name: "O'qituvchi", category: "Ta'lim & Ilm", icon: '📚' },
  { name: 'Olim', category: "Ta'lim & Ilm", icon: '🔬' },
  { name: 'Tarbiyachi', category: "Ta'lim & Ilm", icon: '🧸' },
  { name: "Boshlang'ich sinf o'qituvchisi", category: "Ta'lim & Ilm", icon: '✏️' },
  { name: 'Maktab direktori', category: "Ta'lim & Ilm", icon: '🏫' },
  { name: 'Kutubxonachi', category: "Ta'lim & Ilm", icon: '📖' },
  { name: 'Tarjimon', category: "Ta'lim & Ilm", icon: '🗣️' },
  { name: 'Arxeolog', category: "Ta'lim & Ilm", icon: '⛏️' },
  { name: 'Geolog', category: "Ta'lim & Ilm", icon: '🏔️' },
  { name: 'Astronom', category: "Ta'lim & Ilm", icon: '🔭' },
  { name: 'Matematik', category: "Ta'lim & Ilm", icon: '➗' },
  { name: 'Biolog', category: "Ta'lim & Ilm", icon: '🧬' },
  { name: 'Tarixchi', category: "Ta'lim & Ilm", icon: '📜' },
  // Harbiy & Huquq
  { name: 'Harbiy xizmatchi', category: 'Harbiy & Huquq', icon: '🎖️' },
  { name: 'IIB xodimi', category: 'Harbiy & Huquq', icon: '👮' },
  { name: 'Huquqshunos', category: 'Harbiy & Huquq', icon: '⚖️' },
  { name: 'Qutqaruvchi (FVV)', category: 'Harbiy & Huquq', icon: '🚒' },
  { name: 'Chegarachi', category: 'Harbiy & Huquq', icon: '🚩' },
  { name: 'Sudya', category: 'Harbiy & Huquq', icon: '🔨' },
  { name: 'Prokuror', category: 'Harbiy & Huquq', icon: '📕' },
  { name: 'Advokat', category: 'Harbiy & Huquq', icon: '📗' },
  { name: 'Tergovchi', category: 'Harbiy & Huquq', icon: '🔍' },
  { name: 'Xavfsizlik xodimi', category: 'Harbiy & Huquq', icon: '🛡️' },
  { name: 'Harbiy shifokor', category: 'Harbiy & Huquq', icon: '⚕️' },
  { name: 'Notarius', category: 'Harbiy & Huquq', icon: '🖋️' },
  { name: 'Bojxona xodimi', category: 'Harbiy & Huquq', icon: '📦' },
  // Muhandislik
  { name: 'Muhandis', category: 'Muhandislik', icon: '⚙️' },
  { name: 'Arxitektor', category: 'Muhandislik', icon: '🏗️' },
  { name: 'Quruvchi', category: 'Muhandislik', icon: '👷' },
  { name: 'Elektrchi', category: 'Muhandislik', icon: '💡' },
  { name: 'Uchuvchi', category: 'Muhandislik', icon: '✈️' },
  { name: 'Payvandchi', category: 'Muhandislik', icon: '🔥' },
  { name: 'Santexnik', category: 'Muhandislik', icon: '🔧' },
  { name: 'Avtomobil ustasi', category: 'Muhandislik', icon: '🚗' },
  { name: 'Energetik', category: 'Muhandislik', icon: '🔋' },
  { name: 'Neft va gaz muhandisi', category: 'Muhandislik', icon: '⛽' },
  { name: 'Kon muhandisi', category: 'Muhandislik', icon: '⛏️' },
  { name: 'Konstruktor', category: 'Muhandislik', icon: '📐' },
  { name: "Suv xo'jaligi muhandisi", category: 'Muhandislik', icon: '🌊' },
  { name: "Yo'l qurilishi muhandisi", category: 'Muhandislik', icon: '🚧' },
  { name: 'Iqlim texnikasi ustasi', category: 'Muhandislik', icon: '❄️' },
  // Ijodkorlik
  { name: 'Rassom', category: 'Ijodkorlik', icon: '🖌️' },
  { name: 'Musiqachi', category: 'Ijodkorlik', icon: '🎵' },
  { name: 'Jurnalist', category: 'Ijodkorlik', icon: '🎤' },
  { name: 'Bloger/Youtuber', category: 'Ijodkorlik', icon: '🎥' },
  { name: 'Oshpaz', category: 'Ijodkorlik', icon: '👨‍🍳' },
  { name: 'Tikuvchi/Dizayner', category: 'Ijodkorlik', icon: '✂️' },
  { name: 'Fotograf', category: 'Ijodkorlik', icon: '📷' },
  { name: 'Video montajchi', category: 'Ijodkorlik', icon: '🎬' },
  { name: 'Aktyor', category: 'Ijodkorlik', icon: '🎭' },
  { name: 'Rejissyor', category: 'Ijodkorlik', icon: '🎞️' },
  { name: 'Yozuvchi/Shoir', category: 'Ijodkorlik', icon: '🖊️' },
  { name: 'Xonanda', category: 'Ijodkorlik', icon: '🎙️' },
  { name: 'Raqqosa', category: 'Ijodkorlik', icon: '💃' },
  { name: 'Interyer dizayneri', category: 'Ijodkorlik', icon: '🛋️' },
  { name: 'Animator', category: 'Ijodkorlik', icon: '✨' },
  { name: 'Ovoz rejissyori', category: 'Ijodkorlik', icon: '🔊' },
  { name: 'SMM mutaxassisi', category: 'Ijodkorlik', icon: '📣' },
  // Tadbirkorlik
  { name: 'Fermer', category: 'Tadbirkorlik', icon: '🚜' },
  { name: 'Tadbirkor', category: 'Tadbirkorlik', icon: '💼' },
  { name: 'Bank xodimi', category: 'Tadbirkorlik', icon: '🏦' },
  { name: 'Sportchi/Murabbiy', category: 'Tadbirkorlik', icon: '⚽' },
  { name: 'Buxgalter', category: 'Tadbirkorlik', icon: '🧮' },
  { name: 'Iqtisodchi', category: 'Tadbirkorlik', icon: '📈' },
  { name: 'Marketolog', category: 'Tadbirkorlik', icon: '🎯' },
  { name: 'Menejer', category: 'Tadbirkorlik', icon: '📋' },
  { name: 'Savdo mutaxassisi', category: 'Tadbirkorlik', icon: '🛒' },
  { name: 'Auditor', category: 'Tadbirkorlik', icon: '🗂️' },
  { name: "Sug'urta agenti", category: 'Tadbirkorlik', icon: '📄' },
  { name: 'Investor', category: 'Tadbirkorlik', icon: '🐖' },
  { name: 'Loyiha rahbari', category: 'Tadbirkorlik', icon: '✅' },
  // Qishloq xo'jaligi
  { name: 'Agronom', category: "Qishloq xo'jaligi", icon: '🌱' },
  { name: 'Chorvador', category: "Qishloq xo'jaligi", icon: '🐄' },
  { name: "Bog'bon", category: "Qishloq xo'jaligi", icon: '🌳' },
  { name: 'Pillachi', category: "Qishloq xo'jaligi", icon: '🐛' },
  { name: 'Asalarichi', category: "Qishloq xo'jaligi", icon: '🍯' },
  { name: 'Paxtakor', category: "Qishloq xo'jaligi", icon: '🌸' },
  { name: 'Sabzavotchi', category: "Qishloq xo'jaligi", icon: '🥕' },
  { name: 'Mexanizator', category: "Qishloq xo'jaligi", icon: '🚜' },
  { name: "Suv xo'jaligi mutaxassisi", category: "Qishloq xo'jaligi", icon: '💧' },
  { name: 'Baliqchi', category: "Qishloq xo'jaligi", icon: '🐟' },
  { name: 'Parrandachi', category: "Qishloq xo'jaligi", icon: '🥚' },
  { name: 'Zootexnik', category: "Qishloq xo'jaligi", icon: '🐓' },
  { name: 'Issiqxona egasi', category: "Qishloq xo'jaligi", icon: '🏡' },
  { name: "Don va g'alla mutaxassisi", category: "Qishloq xo'jaligi", icon: '🌾' },
  // Transport & Logistika
  { name: 'Haydovchi', category: 'Transport & Logistika', icon: '🚙' },
  { name: 'Yuk mashinasi haydovchisi', category: 'Transport & Logistika', icon: '🚚' },
  { name: "Temiryo'l mashinisti", category: 'Transport & Logistika', icon: '🚆' },
  { name: 'Avtobus haydovchisi', category: 'Transport & Logistika', icon: '🚌' },
  { name: 'Taksi haydovchisi', category: 'Transport & Logistika', icon: '🚕' },
  { name: 'Logistika menejeri', category: 'Transport & Logistika', icon: '📦' },
  { name: 'Ombor mudiri', category: 'Transport & Logistika', icon: '🗃️' },
  { name: 'Kuryer', category: 'Transport & Logistika', icon: '🚲' },
  { name: 'Dispetcher', category: 'Transport & Logistika', icon: '🎧' },
  { name: 'Aviatsiya texnigi', category: 'Transport & Logistika', icon: '🛫' },
  { name: 'Yuk qabul qiluvchi', category: 'Transport & Logistika', icon: '📝' },
  // Xizmat ko'rsatish
  { name: 'Ofitsiant', category: "Xizmat ko'rsatish", icon: '🍽️' },
  { name: 'Barista', category: "Xizmat ko'rsatish", icon: '☕' },
  { name: 'Qandolatchi', category: "Xizmat ko'rsatish", icon: '🍰' },
  { name: 'Novvoy', category: "Xizmat ko'rsatish", icon: '🥐' },
  { name: 'Sartarosh', category: "Xizmat ko'rsatish", icon: '💈' },
  { name: 'Kosmetolog', category: "Xizmat ko'rsatish", icon: '💎' },
  { name: 'Mehmonxona administratori', category: "Xizmat ko'rsatish", icon: '🛏️' },
  { name: "Gid (yo'lboshchi)", category: "Xizmat ko'rsatish", icon: '🗺️' },
  { name: 'Turizm menejeri', category: "Xizmat ko'rsatish", icon: '🧳' },
  { name: 'Sotuvchi', category: "Xizmat ko'rsatish", icon: '🏪' },
  { name: 'Kassir', category: "Xizmat ko'rsatish", icon: '💳' },
  { name: 'Tozalash xizmati xodimi', category: "Xizmat ko'rsatish", icon: '🧴' },
  // Davlat xizmati
  { name: 'Davlat xizmatchisi', category: 'Davlat xizmati', icon: '🏛️' },
  { name: 'Hokim yordamchisi', category: 'Davlat xizmati', icon: '🏢' },
  { name: 'Mahalla raisi', category: 'Davlat xizmati', icon: '👥' },
  { name: 'Diplomat', category: 'Davlat xizmati', icon: '🌍' },
  { name: 'Statistik', category: 'Davlat xizmati', icon: '📉' },
  { name: 'Soliq inspektori', category: 'Davlat xizmati', icon: '🧾' },
  { name: 'Ijtimoiy xodim', category: 'Davlat xizmati', icon: '🤝' },
  { name: 'Ekolog', category: 'Davlat xizmati', icon: '🍃' },
  { name: 'Arxivchi', category: 'Davlat xizmati', icon: '🗄️' },
  { name: 'Pochta xodimi', category: 'Davlat xizmati', icon: '✉️' },
  { name: 'FHDYo xodimi', category: 'Davlat xizmati', icon: '📃' },
];

/**
 * Kasb yo'nalishlari — 3-qadamdagi tablar uchun.
 * `label` — bolaga ko'rinadigan qisqa nom, `value` — bazadagi to'liq nom.
 */
export const KASB_KATEGORIYALARI: { label: string; value: string; icon: string }[] = [
  { label: 'IT', value: 'IT & Texnologiya', icon: '💻' },
  { label: 'Tibbiyot', value: 'Tibbiyot', icon: '🩺' },
  { label: "Ta'lim", value: "Ta'lim & Ilm", icon: '📚' },
  { label: 'Harbiy', value: 'Harbiy & Huquq', icon: '🎖️' },
  { label: 'Muhandislik', value: 'Muhandislik', icon: '⚙️' },
  { label: 'Ijodkorlik', value: 'Ijodkorlik', icon: '🎨' },
  { label: 'Tadbirkorlik', value: 'Tadbirkorlik', icon: '💼' },
  { label: "Qishloq xo'jaligi", value: "Qishloq xo'jaligi", icon: '🌾' },
  { label: 'Transport', value: 'Transport & Logistika', icon: '🚚' },
  { label: 'Xizmat', value: "Xizmat ko'rsatish", icon: '🍽️' },
  { label: 'Davlat xizmati', value: 'Davlat xizmati', icon: '🏛️' },
];

/**
 * Maktab fanlari — 2-qadamdagi ko'p tanlovli chiplar.
 *
 * Guruhlarga ajratilgan: 22 ta fan bitta uzun qatorda tursa,
 * o'quvchi kerakligini topolmaydi. Guruh sarlavhalari ro'yxatni
 * ko'z bilan skanerlashni osonlashtiradi.
 */
export const FAN_GURUHLARI: { title: string; items: { name: string; icon: string }[] }[] = [
  {
    title: 'Aniq fanlar',
    items: [
      { name: 'Matematika', icon: '➗' },
      { name: 'Algebra', icon: '🔢' },
      { name: 'Geometriya', icon: '📐' },
      { name: 'Fizika', icon: '🧲' },
      { name: 'Astronomiya', icon: '🔭' },
      { name: 'Informatika', icon: '🖥️' },
    ],
  },
  {
    title: 'Tabiiy fanlar',
    items: [
      { name: 'Kimyo', icon: '⚗️' },
      { name: 'Biologiya', icon: '🌿' },
      { name: 'Geografiya', icon: '🗺️' },
    ],
  },
  {
    title: 'Ijtimoiy fanlar',
    items: [
      { name: 'Tarix', icon: '🏛️' },
      { name: 'Huquq asoslari', icon: '⚖️' },
      { name: 'Iqtisodiyot asoslari', icon: '📈' },
      { name: 'Tarbiya', icon: '🤝' },
    ],
  },
  {
    title: 'Til va adabiyot',
    items: [
      { name: 'Ona tili', icon: '📖' },
      { name: 'Adabiyot', icon: '📚' },
      { name: 'Ingliz tili', icon: '🇬🇧' },
      { name: 'Rus tili', icon: '🗣️' },
    ],
  },
  {
    title: 'Amaliy va ijodiy',
    items: [
      { name: 'Chizmachilik', icon: '✏️' },
      { name: 'Texnologiya', icon: '🔧' },
      { name: 'Rasm', icon: '🖼️' },
      { name: 'Musiqa', icon: '🎵' },
      { name: 'Sport', icon: '🏃' },
    ],
  },
];

/** Barcha fanlar bitta ro'yxatda — seed va tekshiruvlar uchun */
export const FANLAR: { name: string; icon: string }[] = FAN_GURUHLARI.flatMap(
  (g) => g.items
);

/**
 * To'garaklar — 2-qadamdagi ikkinchi chiplar guruhi.
 *
 * «Hech qaysi» alohida guruhda va istisno variant: u tanlansa
 * qolgan barcha tanlovlar bekor qilinadi.
 */
export const TOGARAK_GURUHLARI: { title: string; items: { name: string; icon: string }[] }[] = [
  {
    title: 'Sport',
    items: [
      { name: 'Futbol', icon: '⚽' },
      { name: 'Voleybol', icon: '🏐' },
      { name: 'Basketbol', icon: '🏀' },
      { name: 'Kurash', icon: '🤼' },
      { name: 'Boks', icon: '🥊' },
      { name: 'Karate / Taekvondo', icon: '🥋' },
      { name: 'Stol tennisi', icon: '🏓' },
      { name: 'Yengil atletika', icon: '🏃' },
      { name: 'Shaxmat', icon: '♟️' },
    ],
  },
  {
    title: 'Ilm va texnika',
    items: [
      { name: 'Dasturlash', icon: '💻' },
      { name: 'Robototexnika', icon: '🦾' },
      { name: "Matematika to'garagi", icon: '➗' },
      { name: "Fizika-kimyo to'garagi", icon: '⚗️' },
      { name: 'Biologiya va ekologiya', icon: '🌿' },
    ],
  },
  {
    title: 'Til kurslari',
    items: [
      { name: 'Ingliz tili kursi', icon: '🇬🇧' },
      { name: 'Rus tili kursi', icon: '🗣️' },
      { name: 'Boshqa chet tili', icon: '🌐' },
    ],
  },
  {
    title: "San'at va ijod",
    items: [
      { name: 'Musiqa', icon: '🎹' },
      { name: 'Ashula', icon: '🎤' },
      { name: 'Raqs', icon: '💃' },
      { name: 'Teatr', icon: '🎭' },
      { name: 'Rassomlik', icon: '🖌️' },
      { name: 'Hunarmandchilik', icon: '🧵' },
      { name: 'Tikuvchilik', icon: '✂️' },
      { name: 'Oshpazlik', icon: '👨‍🍳' },
    ],
  },
  {
    title: "Boshqa yo'nalishlar",
    items: [
      { name: 'Jurnalistika', icon: '📰' },
      { name: 'Notiqlik va debat', icon: '🗣️' },
      { name: 'Harbiy-vatanparvarlik', icon: '🎖️' },
      { name: 'Volontyorlik', icon: '🤝' },
      { name: 'Hech qaysi', icon: '🚫' },
    ],
  },
];

/** Barcha to'garaklar bitta ro'yxatda — seed va tekshiruvlar uchun */
export const TOGARAKLAR: { name: string; icon: string }[] = TOGARAK_GURUHLARI.flatMap(
  (g) => g.items
);

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
 * ============================================================
 *  BREND RANGLARI
 *
 *  Palitra Xatirchi tumani gerbidan olingan: quyosh (sariq),
 *  tog'lar va nihol (yashil), daryo (ko'k). Ya'ni ranglar
 *  tasodifiy tanlanmagan — tumanning o'z ramzidan kelib chiqadi.
 * ============================================================
 */
export const BRAND = {
  /** Quyosh — asosiy urg'u rangi */
  sun: '#F2B01E',
  sunDeep: '#D89506',
  /** Tog'lar va nihol */
  leaf: '#2E9B3F',
  leafDeep: '#1F7A2D',
  /** Daryo */
  river: '#17559B',
  riverDeep: '#0F3E75',
  /** Matn uchun chuqur siyoh rangi */
  ink: '#0E2439',
} as const;

/**
 * Har bir kasb yo'nalishining o'z rangi, tabrik matni va ovozi.
 *
 * Anketa oxirida o'quvchi aynan o'zi tanlagan yo'nalishga mos
 * rang, so'z va ovoz bilan tabriklanadi — shu payt bola
 * "bu men haqimda" degan his oladi.
 */
export interface CategoryTheme {
  /** Asosiy rang */
  color: string;
  /** Fon uchun ochiq soya */
  soft: string;
  /** Tabrik ekranidagi shaxsiy jumla */
  cheer: string;
  /** Qaysi ovoz chalinadi (sound.ts dagi nomlar) */
  sound: SoundName;
}

export type SoundName =
  | 'siren'
  | 'heartbeat'
  | 'digital'
  | 'machine'
  | 'melody'
  | 'bell'
  | 'coins';

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  'IT & Texnologiya': {
    color: '#17559B',
    soft: '#E7F0FB',
    cheer: 'Sening kodlaring ertangi kunni yozadi.',
    sound: 'digital',
  },
  Tibbiyot: {
    color: '#C2334D',
    soft: '#FCEAED',
    cheer: "Sening qo'llaring odamlarga shifo beradi.",
    sound: 'heartbeat',
  },
  "Ta'lim & Ilm": {
    color: '#7A3FBF',
    soft: '#F1EAFB',
    cheer: "Sen minglab bolalarning yo'lini yoritasan.",
    sound: 'bell',
  },
  'Harbiy & Huquq': {
    color: '#1F7A2D',
    soft: '#E8F5EA',
    cheer: "Sen xalqimiz tinchligining posboni bo'lasan.",
    sound: 'siren',
  },
  Muhandislik: {
    color: '#B5651D',
    soft: '#FBF0E5',
    cheer: 'Sen quradigan narsalar asrlar qoladi.',
    sound: 'machine',
  },
  Ijodkorlik: {
    color: '#C21E7A',
    soft: '#FCE8F3',
    cheer: 'Sening ijoding odamlar qalbiga yetib boradi.',
    sound: 'melody',
  },
  Tadbirkorlik: {
    color: '#D89506',
    soft: '#FDF3DF',
    cheer: "Sen yaratgan ish o'rinlari oilalarni boqadi.",
    sound: 'coins',
  },
  "Qishloq xo'jaligi": {
    color: '#4D7C0F',
    soft: '#EEF6E3',
    cheer: "Sening mehnating dasturxonimizga non bo'lib keladi.",
    sound: 'machine',
  },
  'Transport & Logistika': {
    color: '#0E7C86',
    soft: '#E3F3F5',
    cheer: "Sen yo'llarni yaqinlashtirasan, odamlarni bog'laysan.",
    sound: 'machine',
  },
  "Xizmat ko'rsatish": {
    color: '#B45309',
    soft: '#FBF0E0',
    cheer: 'Sening xizmating odamlarga kayfiyat ulashadi.',
    sound: 'melody',
  },
  'Davlat xizmati': {
    color: '#3730A3',
    soft: '#E8E9FA',
    cheer: 'Sen xalq ishonchini oqlaydigan ish qilasan.',
    sound: 'bell',
  },
};

/** Noma'lum yo'nalish uchun zaxira mavzu */
export const DEFAULT_CATEGORY_THEME: CategoryTheme = {
  color: BRAND.river,
  soft: '#E7F0FB',
  cheer: 'Sening mehnating tumanimizni obod qiladi.',
  sound: 'melody',
};

/** Yo'nalish mavzusini xavfsiz olish */
export function categoryTheme(category: string): CategoryTheme {
  return CATEGORY_THEMES[category] ?? DEFAULT_CATEGORY_THEME;
}

/**
 * Diagrammalar uchun kategoriyali ranglar palitrasi.
 * `dataviz` validatoridan o'tgan: yorqinlik, to'yinganlik,
 * rang ko'rmaslik (CVD) va oq fonda kontrast tekshirilgan.
 */
export const CHART_COLORS = [
  '#17559B',
  '#D89506',
  '#1F7A2D',
  '#7A3FBF',
  '#C2334D',
  '#0E7C86',
  '#B5651D',
  '#C21E7A',
];

/** Bitta seriyali diagrammalar uchun asosiy rang */
export const CHART_PRIMARY = '#17559B';

/**
 * Ketma-ket (sequential) ranglar shkalasi — doiraviy diagrammalar uchun.
 * Yorqinlik bo'yicha tartiblangan, shuning uchun rangni ajrata olmaydigan
 * foydalanuvchi ham bo'laklarni farqlay oladi.
 */
export const RAMP_BLUE = [
  '#C5DBF2',
  '#9CC1E7',
  '#6FA3D8',
  '#4785C6',
  '#2A6AAE',
  '#17559B',
  '#0F3E75',
];

export const RAMP_AMBER = [
  '#FBE3B4',
  '#F7D08A',
  '#F2B01E',
  '#DE9C0C',
  '#C48606',
  '#A96F0A',
  '#8C5A10',
  '#6F4712',
  '#553612',
  '#3D270F',
];

/** Jins bo'yicha ranglar — barcha diagrammalarda bir xil */
export const GENDER_COLORS: Record<string, string> = {
  "O'g'il bola": '#17559B',
  'Qiz bola': '#C21E7A',
};

/** Kasb nomiga qarab emoji topish uchun tezkor xarita */
export const KASB_ICON_MAP: Record<string, string> = KASBLAR.reduce(
  (acc, k) => {
    acc[k.name] = k.icon;
    return acc;
  },
  {} as Record<string, string>
);
