import { PageHeroSkeleton, ServicesGridSkeleton } from '@/components/public/shared/Skeleton'

export default function ServicesLoading() {
  return (
    <>
      <PageHeroSkeleton />
      <ServicesGridSkeleton />
    </>
  )
}