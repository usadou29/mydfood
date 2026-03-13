import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Users, Building2, PartyPopper, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';

export function ChefPrive() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: <PartyPopper size={32} />,
      title: 'Événements privés',
      description:
        'Anniversaires, soirées entre amis, fêtes de famille... Notre chef se déplace chez vous pour une expérience culinaire camerounaise inoubliable.',
    },
    {
      icon: <Building2 size={32} />,
      title: 'Traiteur entreprise',
      description:
        'Séminaires, team buildings, déjeuners d\'affaires. Offrez à vos collaborateurs une pause gourmande originale et savoureuse.',
    },
    {
      icon: <Users size={32} />,
      title: 'Mariages & cérémonies',
      description:
        'Buffet africain, cocktail dînatoire ou repas assis. Nous créons un menu sur mesure pour le plus beau jour de votre vie.',
    },
    {
      icon: <ChefHat size={32} />,
      title: 'Cours de cuisine',
      description:
        'Apprenez à préparer les plats emblématiques de la cuisine camerounaise avec notre chef. Sessions individuelles ou en groupe.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream pt-20">
      <SEO
        title="Chef Privé & Professionnels"
        description="Services de chef privé et traiteur professionnel par DFOOD. Événements privés, mariages, séminaires d'entreprise et cours de cuisine camerounaise."
        canonical="/chef-prive"
      />

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-yellow/20 text-yellow-warning px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Services Premium
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4">
              Chef Privé & Professionnels
            </h1>
            <p className="text-text-light max-w-2xl mx-auto">
              Faites appel à l'expertise DFOOD pour vos événements. Un service
              sur mesure avec toute l'authenticité de la cuisine camerounaise.
            </p>
          </motion.div>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-card hover:shadow-hover transition-shadow"
              >
                <div className="text-yellow mb-4">{service.icon}</div>
                <h3 className="font-display text-xl font-bold text-text mb-3">
                  {service.title}
                </h3>
                <p className="text-text-light leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Comment ça marche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-card p-8 lg:p-12 mb-20"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-text text-center mb-10">
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Contactez-nous',
                  desc: 'Décrivez votre événement, le nombre de convives et vos préférences via notre formulaire ou WhatsApp.',
                },
                {
                  step: '2',
                  title: 'Devis personnalisé',
                  desc: 'Nous vous envoyons un devis détaillé sous 24h avec un menu adapté à vos besoins et votre budget.',
                },
                {
                  step: '3',
                  title: 'Jour J',
                  desc: 'Notre équipe s\'occupe de tout : préparation, mise en place, service et nettoyage si besoin.',
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-yellow rounded-full flex items-center justify-center text-text font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-display text-lg font-bold text-text mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-light text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-2xl font-bold text-text mb-4">
              Prêt à organiser votre événement ?
            </h2>
            <p className="text-text-light mb-8 max-w-xl mx-auto">
              Contactez-nous pour un devis gratuit et sans engagement.
              Nous répondons sous 24h.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/traiteur">
                <Button variant="primary" size="lg">
                  Demander un devis <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
