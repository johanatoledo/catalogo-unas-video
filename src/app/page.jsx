
import Navbar from "@/components/Navbar";
import ServiceCatalog from "@/components/ServiceCatalog";
import { services } from "@/data/services";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-nails-white pb-40">
      <Navbar />

      <section className="mx-auto w-full max-w-10xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="text-center">
          
          <h1 className="--font-title text-3xl  text-nails-silver sm:text-4xl md:text-5xl lg:text-6xl">
            ¡Nuestros Servicios!
          </h1>
        </div>

        <ServiceCatalog services={services} />
      </section>
    </main>
  );
}
