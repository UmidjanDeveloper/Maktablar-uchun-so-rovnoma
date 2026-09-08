/**
 * ============================================================
 *  Excel eksporti (xlsx)
 *
 *  Fayl ikki xil o'quvchi uchun mo'ljallangan:
 *    - HOKIM «Hisobot» varag'ini ochadi va diagrammalarga qaraydi;
 *    - XODIM «Anketalar» va «Yordam» varaqlari bilan ishlaydi.
 *
 *  Diagrammalar rasm emas, haqiqiy Excel diagrammasi — ular
 *  `excel-charts.ts` orqali fayl ichiga qo'shiladi.
 * ============================================================
 */
import { formatDate, formatPhone } from './utils';
import { YORDAM_TOSIQLARI } from './constants';
import { injectCharts, type CellLook, type ChartSpec } from './excel-charts';
import type { DashboardStats, StudentRecord } from '@/types';

/** Ustunlar sarlavhalari (o'zbekcha) */
const HEADERS = [
  '№',
  'Ism',
  'Familiya',
  'Jins',
  'Sinf',
  'Maktab',
  'Mahalla',
  'Tuman',
  'Viloyat',
  'Orzu kasb',
  "Kasb yo'nalishi",
  'Yoqtirgan fanlar',
  "To'garaklar",
  'Kerakli kurslar',
  'Kerakli tillar',
  "Qancha yo'l yuradi",
  "Hozirgi to'siqlar",
  'Qulay vaqt',
  'Uydagi texnika',
  'Telefon',
  'Ota-ona telefoni',
  'Yordam kerakmi',
  'Yordam holati',
  'Hal qilingan sana',
  "To'ldirilgan sana",
];

/** Ustunlar kengligi (belgi hisobida) */
const COL_WIDTHS = [
  5, 14, 16, 12, 6, 30, 16, 12, 12, 22, 20, 30, 22,
  30, 22, 20, 34, 24, 26, 18, 18, 14, 16, 18, 18,
];

/** Diagrammalar joylashadigan varaq */
const DASHBOARD = 'Hisobot';
/** Diagrammalar o'qiydigan ma'lumot varag'i */
const DATA_SHEET = 'Grafik';

/** Hokimiyat aralashuvi talab qiladigan sabab bormi */
function needsHelp(student: StudentRecord): boolean {
  return student.barriers.some((b) =>
    (YORDAM_TOSIQLARI as readonly string[]).includes(b)
  );
}

/** Yordam holatini o'qiladigan matnga aylantiradi */
function helpStatus(student: StudentRecord): string {
  if (!needsHelp(student)) return '—';
  return student.helpResolved ? 'Hal qilindi' : 'Kutmoqda';
}

/** Bitta anketani massiv qatoriga aylantiradi */
function toRow(student: StudentRecord, index: number): (string | number)[] {
  return [
    index + 1,
    student.firstName,
    student.lastName,
    student.gender,
    student.grade,
    student.school,
    student.mahalla,
    student.district,
    student.region,
    student.dreamJob ?? '',
    student.jobCategory ?? '',
    student.favoriteSubjects.join(', '),
    student.clubs.join(', '),
    student.wantedCourses.join(', '),
    student.wantedLanguages.join(', '),
    student.travelWillingness ?? '',
    student.barriers.join(', '),
    student.availableTimes.join(', '),
    student.homeTech ?? '',
    student.phone ?? '',
    student.parentPhone ?? '',
    needsHelp(student) ? 'Ha' : "Yo'q",
    helpStatus(student),
    student.helpResolvedAt ? formatDate(student.helpResolvedAt) : '',
    formatDate(student.createdAt),
  ];
}

/** Excel ustun harfi: 0 -> A, 25 -> Z, 26 -> AA */
function colLetter(index: number): string {
  let n = index;
  let out = '';
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return out;
}

/**
 * Diagrammalar uchun ma'lumot bloklari.
 *
 * Har bir blok `Grafik` varag'ida O'Z ustunlarida joylashadi: shunda
 * diapazonlar oddiy bo'ladi va bitta blok o'zgarsa qolganlari
 * siljimaydi. Blok qo'shilganda ustun hisoblagichi o'zi suriladi.
 */
class DataSheet {
  private rows: (string | number)[][] = [];
  private col = 0;

