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
  { label: 'Harbiy', value: 'Harbiy & Huquq', icon: '🎖' },
  { label: 'Muhandislik', value: 'Muhandislik', icon: '⚙' },
  { label: 'Ijodkorlik', value: 'Ijodkorlik', icon: '🎨' },
  { label: 'Tadbirkorlik', value: 'Tadbirkorlik', icon: '💼' },
  { label: "Qishloq xo'jaligi", value: "Qishloq xo'jaligi", icon: '🌾' },
  { label: 'Transport', value: 'Transport & Logistika', icon: '🚚' },
  { label: 'Xizmat', value: "Xizmat ko'rsatish", icon: '🍽' },
  { label: 'Davlat xizmati', value: 'Davlat xizmati', icon: '🏛' },
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

/**
 * «Hech qaysi» — to'garakka qatnamaslikni bildiruvchi javob.
 * Tanlansa: qolgan to'garaklar bekor qilinadi va «nega bormaysan»
 * savoli ochiladi.
 */
export const HECH_QAYSI = 'Hech qaysi';

/** Barcha to'garaklar bitta ro'yxatda — seed va tekshiruvlar uchun */
export const TOGARAKLAR: { name: string; icon: string }[] = TOGARAK_GURUHLARI.flatMap(
  (g) => g.items
);

/**
 * ============================================================
 *  TA'LIM MARKAZI SAVOLLARI (5-qadam)
 *
 *  Bu savollar «bola kim bo'lishni orzu qiladi?» dan farq qiladi —
 *  ular «qayerda, qanday markaz ochsak, kim keladi?» degan qarorni
 *  raqam bilan ta'minlaydi.
 *
 *  Eng muhimi: «qanday to'garakka BORASAN» emas, «qanday kurs
 *  OCHILSA borasan». Birinchisi mavjud imkoniyatni o'lchaydi,
 *  ikkinchisi qondirilmagan talabni. To'garagi yo'q mahalla
 *  birinchi savolda «qiziqish past» bo'lib ko'rinadi — aslida
 *  u yerda talab eng yuqori bo'lishi mumkin.
 * ============================================================
 */

/** Ochilishi so'ralayotgan kurslar — guruhlangan ko'p tanlov */
/**
 * «Chet tili kursi» varianti alohida ahamiyatga ega: faqat shu tanlansa
 * «qaysi tilni o'rganmoqchisan?» savoli chiqadi. Asalarichi bo'lmoqchi
 * bo'lgan bolaga til haqida savol berish mantiqsiz.
 */
export const CHET_TILI_KURSI = 'Chet tili kursi';

export const KERAKLI_KURSLAR: { title: string; items: { name: string; icon: string }[] }[] = [
  {
    title: 'Til',
    items: [{ name: CHET_TILI_KURSI, icon: '🗣️' }],
  },
  {
    title: 'Fanga tayyorlov',
    items: [
      { name: 'Matematika', icon: '➗' },
      { name: 'Fizika va kimyo', icon: '⚗️' },
      { name: 'Biologiya', icon: '🧬' },
      { name: 'Ona tili va adabiyot', icon: '📖' },
      { name: 'Tarix', icon: '🏛️' },
    ],
  },
  {
    title: 'IT va texnologiya',
    items: [
      { name: 'Dasturlash', icon: '💻' },
      { name: 'Robototexnika', icon: '🦾' },
      { name: 'Grafik dizayn', icon: '🎨' },
      { name: 'SMM va marketing', icon: '📣' },
    ],
  },
  {
    title: 'Kasb-hunar',
    items: [
      { name: 'Tikuvchilik', icon: '🧵' },
      { name: 'Oshpazlik', icon: '👨‍🍳' },
      { name: 'Hunarmandchilik', icon: '🪚' },
      { name: 'Avtomobil ustaligi', icon: '🚗' },
      { name: 'Elektrik va payvandchilik', icon: '⚡' },
      { name: "Qishloq xo'jaligi", icon: '🌾' },
    ],
  },
  {
    title: "San'at va sport",
    items: [
      { name: 'Rassomlik', icon: '🖌️' },
      { name: 'Musiqa', icon: '🎹' },
      { name: 'Sport', icon: '⚽' },
      { name: 'Raqs', icon: '💃' },
    ],
  },
  {
    title: 'Shaxsiy rivojlanish',
    items: [
      { name: 'Notiqlik va liderlik', icon: '🎤' },
      { name: 'Moliyaviy savodxonlik', icon: '🧮' },
    ],
  },
];

