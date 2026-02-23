import ServicesGrid from "@/components/public/home/ServicesGrid";

export const metadata = {
  title: "Our Services - Cleaning Service",
  description: "Browse all of our professional cleaning services",
};

export default function ServicesPage() {
  return (
    <div className="page-container">
      <h1>Our Services</h1>
      <ServicesGrid />
    </div>
  );
}
