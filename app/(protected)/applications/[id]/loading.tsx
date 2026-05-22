function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[8px] bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function ApplicationDetailsLoading() {
  return (
    <section
      className="mx-auto w-full px-5 py-8 sm:px-8 sm:py-10"
      aria-label="Loading application details"
    >
      <div className="flex flex-col gap-5 border-b border-white/10 pb-8">
        <SkeletonBlock className="h-4 w-36" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-xl">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-4 h-12 w-full max-w-md" />
            <SkeletonBlock className="mt-5 h-4 w-64" />
          </div>
          <SkeletonBlock className="h-10 w-28" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-[8px] border border-white/10 bg-zinc-950 p-5">
          <SkeletonBlock className="h-6 w-24" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div
                className="rounded-[8px] border border-white/10 bg-black p-4"
                key={item}
              >
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="mt-4 h-4 w-36" />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="mt-4 h-4 w-full" />
          </div>
          <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="mt-4 h-4 w-full" />
            <SkeletonBlock className="mt-3 h-4 w-3/4" />
          </div>
        </section>

        <div className="grid gap-6">
          <section className="rounded-[8px] border border-white/10 bg-zinc-950 p-5">
            <SkeletonBlock className="h-6 w-36" />
            <SkeletonBlock className="mt-4 h-4 w-full" />
            <SkeletonBlock className="mt-5 h-20 w-full" />
            <SkeletonBlock className="mt-5 h-11 w-32" />
          </section>

          <section className="rounded-[8px] border border-white/10 bg-zinc-950">
            <div className="border-b border-white/10 px-5 py-4">
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="mt-3 h-4 w-16" />
            </div>
            {[0, 1, 2].map((item) => (
              <div className="border-b border-white/10 px-5 py-4" key={item}>
                <SkeletonBlock className="h-5 w-56" />
                <SkeletonBlock className="mt-3 h-3 w-36" />
                <SkeletonBlock className="mt-2 h-3 w-44" />
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}
