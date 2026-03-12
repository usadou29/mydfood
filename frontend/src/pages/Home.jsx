import { HeroSection } from '../components/home/HeroSection';
import { PopularDishes } from '../components/home/PopularDishes';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { ReservationCTA } from '../components/home/ReservationCTA';
import { Testimonials } from '../components/home/Testimonials';

export function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <HeroSection />
      <PopularDishes />
      <AboutSection />
      <ServicesSection />
      <ReservationCTA />
      <Testimonials />
    </div>
  );
}
