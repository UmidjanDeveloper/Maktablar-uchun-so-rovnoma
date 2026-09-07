/**
 * ============================================================
 *  Excel eksporti (xlsx)
 *  Filtrlangan anketalar + qisqacha statistika varaqlari bilan
 *  bitta .xlsx fayl yaratadi.
 * ============================================================
 */
import { formatDate, formatPhone } from './utils';
import { YORDAM_TOSIQLARI } from './constants';
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

/**
 * Filtrlangan anketalarni Excel faylga yuklaydi.
 *
 * Varaqlar: Anketalar, Yordam, Umumiy statistika, Mahallalar kesimi.
 * «Yordam» varag'i alohida turadi, chunki u bilan ishlash tartibi ham
 * boshqacha: qolgan varaqlar tahlil uchun, bu esa qo'ng'iroq qilish
 * va aniq bolaga yordam ko'rsatish uchun.
 */
export async function exportStudentsToExcel(
  students: StudentRecord[],
  stats: DashboardStats | null,
  fileName?: string
): Promise<void> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();

  // --- 1-varaq: anketalar ---
  const rows = [HEADERS, ...students.map(toRow)];
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet['!cols'] = COL_WIDTHS.map((wch) => ({ wch }));
  // Sarlavha qatorini muzlatib qo'yamiz
  sheet['!freeze'] = { xSplit: 0, ySplit: 1 };
  XLSX.utils.book_append_sheet(workbook, sheet, 'Anketalar');

  // --- 2-varaq: yordam kerak bo'lganlar ---
  const help = students.filter(needsHelp);
  if (help.length > 0) {
    const resolved = help.filter((s) => s.helpResolved);
    const pending = help.filter((s) => !s.helpResolved);

    const helpRows: (string | number)[][] = [
      ['YORDAM KERAK BO\'LGAN O\'QUVCHILAR'],
      ['MAXFIY — shaxsiy ma\'lumot. Faqat xizmat maqsadida foydalaning.'],
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
      helpRows.push(['SABABLAR BO\'YICHA', 'Jami', 'Hal qilindi', 'Kutmoqda']);
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

  // --- 3-varaq: umumiy statistika ---
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
      ['YORDAM BO\'YICHA BAJARILGAN ISH'],
      ["To'siq belgilagan o'quvchilar", stats.help.withBarriers],
      ['Hokimiyat aralashuvi kerak', stats.help.needHelp],
      ['Hal qilindi', stats.help.resolved],
      ['Kutmoqda', stats.help.pending],
      [],
      ['TOP 10 KASBLAR', "O'quvchilar soni"],
      ...stats.topJobs.map((j) => [j.name, j.value]),
      [],
      ['SINFLAR BO\'YICHA', "O'quvchilar soni"],
      ...stats.byGrade.map((g) => [g.name, g.value]),
      [],
      ['FANLAR BO\'YICHA QIZIQISH', 'Tanlovlar soni'],
      ...stats.bySubject.map((s) => [s.name, s.value]),
      [],
      ["YO'NALISHLAR BO'YICHA", "O'quvchilar soni"],
      ...stats.byCategory.map((c) => [c.name, c.value]),
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summary);
    summarySheet['!cols'] = [{ wch: 34 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Statistika');

    // --- 4-varaq: mahallalar va maktablar kesimi ---
    const byArea: (string | number)[][] = [
      ["MAHALLALAR BO'YICHA"],
      ['Mahalla', "O'quvchilar soni"],
      ...stats.byMahalla.map((m) => [m.name, m.value]),
      [],
      ["MAKTABLAR BO'YICHA ENG OMMABOP KASB"],
      ['Maktab', 'Jami anketa', 'Eng ommabop kasb', 'Tanlaganlar soni'],
      ...stats.bySchool.map((s) => [s.school, s.total, s.topJob, s.topJobCount]),
    ];
    const areaSheet = XLSX.utils.aoa_to_sheet(byArea);
    areaSheet['!cols'] = [{ wch: 24 }, { wch: 16 }, { wch: 26 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(workbook, areaSheet, 'Hududlar');
  }

  // Fayl nomi tuman va sana bilan — hokimiyat arxivida oson topilishi uchun
  const name =
    fileName ?? `Xatirchi-anketalar-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, name);
}
