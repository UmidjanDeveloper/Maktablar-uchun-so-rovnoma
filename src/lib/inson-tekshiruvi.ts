/**
 * ============================================================
 *  ISM VA TELEFON TEKSHIRUVI
 *
 *  Maktabda o'tkazilgan sinovda ma'lum bo'ldi: bolalar
 *  maydonlarni "ajfjdjfjadfj" deb to'ldiryapti va telefon
 *  raqamiga qo'liga to'g'ri kelgan raqamni bosib tashlayapti.
 *
 *  Bunday yozuvlar hokimiyat uchun butunlay foydasiz: na
 *  bolani topib bo'ladi, na ota-onasi bilan bog'lanib bo'ladi.
 *  Shu sababli tekshiruv qattiqlashtirildi.
 *
 *  Tamoyil: tekshiruv HAQIQIY ismni rad etmasligi kerak.
 *  Shuning uchun har bir qoida o'zbek (va rus) ismlarining
 *  haqiqiy tuzilishiga qarab tanlangan va ro'yxat bo'yicha
 *  sinovdan o'tkazilgan.
 * ============================================================
 */

/* ------------------------------------------------------------------ */
/* ISM                                                                 */
/* ------------------------------------------------------------------ */

/** O'zbek lotin alifbosidagi unlilar */
const UNLILAR = new Set(['a', 'e', 'i', 'o', 'u']);

/**
 * Apostrofning barcha ko'rinishlari.
 *
 * O'zbek tilida "O‘ktam", "G‘ayrat" kabi ismlar apostrof bilan yoziladi,
 * lekin u klaviaturaga qarab turlicha chiqadi: ' ’ ‘ ʻ ʼ ` .
 * Faqat bittasini qabul qilsak, haqiqiy ismlar rad etiladi.
 */
const APOSTROFLAR = "'\u2018\u2019\u02BB\u02BC\u0060";

/** Ismda ruxsat etilgan belgilar: harflar, apostrof, defis, bo'shliq */
const ISM_BELGILARI = new RegExp(`^[A-Za-z\u00C0-\u00FFА-Яа-яЁё${APOSTROFLAR}\\-\\s]+$`);

/** Tekshiruv natijasi — xato bo'lsa sababi bilan */
export interface TekshiruvNatijasi {
  ok: boolean;
  xabar?: string;
}

/**
 * Ismning haqiqiyligini tekshiradi.
 *
 * To'rtta qoida, har biri sinovda uchragan aniq bir xatoni to'xtatadi:
 *
 *   1. Faqat harf — raqam va belgi ("Ali123", "@@@") o'tmaydi
 *   2. Ketma-ket 4 ta undosh yo'q — "ajfjdjfjadfj", "asdfgh", "zxcvbn"
 *      shu qoidada tushadi. Haqiqiy ismlarda eng uzun undosh ketmasi
 *      3 ta ("Xurshid" -> rsh, "Dilshod" -> lsh)
 *   3. Unlilar ulushi kamida 20% — "qwerty" (16%) o'tmaydi,
 *      "Shvetsov" (25%) o'tadi
 *   4. Bir harf 3 marta ketma-ket takrorlanmaydi — "aaa", "ffff"
 */
export function ismTekshir(qiymat: string, maydon = 'Ism'): TekshiruvNatijasi {
  const ism = qiymat.trim();

  if (ism.length < 2) {
    return { ok: false, xabar: `${maydon} kamida 2 ta harfdan iborat bo'lishi kerak` };
  }
  if (ism.length > 50) {
    return { ok: false, xabar: `${maydon} 50 ta belgidan oshmasligi kerak` };
  }
  if (!ISM_BELGILARI.test(ism)) {
    return { ok: false, xabar: `${maydon}da faqat harflar bo'lishi kerak` };
  }

  // Apostrof va defisni olib tashlaymiz — ular tovush emas
  const harflar = ism
    .toLowerCase()
    .replace(new RegExp(`[${APOSTROFLAR}\\-\\s]`, 'g'), '');

  if (harflar.length < 2) {
    return { ok: false, xabar: `${maydon}ni to'liq yozing` };
  }

  let undoshKetma = 0;
  let unliSoni = 0;
  let takror = 1;

  for (let i = 0; i < harflar.length; i++) {
    const harf = harflar[i];

    if (UNLILAR.has(harf)) {
      unliSoni += 1;
      undoshKetma = 0;
    } else {
      undoshKetma += 1;
      if (undoshKetma >= 4) {
        return { ok: false, xabar: `${maydon}ni to'g'ri yozing — tasodifiy harflar qabul qilinmaydi` };
      }
    }

    if (i > 0 && harf === harflar[i - 1]) {
      takror += 1;
      if (takror >= 3) {
        return { ok: false, xabar: `${maydon}ni to'g'ri yozing — tasodifiy harflar qabul qilinmaydi` };
      }
    } else {
      takror = 1;
    }
  }

  if (unliSoni === 0 || unliSoni / harflar.length < 0.2) {
    return { ok: false, xabar: `${maydon}ni to'g'ri yozing — tasodifiy harflar qabul qilinmaydi` };
  }

  return { ok: true };
}

