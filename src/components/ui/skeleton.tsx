import { cn } from '@/lib/utils';

/** Ma'lumot yuklanayotgan paytdagi "skelet" ko'rinish */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-xl bg-slate-100', className)} {...props} />;
}

export { Skeleton };
