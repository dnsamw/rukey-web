import { PageHeroSkeleton, Skeleton } from '@/components/public/shared/Skeleton'

export default function ContactLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              <Skeleton className="h-40 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-[480px] w-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}