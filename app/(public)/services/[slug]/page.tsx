import ServiceDetail from '@/components/public/services/ServiceDetail';

export const metadata = {
  title: 'Service Details - Cleaning Service',
  description: 'Details about our cleaning services',
};

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  return (
    <div className="page-container">
      <ServiceDetail slug={params.slug} />
    </div>
  );
}
