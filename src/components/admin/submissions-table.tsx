'use client';

import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EntityIcon } from '@/lib/icons';
import { formatDate } from '@/lib/utils';
import type { PaginatedStudents, StudentRecord } from '@/types';

interface SubmissionsTableProps {
  data: PaginatedStudents | null;
  loading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSelect: (student: StudentRecord) => void;
}

/** Oxirgi anketalar jadvali: qidiruv, sahifalash va tafsilotlar oynasi */
export function SubmissionsTable({
  data,
  loading,
  search,
  onSearchChange,
  onPageChange,
  onSelect,
}: SubmissionsTableProps) {
  const page = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  return (
    <section className="glass rounded-lg">
      <header className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight text-ink">
            Oxirgi anketalar
          </h3>
          <p className="mt-0.5 text-xs text-ink-faint">
            {data ? `Jami ${data.total.toLocaleString('uz-UZ')} ta yozuv` : 'Yuklanmoqda...'}
            {' · '}Batafsil ko&apos;rish uchun qatorni bosing
          </p>
        </div>

        <div className="relative w-full sm:w-72 no-print">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ism, kasb, maktab bo'yicha qidirish"
            className="h-10 pl-10 text-sm"
            aria-label="Anketalar ichidan qidirish"
          />
        </div>
      </header>

      <div className="border-t border-line">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>O&apos;quvchi</TableHead>
              <TableHead className="w-20">Jins</TableHead>
              <TableHead className="w-16">Sinf</TableHead>
              <TableHead>Maktab</TableHead>
              <TableHead>Mahalla</TableHead>
              <TableHead>Orzu kasb</TableHead>
              <TableHead className="w-40">Sana</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-ink-faint">
                  Tanlangan shartlarga mos anketa topilmadi
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              data?.items.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => onSelect(student)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(student);
                    }
                  }}
                  className="cursor-pointer focus-visible:bg-surface-strong focus-visible:outline-none"
                >
                  <TableCell className="font-semibold">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.gender === 'Qiz bola' ? 'pink' : 'default'}>
                      {student.gender === 'Qiz bola' ? 'Qiz' : "O'g'il"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono tabular-nums text-ink-muted">{student.grade}</TableCell>
                  <TableCell className="text-ink-muted">{student.school}</TableCell>
                  <TableCell className="text-ink-muted">{student.mahalla}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <EntityIcon
                        name={student.dreamJob}
                        className="h-4 w-4 shrink-0 text-accent"
                      />
                      {student.dreamJob}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-[11px] tabular-nums text-ink-faint">
                    {formatDate(student.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Sahifalash */}
      <footer className="flex items-center justify-between gap-3 border-t border-line p-4 no-print">
        <p className="font-mono text-xs tabular-nums text-ink-faint">
          {page}-sahifa / {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Oldingi
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
          >
            Keyingi
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </section>
  );
}
