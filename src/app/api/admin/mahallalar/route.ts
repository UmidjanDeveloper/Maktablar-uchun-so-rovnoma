import type { NextRequest } from 'next/server';
import { listCatalog, createCatalogItem } from '@/lib/catalog-crud';

export const dynamic = 'force-dynamic';

/** GET /api/admin/mahallalar — mahallalar ro'yxati */
export async function GET() {
  return listCatalog('mahalla');
}

/** POST /api/admin/mahallalar — yangi mahalla qo'shish */
export async function POST(request: NextRequest) {
  return createCatalogItem('mahalla', request);
}
