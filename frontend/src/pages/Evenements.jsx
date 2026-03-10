import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { evenements } from '../data/mockData';

export function Evenements() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Hero */}
      <section className="bg-yellow py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-6">
              Nos Événements
            </h1>
            <p className="text-lg text-text/80 max-w-2xl mx-auto">
              Participez à nos soirées dégustation et ateliers culinaires 
              pour découvrir les saveurs du Cameroun.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Événements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {evenements.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h2 className="font-display text-2xl font-bold text-text mb-3">{event.title}</h2>
                  <p className="text-text-light mb-6">{event.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-text-light">
                      <Calendar size={18} className="text-blue" />
                      {new Date(event.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light">
                      <Clock size={18} className="text-blue" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light">
                      <MapPin size={18} className="text-blue" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light">
                      <Users size={18} className="text-blue" />
                      {event.places} places disponibles
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-cream-dark">
                    <div>
                      <span className="text-sm text-text-light">Prix par personne</span>
                      <p className="text-3xl font-bold text-blue">{event.price}€</p>
                    </div>
                    <Button variant="primary" size="lg">
                      <Ticket size={20} />
                      Réserver
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-20 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-text mb-6">
              Vous souhaitez organiser un événement privé ?
            </h2>
            <p className="text-text-light max-w-2xl mx-auto mb-8">
              Tata Dow propose ses services pour vos dîners privés, 
              soirées entreprise ou ateliers cuisine sur mesure.
            </p>
            <a 
              href="/traiteur"
              className="inline-flex items-center gap-2 text-blue font-semibold hover:underline"
            >
              Demander un devis traiteur
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