/** Barcha kurslar bitta ro'yxatda */
export const KERAKLI_KURSLAR_TEKIS: { name: string; icon: string }[] =
  KERAKLI_KURSLAR.flatMap((g) => g.items);

/** Qaysi tilni o'rganmoqchi — til markazi ochish uchun */
export const TILLAR: { name: string; icon: string }[] = [
  { name: 'Ingliz tili', icon: '🇬🇧' },
  { name: 'Rus tili', icon: '🇷🇺' },
  { name: 'Koreys tili', icon: '🇰🇷' },
  { name: 'Turk tili', icon: '🇹🇷' },
  { name: 'Arab tili', icon: '🇸🇦' },
  { name: 'Xitoy tili', icon: '🇨🇳' },
  { name: 'Nemis tili', icon: '🇩🇪' },
];

/**
 * Eski anketalarda uchraydigan «kerak emas» javobi.
 *
 * Ilgari til savoli hammaga berilardi va uni o'tkazib yuborish uchun
 * shunday variant kerak edi. Endi savol faqat «Chet tili kursi»ni
 * tanlagan bolaga chiqadi, ya'ni bu variant mantiqan mumkin emas —
 * ro'yxatdan olib tashlandi. Nom esa saqlanib qoldi: bazadagi eski
 * javoblarni tahlildan chiqarib tashlash uchun kerak.
 */
export const TIL_KERAK_EMAS = 'Til kursi kerak emas';

/**
 * Qatnashish uchun qancha yo'l yurishga tayyor.
 * Markazni qayerga qurish kerakligini shu javob hal qiladi:
 * hech kim yurmasa — har mahallada kichik markaz, yursa — bitta katta.
 */
export const MASOFA_JAVOBLARI: { name: string; icon: string }[] = [
  { name: 'Faqat maktabimda', icon: '🏫' },
  { name: 'Mahallamda', icon: '🏘️' },
  { name: "Qo'shni mahallaga ham", icon: '🚶' },
  { name: 'Tuman markazigacha', icon: '🚌' },
];

/**
 * To'garakka qatnamaslik sabablari.
 *
 * Bu ro'yxat oddiy statistika uchun emas. Hokimiyat har bir javobga
 * qarab aniq chora ko'radi:
 *   - ota-onasi ruxsat bermasa      -> mahalla orqali suhbat
 *   - oilaviy sharoiti bo'lmasa     -> moddiy yordam, bepul o'rin
 *   - sog'lig'i yoki nogironligi    -> maxsus sharoit, uyga o'qituvchi
 *   - yaqin atrofda to'garak yo'q   -> o'sha mahallada markaz ochish
 *   - uzoq, qatnov qiyin            -> transport yoki filial
 *
 * Shu sababli javob bergan o'quvchi boshqaruv panelida ismi, maktabi,
 * sinfi va telefoni bilan ko'rinadi — uni topib yordam berish uchun.
 */
export const TOSIQLAR: { name: string; icon: string }[] = [
  { name: "Yaqin atrofda bunday to'garak yo'q", icon: '🚫' },
  { name: 'Uzoq, qatnash qiyin', icon: '🛣️' },
  { name: "Oilaviy sharoitim yo'q", icon: '🏠' },
  { name: 'Ota-onam ruxsat bermaydi', icon: '🙅' },
  { name: "Uy ishlari ko'p, vaqtim yo'q", icon: '⏰' },
  { name: "Sog'lig'im imkon bermaydi", icon: '🩹' },
  { name: 'Nogironligim bor', icon: '♿' },
  { name: 'Kerakli kiyim yoki jihoz yo\'q', icon: '🎒' },
  { name: 'Qiziqarli emas', icon: '😐' },
  { name: 'Boshqa sabab', icon: '❓' },
];

