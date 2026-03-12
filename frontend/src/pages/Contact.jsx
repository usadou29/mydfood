import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { envoyerContact, inscrireNewsletter } from '../services/contact';

export function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await envoyerContact(formData);
      setSuccess(true);
      setFormData({ nom: '', email: '', sujet: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterError(null);
    try {
      await inscrireNewsletter(newsletterEmail);
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } catch (err) {
      setNewsletterError(err.message || 'Erreur lors de l\'inscription');
    }
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

              {/* Newsletter */}
              <div className="mt-12 bg-yellow/10 rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-text mb-2">Newsletter</h3>
                <p className="text-text-light text-sm mb-4">
                  Recevez nos offres et nouveautés directement dans votre boîte mail.
                </p>
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Votre email"
                    className="flex-1 px-4 py-3 border border-cream-dark rounded-xl bg-white focus:ring-2 focus:ring-yellow focus:border-transparent"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    OK
                  </Button>
                </form>
                {newsletterSuccess && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle size={14} /> Inscription réussie !
                  </p>
                )}
                {newsletterError && (
                  <p className="text-red-500 text-sm mt-2">{newsletterError}</p>
                )}
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

              {success ? (
                <div className="text-center py-12">
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-text mb-2">Message envoyé !</h3>
                  <p className="text-text-light">Nous vous répondrons sous 24h.</p>
                </div>
              ) : (
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

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="animate-spin" size={20} /> Envoi en cours...</>
                    ) : (
                      <><Send size={20} /> Envoyer le message</>
                    )}
                  </Button>
                </form>
              )}

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
