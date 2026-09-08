/**
 * ============================================================
 *  PDF hisobot (jsPDF + autoTable)
 *  Hokim uchun tayyor, chop etishga yaroqli tahliliy hisobot.
 *  Diagrammalar to'g'ridan-to'g'ri PDF ichida chiziladi —
 *  bu rasm sifatini saqlaydi va fayl hajmini kichik qiladi.
 *
 *  `jspdf` kutubxonasi faqat hisobot so'ralganda yuklanadi
 *  (dynamic import), shuning uchun sahifa tez ochiladi.
 * ============================================================
 */
import type { jsPDF } from 'jspdf';
import { formatDate } from './utils';
import { buildRecommendations, PRIORITY_LABELS } from './recommendations';
import { MIN_GROUP } from './center-planning';
import type { AreaDemand, DashboardFilters, DashboardStats } from '@/types';

/** A4 o'lchamlari (mm) va chekka bo'shliqlar */
const PAGE_W = 210;
const PAGE_H = 297;
const M = 14;

/** Brend ranglari (RGB) */
const BRAND: [number, number, number] = [33, 72, 224];
const PINK: [number, number, number] = [236, 72, 153];
const SLATE: [number, number, number] = [100, 116, 139];
const DARK: [number, number, number] = [15, 23, 42];

/**
 * jsPDF standart shriftlari faqat Latin-1 belgilarini qo'llab-quvvatlaydi.
 * O'zbekcha matnlardagi turli apostroflarni oddiy apostrofga almashtiramiz,
 * shunda "Bog'ishamol" kabi nomlar to'g'ri chiqadi.
 */
