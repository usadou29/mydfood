import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin, ChefHat, Users, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { services, temoignages, evenements } from '../data/mockData';

export function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-terracotta/20 text-white text-sm font-medium rounded-full mb-6 border border-terracotta/30">
              Cuisine Camerounaise Moderne
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              DFOOD by <span className="text-terracotta">Tata Dow</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Une cuisine afro-fusion qui célèbre les saveurs du Cameroun 
              avec une touche française. Faite maison, préparée avec amour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/commander">
                <Button variant="primary" size="lg">
                  Commander maintenant
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/menus-famille">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-anthracite">
                  Découvrir les menus
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white"
          >
            <div>
              <p className="text-3xl font-bold text-terracotta">500+</p>
              <p className="text-sm text-gray-300">Clients satisfaits</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-terracotta">4.9/5</p>
              <p className="text-sm text-gray-300">Note moyenne</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-terracotta">24h</p>
              <p className="text-sm text-gray-300">Livraison rapide</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-terracotta">100%</p>
              <p className="text-sm text-gray-300">Fait maison</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-terracotta font-semibold">Nos Services</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-anthracite mt-2">
              4 façons de savourer
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Que ce soit pour un événement, un dîner en famille ou un repas individuel,
              nous avons la solution parfaite pour vous.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm text-terracotta font-medium">{service.subtitle}</span>
                  <h3 className="font-display text-xl font-bold text-anthracite mt-1">{service.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm">{service.description}</p>
                  <ul className="mt-4 space-y-1">
                    {service.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-terracotta rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to={service.link}
                    className="mt-6 inline-flex items-center gap-2 text-terracotta font-semibold hover:gap-3 transition-all"
                  >
                    {service.cta}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements Section */}
      <section className="py-20 bg-anthracite text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-terracotta font-semibold">Événements</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
              Vivez l'expérience DFOOD
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {evenements.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold">{event.title}</h3>
                  <p className="mt-2 text-gray-300 text-sm">{event.description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.location}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-2xl font-bold text-terracotta">{event.price}€</span>
                    <Link to={`/evenements/${event.id}`}>
                      <Button variant="primary" size="sm">
                        Réserver
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-terracotta font-semibold">Avis clients</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-anthracite mt-2">
              Ils nous font confiance
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {temoignages.map((avis, index) => (
              <motion.div
                key={avis.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(avis.note)].map((_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{avis.commentaire}"</p>
                <p className="text-sm font-semibold text-gray-900">{avis.nom}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-terracotta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à découvrir nos saveurs ?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Commandez dès maintenant et recevez votre repas sous 24h. 
              Livraison disponible sur Antony et environs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/commander">
                <Button variant="secondary" size="lg">
                  Commander maintenant
                </Button>
              </Link>
              <a 
                href="https://wa.me/33600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Commander sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
