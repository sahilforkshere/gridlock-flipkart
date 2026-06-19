export default function PredictionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-36 bg-[var(--bg-elevated-2)] rounded-lg border border-[var(--border-subtle)]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-52 bg-[var(--bg-elevated-2)] rounded-lg border border-[var(--border-subtle)]" />
        <div className="h-52 bg-[var(--bg-elevated-2)] rounded-lg border border-[var(--border-subtle)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-[var(--bg-elevated-2)] rounded-lg border border-[var(--border-subtle)]" />
        ))}
      </div>
    </div>
  )
}