/**
 * Yordam talab qiladigan to'siqlar.
 *
 * Bular hokimiyat aralashuvi bilan hal bo'ladi, shuning uchun
 * boshqaruv panelida alohida ajratib ko'rsatiladi.
 */
export const YORDAM_TOSIQLARI = [
  "Oilaviy sharoitim yo'q",
  'Ota-onam ruxsat bermaydi',
  "Sog'lig'im imkon bermaydi",
  'Nogironligim bor',
  "Kerakli kiyim yoki jihoz yo'q",
  'Uzoq, qatnash qiyin',
] as const;

/** Qachon qatnasha oladi — smena va o'qituvchi rejalashtirish uchun */
export const VAQT_JAVOBLARI: { name: string; icon: string }[] = [
  { name: 'Darsdan keyin (kunduzi)', icon: '🌤️' },
  { name: 'Kechqurun', icon: '🌙' },
  { name: 'Dam olish kunlari', icon: '📅' },
  { name: "Yozgi ta'tilda", icon: '☀️' },
];

/** Uydagi texnika — onlayn yoki aralash format mumkinmi */
export const UY_TEXNIKASI: { name: string; icon: string }[] = [
  { name: 'Kompyuter ham, internet ham bor', icon: '🖥️' },
  { name: 'Faqat telefon va internet bor', icon: '📱' },
  { name: 'Faqat kompyuter bor', icon: '💻' },
  { name: "Ikkalasi ham yo'q", icon: '❌' },
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
  /**
   * Qorong'i temadagi yorqin variant.
   * Zarur: to'q ranglar qorong'i fonda ko'rinmaydi va tabrik
   * ekranidagi kasb ikonasi qora doiraga aylanib qolardi.
   */
  colorDark: string;
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
  | 'coins'
  | 'flight'
  | 'victory';

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  'IT & Texnologiya': {
    color: '#17559B',
    colorDark: '#60A5FA',
    soft: '#E7F0FB',
    cheer: 'Sening kodlaring ertangi kunni yozadi.',
    sound: 'digital',
  },
  Tibbiyot: {
    color: '#C2334D',
    colorDark: '#FB7185',
    soft: '#FCEAED',
    cheer: "Sening qo'llaring odamlarga shifo beradi.",
    sound: 'heartbeat',
  },
  "Ta'lim & Ilm": {
    color: '#7A3FBF',
    colorDark: '#C084FC',
    soft: '#F1EAFB',
    cheer: "Sen minglab bolalarning yo'lini yoritasan.",
    sound: 'bell',
  },
  'Harbiy & Huquq': {
    color: '#1F7A2D',
    colorDark: '#4ADE80',
    soft: '#E8F5EA',
    cheer: "Sen xalqimiz tinchligining posboni bo'lasan.",
    sound: 'siren',
  },
  Muhandislik: {
    color: '#B5651D',
    colorDark: '#FB923C',
    soft: '#FBF0E5',
    cheer: 'Sen quradigan narsalar asrlar qoladi.',
    sound: 'machine',
  },
  Ijodkorlik: {
    color: '#C21E7A',
    colorDark: '#F472B6',
    soft: '#FCE8F3',
    cheer: 'Sening ijoding odamlar qalbiga yetib boradi.',
    sound: 'melody',
  },
  Tadbirkorlik: {
    color: '#D89506',
    colorDark: '#FBBF24',
    soft: '#FDF3DF',
    cheer: "Sen yaratgan ish o'rinlari oilalarni boqadi.",
    sound: 'coins',
  },
  "Qishloq xo'jaligi": {
    color: '#4D7C0F',
    colorDark: '#A3E635',
    soft: '#EEF6E3',
    cheer: "Sening mehnating dasturxonimizga non bo'lib keladi.",
    sound: 'machine',
  },
  'Transport & Logistika': {
    color: '#0E7C86',
    colorDark: '#22D3EE',
    soft: '#E3F3F5',
    cheer: "Sen yo'llarni yaqinlashtirasan, odamlarni bog'laysan.",
    sound: 'machine',
  },
  "Xizmat ko'rsatish": {
    color: '#B45309',
    colorDark: '#F59E0B',
    soft: '#FBF0E0',
    cheer: 'Sening xizmating odamlarga kayfiyat ulashadi.',
    sound: 'melody',
  },
  'Davlat xizmati': {
    color: '#3730A3',
    colorDark: '#818CF8',
    soft: '#E8E9FA',
    cheer: 'Sen xalq ishonchini oqlaydigan ish qilasan.',
    sound: 'bell',
  },
};

