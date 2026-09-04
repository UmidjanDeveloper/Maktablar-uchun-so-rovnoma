'use client';

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartShell, ChartTooltip } from './chart-shell';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  CHART_PRIMARY,
  GENDER_COLORS,
  KASB_KATEGORIYALARI,
  RAMP_AMBER,
  RAMP_BLUE,
} from '@/lib/constants';
import { percent, truncate } from '@/lib/utils';
import type { DashboardStats, NameValue } from '@/types';

/** O'qi va to'r chiziqlari uchun umumiy uslub — ular fonda qolishi kerak */
/** Yo'nalish nomiga qarab emoji topish uchun xarita */
const CATEGORY_ICONS: Record<string, string> = KASB_KATEGORIYALARI.reduce(
  (acc, c) => {
    acc[c.value] = c.icon;
    return acc;
  },
  {} as Record<string, string>
);

const AXIS_STYLE = {
  tick: { fill: '#64748b', fontSize: 11 },
  axisLine: { stroke: '#e2e8f0' },
  tickLine: false,
} as const;

/* ------------------------------------------------------------------ */
/* 1. TOP 10 KASBLAR — vertikal ustunli diagramma (bitta seriya)       */
/* ------------------------------------------------------------------ */
export function TopJobsChart({ data }: { data: NameValue[] }) {
  return (
    <ChartShell
      title="Top 10 kasblar"
      description="Eng ko'p tanlangan orzu kasblar"
      empty={data.length === 0}
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 16, right: 8, left: -18, bottom: 46 }}>
          <XAxis
            dataKey="name"
            {...AXIS_STYLE}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={70}
            tickFormatter={(value: string) => truncate(value, 16)}
          />
          <YAxis {...AXIS_STYLE} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar
            dataKey="value"
            name="O'quvchilar"
            fill={CHART_PRIMARY}
            radius={[4, 4, 0, 0]}
            maxBarSize={44}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 2. QIZLAR vs O'G'IL BOLALAR — guruhlangan ustunli diagramma         */
