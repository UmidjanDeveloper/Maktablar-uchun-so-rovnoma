'use client';

import { motion } from 'framer-motion';
import { GraduationCap, School, MapPin, User, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/types';

interface KpiCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
}

/** Yuqoridagi asosiy ko'rsatkichlar (KPI) kartochkalari */
export function KpiCards({ stats, loading }: KpiCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px]" />
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
      color: 'text-brand-600',
      bg: 'bg-brand-50',
    },
    {
      label: 'Jami maktablar',
      value: stats.kpi.totalSchools,
      hint: 'Qamrab olingan',
      icon: School,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Jami mahallalar',
      value: stats.kpi.totalMahallas,
      hint: 'Qamrab olingan',
      icon: MapPin,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      label: 'Qizlar',
      value: `${stats.kpi.girlsPercent}%`,
      hint: `${stats.kpi.girlsCount} ta o'quvchi`,
      icon: User,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      label: "O'g'il bolalar",
      value: `${stats.kpi.boysPercent}%`,
      hint: `${stats.kpi.boysCount} ta o'quvchi`,
      icon: Users,
      color: 'text-brand-600',
      bg: 'bg-brand-50',
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
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{card.hint}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
