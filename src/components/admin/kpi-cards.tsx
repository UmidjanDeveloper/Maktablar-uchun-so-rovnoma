'use client';

import { motion } from 'framer-motion';
import { GraduationCap, School, MapPin, User, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/types';

interface KpiCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

/**
 * Yuqoridagi asosiy ko'rsatkichlar (KPI) kartochkalari.
 *
 * Raqamlar monospace shriftda — bir necha kartochka yonma-yon turganda
 * raqamlar bir xil kenglikda bo'ladi va ko'z ular orasida "sakramaydi".
 * Bu boshqaruv paneliga xos uslub: raqam birinchi, bezak keyin.
 */
export function KpiCards({ stats, loading }: KpiCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[112px]" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Jami o'quvchilar",
      value: stats.kpi.totalStudents.toLocaleString('uz-UZ'),
      hint: 'Topshirilgan anketalar',
      icon: GraduationCap,
      tone: 'var(--accent)',
    },
    {
      label: 'Jami maktablar',
      value: stats.kpi.totalSchools,
      hint: 'Qamrab olingan',
      icon: School,
      tone: 'var(--accent-2)',
    },
    {
      label: 'Jami mahallalar',
      value: stats.kpi.totalMahallas,
      hint: 'Qamrab olingan',
      icon: MapPin,
      tone: 'var(--accent-3)',
    },
    {
      label: 'Qizlar',
      value: `${stats.kpi.girlsPercent}%`,
      hint: `${stats.kpi.girlsCount} ta o'quvchi`,
      icon: User,
      tone: 'var(--accent-3)',
    },
    {
      label: "O'g'il bolalar",
      value: `${stats.kpi.boysPercent}%`,
      hint: `${stats.kpi.boysCount} ta o'quvchi`,
      icon: Users,
      tone: 'var(--accent)',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="glass relative overflow-hidden rounded-lg p-4"
          >
            {/* Yuqori chekkadagi rangli chiziq — kartochkalarni farqlaydi */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${card.tone}, transparent)` }}
            />

            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {card.label}
              </p>
              <Icon className="h-4 w-4 shrink-0" style={{ color: card.tone }} strokeWidth={1.9} />
            </div>

            <p className="mt-2 font-mono text-[28px] font-semibold leading-none tabular-nums text-ink sm:text-3xl">
              {card.value}
            </p>
            <p className="mt-1.5 text-[11px] text-ink-faint">{card.hint}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
