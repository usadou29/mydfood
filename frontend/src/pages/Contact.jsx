import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook } from 'lucide-react';
import { Button } from '../components/Button';

export function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message envoyé ! Nous vous répondrons sous 24h.');
    setFormData({ nom: '', email: '', sujet: '', message: '' });
  };

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
              Contactez-nous
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Une question ? Une demande spéciale ? N'hésitez pas à nous contacter, 
              nous vous répondrons avec plaisir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Infos */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-bold text-text mb-8">Nos coordonnées</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="text-yellow" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Téléphone</h3>
                    <p className="text-text-light">+33 6 00 00 00 00</p>
                    <p className="text-sm text-text-light">Disponible sur WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="text-yellow" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Email</h3>
                    <p className="text-text-light">contact@mydfood.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-yellow" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Adresse</h3>
                    <p className="text-text-light">Antony, 92160</p>
                    <p className="text-sm text-text-light">Points de retrait : Antony, Châtelet, Denfert-Rochereau</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-yellow" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">Horaires</h3>
                    <p className="text-text-light">Lundi - Samedi : 10h - 20h</p>
                    <p className="text-sm text-text-light">Livraison : 11h30 - 14h00 & 18h30 - 21h00</p>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="mt-12">
                <h3 className="font-semibold text-text mb-4">Suivez-nous</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-text text-white rounded-xl flex items-center justify-center hover:bg-blue transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-text text-white rounded-xl flex items-center justify-center hover:bg-blue transition-colors"
                  >
                    <Facebook size={24} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-card p-8"
            >
              <h2 className="font-display text-2xl font-bold text-text mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Nom complet</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Sujet</label>
                  <select
                    className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    value={formData.sujet}
                    onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="traiteur">Demande de devis traiteur</option>
                    <option value="evenement">Information événement</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Message</label>
                  <textarea
                    rows="5"
                    required
                    className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  <Send size={20} />
                  Envoyer le message
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-text-light">
                Ou écrivez-nous directement sur{' '}
                <a 
                  href="https://wa.me/33600000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
