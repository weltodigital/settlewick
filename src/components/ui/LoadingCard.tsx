interface LoadingCardProps {
  viewMode?: 'grid' | 'list'
  count?: number
}

export default function LoadingCard({ viewMode = 'grid', count = 6 }: LoadingCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`card animate-pulse ${viewMode === 'list' ? 'sm:flex sm:overflow-hidden' : ''}`}
        >
          {/* Image skeleton */}
          <div className={`bg-secondary/50 ${
            viewMode === 'list'
              ? 'sm:w-80 sm:flex-shrink-0 aspect-[4/3] sm:rounded-l-xl sm:rounded-tr-none'
              : 'aspect-[4/3] rounded-t-xl'
          }`} />

          {/* Content skeleton */}
          <div className={`p-4 space-y-3 ${viewMode === 'list' ? 'sm:flex-1 sm:flex sm:flex-col sm:justify-between' : ''}`}>
            <div className="space-y-3">
              {/* Price skeleton */}
              <div className="space-y-2">
                <div className="h-7 bg-secondary/50 rounded w-1/2" />
                <div className="h-4 bg-secondary/50 rounded w-1/3" />
              </div>

              {/* Details skeleton */}
              <div className="flex gap-4">
                <div className="h-4 bg-secondary/50 rounded w-12" />
                <div className="h-4 bg-secondary/50 rounded w-12" />
                <div className="h-4 bg-secondary/50 rounded w-16" />
              </div>

              {/* Address skeleton */}
              <div className="h-4 bg-secondary/50 rounded w-2/3" />

              {/* Summary skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-secondary/50 rounded" />
                <div className="h-4 bg-secondary/50 rounded w-4/5" />
              </div>
            </div>

            {/* Agent skeleton */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary/50 rounded" />
                <div className="h-4 bg-secondary/50 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}