/**
 * Aurora foni — sekin suzuvchi gradient dog'lar.
 *
 * Butunlay CSS bilan qilingan: canvas ham, zarrachalar ham yo'q.
 * Sabab — maktab kompyuterlarida canvas animatsiyasi protsessorni
 * band qiladi, CSS transform esa videokartada ishlaydi va deyarli
 * bepul. Zaif mashinada `[data-fx="lite"]` animatsiyani to'xtatadi,
 * dog'lar statik qoladi.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Asosiy gradient qatlam */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, var(--bg-base) 0%, var(--bg-elev) 55%, var(--bg-deep) 100%)',
        }}
      />

      {/* Uch dog' — har biri o'z tezligida suzadi */}
      <div
        className="aurora-layer absolute -left-[15%] -top-[20%] h-[70vmax] w-[70vmax] rounded-full blur-[90px]"
        style={{
          background: 'radial-gradient(circle, var(--mesh-1) 0%, transparent 68%)',
          animation: 'aurora-drift 26s ease-in-out infinite',
        }}
      />
      <div
        className="aurora-layer absolute -right-[18%] top-[8%] h-[62vmax] w-[62vmax] rounded-full blur-[90px]"
        style={{
          background: 'radial-gradient(circle, var(--mesh-2) 0%, transparent 68%)',
          animation: 'aurora-drift 34s ease-in-out infinite reverse',
        }}
      />
      <div
        className="aurora-layer absolute bottom-[-25%] left-[20%] h-[58vmax] w-[58vmax] rounded-full blur-[90px]"
        style={{
          background: 'radial-gradient(circle, var(--mesh-3) 0%, transparent 68%)',
          animation: 'aurora-drift 42s ease-in-out infinite',
        }}
      />

      {/* Nozik to'r — chuqurlik hissi uchun */}
      <div className="bg-grid absolute inset-0 opacity-[0.35]" />
    </div>
  );
}
