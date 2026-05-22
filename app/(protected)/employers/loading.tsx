function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[8px] bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function EmployersLoading() {
  return (
    <section
      className="mx-auto w-full px-5 py-8 sm:px-8 sm:py-10"
      aria-label="Loading employers"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
        <div className="w-full max-w-xl">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="mt-4 h-12 w-full max-w-md" />
          <SkeletonBlock className="mt-5 h-4 w-full max-w-lg" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[400px_1fr]">
        <section className="rounded-[8px] border border-white/10 bg-zinc-950 p-5">
          <SkeletonBlock className="h-6 w-36" />
          <div className="mt-5 space-y-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item}>
                <SkeletonBlock className="h-3 w-28" />
                <SkeletonBlock className="mt-2 h-11 w-full" />
              </div>
            ))}
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-11 w-full" />
          </div>
        </section>

        <section className="rounded-[8px] border border-white/10 bg-zinc-950">
          <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <SkeletonBlock className="h-6 w-32" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  {["Employer", "Type", "Manager", "Dates", "Salary", "Status", "Actions"].map(
                    (heading) => (
                      <th className="px-5 py-3" key={heading}>
                        <SkeletonBlock className="h-3 w-20" />
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[0, 1, 2, 3].map((row) => (
                  <tr key={row}>
                    <td className="px-5 py-4 align-top">
                      <SkeletonBlock className="h-5 w-44" />
                      <SkeletonBlock className="mt-3 h-4 w-28" />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <SkeletonBlock className="h-4 w-24" />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <SkeletonBlock className="h-4 w-32" />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <SkeletonBlock className="h-4 w-36" />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <SkeletonBlock className="h-4 w-28" />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <SkeletonBlock className="h-7 w-24" />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex gap-2">
                        <SkeletonBlock className="h-9 w-14" />
                        <SkeletonBlock className="h-9 w-16" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
