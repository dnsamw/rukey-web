import { PageHeroSkeleton, Skeleton } from '@/components/public/shared/Skeleton'

export default function CareersLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </section>
    </>
  )
}