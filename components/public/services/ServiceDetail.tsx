'use client';

interface ServiceDetailProps {
  slug: string;
}

export default function ServiceDetail({ slug }: ServiceDetailProps) {
  return (
    <div className="service-detail">
      <h1>Service: {slug}</h1>
      <p>Detailed information about this service.</p>
    </div>
  );
}
