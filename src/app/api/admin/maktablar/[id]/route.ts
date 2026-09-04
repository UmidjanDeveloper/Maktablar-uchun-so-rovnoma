import type { NextRequest } from 'next/server';
import { updateCatalogItem, deleteCatalogItem } from '@/lib/catalog-crud';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/maktablar/[id] — maktab nomini o'zgartirish */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return updateCatalogItem('school', params.id, request);
}

/** DELETE /api/admin/maktablar/[id] — maktabni o'chirish */
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  return deleteCatalogItem('school', params.id);
}
