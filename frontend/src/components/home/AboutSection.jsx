import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
              <div className="absolute inset-0 rounded-full bg-blue/10" />
              <div className="absolute inset-4 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=600&fit=crop"
                  alt="Tata Dow en cuisine"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute bottom-8 right-8 bg-yellow rounded-2xl p-4 shadow-card">
              <p className="text-3xl font-display font-bold text-text">10+</p>
              <p className="text-sm text-text">Années de passion</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full mb-4">
              Notre Histoire
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-6">
              L'amour de la cuisine camerounaise
            </h2>
            <p className="text-text-light mb-6 leading-relaxed">
              Fondé en octobre 2022 par Doriane Fampou, DFOOD est né d'une passion pour
              la cuisine camerounaise. Des plats préparés avec des produits frais, des
              viandes 100% Halal, et des pâtes à pastels confectionnées maison.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Viandes 100% Halal certifiées',
                'Produits frais, pâte à pastels maison',
                'Recettes traditionnelles camerounaises',
                'Livraison en Île-de-France',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-text" />
                  </div>
                  <span className="text-text">{item}</span>
                </div>
              ))}
            </div>

            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              En savoir plus
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