function safe(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/[‘’ʻʼ`´′]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    // Latin-1 da mavjud bo'lgan o'rta nuqta bilan almashtiramiz
    .replace(/[•●]/g, '\u00B7')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, ''); // Emoji va boshqa belgilarni olib tashlaymiz
}

/** Sahifa oxiriga yetganini tekshiradi, kerak bo'lsa yangi sahifa ochadi */
function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - 20) {
    doc.addPage();
    return M + 6;
  }
  return y;
}

/**
 * Bo'lim sarlavhasini chizadi.
 *
 * `needed` — sarlavhadan keyin keladigan kontentning taxminiy balandligi.
 * Buni berish shart, aks holda sarlavha sahifa oxirida yolg'iz qolib,
 * jadval yoki diagramma keyingi sahifadan boshlanadi — hisobotda
 * bo'sh sahifa hosil bo'ladi.
 */
function sectionTitle(doc: jsPDF, title: string, y: number, needed = 30): number {
  /*
   * Butun diagrammaning balandligini talab qilib bo'lmaydi: uzun
   * ro'yxat hech qachon bitta sahifaga sig'maydi va har safar yangi
   * sahifadan boshlanib, oldingisining yarmini bo'sh qoldiradi.
   * Shuning uchun "kamida shuncha joy bo'lsin" degan chegara qo'yamiz —
   * sarlavha va bir necha qator sig'sa, qolgani keyingi sahifaga
   * o'zi oqib o'tadi.
   */
  const top = ensureSpace(doc, y, 16 + Math.min(needed, 34));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(safe(title), M, top);
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.8);
  doc.line(M, top + 1.8, M + 26, top + 1.8);
  return top + 9;
}

/**
 * Gorizontal ustunli diagramma chizadi.
 * @param data nom–qiymat juftliklari
 */
function drawBarChart(
  doc: jsPDF,
  data: { name: string; value: number }[],
  y: number,
  options: {
    color?: [number, number, number];
    labelWidth?: number;
    max?: number;
    /** Berilsa, qiymat yonida ulush foizi ham ko'rsatiladi */
    total?: number;
  } = {}
): number {
  const { color = BRAND, labelWidth = 52, total } = options;
  if (data.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text("Ma'lumot yo'q", M, y);
    return y + 8;
  }

  const rowH = 6.4;
  const barMaxW = PAGE_W - M * 2 - labelWidth - (total ? 24 : 16);
  const max = options.max ?? Math.max(...data.map((d) => d.value), 1);
  /*
   * Butun diagramma uchun joy talab qilmaymiz — uzun ro'yxat hech
   * qachon bitta sahifaga sig'maydi va har safar yangi sahifaga
   * o'tib, oldingisini yarim bo'sh qoldirardi. Har bir qator o'zi
   * uchun joy tekshiradi, shuning uchun diagramma sahifadan
   * sahifaga tabiiy oqib o'tadi.
   */
  let cursor = ensureSpace(doc, y, rowH + 6);

  for (const item of data) {
    cursor = ensureSpace(doc, cursor, rowH + 2);
    const width = Math.max(1.2, (item.value / max) * barMaxW);

    // Nom
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    // Uzun nomlarni ochiq-oydin qisqartiramiz
    const label = safe(item.name);
    doc.text(label.length > 30 ? `${label.slice(0, 29)}...` : label, M, cursor + 3.2);

    // Fon chizig'i
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(M + labelWidth, cursor, barMaxW, 4.4, 1.2, 1.2, 'F');

    // Ustun
    doc.setFillColor(...color);
    doc.roundedRect(M + labelWidth, cursor, width, 4.4, 1.2, 1.2, 'F');

    // Qiymat (kerak bo'lsa foizi bilan)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    const qiymat = total
      ? `${item.value}  ${Math.round((item.value / total) * 100)}%`
      : String(item.value);
    doc.text(qiymat, M + labelWidth + barMaxW + 3, cursor + 3.4);

    cursor += rowH;
  }

  return cursor + 4;
}

/**
 * Jins bo'yicha taqqoslash diagrammasi.
 *
 * Ilgari ikkita alohida diagramma chizilardi va ularni ko'z bilan
 * solishtirib bo'lmasdi — bir xil kasb ikki joyda, ikki xil tartibda
 * turardi. Endi har bir kasb bitta qatorda: ustidagi ustun o'g'il
 * bolalar, ostidagisi qizlar.
 */
function drawGenderChart(
  doc: jsPDF,
  data: { name: string; ogil: number; qiz: number }[],
  y: number
): number {
  if (data.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text("Ma'lumot yo'q", M, y);
    return y + 8;
  }

  const labelWidth = 52;
  const barMaxW = PAGE_W - M * 2 - labelWidth - 16;
  const max = Math.max(...data.flatMap((d) => [d.ogil, d.qiz]), 1);
  const barH = 3;
  const rowH = barH * 2 + 3.6;

  let cursor = y;

  // Izoh — qaysi rang kim
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setFillColor(...BRAND);
  doc.roundedRect(M + labelWidth, cursor - 2.6, 6, 2.6, 0.6, 0.6, 'F');
  doc.setTextColor(...SLATE);
  doc.text(safe("O'g'il bolalar"), M + labelWidth + 8, cursor);
  doc.setFillColor(...PINK);
  doc.roundedRect(M + labelWidth + 38, cursor - 2.6, 6, 2.6, 0.6, 0.6, 'F');
  doc.text(safe('Qizlar'), M + labelWidth + 46, cursor);
  cursor += 5;

  for (const item of data) {
    cursor = ensureSpace(doc, cursor, rowH + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    const label = safe(item.name);
    doc.text(
      label.length > 30 ? `${label.slice(0, 29)}...` : label,
      M,
      cursor + rowH / 2 - 0.4
    );

    ([
      [item.ogil, BRAND, 0],
      [item.qiz, PINK, barH + 0.8],
    ] as [number, [number, number, number], number][]).forEach(([value, color, dy]) => {
      const top = cursor + dy;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(M + labelWidth, top, barMaxW, barH, 0.8, 0.8, 'F');
      if (value > 0) {
        doc.setFillColor(...color);
        doc.roundedRect(
          M + labelWidth,
          top,
          Math.max(1.2, (value / max) * barMaxW),
          barH,
          0.8,
          0.8,
          'F'
        );
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...SLATE);
      doc.text(String(value), M + labelWidth + barMaxW + 3, top + barH - 0.3);
    });

    cursor += rowH;
  }

  return cursor + 4;
}

/**
 * «Shuncha muammo aniqlandi — shunchasi hal qilindi» bandi.
 *
 * Hisobotning boshiga qo'yiladi, chunki hokim uchun eng muhim raqam
 * shu: diagrammalar holatni tasvirlaydi, bu esa bajarilgan ishni.
 */
function drawHelpBand(
  doc: jsPDF,
  help: { needHelp: number; resolved: number; pending: number },
  y: number
): number {
  if (help.needHelp === 0) return y;

  const h = 22;
  const top = ensureSpace(doc, y, h + 6);
  const foiz = Math.round((help.resolved / help.needHelp) * 100);

  doc.setFillColor(254, 249, 243);
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, top, PAGE_W - M * 2, h, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text(safe("YORDAM KERAK BO'LGAN O'QUVCHILAR"), M + 5, top + 6.5);

  // Uchta raqam yonma-yon
  const cells: [string, string, [number, number, number]][] = [
    [String(help.needHelp), 'muammo aniqlandi', DARK],
    [String(help.resolved), 'hal qilindi', [21, 128, 61]],
    [String(help.pending), 'kutmoqda', [180, 83, 9]],
  ];
  cells.forEach(([value, label, color], i) => {
    const x = M + 5 + i * 42;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...color);
    doc.text(value, x, top + 15.5);
    // Kenglikni raqam O'Z o'lchamida o'lchaymiz, aks holda yozuv
    // raqamning ustiga chiqib ketadi
    const raqamKengligi = doc.getTextWidth(value);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...SLATE);
    doc.text(safe(label), x + raqamKengligi + 2.5, top + 15.5);
  });

  // O'ng tomonda bajarilish darajasi
  const barX = M + 138;
  const barW = PAGE_W - M - 5 - barX;
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(barX, top + 12.5, barW, 3, 1, 1, 'F');
  if (foiz > 0) {
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(barX, top + 12.5, (barW * foiz) / 100, 3, 1, 1, 'F');
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61);
  const foizMatn = `${foiz}%`;
  const foizKengligi = doc.getTextWidth(foizMatn);
  doc.text(foizMatn, PAGE_W - M - 5, top + 9.5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...SLATE);
  doc.text(safe('bajarildi'), PAGE_W - M - 5 - foizKengligi - 2.5, top + 9.5, {
    align: 'right',
  });

  return top + h + 8;
}

/** KPI kartochkalar qatorini chizadi */
function drawKpiCards(
  doc: jsPDF,
  cards: { label: string; value: string }[],
  y: number
): number {
  const gap = 3;
  const cardW = (PAGE_W - M * 2 - gap * (cards.length - 1)) / cards.length;
  const cardH = 20;

  cards.forEach((card, i) => {
    const x = M + i * (cardW + gap);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, cardW, cardH, 2.5, 2.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...BRAND);
    doc.text(safe(card.value), x + cardW / 2, y + 9.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...SLATE);
    doc.text(safe(card.label), x + cardW / 2, y + 15.5, { align: 'center' });
  });

  return y + cardH + 8;
}

/**
 * Hudud kesimidagi talab jadvali.
 *
 * Hisobotning eng amaliy jadvali: hokim "tumanda nima ommabop"
 * emas, "SHU mahallada nima ochish kerak" degan savolga javob
 * izlaydi. Har bir katakda nom va uni tanlagan o'quvchilar soni
 * turadi — sonsiz nom qaror qabul qilishga yaramaydi.
 */
function drawDemandTable(
  doc: jsPDF,
  autoTable: typeof import('jspdf-autotable').default,
  rows: AreaDemand[],
  y: number,
  options: { areaLabel: string; areaWidth: number }
): number {
  /** "Dasturchi (4)" ko'rinishi; javob bo'lmasa chiziqcha */
  const cell = (name: string | null, count: number): string =>
    name ? safe(`${name} (${count})`) : '-';

  autoTable(doc, {
    startY: y,
    head: [
      [
        options.areaLabel,
        'Anketa',
        'Yo\'nalish',
        'Eng ko\'p kasb',
        'Kuchli fan',
        'So\'ralgan kurs',
      ],
    ],
    body: rows.map((r) => [
      safe(r.name),
      r.total,
      cell(r.topCategory, r.topCategoryCount),
      cell(r.topJob, r.topJobCount),
      cell(r.topSubject, r.topSubjectCount),
      cell(r.topCourse, r.topCourseCount),
    ]),
    styles: { font: 'helvetica', fontSize: 7.4, cellPadding: 1.8, textColor: DARK },
    headStyles: { fillColor: BRAND, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: options.areaWidth, fontStyle: 'bold' },
      1: { cellWidth: 12, halign: 'center' },
    },
    margin: { left: M, right: M, bottom: 20 },
    rowPageBreak: 'avoid',
    theme: 'grid',
  });

  const after = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  return (after?.finalY ?? y) + 8;
}

/** Faol filtrlarni o'qiladigan matnga aylantiradi */
function describeFilters(filters: DashboardFilters): string {
  const parts: string[] = [];
  if (filters.mahallalar.length) parts.push(`Mahalla: ${filters.mahallalar.join(', ')}`);
  if (filters.maktablar.length) parts.push(`Maktab: ${filters.maktablar.join(', ')}`);
  if (filters.sinflar.length) parts.push(`Sinf: ${filters.sinflar.join(', ')}`);
  if (filters.jinslar.length) parts.push(`Jins: ${filters.jinslar.join(', ')}`);
  if (filters.kategoriyalar.length) parts.push(`Yo'nalish: ${filters.kategoriyalar.join(', ')}`);
  if (filters.dateFrom) parts.push(`Boshlanish: ${filters.dateFrom}`);
  if (filters.dateTo) parts.push(`Tugash: ${filters.dateTo}`);
  return parts.length ? parts.join(' | ') : 'Filtrlar qo\'llanilmagan (barcha anketalar)';
}

/** Har bir sahifaga kolontitul qo'shadi */
function addFooters(doc: jsPDF): void {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(M, PAGE_H - 14, PAGE_W - M, PAGE_H - 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text(
      safe("Kelajak Egasi - Xatirchi tumani hokimligi | Navoiy viloyati"),
      M,
      PAGE_H - 9.5
    );
    doc.text(`${i} / ${pages}`, PAGE_W - M, PAGE_H - 9.5, { align: 'right' });
  }
}

/**
 * Hokim uchun to'liq tahliliy PDF hisobotni yaratadi va yuklab beradi.
 *
 * Hisobotda SHAXSIY MA'LUMOT bo'lmaydi — faqat umumlashtirilgan
 * raqamlar. Aniq o'quvchining ismi, telefoni va sabablari boshqaruv
 * panelida va Excel faylida qoladi.
 */
export async function exportDashboardToPdf(
  stats: DashboardStats,
  filters: DashboardFilters,
  options: { fileName?: string } = {}
): Promise<void> {
  const { fileName } = options;
  const [{ jsPDF: JsPdf }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new JsPdf({ unit: 'mm', format: 'a4' });

  // ---------- Sarlavha ----------
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, PAGE_W, 32, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text(safe('KELAJAK EGASI'), M, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(safe("Xatirchi tumani o'quvchilarining kasb tanlovi tahlili"), M, 21);
  doc.setFontSize(8);
  doc.text(safe(`Hisobot sanasi: ${formatDate(new Date())}`), M, 27);

  let y = 42;

  // ---------- Filtrlar ----------
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  const filterLines = doc.splitTextToSize(safe(describeFilters(filters)), PAGE_W - M * 2);
  doc.text(filterLines, M, y);
  y += filterLines.length * 4 + 4;

  // ---------- KPI ----------
  y = drawKpiCards(
    doc,
    [
      { label: "Jami o'quvchilar", value: String(stats.kpi.totalStudents) },
      { label: 'Maktablar', value: String(stats.kpi.totalSchools) },
      { label: 'Mahallalar', value: String(stats.kpi.totalMahallas) },
      { label: 'Qizlar', value: `${stats.kpi.girlsPercent}%` },
      { label: "O'g'il bolalar", value: `${stats.kpi.boysPercent}%` },
    ],
    y
  );

  // ---------- Yordam holati ----------
  // Hisobotning eng birinchi xulosasi: qancha muammo bor va nechtasi yopilgan
  y = drawHelpBand(doc, stats.help, y);

  // ---------- Top 10 kasblar ----------
  y = sectionTitle(doc, '1. Eng ommabop 10 ta kasb', y, stats.topJobs.length * 6.4);
  y = drawBarChart(doc, stats.topJobs, y, { total: stats.kpi.totalStudents });

  // ---------- Jins bo'yicha taqqoslash ----------
  y = sectionTitle(
    doc,
    "2. Qizlar va o'g'il bolalar tanlovi",
    y,
    stats.genderJobs.length * 9.6 + 5
  );
  y = drawGenderChart(doc, stats.genderJobs, y);

  // ---------- Mahallalar ----------
  const mahallaRows = stats.byMahalla.slice(0, 15);
  y = sectionTitle(doc, "3. Mahallalar bo'yicha faollik (TOP 15)", y, mahallaRows.length * 6.4);
  y = drawBarChart(doc, mahallaRows, y, {
    color: [16, 185, 129],
    total: stats.kpi.totalStudents,
  });

  // ---------- Sinflar va fanlar ----------
  y = sectionTitle(doc, "4. Sinflar bo'yicha taqsimot", y, stats.byGrade.length * 6.4);
  y = drawBarChart(doc, stats.byGrade, y, {
    color: [139, 92, 246],
    labelWidth: 24,
    total: stats.kpi.totalStudents,
  });

  const subjectRows = stats.bySubject.slice(0, 20);
  y = sectionTitle(doc, "5. Fanlar bo'yicha qiziqish", y, subjectRows.length * 6.4);
  y = drawBarChart(doc, subjectRows, y, { color: [249, 115, 22], labelWidth: 34 });

  // ---------- Mahallalar kesimidagi talab ----------
  /*
   * Hisobotning markaziy jadvallari. Yuqoridagi diagrammalar butun
   * tuman bo'yicha o'rtachani ko'rsatadi, qaror esa hudud bo'yicha
   * qabul qilinadi: markaz bitta mahallada ochiladi, to'garak bitta
   * maktabda tashkil qilinadi.
   */
  const mahallaDemandRows = stats.demandByMahalla.slice(0, 15);
  if (mahallaDemandRows.length > 0) {
    y = sectionTitle(doc, '6. Mahallalar kesimida talab (eng faol 15 ta)', y, 48);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    const demandIntro = doc.splitTextToSize(
      safe(
        'Qavs ichidagi raqam - shu javobni bergan o\'quvchilar soni. ' +
          '"So\'ralgan kurs" ustuni eng muhimi: bu mavjud emas, aynan KERAK ' +
          'bo\'lgan to\'garak, ya\'ni shu hududda nima ochish kerakligini ko\'rsatadi. ' +
          '"Eng ko\'p kasb" faqat 9-11-sinf javoblaridan hisoblanadi.'
      ),
      PAGE_W - M * 2
    );
    doc.text(demandIntro, M, y);
    y += demandIntro.length * 4.2 + 4;

    y = drawDemandTable(doc, autoTable, mahallaDemandRows, y, {
      areaLabel: 'Mahalla',
      areaWidth: 27,
    });
  }

  // ---------- Maktablar kesimidagi talab ----------
  const SCHOOL_LIMIT = 20;
  const schoolDemandRows = stats.demandBySchool.slice(0, SCHOOL_LIMIT);
  const schoolRest = stats.demandBySchool.length - schoolDemandRows.length;

  if (schoolDemandRows.length > 0) {
    y = sectionTitle(
      doc,
      `7. Maktablar kesimida talab (eng faol ${schoolDemandRows.length} ta)`,
      y,
      40
    );
    y = drawDemandTable(doc, autoTable, schoolDemandRows, y, {
      areaLabel: 'Maktab',
      areaWidth: 42,
    });

    if (schoolRest > 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(...SLATE);
      doc.text(
        safe(
          `Ro'yxatda yana ${schoolRest} ta maktab bor. ` +
            "To'liq ro'yxat Excel faylining «Hududlar» varag'ida."
        ),
        M,
        y - 3
      );
      y += 3;
    }
  }

  // ---------- Ta'lim markazi ochish tahlili ----------
  // Hisobotning eng amaliy qismi: qayerda, qanday markaz ochish mumkin.
  // Diagrammalar holatni tasvirlaydi, bu bo'lim esa qarorni taklif qiladi.
  const plan = stats.centerPlan;
  let cursor = y + 2;

  if (plan.answered > 0) {
    cursor = ensureSpace(doc, cursor, 60);
    cursor = sectionTitle(doc, "8. Ta'lim markazi ochish tahlili", cursor, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    const planIntro = doc.splitTextToSize(
      safe(
        `Quyidagi jadval ${plan.answered} ta o'quvchining javobiga tayanadi. ` +
          `"Guruh" ustuni - bitta joyda aynan bir xil kursni so'ragan o'quvchilar soni; ` +
          `kurs guruh to'lgandagina ishga tushadi (kamida ${MIN_GROUP} kishi). ` +
          `"To'garaksiz" ustuni - yaqin atrofda hech qanday to'garak yo'q deganlar ulushi.`
      ),
      PAGE_W - M * 2
    );
    doc.text(planIntro, M, cursor);
    cursor += planIntro.length * 4.2 + 3;

    const rows = plan.byMahalla.slice(0, 15);
    if (rows.length > 0) {
      autoTable(doc, {
        startY: cursor,
        head: [['Mahalla', 'Kurs', 'Guruh', "To'garaksiz", 'Qulay vaqt', 'Holat']],
        body: rows.map((o) => [
          safe(o.location),
          safe(o.courses[0]?.name ?? '-'),
          o.topDemand,
          `${o.unservedShare}%`,
          safe(o.bestTime ?? '-'),
          o.viability === 'viable'
            ? "Guruh to'ladi"
            : o.viability === 'close'
              ? 'Biroz yetmaydi'
              : 'Hozircha kam',
        ]),
        styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, textColor: DARK },
        headStyles: { fillColor: BRAND, textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: M, right: M, bottom: 20 },
        rowPageBreak: 'avoid',
        theme: 'grid',
      });
      const afterPlan = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
      cursor = (afterPlan?.finalY ?? cursor) + 8;
    }

    // Til talabi — til markazi uchun alohida qator
    if (plan.languageDemand.length > 0) {
      cursor = ensureSpace(doc, cursor, 16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text(safe("Qaysi til so'ralmoqda:"), M, cursor);
      cursor += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...SLATE);
      const langLine = doc.splitTextToSize(
        safe(plan.languageDemand.map((l) => `${l.name} - ${l.count}`).join(';  ')),
        PAGE_W - M * 2
      );
      doc.text(langLine, M, cursor);
      cursor += langLine.length * 4.2 + 6;
    }
  }

  // ---------- Yordam kerak bo'lgan o'quvchilar ----------
  /*
   * Bu yerda ATAYLAB faqat raqamlar bor: nechta muammo aniqlandi,
   * nechtasi yopildi va qaysi sabab bo'yicha. Bolalarning ismi,
   * maktabi va telefoni bu hujjatga kiritilmaydi — PDF qo'ldan
   * qo'lga o'tadi, chop etiladi, pochta orqali yuboriladi, ya'ni
   * uni maxfiy saqlab bo'lmaydi. Ismli ro'yxat faqat parol ostidagi
   * boshqaruv panelida va Excel faylining «Yordam» varag'ida.
   */
  if (stats.help.needHelp > 0) {
    cursor = sectionTitle(doc, "9. Yordam kerak bo'lgan o'quvchilar", cursor, 50);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    const helpIntro = doc.splitTextToSize(
      safe(
        `Jami ${stats.help.needHelp} ta o'quvchi hokimiyat aralashuvini talab qiladigan ` +
          `sababni ko'rsatdi. Shulardan ${stats.help.resolved} tasi bo'yicha ish yakunlandi, ` +
          `${stats.help.pending} tasi kutmoqda.`
      ),
      PAGE_W - M * 2
    );
    doc.text(helpIntro, M, cursor);
    cursor += helpIntro.length * 4.2 + 4;

    // Sabablar kesimi
    if (stats.help.byBarrier.length > 0) {
      autoTable(doc, {
        startY: cursor,
        head: [['Sabab', 'Aniqlandi', 'Hal qilindi', 'Kutmoqda']],
        body: stats.help.byBarrier.map((b) => [
          safe(b.name),
          b.count,
          b.resolved,
          b.count - b.resolved,
        ]),
        styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, textColor: DARK },
        headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [254, 249, 243] },
        margin: { left: M, right: M, bottom: 20 },
        rowPageBreak: 'avoid',
        theme: 'grid',
      });
      const afterBarriers = (doc as unknown as { lastAutoTable?: { finalY: number } })
        .lastAutoTable;
      cursor = (afterBarriers?.finalY ?? cursor) + 8;
    }

  }

  // ---------- Xulosa va tavsiyalar ----------
  cursor = sectionTitle(doc, 'Xulosa va tavsiyalar', cursor, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE);
  const introLines = doc.splitTextToSize(
    safe(
      'Quyidagi tavsiyalar anketa natijalari asosida avtomatik shakllantirilgan. ' +
        'Har bir tavsiya yonida uni tasdiqlovchi raqamli dalil keltirilgan.'
    ),
    PAGE_W - M * 2
  );
  doc.text(introLines, M, cursor);
  cursor += introLines.length * 4 + 4;

  const recommendations = buildRecommendations(stats);

  for (const rec of recommendations) {
    cursor = ensureSpace(doc, cursor, 26);

    // Muhimlik darajasi rangi
    const badgeColor: [number, number, number] =
      rec.priority === 'high'
        ? [220, 38, 38]
        : rec.priority === 'medium'
          ? [217, 119, 6]
          : [100, 116, 139];

    // Chap tomonda rangli chiziq — darajani ko'rsatadi
    doc.setFillColor(...badgeColor);
    doc.roundedRect(M, cursor - 3.2, 1.4, 5, 0.7, 0.7, 'F');

    // Sarlavha
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    const titleLines = doc.splitTextToSize(safe(rec.title), PAGE_W - M * 2 - 26);
    doc.text(titleLines, M + 4, cursor);

    // Daraja yorlig'i o'ng tomonda
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...badgeColor);
    doc.text(safe(PRIORITY_LABELS[rec.priority].toUpperCase()), PAGE_W - M, cursor, {
      align: 'right',
    });
    cursor += titleLines.length * 4.4 + 1;

    // Nima qilish kerak
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    const actionLines = doc.splitTextToSize(safe(rec.action), PAGE_W - M * 2 - 4);
    doc.text(actionLines, M + 4, cursor);
    cursor += actionLines.length * 4 + 1;

    // Dalil
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(...SLATE);
    const evidenceLines = doc.splitTextToSize(
      safe(`Dalil: ${rec.evidence}`),
      PAGE_W - M * 2 - 4
    );
    doc.text(evidenceLines, M + 4, cursor);
    cursor += evidenceLines.length * 3.8 + 5;
  }

  addFooters(doc);

  // Fayl nomi tuman va sana bilan — hokimiyat arxivida oson topilishi uchun
  doc.save(fileName ?? `Xatirchi-hisobot-${new Date().toISOString().slice(0, 10)}.pdf`);
}
