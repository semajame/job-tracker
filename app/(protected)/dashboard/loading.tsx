function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[8px] bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function DashboardLoading() {
  return (
    <section
      className="w-full px-5 py-8 sm:px-8 sm:py-10"
      aria-label="Loading dashboard"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-xl">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="mt-4 h-12 w-full max-w-sm" />
          <SkeletonBlock className="mt-5 h-4 w-full max-w-xs" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["saved", "applied", "interviews", "offers"].map((item) => (
          <article
            className="h-full rounded-[8px] border border-white/10 bg-zinc-950 p-5"
            key={item}
          >
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-5 h-10 w-16" />
            <SkeletonBlock className="mt-4 h-4 w-32" />
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[8px] border border-white/10 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <SkeletonBlock className="h-6 w-36" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <div className="divide-y divide-white/10">
            {[0, 1, 2].map((item) => (
              <article
                className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto_auto] md:items-center"
                key={item}
              >
                <div>
                  <SkeletonBlock className="h-5 w-48" />
                  <SkeletonBlock className="mt-3 h-4 w-28" />
                </div>
                <SkeletonBlock className="h-7 w-24" />
                <SkeletonBlock className="h-4 w-16" />
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-[8px] border border-white/10 bg-[linear-gradient(200deg,#262626_0%,#000000_72%)] p-5">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-4 h-8 w-56" />
          <SkeletonBlock className="mt-5 h-4 w-full" />
          <SkeletonBlock className="mt-3 h-4 w-4/5" />
          <div className="mt-7 space-y-5">
            {[0, 1, 2].map((item) => (
              <div key={item}>
                <div className="mb-2 flex justify-between">
                  <SkeletonBlock className="h-3 w-32" />
                  <SkeletonBlock className="h-3 w-10" />
                </div>
                <SkeletonBlock className="h-2 w-full" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
