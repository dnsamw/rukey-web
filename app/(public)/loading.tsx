import { HeroSkeleton, ServicesGridSkeleton, TestimonialsSkeleton } from '@/components/public/shared/Skeleton'

export default function HomeLoading() {
  return (
    <>
      <HeroSkeleton />
      {/* Stats bar placeholder */}
      <div className="bg-[var(--color-primary)] h-24 animate-pulse" />
      <ServicesGridSkeleton />
      {/* About section placeholder */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="h-[480px] bg-gray-200 animate-pulse rounded-2xl" />
            <div className="space-y-4 pt-8">
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-full" />
              <div className="h-8 w-72 bg-gray-200 animate-pulse rounded-xl" />
              <div className="h-3 w-full bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-3 w-5/6 bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-3 w-4/6 bg-gray-200 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <TestimonialsSkeleton />
    </>
  )
}