/* ------------------------------------------------------------------ */
export function GenderJobsChart({ data }: { data: DashboardStats['genderJobs'] }) {
  return (
    <ChartShell
      title="Qizlar va o'g'il bolalar tanlovi"
      description="Eng ommabop kasblar jins kesimida"
      empty={data.length === 0}
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 16, right: 8, left: -18, bottom: 46 }} barGap={2}>
          <XAxis
            dataKey="name"
            {...AXIS_STYLE}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={70}
            tickFormatter={(value: string) => truncate(value, 16)}
          />
          <YAxis {...AXIS_STYLE} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend
            verticalAlign="top"
            align="right"
            height={28}
            iconType="circle"
            iconSize={9}
            wrapperStyle={{ fontSize: 12, color: '#475569' }}
          />
          <Bar
            dataKey="ogil"
            name="O'g'il bolalar"
            fill={GENDER_COLORS["O'g'il bola"]}
            radius={[4, 4, 0, 0]}
            maxBarSize={22}
          />
          <Bar
            dataKey="qiz"
            name="Qizlar"
            fill={GENDER_COLORS['Qiz bola']}
            radius={[4, 4, 0, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 3. MAHALLALAR — gorizontal ustunli diagramma                        */
/* ------------------------------------------------------------------ */
export function MahallaChart({ data }: { data: NameValue[] }) {
  // Ro'yxat uzun bo'lgani uchun eng faol 15 tasini ko'rsatamiz
  const visible = data.slice(0, 15);

  return (
    <ChartShell
      title="Mahalla bo'yicha qiziqish"
      description={`Eng faol ${visible.length} ta mahalla (jami ${data.length} ta)`}
      empty={data.length === 0}
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={Math.max(280, visible.length * 26)}>
        <BarChart
          data={visible}
          layout="vertical"
          margin={{ top: 4, right: 28, left: 8, bottom: 4 }}
        >
          <XAxis type="number" {...AXIS_STYLE} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            {...AXIS_STYLE}
            width={104}
            interval={0}
            tickFormatter={(value: string) => truncate(value, 14)}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar
            dataKey="value"
            name="O'quvchilar"
            fill={CHART_PRIMARY}
            radius={[0, 4, 4, 0]}
            maxBarSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 4. MAKTABLAR — jadval                                               */
/* ------------------------------------------------------------------ */
export function SchoolTopJobsTable({ data }: { data: DashboardStats['bySchool'] }) {
  return (
    <ChartShell
      title="Maktab bo'yicha top kasb"
      description="Har bir maktabdagi eng ommabop tanlov"
      empty={data.length === 0}
      className="lg:col-span-2"
    >
      <div className="max-h-[360px] overflow-y-auto rounded-xl border border-slate-100">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead>Maktab</TableHead>
              <TableHead className="w-24 text-right">Anketa</TableHead>
              <TableHead>Eng ommabop kasb</TableHead>
              <TableHead className="w-24 text-right">Ulush</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.school}>
                <TableCell className="font-semibold text-slate-900">{row.school}</TableCell>
                <TableCell className="text-right tabular-nums">{row.total}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true">{row.topJobIcon}</span>
                    {row.topJob}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{percent(row.topJobCount, row.total)}%</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* Doiraviy diagrammalar uchun umumiy komponent                        */
/* ------------------------------------------------------------------ */
interface DonutProps {
  title: string;
  description: string;
  data: NameValue[];
  ramp: string[];
  unit?: string;
}

/**
 * Doiraviy (donut) diagramma.
 * Ranglar yorqinlik bo'yicha ketma-ket tanlangan — shu sababli rangni
 * ajrata olmaydigan foydalanuvchilar ham bo'laklarni farqlay oladi.
 * Har bir bo'lak yonida nomi va ulushi yozib qo'yiladi.
 */
function DonutChart({ title, description, data, ramp, unit = "o'quvchi" }: DonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartShell title={title} description={description} empty={data.length === 0}>
      {/* Diagramma tepada, ro'yxat pastda — kartochka tor bo'lgani uchun
          yonma-yon joylashuv nomlarni siqib qo'yardi. */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-[190px] w-[190px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={80}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={ramp[index % ramp.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip unit={unit} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ro'yxat — rang bilan birga nom va son ham ko'rsatiladi.
            Shu sababli bo'laklarni faqat rang orqali emas, nomi bo'yicha
            ham ajratish mumkin (rang ko'rmaslik holati uchun muhim). */}
        <ul className="w-full min-w-0 text-sm">
          {data.map((entry, index) => (
            <li key={entry.name} className="flex items-center gap-2 py-[3px]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: ramp[index % ramp.length] }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-slate-600">{entry.name}</span>
              <span className="shrink-0 font-bold tabular-nums text-slate-900">
                {entry.value}
              </span>
              <span className="w-11 shrink-0 text-right text-xs tabular-nums text-slate-400">
                {percent(entry.value, total)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartShell>
  );
}

/* ------------------------------------------------------------------ */
/* 5. SINFLAR BO'YICHA TAQSIMOT                                        */
/* ------------------------------------------------------------------ */
export function GradesChart({ data }: { data: NameValue[] }) {
  return (
    <DonutChart
      title="Sinflar bo'yicha taqsimot"
      description="Anketa to'ldirgan o'quvchilar sinflari"
      data={data}
      ramp={RAMP_BLUE}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 6. FANLAR BO'YICHA QIZIQISH                                         */
/* ------------------------------------------------------------------ */
export function SubjectsChart({ data }: { data: NameValue[] }) {
  return (
    <DonutChart
      title="Fanlar bo'yicha qiziqish"
      description="O'quvchilar yoqtirgan fanlar"
      data={data}
      ramp={RAMP_AMBER}
      unit="tanlov"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Qo'shimcha: yo'nalishlar bo'yicha qisqacha ko'rinish                */
/* ------------------------------------------------------------------ */
export function CategoryOverview({ data }: { data: NameValue[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartShell
      title="Yo'nalishlar bo'yicha"
      description="Kasb yo'nalishlarining ulushi"
      empty={data.length === 0}
    >
      <ul className="space-y-3">
        {data.map((item) => {
          const share = percent(item.value, total);
          return (
            <li key={item.name}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-1.5 truncate font-medium text-slate-700">
                  <span aria-hidden="true">{CATEGORY_ICONS[item.name] ?? '📌'}</span>
                  {item.name}
                </span>
                <span className="shrink-0 tabular-nums text-slate-500">
                  <strong className="text-slate-900">{item.value}</strong> · {share}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${Math.max(share, 1)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </ChartShell>
  );
}
