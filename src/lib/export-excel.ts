/**
 * ============================================================
 *  Excel eksporti (xlsx)
 *  Filtrlangan anketalar + qisqacha statistika varaqlari bilan
 *  bitta .xlsx fayl yaratadi.
 * ============================================================
 */
import { formatDate } from './utils';
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
  'Kasb tanlash sababi',
  'Ilhomlantirgan',
  "Chet elda o'qish",
  'Mahalla uchun rejasi',
  'Telefon',
  'Ota-ona telefoni',
  "To'ldirilgan sana",
];

/** Ustunlar kengligi (belgi hisobida) */
const COL_WIDTHS = [
  5, 14, 16, 12, 6, 14, 16, 12, 12, 22, 20, 30, 22, 40, 16, 18, 40, 18, 18, 18,
];

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
    student.dreamJob,
    student.jobCategory,
    student.favoriteSubjects.join(', '),
    student.clubs.join(', '),
    student.motivation ?? '',
    student.inspiration ?? '',
    student.studyAbroad ?? '',
    student.futureContribution ?? '',
    student.phone ?? '',
    student.parentPhone ?? '',
    formatDate(student.createdAt),
  ];
}

/**
 * Filtrlangan anketalarni Excel faylga yuklaydi.
 * Fayl uchta varaqdan iborat: Anketalar, Umumiy statistika, Mahallalar kesimi.
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

  // --- 2-varaq: umumiy statistika ---
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

    // --- 3-varaq: mahallalar va maktablar kesimi ---
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
