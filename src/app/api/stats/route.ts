import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildWhere, parseFilters } from '@/lib/filters';
import { requireAdmin } from '@/lib/api-auth';
import { percent, searchKey } from '@/lib/utils';
import { KASB_ICON_MAP } from '@/lib/constants';
import { buildCenterPlan } from '@/lib/center-planning';
import { YORDAM_TOSIQLARI } from '@/lib/constants';
import type {
  AreaDemand,
  CoverageStats,
  SchoolCoverage,
  DashboardStats,
  MahallaInsight,
  NameValue,
  SchoolTopJob,
} from '@/types';

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
 * Bitta hudud ichidagi sanoqlar.
 * Mahalla va maktab uchun bir xil tuzilma ishlatiladi.
 */
interface AreaBuckets {
  total: number;
  jobs: Map<string, number>;
  categories: Map<string, number>;
  subjects: Map<string, number>;
  courses: Map<string, number>;
}

function areaBuckets(map: Map<string, AreaBuckets>, key: string): AreaBuckets {
  let cell = map.get(key);
  if (!cell) {
    cell = {
      total: 0,
      jobs: new Map(),
      categories: new Map(),
      subjects: new Map(),
      courses: new Map(),
    };
    map.set(key, cell);
  }
  return cell;
}

/** Xaritadagi eng katta yozuv (teng bo'lsa alifbo bo'yicha) */
function topEntry(map: Map<string, number>): [string, number] | null {
  if (map.size === 0) return null;
  return Array.from(map.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  )[0];
}

