import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, ChefHat } from 'lucide-react';
import { Logo } from '../Logo';

export function HeroSection() {
  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-yellow/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-20 h-20" />
              <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full">
                Cuisine Camerounaise Authentique
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text leading-tight mb-6">
              La cuisine de <span className="text-blue">Tata Dow</span> chez vous
            </h1>

            <p className="text-lg text-text-light mb-8 max-w-lg leading-relaxed">
              Plats faits maison, viandes 100% Halal, produits frais.
              Thieb, grillades, pastels, beignets... livrés en Île-de-France.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/commander"
                className="btn-primary text-center inline-flex items-center justify-center gap-2"
              >
                Commander maintenant
                <ArrowRight size={20} />
              </Link>
              <Link to="/menus-famille" className="btn-secondary text-center">
                Voir les menus famille
              </Link>
            </div>

            <div className="flex gap-8 mt-10 pt-8 border-t border-cream-dark">
              <div>
                <p className="text-3xl font-display font-bold text-blue">500+</p>
                <p className="text-sm text-text-light">Clients satisfaits</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-blue">20+</p>
                <p className="text-sm text-text-light">Plats & menus</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-blue">24h</p>
                <p className="text-sm text-text-light">Livraison rapide</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] mx-auto">
              <div className="absolute inset-0 rounded-full bg-yellow/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-cream-dark overflow-hidden">
                {heroImgError ? (
                  <div className="w-full h-full flex items-center justify-center bg-yellow/20">
                    <ChefHat size={80} className="text-yellow-dark/50" />
                  </div>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=800&fit=crop"
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => setHeroImgError(true)}
                    loading="eager"
                  />
                )}
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card p-4 animate-float">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍗</span>
                  <div>
                    <p className="font-bold text-text text-sm">100% Halal</p>
                    <p className="text-xs text-text-light">Fait maison</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <p className="font-bold text-text text-sm">Sous 24h</p>
                    <p className="text-xs text-text-light">Île-de-France</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
