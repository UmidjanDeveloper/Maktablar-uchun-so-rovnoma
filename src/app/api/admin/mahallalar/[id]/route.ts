import type { NextRequest } from 'next/server';
import { updateCatalogItem, deleteCatalogItem } from '@/lib/catalog-crud';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/mahallalar/[id] — mahalla nomini o'zgartirish */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return updateCatalogItem('mahalla', params.id, request);
}

/** DELETE /api/admin/mahallalar/[id] — mahallani o'chirish */
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  return deleteCatalogItem('mahalla', params.id);
}
