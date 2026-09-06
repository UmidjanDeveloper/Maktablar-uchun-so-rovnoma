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
import { EntityIcon } from '@/lib/icons';
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
      <span className="w-44 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <span className="text-sm text-ink-muted">{value}</span>
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
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border font-mono text-lg font-semibold"
              style={{
                borderColor: isGirl
                  ? 'color-mix(in srgb, var(--accent-3) 45%, transparent)'
                  : 'color-mix(in srgb, var(--accent) 45%, transparent)',
                backgroundColor: isGirl
                  ? 'color-mix(in srgb, var(--accent-3) 14%, transparent)'
                  : 'color-mix(in srgb, var(--accent) 14%, transparent)',
                color: isGirl ? 'var(--accent-3)' : 'var(--accent)',
              }}
            >
              {initials(student.firstName, student.lastName)}
            </div>
            <div className="min-w-0">
              <DialogTitle className="truncate">
                {student.firstName} {student.lastName}
              </DialogTitle>
              <DialogDescription className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge variant={isGirl ? 'pink' : 'default'}>{student.gender}</Badge>
                <Badge variant="secondary">{student.grade}-sinf</Badge>
                <Badge variant="outline">{student.school}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Orzu kasb — oynadagi eng muhim ma'lumot */}
        <div className="flex items-center gap-4 rounded-md border border-accent/35 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-accent">
            <EntityIcon name={student.dreamJob} className="h-6 w-6" strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              Orzu qilgan kasbi
            </p>
            <p className="font-display text-lg font-semibold leading-tight text-ink">
              {student.dreamJob}
            </p>
            <p className="text-xs text-ink-faint">{student.jobCategory}</p>
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

        {/* Ta'lim markazi savollari — markaz ochish qarori uchun */}
        <div className="space-y-3">
          <Row
            label="Qanday kurs kerak"
            value={
              student.wantedCourses.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {student.wantedCourses.map((c) => (
                    <Badge key={c} variant="default">
                      {c}
                    </Badge>
                  ))}
                </span>
              ) : (
                '—'
              )
            }
          />
          <Row
            label="Qaysi til"
            value={
              student.wantedLanguages.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {student.wantedLanguages.map((l) => (
                    <Badge key={l} variant="secondary">
                      {l}
                    </Badge>
                  ))}
                </span>
              ) : (
                '—'
              )
            }
          />
          <Row label="Qancha yo'l yuradi" value={student.travelWillingness || '—'} />
          <Row
            label="Hozirgi to'siqlar"
            value={
              student.barriers.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {student.barriers.map((b) => (
                    <Badge key={b} variant="outline">
                      {b}
                    </Badge>
                  ))}
                </span>
              ) : (
                '—'
              )
            }
          />
          <Row
            label="Qachon qatnasha oladi"
            value={student.availableTimes.length ? student.availableTimes.join(', ') : '—'}
          />
          <Row label="Uydagi texnika" value={student.homeTech || '—'} />
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
          <Row
            label="Telefon"
            value={<span className="font-mono tabular-nums">{formatPhone(student.phone)}</span>}
          />
          <Row
            label="Ota-ona telefoni"
            value={
              <span className="font-mono tabular-nums">{formatPhone(student.parentPhone)}</span>
            }
          />
          <Row
            label="To'ldirilgan sana"
            value={<span className="font-mono tabular-nums">{formatDate(student.createdAt)}</span>}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
