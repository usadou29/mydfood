import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Flame, UtensilsCrossed } from 'lucide-react';
import { SEO } from '../components/SEO';

export function APropos() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const valeurs = [
    {
      icon: <ShieldCheck size={32} />,
      title: '100% Halal certifié',
      description:
        'Toutes nos viandes sont rigoureusement sélectionnées et certifiées Halal. Un engagement de confiance pour nos clients.',
    },
    {
      icon: <Flame size={32} />,
      title: 'Fait maison',
      description:
        'Chaque plat est préparé artisanalement le jour même avec des produits frais. Zéro industriel, 100% saveur.',
    },
    {
      icon: <UtensilsCrossed size={32} />,
      title: 'Saveurs camerounaises',
      description:
        'Des recettes traditionnelles transmises de génération en génération, revisitées avec créativité et passion.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream pt-20">
      <SEO
        title="À propos — Notre Histoire"
        description="Découvrez l'histoire de DFOOD by Tata Dow, cuisine camerounaise authentique et 100% Halal en Île-de-France. Fondée par Doriane Fampou."
        canonical="/a-propos"
      />

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
              Notre Histoire
            </h1>
            <p className="mt-4 text-text-light max-w-2xl mx-auto">
              Derrière chaque plat DFOOD, il y a une histoire de passion,
              de tradition et de partage.
            </p>
          </motion.div>

          {/* Fondatrice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-card p-8 lg:p-12 mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Heart size={24} className="text-yellow" />
                  <span className="text-sm font-semibold text-yellow uppercase tracking-wider">
                    La fondatrice
                  </span>
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-text mb-4">
                  Doriane Fampou
                </h2>
                <p className="text-text-light leading-relaxed mb-4">
                  Passionnée de cuisine depuis son plus jeune âge, Doriane a grandi
                  au Cameroun entourée de saveurs authentiques et de recettes familiales.
                  Installée en France, elle a décidé de partager ce patrimoine culinaire
                  avec tous ceux qui recherchent des plats faits maison, savoureux et
                  préparés avec amour.
                </p>
                <p className="text-text-light leading-relaxed">
                  Avec DFOOD by Tata Dow, Doriane propose une cuisine camerounaise
                  authentique, entièrement Halal, livrée directement chez vous en
                  Île-de-France. Chaque commande est une invitation au voyage
                  gustatif.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-yellow/20 to-blue/10 flex items-center justify-center">
                  <UtensilsCrossed size={120} className="text-yellow/40" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Valeurs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text mb-4">
              Nos valeurs
            </h2>
            <p className="text-text-light max-w-xl mx-auto">
              Ce qui fait de DFOOD une expérience unique.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {valeurs.map((valeur, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-card text-center"
              >
                <div className="text-yellow mb-4 flex justify-center">
                  {valeur.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-text mb-2">
                  {valeur.title}
                </h3>
                <p className="text-text-light">{valeur.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-card p-8 lg:p-12 text-center"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text mb-6">
              Notre mission
            </h2>
            <p className="text-text-light leading-relaxed max-w-3xl mx-auto mb-4">
              Chez DFOOD, notre mission est simple : rendre la cuisine camerounaise
              authentique accessible à tous en Île-de-France. Nous croyons que la bonne
              cuisine rapproche les gens, et chaque plat que nous préparons est une
              invitation au partage et à la découverte.
            </p>
            <p className="text-text-light leading-relaxed max-w-3xl mx-auto">
              Que ce soit pour un repas en famille, un événement entre amis ou une
              prestation traiteur pour votre entreprise, DFOOD s'engage à vous offrir
              le meilleur de la gastronomie camerounaise avec des ingrédients frais
              et des viandes 100% Halal.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
