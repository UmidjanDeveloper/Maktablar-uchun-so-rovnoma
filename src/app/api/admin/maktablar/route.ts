import type { NextRequest } from 'next/server';
import { listCatalog, createCatalogItem } from '@/lib/catalog-crud';

export const dynamic = 'force-dynamic';

/** GET /api/admin/maktablar — maktablar ro'yxati */
export async function GET() {
  return listCatalog('school');
}

/** POST /api/admin/maktablar — yangi maktab qo'shish */
export async function POST(request: NextRequest) {
  return createCatalogItem('school', request);
}