/** Noma'lum yo'nalish uchun zaxira mavzu */
export const DEFAULT_CATEGORY_THEME: CategoryTheme = {
  color: BRAND.river,
  colorDark: '#60A5FA',
  soft: '#E7F0FB',
  cheer: 'Sening mehnating tumanimizni obod qiladi.',
  sound: 'melody',
};

/** Yo'nalish mavzusini xavfsiz olish */
export function categoryTheme(category: string): CategoryTheme {
  return CATEGORY_THEMES[category] ?? DEFAULT_CATEGORY_THEME;
}

/**
 * ============================================================
 *  HAR BIR KASB UCHUN ALOHIDA TABRIK
 *
 *  Ilgari tabrik jumlasi yo'nalishga bog'langan edi: 148 ta
 *  kasbga atigi 11 ta jumla to'g'ri kelardi. Natijada dron
 *  uchuvchisiga "sening kodlaring...", veterinarga esa
 *  "odamlarga shifo berasan" deb chiqardi.
 *
 *  Endi har bir kasbning o'z jumlasi bor. Bola o'zi tanlagan
 *  kasb haqida aynan o'ziga tegishli gapni o'qiydi — tabrik
 *  ekrani shu sababli esda qoladi.
 *
 *  `sound` faqat yo'nalish ovozi mos kelmagan joyda beriladi
 *  (masalan uchuvchiga mexanizm emas, parvoz ovozi).
 * ============================================================
 */