/** Hudud sanoqlarini hisobot qatoriga aylantiradi */
function toAreaDemand(map: Map<string, AreaBuckets>, limit: number): AreaDemand[] {
  return Array.from(map.entries())
    .map(([name, b]) => {
      const job = topEntry(b.jobs);
      const category = topEntry(b.categories);
      const subject = topEntry(b.subjects);
      const course = topEntry(b.courses);
      return {
        name,
        total: b.total,
        topJob: job?.[0] ?? null,
        topJobCount: job?.[1] ?? 0,
        topCategory: category?.[0] ?? null,
        topCategoryCount: category?.[1] ?? 0,
        topSubject: subject?.[0] ?? null,
        topSubjectCount: subject?.[1] ?? 0,
        topCourse: course?.[0] ?? null,
        topCourseCount: course?.[1] ?? 0,
      };
    })
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/**
 * So'rovnoma qamrovini hisoblaydi.
 *
 * DIQQAT: bu yerda filtrlar ATAYLAB ishlatilmaydi. "Qaysi maktab
 * umuman to'ldirmadi" degan savolga javob butun tuman bo'yicha
 * bo'lishi kerak — aks holda, masalan, 9-sinf filtri qo'yilganda
 * faqat kichik sinflari bor maktab ham "to'ldirmagan" bo'lib
 * ko'rinardi va maktabga noo'rin tanbeh berilardi.
 */
async function buildCoverage(): Promise<CoverageStats> {
  const [schoolCatalog, mahallaCatalog, schoolGroups, mahallaGroups] = await Promise.all([
    prisma.school.findMany({ select: { name: true } }),
    prisma.mahalla.findMany({ select: { name: true } }),
    prisma.student.groupBy({
      by: ['school'],
      _count: { _all: true },
      _max: { createdAt: true },
    }),
    prisma.student.groupBy({ by: ['mahalla'], _count: { _all: true } }),
  ]);

  /*
   * Anketadagi nom bilan katalogdagi nom apostrof yoki defis bilan
   * farq qilishi mumkin ("Bog'ishamol" / "Bogʻishamol"). Solishtirish
   * normallashtirilgan kalit bo'yicha ketadi, aks holda bir xil
   * maktab ikki marta sanalardi.
   */
  const schoolByKey = new Map<string, string>();
  for (const s of schoolCatalog) schoolByKey.set(searchKey(s.name), s.name);

  const counts = new Map<string, { count: number; lastAt: Date | null }>();
  const extra: SchoolCoverage[] = [];

  for (const group of schoolGroups) {
    const name = schoolByKey.get(searchKey(group.school));
    const count = group._count._all;
    const lastAt = group._max.createdAt;

    if (name) {
      const cell = counts.get(name) ?? { count: 0, lastAt: null };
      cell.count += count;
      if (lastAt && (!cell.lastAt || lastAt > cell.lastAt)) cell.lastAt = lastAt;
      counts.set(name, cell);
    } else {
      extra.push({
        name: group.school,
        count,
        lastAt: lastAt?.toISOString() ?? null,
        inCatalog: false,
      });
    }
  }

  const schools: SchoolCoverage[] = schoolCatalog
    .map((s) => {
      const cell = counts.get(s.name);
      return {
        name: s.name,
        count: cell?.count ?? 0,
        lastAt: cell?.lastAt?.toISOString() ?? null,
        inCatalog: true,
      };
    })
    .concat(extra)
    // Ko'pdan ozga; teng bo'lsa nom bo'yicha
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const mahallaKeys = new Set(mahallaGroups.map((g) => searchKey(g.mahalla)));
  const silentMahallas = mahallaCatalog
    .filter((m) => !mahallaKeys.has(searchKey(m.name)))
    .map((m) => m.name)
    .sort((a, b) => a.localeCompare(b));

  const active = schools.filter((s) => s.inCatalog && s.count > 0).length;

  return {
    totalSchools: schoolCatalog.length,
    activeSchools: active,
    silentSchools: schoolCatalog.length - active,
    totalStudents: schoolGroups.reduce((sum, g) => sum + g._count._all, 0),
    schools,
    totalMahallas: mahallaCatalog.length,
    silentMahallas,
  };
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
        helpResolved: true,
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
    /** Mahalla va maktab kesimidagi to'liq talab (kasb + fan + kurs) */
    const mahallaDemand = new Map<string, AreaBuckets>();
    const schoolDemand = new Map<string, AreaBuckets>();
    /** Kasb -> {o'g'il, qiz} */
    const genderJobs = new Map<string, { ogil: number; qiz: number }>();

    let girls = 0;
    let boys = 0;

    for (const row of rows) {
      // Orzu kasb faqat 9-11-sinfda so'raladi — kichik sinflarda
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

      // Mahalla va maktab kesimidagi talab
      for (const cell of [
        areaBuckets(mahallaDemand, row.mahalla),
        areaBuckets(schoolDemand, row.school),
      ]) {
        cell.total += 1;
        if (dreamJob) inc(cell.jobs, dreamJob);
        if (jobCategory) inc(cell.categories, jobCategory);
        for (const subject of row.favoriteSubjects) inc(cell.subjects, subject);
        for (const course of row.wantedCourses) inc(cell.courses, course);
      }

      // Jins bo'yicha kasblar
      if (dreamJob) {
        const gj = genderJobs.get(dreamJob) ?? { ogil: 0, qiz: 0 };
        if (isGirl) gj.qiz += 1;
        else gj.ogil += 1;
        genderJobs.set(dreamJob, gj);
      }
    }

    const total = rows.length;
    // Kasb savoliga javob berganlar — foizlar uchun to'g'ri maxraj
    const withJob = rows.filter((r) => !!r.dreamJob).length;
    const topJobs = toSorted(jobs, 10);

    // Jins bo'yicha taqqoslash — eng ommabop 8 ta kasb kesimida
    const genderJobStats = toSorted(jobs, 8).map((job) => {
      const gj = genderJobs.get(job.name) ?? { ogil: 0, qiz: 0 };
      return { name: job.name, ogil: gj.ogil, qiz: gj.qiz };
    });

    // Har bir maktabdagi eng ommabop kasb
    // Diqqat: maktabda faqat 5-8-sinf o'quvchisi bo'lsa, kasblar ro'yxati
    // bo'sh bo'ladi (ularga orzu kasb savoli berilmaydi) — bunday maktab
    // jadvalga umuman qo'shilmaydi
    const bySchool: SchoolTopJob[] = Array.from(schoolJobs.entries())
      .filter(([, jobMap]) => jobMap.size > 0)
      .map(([school, jobMap]) => {
        const [topJob, topJobCount] = Array.from(jobMap.entries()).sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
        )[0];
        // Shu maktabda kasb savoliga javob berganlar soni
        const withJobHere = Array.from(jobMap.values()).reduce((sum, n) => sum + n, 0);
        return {
          school,
          total: schools.get(school) ?? 0,
          withJob: withJobHere,
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

    /*
     * Yordam bo'yicha bajarilgan ish.
     *
     * Diagrammalar «hozir qanday» degan savolga javob beradi, bu blok
     * esa «nima qilindi» degan savolga: hokim uchun hisobotdagi eng
     * muhim qator — nechta muammo aniqlandi va nechtasi yopildi.
     */
    const yordamRows = rows.filter((r) => r.barriers.length > 0);
    const aralashuvRows = yordamRows.filter((r) =>
      r.barriers.some((b) => (YORDAM_TOSIQLARI as readonly string[]).includes(b))
    );
    const barrierStats = new Map<string, { count: number; resolved: number }>();
    for (const r of yordamRows) {
      for (const b of r.barriers) {
        const cell = barrierStats.get(b) ?? { count: 0, resolved: 0 };
        cell.count += 1;
        if (r.helpResolved) cell.resolved += 1;
        barrierStats.set(b, cell);
      }
    }
    const helpStats = {
      withBarriers: yordamRows.length,
      needHelp: aralashuvRows.length,
      resolved: aralashuvRows.filter((r) => r.helpResolved).length,
      pending: aralashuvRows.filter((r) => !r.helpResolved).length,
      byBarrier: Array.from(barrierStats.entries())
        .map(([name, v]) => ({ name, count: v.count, resolved: v.resolved }))
        .sort((a, b) => b.count - a.count),
    };

    const coverage = await buildCoverage();

    const stats: DashboardStats = {
      kpi: {
        totalStudents: total,
        totalSchools: schools.size,
        totalMahallas: mahallas.size,
        girlsCount: girls,
        boysCount: boys,
        girlsPercent: percent(girls, total),
        // Ikki foiz yig'indisi doim 100 bo'lishi kerak: alohida
        // yaxlitlansa 51% + 50% = 101% chiqib qolardi
        boysPercent: total ? 100 - percent(girls, total) : 0,
        withJob,
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
      help: helpStats,
      /*
       * Chegara ataylab keng: hisobotda faqat eng faol 15-20 tasi
       * chiqadi, lekin "yana nechta hudud bor" degan qatorni to'g'ri
       * yozish uchun to'liq son kerak. Tumanda ~70 mahalla va ~94
       * maktab bor, ya'ni javob hajmi baribir kichik qoladi.
       */
      demandByMahalla: toAreaDemand(mahallaDemand, 200),
      demandBySchool: toAreaDemand(schoolDemand, 200),
      coverage,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[GET /api/stats]', error);
    return NextResponse.json({ message: 'Statistikani hisoblab bo\'lmadi' }, { status: 500 });
  }
}