  /** Blok qo'shadi va diagramma uchun diapazonlarni qaytaradi */
  add(
    title: string,
    categories: string[],
    seriesList: { name: string; values: number[] }[]
  ): { cats: string; series: { name: string; ref: string }[] } | null {
    if (categories.length === 0) return null;

    const first = this.col;
    // Sarlavha qatori: nom + har bir qator uchun ustun
    this.put(0, first, title);
    seriesList.forEach((s, i) => this.put(0, first + 1 + i, s.name));

    categories.forEach((cat, r) => {
      this.put(r + 1, first, cat);
      seriesList.forEach((s, i) => this.put(r + 1, first + 1 + i, s.values[r] ?? 0));
    });

    const last = categories.length + 1; // 1-qator sarlavha, ma'lumot 2-qatordan
    const ref = (c: number) => `${DATA_SHEET}!$${colLetter(c)}$2:$${colLetter(c)}$${last}`;

    // Bloklar orasida bitta bo'sh ustun qoldiramiz — o'qish osonroq
    this.col = first + seriesList.length + 2;

    return {
      cats: ref(first),
      series: seriesList.map((s, i) => ({ name: s.name, ref: ref(first + 1 + i) })),
    };
  }

  private put(row: number, col: number, value: string | number): void {
    if (!this.rows[row]) this.rows[row] = [];
    this.rows[row][col] = value;
  }

  toArray(): (string | number)[][] {
    // Bo'sh kataklarni to'ldiramiz, aks holda xlsx qatorni kaltalashtiradi
    return this.rows.map((r) => Array.from(r, (v) => v ?? ''));
  }

  get width(): number {
    return this.col;
  }
}

/**
 * Gorizontal ustunli diagramma uchun tartibni teskari qiladi.
 *
 * Excel birinchi qatorni ENG PASTGA chizadi. Ro'yxatimiz esa kattadan
 * kichikka tartiblangan, ya'ni to'g'ridan-to'g'ri bersak eng ommabop
 * kasb pastda, eng kamnisi tepada turadi — hisobotni o'qigan odam
 * teskari xulosa chiqaradi.
 */
function pastdanYuqoriga<T>(list: T[]): T[] {
  return [...list].reverse();
}