export const KASB_TABRIKLARI: Record<string, { cheer: string; sound?: SoundName }> = {
  // IT & Texnologiya
  'Dasturchi': { cheer: 'Sening kodlaring minglab odamning ishini osonlashtiradi.' },
  "Sun'iy Intellekt mutaxassisi": { cheer: "Sen o'rgatgan aql insonlarga xizmat qiladi." },
  'Kiberxavfsizlik mutaxassisi': { cheer: "Sen ko'rinmas qalqonsan — ming odamning ma'lumoti sen tufayli omon." },
  'Grafik Dizayner': { cheer: "Sen chizgan har bir shakl odamlarning ko'zini quvontiradi." },
  'Mobil ilova yaratuvchi': { cheer: 'Sen yaratgan ilova minglab telefonda ochiladi.' },
  "O'yin yaratuvchi": { cheer: 'Sen yaratgan olamda minglab bola sarguzasht qidiradi.' },
  'Veb-dasturchi': { cheer: "Sen quradigan sayt butun dunyoga ochiq bo'ladi." },
  "Ma'lumotlar tahlilchisi": { cheer: 'Sen raqamlar ichidan haqiqatni topib berasan.' },
  'Tarmoq muhandisi': { cheer: "Sen tufayli odamlar bir-biri bilan uzilmay bog'lanadi." },
  'Robototexnik': { cheer: 'Sen jonsiz temirga harakat va aql berasan.' },
  '3D modelchi': { cheer: "Sen xayoldagi narsani qo'l bilan ushlasa bo'ladigan qilasan." },
  'Dastur sinovchisi (QA)': { cheer: 'Sen topgan har bir xato minglab odamni ovoragarchilikdan saqlaydi.' },
  'Kompyuter ustasi': { cheer: "Sening qo'ling tegishi bilan to'xtagan mashina yana ishga tushadi.", sound: 'machine' },
  'Dron uchuvchisi': { cheer: "Sen osmondan turib butun bir dalani bir qarashda ko'rasan.", sound: 'flight' },
  // Tibbiyot
  'Shifokor': { cheer: "Sening qo'llaring odamlarga shifo beradi." },
  'Jarroh': { cheer: 'Sen bir necha soat ichida butun bir umrni qaytarasan.' },
  'Stomatolog': { cheer: "Sen tufayli odamlar og'riqsiz kuladi." },
  'Hamshira': { cheer: "Bemor eng qiyin damida birinchi bo'lib seni ko'radi." },
  'Psixolog': { cheer: "Sen ko'zga ko'rinmaydigan yaralarni davolaysan." },
  'Farmatsevt': { cheer: "Sening qo'lingdagi dori kimningdir umidiga aylanadi." },
  'Veterinar': { cheer: "Sen gapira olmaydigan jonivorning og'rig'ini tushunasan." },
  'Pediatr': { cheer: "Kichkintoylarning sog'lom o'sishi senga bog'liq." },
  'Kardiolog': { cheer: "Sen to'xtay deb turgan yurakni yana urishga majbur qilasan." },
  "Ko'z shifokori": { cheer: "Sen tufayli kimdir dunyoni yana aniq ko'radi." },
  'Laborant': { cheer: "Kasallikning nomini birinchi bo'lib sen aytasan." },
  'Rentgenolog': { cheer: "Sen boshqalar ko'rmaganini ko'rasan." },
  'Tez yordam feldsheri': { cheer: 'Sening bir daqiqang kimningdir umrini uzaytiradi.', sound: 'siren' },
  'Reabilitolog': { cheer: "Sen yiqilgan odamni yana o'z oyog'ida turg'izasan." },
  'Dietolog': { cheer: "Sen odamlarga sog'lom yashashni o'rgatasan." },
  // Ta'lim & Ilm
  "O'qituvchi": { cheer: "Sen minglab bolaning yo'lini yoritasan." },
  'Olim': { cheer: 'Bugun hech kim bilmagan narsani ertaga sen ochasan.' },
  'Tarbiyachi': { cheer: "Bola dunyoni birinchi bo'lib sening ko'zing bilan ko'radi." },
  "Boshlang'ich sinf o'qituvchisi": { cheer: "Birinchi harfni sen o'rgatasan — bu bir umr esda qoladi." },
  'Maktab direktori': { cheer: 'Butun bir maktabning havosini sen belgilaysan.' },
  'Kutubxonachi': { cheer: 'Sen minglab kitobni aynan kerakli odamga yetkazasan.' },
  'Tarjimon': { cheer: 'Sen tufayli boshqa tildagi odamlar bir-birini tushunadi.' },
  'Arxeolog': { cheer: 'Sen yer ostidan xalqimizning tarixini qazib olasan.' },
  'Geolog': { cheer: "Sen yerimiz qa'ridagi boylikni topasan." },
  'Astronom': { cheer: "Sen insoniyat hali bormagan joyni o'rganasan." },
  'Matematik': { cheer: 'Sen olamning eng aniq tilida gapirasan.' },
  'Biolog': { cheer: 'Sen tirik olamning sirlarini ochasan.' },
  'Tarixchi': { cheer: "Sen o'tmishni esda saqlab, kelajakni xatodan asraysan." },
  // Harbiy & Huquq
  'Harbiy xizmatchi': { cheer: 'Sen tinch uyqumizning posbonisan.' },
  'IIB xodimi': { cheer: "Sen bor joyda odamlar o'zini xavfsiz his qiladi." },
  'Huquqshunos': { cheer: 'Sen haqiqatni qonun tilida himoya qilasan.', sound: 'bell' },
  'Qutqaruvchi (FVV)': { cheer: 'Hamma qochayotgan tomonga sen yugurasan.' },
  'Chegarachi': { cheer: 'Vatan chegarasi sening yelkangda turadi.' },
  'Sudya': { cheer: "Sening bir so'zing odamning taqdirini hal qiladi — adolat bilan ayt.", sound: 'bell' },
  'Prokuror': { cheer: "Qonun buzilgan joyda birinchi bo'lib sen ovoz chiqarasan.", sound: 'bell' },
  'Advokat': { cheer: "Sen hech kim eshitmaganning ovozi bo'lasan.", sound: 'bell' },
  'Tergovchi': { cheer: 'Sen chalkash izlar ichidan haqiqatni topasan.' },
  'Xavfsizlik xodimi': { cheer: "Sen tinchlikni ko'rinmas holda saqlaysan." },
  'Harbiy shifokor': { cheer: "Sen eng og'ir sharoitda ham hayot uchun kurashasan.", sound: 'heartbeat' },
  'Notarius': { cheer: 'Sening imzoing hujjatga kuch beradi.', sound: 'bell' },
  'Bojxona xodimi': { cheer: 'Mamlakat darvozasida halollik sendan boshlanadi.', sound: 'bell' },
  // Muhandislik
  'Muhandis': { cheer: 'Sen chizgan chizma temir va betonga aylanadi.' },
  'Arxitektor': { cheer: 'Sen chizgan uyda odamlar bir umr yashaydi.' },
  'Quruvchi': { cheer: 'Sen qurgan bino sendan keyin ham asrlar turadi.' },
  'Elektrchi': { cheer: "Sen tufayli qorong'i uyga yorug'lik keladi." },
  'Uchuvchi': { cheer: 'Sen minglab odamni osmon orqali uyiga eltasan.', sound: 'flight' },
  'Payvandchi': { cheer: "Sening uchqunlaringdan ko'prik va zavod tug'iladi." },
  'Santexnik': { cheer: 'Sen har bir uyga toza suv olib borasan.' },
  'Avtomobil ustasi': { cheer: "Sening qo'ling tegsa, to'xtagan mashina yana yo'lga chiqadi." },
  'Energetik': { cheer: "Butun tumanning yorug'ligi sening navbatchiligingga bog'liq." },
  'Neft va gaz muhandisi': { cheer: "Sen yer qa'ridagi kuchni odamlar xizmatiga qo'yasan." },
  'Kon muhandisi': { cheer: 'Sen yer ostidan mamlakat boyligini chiqarasan.' },
  'Konstruktor': { cheer: "Sen hali dunyoda yo'q narsani qog'ozda yaratasan." },
  "Suv xo'jaligi muhandisi": { cheer: "Sen suvni cho'lga olib borasan — o'sha yer gullaydi." },
  "Yo'l qurilishi muhandisi": { cheer: "Sen qurgan yo'l qishloqni shaharga ulaydi." },
  'Iqlim texnikasi ustasi': { cheer: "Sen tufayli issiqda salqin, sovuqda iliq bo'ladi." },
  // Ijodkorlik
  'Rassom': { cheer: "Sening bo'yoqlaring devorda ham, qalbda ham iz qoldiradi." },
  'Musiqachi': { cheer: "Sening kuying odamlarning kayfiyatini o'zgartiradi." },
  'Jurnalist': { cheer: 'Sen haqiqatni hech kim aytolmaganda aytasan.' },
  'Bloger/Youtuber': { cheer: 'Sening bir gaping minglab tengdoshingga yetib boradi.' },
  'Oshpaz': { cheer: 'Sening taomingdan keyin odamlar kulib turadi.' },
  'Tikuvchi/Dizayner': { cheer: 'Sen tikkan kiyim odamga ishonch beradi.' },
  'Fotograf': { cheer: "Sen bir lahzani abadiy qilib qo'yasan." },
  'Video montajchi': { cheer: 'Sen tarqoq lavhalardan butun bir hikoya yasaysan.' },
  'Aktyor': { cheer: "Sen sahnada boshqa umrni yashab, zalni yig'latasan va kuldirasan." },
  'Rejissyor': { cheer: "Sen boshqalar ko'rmagan hikoyani ko'rsatib berasan." },
  'Yozuvchi/Shoir': { cheer: "Sening bir satring yuz yildan keyin ham o'qiladi." },
  'Xonanda': { cheer: "Sening ovozing to'ylarda ham, qalblarda ham yangraydi." },
  'Raqqosa': { cheer: "Sen so'zsiz gapirishni bilasan." },
  'Interyer dizayneri': { cheer: 'Sen oddiy xonani odam yashagisi keladigan joyga aylantirasan.' },
  'Animator': { cheer: "Sen chizgan qahramon bolalarning do'stiga aylanadi." },
  'Ovoz rejissyori': { cheer: 'Sen boshqalar eshitmaganini eshitasan.' },
  'SMM mutaxassisi': { cheer: 'Sen kichik ishni butun mamlakatga tanitasan.' },
  // Tadbirkorlik
  'Fermer': { cheer: "Sen ekkan urug' minglab dasturxonga non bo'lib boradi." },
  'Tadbirkor': { cheer: "Sen yaratgan ish o'rinlari oilalarni boqadi." },
  'Bank xodimi': { cheer: 'Odamlar butun mehnatini senga ishonib topshiradi.' },
  'Sportchi/Murabbiy': { cheer: "Sen bayroq ko'tarib chiqqaningda butun tuman o'rnidan turadi.", sound: 'victory' },
  'Buxgalter': { cheer: 'Sening aniqliging butun korxonani xatodan saqlaydi.' },
  'Iqtisodchi': { cheer: "Sen raqamlar orqali ertangi kunni ko'ra olasan." },
  'Marketolog': { cheer: 'Sen yaxshi mahsulotni aynan kerakli odamga topib berasan.' },
  'Menejer': { cheer: 'Sen odamlarni bitta maqsad atrofida birlashtirasan.' },
  'Savdo mutaxassisi': { cheer: 'Sen kerakli narsani kerakli vaqtda yetkazasan.' },
  'Auditor': { cheer: 'Sen halollikni raqamlar bilan isbotlaysan.' },
  "Sug'urta agenti": { cheer: 'Kutilmagan kunda odamning yelkasidan sen tutasan.' },
  'Investor': { cheer: "Sen boshqalar ko'rmagan imkoniyatga ishonasan." },
  'Loyiha rahbari': { cheer: "Sen g'oyani boshidan oxirigacha yetkazasan." },
  // Qishloq xo'jaligi
  'Agronom': { cheer: "Sen tufayli bir tup ko'chat butun bir bog'ga aylanadi." },
  'Chorvador': { cheer: "Sening mehnating har uyning dasturxoniga sut bo'lib boradi." },
  "Bog'bon": { cheer: 'Sen ekkan daraxt sendan keyin ham soya beradi.' },
  'Pillachi': { cheer: 'Sen kichkina qurtdan ipak yaratasan.' },
  'Asalarichi': { cheer: 'Sen tabiat bilan til topishib, shirinlik yaratasan.' },
  'Paxtakor': { cheer: 'Sening dalangdan mamlakat kiyimi boshlanadi.' },
  'Sabzavotchi': { cheer: "Sen yetishtirgan hosil bolalarni sog'lom qiladi." },
  'Mexanizator': { cheer: 'Sening texnikang bir kunda yuz kishilik ishni bajaradi.' },
  "Suv xo'jaligi mutaxassisi": { cheer: "Sen suvni to'g'ri taqsimlab, butun dalani tirik qilasan." },
  'Baliqchi': { cheer: 'Sen suv ostidagi boylikni odamlarga yetkazasan.' },
  'Parrandachi': { cheer: 'Sening mehnating har kuni har uyning stoliga chiqadi.' },
  'Zootexnik': { cheer: "Jonivorlarning sog'lig'i uchun sen javobgarsan." },
  'Issiqxona egasi': { cheer: "Sen qishning o'rtasida yozgi hosil yetishtirasan." },
  "Don va g'alla mutaxassisi": { cheer: 'Sen tufayli non hech qachon kamaymaydi.' },
  // Transport & Logistika
  'Haydovchi': { cheer: 'Sen odamlarni eson-omon manzilga yetkazasan.' },
  'Yuk mashinasi haydovchisi': { cheer: "Sen tunda yo'lda bo'lasan — ertalab do'konlar to'la bo'ladi." },
  "Temiryo'l mashinisti": { cheer: "Sening poyezding minglab odamni bir kunda bog'laydi." },
  'Avtobus haydovchisi': { cheer: 'Har kuni ertalab bolalarni maktabga sen yetkazasan.' },
  'Taksi haydovchisi': { cheer: 'Shoshgan odamning eng katta yordamchisi — sen.' },
  'Logistika menejeri': { cheer: 'Sen tufayli yuk kerakli joyga kerakli vaqtda yetadi.' },
  'Ombor mudiri': { cheer: 'Sening tartibing butun zanjirni ushlab turadi.' },
  'Kuryer': { cheer: 'Sen kimningdir kutgan xabarini yetkazasan.' },
  'Dispetcher': { cheer: "Sen ko'rinmaysan, lekin hamma harakat sendan boshlanadi." },
  'Aviatsiya texnigi': { cheer: "Samolyot osmonga ko'tarilishidan oldin sen ruxsat berasan.", sound: 'flight' },
  'Yuk qabul qiluvchi': { cheer: "Sening aniqliging hech narsani yo'qotmaydi." },
  // Xizmat ko'rsatish
  'Ofitsiant': { cheer: "Sening kulging mehmonning kayfiyatini ko'taradi." },
  'Barista': { cheer: 'Sen bir piyola bilan odamning kunini boshlab berasan.' },
  'Qandolatchi': { cheer: 'Sening shirinliging bayramlarni bayram qiladi.' },
  'Novvoy': { cheer: 'Sen tunda pishirgan non ertalab har uyga boradi.' },
  'Sartarosh': { cheer: "Sendan chiqqan odam o'ziga ishonib ketadi." },
  'Kosmetolog': { cheer: "Sen odamlarga o'zini yoqtirishni qaytarasan." },
  'Mehmonxona administratori': { cheer: 'Mehmon shahar haqidagi birinchi taassurotni sendan oladi.' },
  "Gid (yo'lboshchi)": { cheer: "Sen tumanimiz tarixini butun dunyoga so'zlab berasan." },
  'Turizm menejeri': { cheer: 'Sen tufayli mehmonlar yurtimizni sevib qaytadi.' },
  'Sotuvchi': { cheer: 'Sen har kuni yuzlab odam bilan samimiy muloqot qilasan.' },
  'Kassir': { cheer: "Sening halolliging do'konning obro'sini saqlaydi." },
  'Tozalash xizmati xodimi': { cheer: 'Sen tufayli har kuni tong toza boshlanadi.' },
  // Davlat xizmati
  'Davlat xizmatchisi': { cheer: 'Sen xalq ishonchini oqlaydigan ish qilasan.' },
  'Hokim yordamchisi': { cheer: 'Sen odamlarning muammosini rahbargacha yetkazasan.' },
  'Mahalla raisi': { cheer: 'Mahalladagi har bir xonadon senga ishonadi.' },
  'Diplomat': { cheer: "Sen mamlakatimizning yuzi bo'lib dunyoga chiqasan." },
  'Statistik': { cheer: "Sen to'plagan raqamlar asosida qaror qabul qilinadi." },
  'Soliq inspektori': { cheer: "Sen yig'gan mablag' maktab va yo'lga aylanadi." },
  'Ijtimoiy xodim': { cheer: "Eng ko'p yordamga muhtoj odamning yonida sen bo'lasan." },
  'Ekolog': { cheer: 'Sen kelajak avlodga toza havo qoldirasan.' },
  'Arxivchi': { cheer: "Sen saqlagan hujjat yuz yildan keyin ham kerak bo'ladi." },
  'Pochta xodimi': { cheer: "Sen odamlar orasidagi eng eski ko'prikni ushlab turasan." },
  'FHDYo xodimi': { cheer: "Har oilaning eng baxtli kuni sening qo'lingdan o'tadi." },
};

/**
 * Kasb uchun rang, ovoz va tabrik jumlasini qaytaradi.
 *
 * Jumla va ovoz avval kasbning o'zidan qidiriladi; topilmasa
 * (masalan admin panel orqali yangi kasb qo'shilgan bo'lsa)
 * yo'nalish qiymatlari ishlatiladi. Rang esa doim yo'nalishdan
 * olinadi — bir yo'nalishdagi kasblar bir xil rangda ko'rinishi
 * uchun.
 */
export function jobTheme(dreamJob: string, category: string): CategoryTheme {
  const base = categoryTheme(category);
  const own = KASB_TABRIKLARI[dreamJob];
  if (!own) return base;
  return { ...base, cheer: own.cheer, sound: own.sound ?? base.sound };
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
