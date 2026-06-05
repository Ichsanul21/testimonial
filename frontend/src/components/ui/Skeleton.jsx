export default function Skeleton({ width, height, rounded = 'xl', className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded === 'full' ? '9999px' : `var(--radius-${rounded}, 0.75rem)`,
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <Skeleton width="60%" height="1.25rem" />
      <Skeleton width="40%" height="0.875rem" />
      <Skeleton width="100%" height="3rem" rounded="xl" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Skeleton width="2rem" height="2rem" rounded="full" />
          <Skeleton width="25%" height="1rem" />
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="10%" height="1.5rem" rounded="full" />
        </div>
      ))}
    </div>
  )
}
