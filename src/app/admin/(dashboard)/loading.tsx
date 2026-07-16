function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-white/70 shadow-[0_18px_50px_rgba(61,28,82,0.06)] ${className ?? ""}`}
    />
  );
}

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBlock key={index} className="h-32" />
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
        <SkeletonBlock className="h-80" />
        <SkeletonBlock className="h-80" />
      </section>
      <SkeletonBlock className="h-20" />
      <SkeletonBlock className="h-96" />
    </div>
  );
}
