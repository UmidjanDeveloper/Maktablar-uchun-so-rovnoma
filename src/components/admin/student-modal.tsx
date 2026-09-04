'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { KASB_ICON_MAP } from '@/lib/constants';
import { formatDate, formatPhone, initials } from '@/lib/utils';
import type { StudentRecord } from '@/types';

interface StudentModalProps {
  student: StudentRecord | null;
  onClose: () => void;
}

/** Ma'lumot qatori */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="w-44 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}

/** Anketa tafsilotlari oynasi — jadvaldagi qatorni bosganda ochiladi */
export function StudentModal({ student, onClose }: StudentModalProps) {
  if (!student) return null;

  const isGirl = student.gender === 'Qiz bola';

  return (
    <Dialog open={!!student} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-4 pr-8">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold ${
                isGirl ? 'bg-pink-50 text-pink-700' : 'bg-brand-50 text-brand-700'
              }`}
            >
              {initials(student.firstName, student.lastName)}
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate">
                {student.firstName} {student.lastName}
              </DialogTitle>
              <DialogDescription className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant={isGirl ? 'pink' : 'default'}>{student.gender}</Badge>
                <Badge variant="secondary">{student.grade}-sinf</Badge>
                <Badge variant="outline">{student.school}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Orzu kasb */}
        <div className="flex items-center gap-4 rounded-2xl border-2 border-brand-100 bg-brand-50 p-4">
          <span className="text-4xl leading-none" aria-hidden="true">
            {KASB_ICON_MAP[student.dreamJob] ?? '⭐'}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Orzu qilgan kasbi
            </p>
            <p className="text-lg font-bold text-brand-900">{student.dreamJob}</p>
            <p className="text-xs text-brand-700">{student.jobCategory}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Row label="Mahalla" value={student.mahalla} />
          <Row label="Hudud" value={`${student.district} tumani, ${student.region} viloyati`} />
          <Row
            label="Yoqtirgan fanlar"
            value={
              student.favoriteSubjects.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {student.favoriteSubjects.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </span>
              ) : (
                '—'
              )
            }
          />
          <Row
            label="To'garaklar"
            value={
              student.clubs.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {student.clubs.map((c) => (
                    <Badge key={c} variant="outline">
                      {c}
                    </Badge>
                  ))}
                </span>
              ) : (
                '—'
              )
            }
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <Row label="Kasb tanlash sababi" value={student.motivation || '—'} />
          <Row label="Ilhomlantirgan" value={student.inspiration || '—'} />
          <Row label="Chet elda o'qish" value={student.studyAbroad || '—'} />
          <Row label="Mahalla uchun rejasi" value={student.futureContribution || '—'} />
        </div>

        <Separator />

        <div className="space-y-3">
          <Row label="Telefon" value={formatPhone(student.phone)} />
          <Row label="Ota-ona telefoni" value={formatPhone(student.parentPhone)} />
          <Row label="To'ldirilgan sana" value={formatDate(student.createdAt)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
