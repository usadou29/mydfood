import { SEO } from '../components/SEO';
import { HeroSection } from '../components/home/HeroSection';
import { PopularDishes } from '../components/home/PopularDishes';
import { AboutSection } from '../components/home/AboutSection';
import { FormulesEtudiantes } from '../components/home/FormulesEtudiantes';
import { ServicesSection } from '../components/home/ServicesSection';
import { ReservationCTA } from '../components/home/ReservationCTA';
import { Testimonials } from '../components/home/Testimonials';

export function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <SEO
        description="DFOOD by Tata Dow — Cuisine camerounaise authentique 100% Halal. Commandez en ligne, livraison en Île-de-France. Traiteur, événements, menus famille."
        canonical="/"
      />
      <HeroSection />
      <PopularDishes />
      <AboutSection />
      <FormulesEtudiantes />
      <ServicesSection />
      <ReservationCTA />
      <Testimonials />
    </div>
  );
}
