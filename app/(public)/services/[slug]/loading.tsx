import { PageHeroSkeleton } from '@/components/public/shared/Skeleton'
import { Skeleton } from '@/components/public/shared/Skeleton'

export default function ServiceDetailLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-80 w-full" />
              <div className="space-y-3">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-1 w-12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}