/** Ismning birinchi harfini katta qiladi: "aziza" -> "Aziza" */
export function ismniChiroyliQil(qiymat: string): string {
  return qiymat
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((so) => (so ? so[0].toLocaleUpperCase('uz') + so.slice(1) : so))
    .join(' ');
}

/* ------------------------------------------------------------------ */
/* TELEFON                                                             */
/* ------------------------------------------------------------------ */

/**
 * O'zbekistonda amalda ishlatiladigan kodlar.
 *
 * Mobil operatorlar (90, 91, 93, 94, 88, 95, 97, 98, 99, 33, 77, 20, 50, 55)
 * va viloyat shahar kodlari qo'shilgan — qishloqda ota-onaning uy
 * telefoni ham uchraydi.
 *
 * Ro'yxat ataylab yopiq: aynan shu sababli "111111111" yoki
 * "123456789" kabi tasodifiy raqamlar birinchi ikkita raqamidayoq
 * rad etiladi.
 */
const KODLAR = new Set([
  '20', '33', '50', '55', '61', '62', '65', '66', '67', '69',
  '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
  '88', '90', '91', '93', '94', '95', '97', '98', '99',
]);

/** Raqamdan faqat sonlarni ajratib oladi */
export function faqatRaqam(qiymat: string): string {
  return qiymat.replace(/\D/g, '');
}

/**
 * Kiritilayotgan raqamni +998 dan keyingi 9 ta songa keltiradi.
 * Foydalanuvchi 998 bilan yoki 0 bilan boshlasa ham to'g'ri tushunadi.
 */
export function milliyRaqam(qiymat: string): string {
  let d = faqatRaqam(qiymat);
  if (d.startsWith('998')) d = d.slice(3);
  // Ba'zilar ichki formatda "0 90 ..." deb yozadi
  if (d.length > 9 && d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 9);
}

/** Ko'rinish uchun: "901234567" -> "90 123 45 67" */
export function raqamniChiroyliQil(qiymat: string): string {
  const d = milliyRaqam(qiymat);
  const bo = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  return bo.filter(Boolean).join(' ');
}

/**
 * Telefon raqamini tekshiradi.
 *
 * Uchta qoida sinovda uchragan aniq xatolarni to'xtatadi:
 *   1. Aniq 9 ta raqam — kam yoki ko'p bo'lsa o'tmaydi
 *   2. Kod haqiqiy bo'lishi kerak — "111111111", "123456789" shu yerda tushadi
 *   3. Bir xil raqam takrori va ketma-ket o'sish/kamayish rad etiladi —
 *      "901111111", "901234567" kabi "bosib tashlangan" raqamlar
 */
export function telefonTekshir(qiymat: string, maydon = 'Telefon raqami'): TekshiruvNatijasi {
  const d = milliyRaqam(qiymat);

  if (d.length === 0) {
    return { ok: false, xabar: `${maydon}ni kiriting` };
  }
  if (d.length !== 9) {
    return { ok: false, xabar: `${maydon} 9 ta raqamdan iborat bo'lishi kerak` };
  }
  if (!KODLAR.has(d.slice(0, 2))) {
    return { ok: false, xabar: `Bunday operator kodi yo'q. Masalan: 90, 91, 93, 94, 97, 99` };
  }

  const qolgan = d.slice(2);

  // Hamma raqam bir xil: 901111111
  if (new Set(qolgan).size === 1) {
    return { ok: false, xabar: `${maydon} to'g'ri emas — haqiqiy raqamni kiriting` };
  }

  // Ketma-ket o'sish yoki kamayish: 901234567, 909876543
  let osish = true;
  let kamayish = true;
  for (let i = 1; i < qolgan.length; i++) {
    const farq = Number(qolgan[i]) - Number(qolgan[i - 1]);
    if (farq !== 1) osish = false;
    if (farq !== -1) kamayish = false;
  }
  if (osish || kamayish) {
    return { ok: false, xabar: `${maydon} to'g'ri emas — haqiqiy raqamni kiriting` };
  }

  return { ok: true };
}

/** Bazaga yoziladigan yagona ko'rinish: +998901234567 */
export function telefonSaqlashUchun(qiymat: string): string | null {
  const d = milliyRaqam(qiymat);
  return d.length === 9 ? `+998${d}` : null;
}
