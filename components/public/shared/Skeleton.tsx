type Props = {
  className?: string
}

export function Skeleton({ className = '' }: Props) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[90vh] min-h-[580px] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300/80 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl space-y-5">
            <div className="h-6 w-36 bg-gray-300 rounded-full" />
            <div className="h-16 w-64 bg-gray-300 rounded-xl" />
            <div className="h-12 w-48 bg-gray-300 rounded-xl" />
            <div className="h-4 w-80 bg-gray-300 rounded-lg" />
            <div className="h-4 w-64 bg-gray-300 rounded-lg" />
            <div className="flex gap-4 pt-2">
              <div className="h-12 w-36 bg-gray-300 rounded-full" />
              <div className="h-12 w-32 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-3 w-full bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-3 w-5/6 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded-lg mt-4" />
      </div>
    </div>
  )
}

export function ServicesGridSkeleton() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading skeleton */}
        <div className="text-center mb-12 space-y-3">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-full mx-auto" />
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-xl mx-auto" />
          <div className="h-3 w-96 bg-gray-200 animate-pulse rounded-lg mx-auto" />
          <div className="h-1 w-16 bg-gray-200 animate-pulse rounded-full mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSkeleton() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-full mx-auto" />
          <div className="h-8 w-56 bg-gray-200 animate-pulse rounded-xl mx-auto" />
          <div className="h-1 w-16 bg-gray-200 animate-pulse rounded-full mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 space-y-4">
              <div className="h-8 w-10 bg-gray-200 animate-pulse rounded-lg" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-3 w-3 bg-gray-200 animate-pulse rounded-full" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-3 w-5/6 bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-3 w-4/6 bg-gray-200 animate-pulse rounded-lg" />
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gray-200 animate-pulse rounded-full" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded-lg" />
                  <div className="h-2.5 w-32 bg-gray-200 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PageHeroSkeleton() {
  return (
    <div className="bg-[#1E3A5F] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="h-6 w-32 bg-white/20 animate-pulse rounded-full mx-auto" />
        <div className="h-10 w-72 bg-white/20 animate-pulse rounded-xl mx-auto" />
        <div className="h-4 w-96 bg-white/10 animate-pulse rounded-lg mx-auto" />
      </div>
    </div>
  )
}