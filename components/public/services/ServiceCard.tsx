'use client';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export default function ServiceCard({ id, title, description, image }: ServiceCardProps) {
  return (
    <div className="service-card">
      {image && <img src={image} alt={title} />}
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={`/services/${id}`}>Learn More</a>
    </div>
  );
}
