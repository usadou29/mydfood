import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';

const formules = [
  {
    id: 'pastas',
    nom: 'Formule Pastas',
    prix: 8.5,
    description: 'Pâtes fraîches cuisinées à la camerounaise avec sauce au choix.',
    exemples: ['Pasta sauce tomate', 'Pasta sauce blanche', 'Pasta sautée'],
    couleur: 'bg-yellow/20',
    bordure: 'border-yellow',
  },
  {
    id: 'plats-sauce',
    nom: 'Formule Plats en Sauce',
    prix: 10,
    description: 'Plats mijotés traditionnels avec accompagnement au choix.',
    exemples: ['Thiep Poulet', 'Thiep Poisson', 'Sauce Tomate Bœuf', 'Sauce Tomate Poulet'],
    couleur: 'bg-blue/10',
    bordure: 'border-blue',
  },
  {
    id: 'grillades',
    nom: 'Formule Grillades',
    prix: 11,
    description: 'Viandes grillées 100% Halal avec garnitures maison.',
    exemples: ['Poulet Braisé', 'Poisson Braisé', 'Brochettes de Bœuf'],
    couleur: 'bg-yellow/20',
    bordure: 'border-yellow',
  },
];

export function FormulesEtudiantes() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue/10 text-blue font-medium text-sm rounded-full mb-4">
            <GraduationCap size={16} />
            Spécial Étudiants
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
            Nos Formules Étudiantes
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Des repas complets et savoureux à petit prix, pensés pour les étudiants.
            Viandes 100% Halal et produits frais.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {formules.map((formule, index) => (
            <motion.div
              key={formule.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border-2 ${formule.bordure} p-6 card-hover relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 ${formule.couleur} w-24 h-24 rounded-bl-[3rem] -mr-2 -mt-2`} />

              <div className="relative">
                <h3 className="font-display text-xl font-bold text-text mb-2">
                  {formule.nom}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-display font-bold text-blue">
                    {formule.prix.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-text-light text-sm">€</span>
                </div>
                <p className="text-text-light text-sm mb-4">
                  {formule.description}
                </p>
                <div className="space-y-2">
                  {formule.exemples.map((exemple) => (
                    <div key={exemple} className="flex items-center gap-2 text-sm text-text">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow flex-shrink-0" />
                      {exemple}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/commander"
            className="btn-primary inline-flex items-center gap-2"
          >
            Commander maintenant
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
