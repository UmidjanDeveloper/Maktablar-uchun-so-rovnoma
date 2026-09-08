/**
 * ============================================================
 *  Kataloglar (Mahalla / Maktab) uchun umumiy CRUD yordamchisi.
 *  Ikkala model ham bir xil tuzilishga ega, shuning uchun
 *  kod takrorlanmasligi uchun bitta joyda yozilgan.
 * ============================================================
 */
import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { catalogItemSchema, fieldErrors } from '@/lib/validation';
import { requireAdmin } from '@/lib/api-auth';
import { sortSchools } from '@/lib/utils';

type CatalogModel = 'mahalla' | 'school';

/** Model uchun o'zbekcha nom (xato xabarlarida ishlatiladi) */
const LABELS: Record<CatalogModel, string> = {
  mahalla: 'Mahalla',
  school: 'Maktab',
};

/** Katalog yozuvi — ikkala model uchun ham bir xil tuzilish */
interface CatalogRow {
  id: string;
  name: string;
  createdAt: Date;
}

/**
 * Mahalla va School delegatlarining umumiy qismi.
 * Prisma har bir model uchun alohida tip yaratgani sababli, ikkalasiga
 * mos keladigan minimal interfeys orqali ishlaymiz.
 */
interface CatalogDelegate {
  findMany(args?: { orderBy?: { createdAt: 'asc' | 'desc' } }): Promise<CatalogRow[]>;
  create(args: { data: { name: string } }): Promise<CatalogRow>;
  update(args: { where: { id: string }; data: { name: string } }): Promise<CatalogRow>;
  delete(args: { where: { id: string } }): Promise<CatalogRow>;
}

/** Prisma delegatini model nomiga qarab tanlaydi */
function delegate(model: CatalogModel): CatalogDelegate {
  return (model === 'mahalla' ? prisma.mahalla : prisma.school) as unknown as CatalogDelegate;
}

/** GET — ro'yxatni qaytaradi */
export async function listCatalog(model: CatalogModel) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const items = await delegate(model).findMany({ orderBy: { createdAt: 'asc' } });
    // Maktablarni raqami bo'yicha, mahallalarni alifbo bo'yicha tartiblaymiz
    const sorted =
      model === 'school'
        ? sortSchools(items, (i) => i.name)
        : [...items].sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ items: sorted });
  } catch (error) {
    console.error(`[GET catalog:${model}]`, error);
    return NextResponse.json({ message: "Ro'yxatni yuklab bo'lmadi" }, { status: 500 });
  }
}

/** POST — yangi yozuv qo'shadi */
export async function createCatalogItem(model: CatalogModel, request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  const parsed = catalogItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ma'lumotlarda xatolik bor", errors: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  try {
    const item = await delegate(model).create({ data: { name: parsed.data.name } });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { message: `${LABELS[model]} allaqachon ro'yxatda bor` },
        { status: 409 }
      );
    }
    console.error(`[POST catalog:${model}]`, error);
    return NextResponse.json({ message: "Saqlab bo'lmadi" }, { status: 500 });
  }
}

/**
 * Katalogdagi nom o'zgarganda anketalarni ham ko'chiradi.
 *
 * `Student.school` va `Student.mahalla` — nomning NUSXASI, chet el
 * kaliti emas (anketa ro'yxatdan tashqari nom yozishga ham ruxsat
 * beradi). Shu sababli katalogda nom o'zgartirilsa, eski anketalar
 * eski nom bilan qolib ketardi va ular:
 *   - «Maktablar qamrovi» panelida "to'ldirmagan" bo'lib ko'rinardi,
 *   - eski nom esa "ro'yxatda yo'q" qatorida chiqardi.
 * Ya'ni hokim aslida ishlagan maktabdan hisobot so'rab qolardi.
 */
async function renameStudents(
  tx: Prisma.TransactionClient,
  model: CatalogModel,
  from: string,
  to: string
): Promise<number> {
  if (from === to) return 0;
  const result =
    model === 'school'
      ? await tx.student.updateMany({ where: { school: from }, data: { school: to } })
      : await tx.student.updateMany({ where: { mahalla: from }, data: { mahalla: to } });
  return result.count;
}

/** Katalog yozuvi ishlatilgan anketalar soni */
async function countStudents(model: CatalogModel, name: string): Promise<number> {
  return model === 'school'
    ? prisma.student.count({ where: { school: name } })
    : prisma.student.count({ where: { mahalla: name } });
}

/** PATCH — nomni o'zgartiradi */
export async function updateCatalogItem(model: CatalogModel, id: string, request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "So'rov formati noto'g'ri" }, { status: 400 });
  }

  const parsed = catalogItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Ma'lumotlarda xatolik bor", errors: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  try {
    /*
     * Katalog yozuvi va anketalar BIR TRANZAKSIYADA yangilanadi:
     * biri o'tib, ikkinchisi o'tmay qolsa, ma'lumot ikkiga bo'linib
     * ketardi va uni qo'lda tuzatish kerak bo'lardi.
     */
    const { item, moved } = await prisma.$transaction(async (tx) => {
      const current =
        model === 'school'
          ? await tx.school.findUnique({ where: { id } })
          : await tx.mahalla.findUnique({ where: { id } });

      if (!current) throw new Prisma.PrismaClientKnownRequestError('not found', {
        code: 'P2025',
        clientVersion: Prisma.prismaVersion.client,
      });

      const updated =
        model === 'school'
          ? await tx.school.update({ where: { id }, data: { name: parsed.data.name } })
          : await tx.mahalla.update({ where: { id }, data: { name: parsed.data.name } });

      const count = await renameStudents(tx, model, current.name, parsed.data.name);
      return { item: updated, moved: count };
    });

    return NextResponse.json({ item, moved });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: `Bunday nomli ${LABELS[model].toLowerCase()} allaqachon mavjud` },
          { status: 409 }
        );
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Yozuv topilmadi' }, { status: 404 });
      }
    }
    console.error(`[PATCH catalog:${model}]`, error);
    return NextResponse.json({ message: "O'zgartirib bo'lmadi" }, { status: 500 });
  }
}

/** DELETE — yozuvni o'chiradi */
export async function deleteCatalogItem(model: CatalogModel, id: string) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    /*
     * Anketasi bor yozuvni o'chirishga yo'l qo'ymaymiz. O'chirilsa,
     * anketalar "ro'yxatda yo'q" holatiga tushib qolardi va qamrov
     * hisoboti noto'g'ri bo'lardi. Bunday holatda admin avval
     * nomni to'g'rilashi kerak.
     */
    const current =
      model === 'school'
        ? await prisma.school.findUnique({ where: { id } })
        : await prisma.mahalla.findUnique({ where: { id } });

    if (!current) {
      return NextResponse.json({ message: 'Yozuv topilmadi' }, { status: 404 });
    }

    const used = await countStudents(model, current.name);
    if (used > 0) {
      return NextResponse.json(
        {
          message:
            `Bu ${LABELS[model].toLowerCase()} bo'yicha ${used} ta anketa bor — o'chirib bo'lmaydi. ` +
            `Nomi noto'g'ri bo'lsa, o'chirmasdan tahrirlang: anketalar ham avtomatik ko'chadi.`,
          used,
        },
        { status: 409 }
      );
    }

    await delegate(model).delete({ where: { id } });
    return NextResponse.json({ message: "O'chirildi" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: 'Yozuv topilmadi' }, { status: 404 });
    }
    console.error(`[DELETE catalog:${model}]`, error);
    return NextResponse.json({ message: "O'chirib bo'lmadi" }, { status: 500 });
  }
}
