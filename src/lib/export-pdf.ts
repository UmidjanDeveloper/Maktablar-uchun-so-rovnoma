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
import type { DashboardFilters, DashboardStats } from '@/types';

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

/** Bo'lim sarlavhasini chizadi */
function sectionTitle(doc: jsPDF, title: string, y: number): number {
  const top = ensureSpace(doc, y, 16);
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
  options: { color?: [number, number, number]; labelWidth?: number; max?: number } = {}
): number {
  const { color = BRAND, labelWidth = 52 } = options;
  if (data.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text("Ma'lumot yo'q", M, y);
    return y + 8;
  }

  const rowH = 6.4;
  const barMaxW = PAGE_W - M * 2 - labelWidth - 16;
  const max = options.max ?? Math.max(...data.map((d) => d.value), 1);
  let cursor = ensureSpace(doc, y, data.length * rowH + 6);

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

    // Qiymat
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    doc.text(String(item.value), M + labelWidth + barMaxW + 3, cursor + 3.4);

    cursor += rowH;
  }

  return cursor + 4;
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
 */
export async function exportDashboardToPdf(
  stats: DashboardStats,
  filters: DashboardFilters,
  fileName?: string
): Promise<void> {
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

  // ---------- Top 10 kasblar ----------
  y = sectionTitle(doc, '1. Eng ommabop 10 ta kasb', y);
  y = drawBarChart(doc, stats.topJobs, y);

  // ---------- Jins bo'yicha taqqoslash ----------
  y = sectionTitle(doc, '2. Qizlar va o\'g\'il bolalar tanlovi', y);
  const genderMax = Math.max(
    ...stats.genderJobs.flatMap((g) => [g.ogil, g.qiz]),
    1
  );
  y = drawBarChart(
    doc,
    stats.genderJobs.map((g) => ({ name: `${g.name} (o'g'il)`, value: g.ogil })),
    y,
    { color: BRAND, max: genderMax }
  );
  y = drawBarChart(
    doc,
    stats.genderJobs.map((g) => ({ name: `${g.name} (qiz)`, value: g.qiz })),
    y,
    { color: PINK, max: genderMax }
  );

  // ---------- Mahallalar ----------
  y = sectionTitle(doc, '3. Mahallalar bo\'yicha faollik (TOP 15)', y);
  y = drawBarChart(doc, stats.byMahalla.slice(0, 15), y, { color: [16, 185, 129] });

  // ---------- Sinflar va fanlar ----------
  y = sectionTitle(doc, '4. Sinflar bo\'yicha taqsimot', y);
  y = drawBarChart(doc, stats.byGrade, y, { color: [139, 92, 246], labelWidth: 24 });

  y = sectionTitle(doc, '5. Fanlar bo\'yicha qiziqish', y);
  y = drawBarChart(doc, stats.bySubject, y, { color: [249, 115, 22], labelWidth: 34 });

  // ---------- Maktablar jadvali ----------
  y = sectionTitle(doc, '6. Maktablar bo\'yicha eng ommabop kasb', y);
  autoTable(doc, {
    startY: y,
    head: [['Maktab', 'Anketalar', 'Eng ommabop kasb', 'Tanlagan']],
    body: stats.bySchool.map((s) => [
      safe(s.school),
      s.total,
      safe(s.topJob),
      s.topJobCount,
    ]),
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2, textColor: DARK },
    headStyles: { fillColor: BRAND, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: M, right: M, bottom: 20 },
    theme: 'grid',
  });

  // ---------- Xulosa va tavsiyalar ----------
  const afterTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  let cursor = (afterTable?.finalY ?? y) + 10;
  cursor = sectionTitle(doc, 'Xulosa va tavsiyalar', cursor);

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

  doc.save(
    fileName ?? `Kelajak-Egasi-hisobot-${new Date().toISOString().slice(0, 10)}.pdf`
  );
}
