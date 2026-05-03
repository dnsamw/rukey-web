import { PageHeroSkeleton } from '@/components/public/shared/Skeleton'
import { Skeleton } from '@/components/public/shared/Skeleton'

export default function AboutLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Skeleton className="h-[460px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <div className="grid grid-cols-2 gap-3 pt-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14" />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}