import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, ChefHat, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { menusFamille } from '../data/mockData';

export function MenusFamille() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Hero */}
      <section className="bg-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Menus Famille
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Des menus complets pour partager un moment convivial autour 
              de la cuisine camerounaise. De 1 à 8 personnes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Menus */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menusFamille.map((menu, index) => (
              <motion.div
                key={menu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow"
              >
                <div className="h-56 overflow-hidden">
                  <img 
                    src={menu.image} 
                    alt={menu.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-text mb-2">{menu.name}</h3>
                  <p className="text-blue font-semibold mb-4">{menu.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {menu.content.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-light">
                        <div className="w-1.5 h-1.5 bg-yellow rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                    <span className="text-3xl font-bold text-blue">{menu.price}€</span>
                    <Button variant="primary">
                      Commander
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="py-20 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-card"
            >
              <Users size={40} className="mx-auto text-yellow mb-4" />
              <h3 className="font-display text-lg font-bold text-text mb-2">Pour tous</h3>
              <p className="text-text-light text-sm">
                Menus adaptés de 1 à 8 personnes pour tous vos moments de partage
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-card"
            >
              <Clock size={40} className="mx-auto text-yellow mb-4" />
              <h3 className="font-display text-lg font-bold text-text mb-2">Sous 24h</h3>
              <p className="text-text-light text-sm">
                Commandez aujourd'hui, recevez demain. Livraison ou retrait sur Antony
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-card"
            >
              <ChefHat size={40} className="mx-auto text-yellow mb-4" />
              <h3 className="font-display text-lg font-bold text-text mb-2">Fait maison</h3>
              <p className="text-text-light text-sm">
                Tous nos plats sont préparés avec amour par Tata Dow
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
