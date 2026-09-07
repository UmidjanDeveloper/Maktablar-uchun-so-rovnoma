import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildWhere, parseFilters } from '@/lib/filters';
import { requireAdmin } from '@/lib/api-auth';
import { percent } from '@/lib/utils';
import { KASB_ICON_MAP } from '@/lib/constants';
import { buildCenterPlan } from '@/lib/center-planning';
import type { DashboardStats, MahallaInsight, NameValue, SchoolTopJob } from '@/types';

export const dynamic = 'force-dynamic';

/** Xaritadan kamayish tartibidagi ro'yxat yasaydi */
function toSorted(map: Map<string, number>, limit?: number): NameValue[] {
  const list = Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  return limit ? list.slice(0, limit) : list;
}

/** Xaritadagi qiymatni bittaga oshiradi */
function inc(map: Map<string, number>, key: string, by = 1): void {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + by);
}

/**
 * GET /api/stats — dashboard uchun barcha statistikalar.
 * Filtrlar barcha diagrammalarga bir vaqtda ta'sir qiladi.
 */
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const filters = parseFilters(request.nextUrl.searchParams);
  const where = buildWhere(filters);

  try {
    // Hisob-kitob uchun faqat zarur ustunlarni olamiz — bu tezroq ishlaydi
    const rows = await prisma.student.findMany({
      where,
      select: {
        gender: true,
        mahalla: true,
        school: true,
        grade: true,
        dreamJob: true,
        jobCategory: true,
        favoriteSubjects: true,
        clubs: true,
        inspiration: true,
        studyAbroad: true,
        wantedCourses: true,
        wantedLanguages: true,
        travelWillingness: true,
        barriers: true,
        availableTimes: true,
        homeTech: true,
      },
    });

    const jobs = new Map<string, number>();
    const mahallas = new Map<string, number>();
    const grades = new Map<string, number>();
    const subjects = new Map<string, number>();
    const categories = new Map<string, number>();
    const inspirations = new Map<string, number>();
    const abroad = new Map<string, number>();
    const schools = new Map<string, number>();
    const clubs = new Map<string, number>();

    /** Mahalla -> (yo'nalish -> son) — tavsiyalar uchun */
    const mahallaCategories = new Map<string, Map<string, number>>();
    /** Mahalla -> {qiz, o'g'il} */
    const mahallaGender = new Map<string, { girls: number; boys: number }>();
    /** Yo'nalish -> {qiz, o'g'il} */
    const categoryGender = new Map<string, { ogil: number; qiz: number }>();

    /** Maktab -> (kasb -> son) */
    const schoolJobs = new Map<string, Map<string, number>>();
    /** Kasb -> {o'g'il, qiz} */
    const genderJobs = new Map<string, { ogil: number; qiz: number }>();

    let girls = 0;
    let boys = 0;

    for (const row of rows) {
      // Orzu kasb faqat 10-11-sinfda so'raladi — kichik sinflarda
      // bo'sh bo'ladi va kasb statistikasiga qo'shilmaydi
      const dreamJob = row.dreamJob;
      const jobCategory = row.jobCategory;
      const isGirl = row.gender === 'Qiz bola';
      if (isGirl) girls += 1;
      else boys += 1;

      if (dreamJob) inc(jobs, dreamJob);
      inc(mahallas, row.mahalla);
      inc(schools, row.school);
      inc(grades, `${row.grade}-sinf`);
      if (jobCategory) inc(categories, jobCategory);
      if (row.inspiration) inc(inspirations, row.inspiration);
      if (row.studyAbroad) inc(abroad, row.studyAbroad);
      for (const subject of row.favoriteSubjects) inc(subjects, subject);
      for (const club of row.clubs) inc(clubs, club);

      // Mahalla kesimidagi yo'nalishlar va jins nisbati
      let catMap = mahallaCategories.get(row.mahalla);
      if (!catMap) {
        catMap = new Map<string, number>();
        mahallaCategories.set(row.mahalla, catMap);
      }
      if (jobCategory) inc(catMap, jobCategory);

      const mg = mahallaGender.get(row.mahalla) ?? { girls: 0, boys: 0 };
      if (isGirl) mg.girls += 1;
      else mg.boys += 1;
      mahallaGender.set(row.mahalla, mg);

      if (jobCategory) {
        const cg = categoryGender.get(jobCategory) ?? { ogil: 0, qiz: 0 };
        if (isGirl) cg.qiz += 1;
        else cg.ogil += 1;
        categoryGender.set(jobCategory, cg);
      }

      // Maktab bo'yicha kasblar
      let jobMap = schoolJobs.get(row.school);
      if (!jobMap) {
        jobMap = new Map<string, number>();
        schoolJobs.set(row.school, jobMap);
      }
      if (dreamJob) inc(jobMap, dreamJob);

      // Jins bo'yicha kasblar
      if (dreamJob) {
        const gj = genderJobs.get(dreamJob) ?? { ogil: 0, qiz: 0 };
        if (isGirl) gj.qiz += 1;
        else gj.ogil += 1;
        genderJobs.set(dreamJob, gj);
      }
    }

    const total = rows.length;
    const topJobs = toSorted(jobs, 10);

    // Jins bo'yicha taqqoslash — eng ommabop 8 ta kasb kesimida
    const genderJobStats = toSorted(jobs, 8).map((job) => {
      const gj = genderJobs.get(job.name) ?? { ogil: 0, qiz: 0 };
      return { name: job.name, ogil: gj.ogil, qiz: gj.qiz };
    });

    // Har bir maktabdagi eng ommabop kasb
    // Diqqat: maktabda faqat 5-9-sinf o'quvchisi bo'lsa, kasblar ro'yxati
    // bo'sh bo'ladi (ularga orzu kasb savoli berilmaydi) — bunday maktab
    // jadvalga umuman qo'shilmaydi
    const bySchool: SchoolTopJob[] = Array.from(schoolJobs.entries())
      .filter(([, jobMap]) => jobMap.size > 0)
      .map(([school, jobMap]) => {
        const [topJob, topJobCount] = Array.from(jobMap.entries()).sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
        )[0];
        return {
          school,
          total: schools.get(school) ?? 0,
          topJob,
          topJobCount,
          topJobIcon: KASB_ICON_MAP[topJob] ?? '⭐',
        };
      })
      .sort(
        (a, b) =>
          b.total - a.total ||
          // "12-maktab" kabi nomlarni raqami bo'yicha tartiblaymiz
          (parseInt(a.school, 10) || 0) - (parseInt(b.school, 10) || 0)
      );

    // Mahalla kesimidagi tahlil — tavsiyalar shu asosda quriladi
    // Xuddi shunday: yo'nalish javobi yo'q mahalla tahlilga kirmaydi
    const mahallaInsights: MahallaInsight[] = Array.from(mahallaCategories.entries())
      .filter(([, catMap]) => catMap.size > 0)
      .map(([mahalla, catMap]) => {
        const [topCategory, topCategoryCount] = Array.from(catMap.entries()).sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
        )[0];
        const mahallaTotal = mahallas.get(mahalla) ?? 0;
        const gender = mahallaGender.get(mahalla) ?? { girls: 0, boys: 0 };
        return {
          mahalla,
          total: mahallaTotal,
          topCategory,
          topCategoryCount,
          topCategoryShare: percent(topCategoryCount, mahallaTotal),
          girls: gender.girls,
          boys: gender.boys,
        };
      })
      .sort((a, b) => b.total - a.total);

    // Yo'nalishlar jins kesimida
    const categoryGenderStats = toSorted(categories).map((c) => {
      const cg = categoryGender.get(c.name) ?? { ogil: 0, qiz: 0 };
      return { name: c.name, ogil: cg.ogil, qiz: cg.qiz };
    });

    // Sinflarni 5 dan 11 gacha tabiiy tartibda chiqaramiz
    const byGrade = toSorted(grades).sort(
      (a, b) => parseInt(a.name, 10) - parseInt(b.name, 10)
    );

    const stats: DashboardStats = {
      kpi: {
        totalStudents: total,
        totalSchools: schools.size,
        totalMahallas: mahallas.size,
        girlsCount: girls,
        boysCount: boys,
        girlsPercent: percent(girls, total),
        boysPercent: percent(boys, total),
        totalAll: total,
      },
      topJobs,
      genderJobs: genderJobStats,
      byMahalla: toSorted(mahallas),
      bySchool,
      byGrade,
      bySubject: toSorted(subjects),
      byCategory: toSorted(categories),
      byInspiration: toSorted(inspirations),
      studyAbroad: toSorted(abroad),
      byClub: toSorted(clubs),
      mahallaInsights,
      categoryGender: categoryGenderStats,
      centerPlan: buildCenterPlan(rows),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[GET /api/stats]', error);
    return NextResponse.json({ message: 'Statistikani hisoblab bo\'lmadi' }, { status: 500 });
  }
}