/** Anketalar oqimi — kunlar bo'yicha (chiziqli diagramma uchun) */
function dailyFlow(students: StudentRecord[]): { labels: string[]; counts: number[] } {
  const byDay = new Map<string, number>();
  for (const s of students) {
    const day = s.createdAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  const days = Array.from(byDay.keys()).sort();
  return {
    labels: days.map((d) => `${d.slice(8, 10)}.${d.slice(5, 7)}`),
    counts: days.map((d) => byDay.get(d) ?? 0),
  };
}

/** Faylni brauzerga beradi */
function download(buffer: ArrayBuffer | Uint8Array, name: string): void {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Brauzer faylni o'qib ulgurishi uchun biroz kutamiz
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Filtrlangan anketalarni Excel faylga yuklaydi.
 *
 * Varaqlar: Hisobot (diagrammalar), Grafik (ularning ma'lumoti),
 * Anketalar, Yordam, Statistika, Hududlar.
 */
export async function exportStudentsToExcel(
  students: StudentRecord[],
  stats: DashboardStats | null,
  fileName?: string
): Promise<void> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();

  const charts: ChartSpec[] = [];
  const data = new DataSheet();

  /* ---------- 1-varaq: HISOBOT (diagrammalar) ---------- */
  const dash: (string | number)[][] = [
    ['KELAJAK EGASI — XATIRCHI TUMANI'],
    ["O'quvchilarning kasb tanlovi va ta'lim ehtiyoji tahlili"],
    [`Hisobot sanasi: ${formatDate(new Date())}`],
    [],
  ];

  const looks: Record<string, CellLook> = {
    A1: 'title',
    A2: 'subtitle',
    A3: 'subtitle',
  };
  const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } },
  ];

  /** Diagramma to'ri: kenglik, balandlik va boshlanish qatori */
  const W = 8;
  const H = 16;
  const START = 8;

  if (stats) {
    /*
     * KPI bloki: yorliqlar 5-qatorda, raqamlar 6-qatorda. Har biri
     * uchta ustunni egallaydi — uzun yorliq kesilib qolmasligi uchun
     * kataklar birlashtiriladi.
     */
    const kpis: [string, number | string][] = [
      ["Jami o'quvchilar", stats.kpi.totalStudents],
      ['Maktablar', stats.kpi.totalSchools],
      ['Mahallalar', stats.kpi.totalMahallas],
      ['Yordam kerak', stats.help.needHelp],
      ['Hal qilindi', stats.help.resolved],
    ];
    const labelRow: (string | number)[] = [];
    const valueRow: (string | number)[] = [];
    kpis.forEach(([label, value], i) => {
      const col = i * 3;
      labelRow[col] = label;
      valueRow[col] = value;
      looks[`${colLetter(col)}5`] = 'kpiLabel';
      looks[`${colLetter(col)}6`] = 'kpiValue';
      merges.push({ s: { r: 4, c: col }, e: { r: 4, c: col + 2 } });
      merges.push({ s: { r: 5, c: col }, e: { r: 5, c: col + 2 } });
    });
    dash.push(labelRow, valueRow, []);

    let slot = 0;
    const nextAnchor = () => {
      const col = (slot % 2) * (W + 1);
      const row = START + Math.floor(slot / 2) * (H + 1);
      slot += 1;
      return { col, row, toCol: col + W, toRow: row + H };
    };

    // 1) Eng ommabop kasblar
    const topJobs = pastdanYuqoriga(stats.topJobs);
    const jobs = data.add('Kasb', topJobs.map((j) => j.name), [
      { name: "O'quvchilar", values: topJobs.map((j) => j.value) },
    ]);
    if (jobs) {
      charts.push({
        kind: 'bar',
        title: 'Eng ommabop kasblar',
        categories: jobs.cats,
        series: [{ name: jobs.series[0].name, values: jobs.series[0].ref }],
        anchor: nextAnchor(),
      });
    }

    // 2) Sinflar bo'yicha taqsimot
    const grades = data.add('Sinf', stats.byGrade.map((g) => g.name), [
      { name: "O'quvchilar", values: stats.byGrade.map((g) => g.value) },
    ]);
    if (grades) {
      charts.push({
        kind: 'column',
        title: "Sinflar bo'yicha taqsimot",
        categories: grades.cats,
        series: [
          { name: grades.series[0].name, values: grades.series[0].ref, color: '8B5CF6' },
        ],
        anchor: nextAnchor(),
      });
    }

    // 3) So'ralgan kurslar — markaz ochish qarori shu yerdan chiqadi
    const topCourses = pastdanYuqoriga(stats.centerPlan.courseDemand.slice(0, 10));
    const courses = data.add('Kurs', topCourses.map((c) => c.name), [
      { name: "So'raganlar", values: topCourses.map((c) => c.count) },
    ]);
    if (courses) {
      charts.push({
        kind: 'bar',
        title: "Eng ko'p so'ralgan kurslar",
        categories: courses.cats,
        series: [
          { name: courses.series[0].name, values: courses.series[0].ref, color: '10B981' },
        ],
        anchor: nextAnchor(),
      });
    }

    // 4) Qiz va o'g'il bolalar nisbati
    const gender = data.add('Jins', ['Qizlar', "O'g'il bolalar"], [
      { name: "O'quvchilar", values: [stats.kpi.girlsCount, stats.kpi.boysCount] },
    ]);
    if (gender) {
      charts.push({
        kind: 'pie',
        title: "Qizlar va o'g'il bolalar",
        categories: gender.cats,
        series: [{ name: gender.series[0].name, values: gender.series[0].ref }],
        anchor: nextAnchor(),
        points: 2,
        legend: true,
      });
    }

    // 5) Mahallalar bo'yicha faollik
    const topMahallas = pastdanYuqoriga(stats.byMahalla.slice(0, 12));
    const mahallas = data.add('Mahalla', topMahallas.map((m) => m.name), [
      { name: 'Anketalar', values: topMahallas.map((m) => m.value) },
    ]);
    if (mahallas) {
      charts.push({
        kind: 'bar',
        title: "Mahallalar bo'yicha faollik",
        categories: mahallas.cats,
        series: [
          { name: mahallas.series[0].name, values: mahallas.series[0].ref, color: '06B6D4' },
        ],
        anchor: nextAnchor(),
      });
    }

    // 6) Yordam: qancha aniqlandi, qanchasi yopildi
    if (stats.help.byBarrier.length > 0) {
      const barriers = pastdanYuqoriga(stats.help.byBarrier);
      const help = data.add('Sabab', barriers.map((b) => b.name), [
        { name: 'Hal qilindi', values: barriers.map((b) => b.resolved) },
        { name: 'Kutmoqda', values: barriers.map((b) => b.count - b.resolved) },
      ]);
      if (help) {
        charts.push({
          kind: 'bar',
          title: "Yordam: sabab bo'yicha holat",
          categories: help.cats,
          series: [
            { name: help.series[0].name, values: help.series[0].ref, color: '10B981' },
            { name: help.series[1].name, values: help.series[1].ref, color: 'F59E0B' },
          ],
          anchor: nextAnchor(),
          stacked: true,
          legend: true,
        });
      }
    }

    // 7) Kunlar bo'yicha anketa oqimi — butun kenglikda
    const flow = dailyFlow(students);
    if (flow.labels.length > 1) {
      const daily = data.add('Sana', flow.labels, [
        { name: 'Anketalar', values: flow.counts },
      ]);
      if (daily) {
        const a = nextAnchor();
        charts.push({
          kind: 'line',
          title: "Kunlar bo'yicha to'ldirilgan anketalar",
          categories: daily.cats,
          series: [
            { name: daily.series[0].name, values: daily.series[0].ref, color: '2148E0' },
          ],
          anchor: { col: 0, row: a.row, toCol: W * 2 + 1, toRow: a.row + H },
        });
      }
    }
  }

  // Diagrammalar sig'ishi uchun varaqni yetarlicha uzun qilamiz
  const neededRows = START + Math.ceil(charts.length / 2) * (H + 1) + 2;
  while (dash.length < neededRows) dash.push([]);

  const dashSheet = XLSX.utils.aoa_to_sheet(dash);
  dashSheet['!cols'] = Array.from({ length: 20 }, () => ({ wch: 9 }));
  dashSheet['!merges'] = merges;
  XLSX.utils.book_append_sheet(workbook, dashSheet, DASHBOARD);

  /* ---------- 2-varaq: GRAFIK (diagrammalar ma'lumoti) ---------- */
  const dataRows = data.toArray();
  const dataSheet = XLSX.utils.aoa_to_sheet(dataRows.length ? dataRows : [['']]);
  dataSheet['!cols'] = Array.from({ length: Math.max(1, data.width) }, () => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(workbook, dataSheet, DATA_SHEET);

  /* ---------- 3-varaq: anketalar ---------- */
  const rows = [HEADERS, ...students.map(toRow)];
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet['!cols'] = COL_WIDTHS.map((wch) => ({ wch }));
  sheet['!freeze'] = { xSplit: 0, ySplit: 1 };
  XLSX.utils.book_append_sheet(workbook, sheet, 'Anketalar');

  /* ---------- 4-varaq: yordam kerak bo'lganlar ---------- */
  const help = students.filter(needsHelp);
  if (help.length > 0) {
    const resolved = help.filter((s) => s.helpResolved);
    const pending = help.filter((s) => !s.helpResolved);

    const helpRows: (string | number)[][] = [
      ["YORDAM KERAK BO'LGAN O'QUVCHILAR"],
      ["MAXFIY — shaxsiy ma'lumot. Faqat xizmat maqsadida foydalaning."],
      ['Hisobot sanasi', formatDate(new Date())],
      [],
      ['Muammo aniqlandi', help.length],
      ['Hal qilindi', resolved.length],
      ['Kutmoqda', pending.length],
      [
        'Bajarilish darajasi',
        `${help.length > 0 ? Math.round((resolved.length / help.length) * 100) : 0}%`,
      ],
      [],
    ];

    if (stats?.help.byBarrier.length) {
      helpRows.push(["SABABLAR BO'YICHA", 'Jami', 'Hal qilindi', 'Kutmoqda']);
      for (const b of stats.help.byBarrier) {
        helpRows.push([b.name, b.count, b.resolved, b.count - b.resolved]);
      }
      helpRows.push([]);
    }

    helpRows.push([
      '№',
      'Ism',
      'Familiya',
      'Sinf',
      'Maktab',
      'Mahalla',
      'Sabab',
      'Ota-ona telefoni',
      "O'quvchi telefoni",
      'Holat',
      'Hal qilingan sana',
    ]);

    // Avval kutayotganlar — ish shu ro'yxatdan boshlanadi
    [...pending, ...resolved].forEach((s, i) => {
      helpRows.push([
        i + 1,
        s.firstName,
        s.lastName,
        s.grade,
        s.school,
        s.mahalla,
        s.barriers.join(', '),
        // Bu varaq qo'ng'iroq qilish uchun — raqam o'qiladigan ko'rinishda
        s.parentPhone ? formatPhone(s.parentPhone) : '',
        s.phone ? formatPhone(s.phone) : '',
        s.helpResolved ? 'Hal qilindi' : 'Kutmoqda',
        s.helpResolvedAt ? formatDate(s.helpResolvedAt) : '',
      ]);
    });

    const helpSheet = XLSX.utils.aoa_to_sheet(helpRows);
    helpSheet['!cols'] = [
      { wch: 5 }, { wch: 14 }, { wch: 16 }, { wch: 6 }, { wch: 32 },
      { wch: 18 }, { wch: 36 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(workbook, helpSheet, 'Yordam');
  }

  /* ---------- 5-varaq: umumiy statistika ---------- */
  if (stats) {
    const summary: (string | number)[][] = [
      ['KELAJAK EGASI — UMUMIY STATISTIKA'],
      ['Hisobot sanasi', formatDate(new Date())],
      [],
      ["Jami o'quvchilar", stats.kpi.totalStudents],
      ['Jami maktablar', stats.kpi.totalSchools],
      ['Jami mahallalar', stats.kpi.totalMahallas],
      ['Qizlar', `${stats.kpi.girlsCount} (${stats.kpi.girlsPercent}%)`],
      ["O'g'il bolalar", `${stats.kpi.boysCount} (${stats.kpi.boysPercent}%)`],
      [],
      ["YORDAM BO'YICHA BAJARILGAN ISH"],
      ["To'siq belgilagan o'quvchilar", stats.help.withBarriers],
      ['Hokimiyat aralashuvi kerak', stats.help.needHelp],
      ['Hal qilindi', stats.help.resolved],
      ['Kutmoqda', stats.help.pending],
      [],
      ['TOP 10 KASBLAR', "O'quvchilar soni"],
      ...stats.topJobs.map((j) => [j.name, j.value]),
      [],
      ["SINFLAR BO'YICHA", "O'quvchilar soni"],
      ...stats.byGrade.map((g) => [g.name, g.value]),
      [],
      ["FANLAR BO'YICHA QIZIQISH", 'Tanlovlar soni'],
      ...stats.bySubject.map((s) => [s.name, s.value]),
      [],
      ["YO'NALISHLAR BO'YICHA", "O'quvchilar soni"],
      ...stats.byCategory.map((c) => [c.name, c.value]),
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summary);
    summarySheet['!cols'] = [{ wch: 34 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Statistika');

    /* ---------- 6-varaq: mahallalar va maktablar kesimi ---------- */
    const byArea: (string | number)[][] = [
      ["MAHALLALAR BO'YICHA TALAB"],
      ['Mahalla', 'Anketa', "Yo'nalish", "Eng ko'p kasb", 'Kuchli fan', "So'ralgan kurs"],
      ...stats.demandByMahalla.map((m) => [
        m.name,
        m.total,
        m.topCategory ?? '—',
        m.topJob ?? '—',
        m.topSubject ?? '—',
        m.topCourse ?? '—',
      ]),
      [],
      ["MAKTABLAR BO'YICHA TALAB"],
      ['Maktab', 'Anketa', "Yo'nalish", "Eng ko'p kasb", 'Kuchli fan', "So'ralgan kurs"],
      ...stats.demandBySchool.map((s) => [
        s.name,
        s.total,
        s.topCategory ?? '—',
        s.topJob ?? '—',
        s.topSubject ?? '—',
        s.topCourse ?? '—',
      ]),
    ];
    const areaSheet = XLSX.utils.aoa_to_sheet(byArea);
    areaSheet['!cols'] = [
      { wch: 34 }, { wch: 9 }, { wch: 22 }, { wch: 26 }, { wch: 22 }, { wch: 26 },
    ];
    XLSX.utils.book_append_sheet(workbook, areaSheet, 'Hududlar');
  }

  // Faylni yozamiz va ichiga diagrammalarni qo'shamiz
  const raw: ArrayBuffer | Uint8Array = XLSX.write(workbook, {
    type: 'array',
    bookType: 'xlsx',
  });
  const withCharts = await injectCharts(raw, DASHBOARD, charts, {
    hideGridLines: true,
    printFit: true,
    cells: looks,
  });

  // Fayl nomi tuman va sana bilan — hokimiyat arxivida oson topilishi uchun
  download(
    withCharts,
    fileName ?? `Xatirchi-hisobot-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}
