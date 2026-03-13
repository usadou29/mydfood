import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { envoyerDevisTraiteur } from '../services/contact';
import { SEO } from '../components/SEO';

export function Traiteur() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    date: '',
    type_evenement: '',
    personnes: '',
    budget: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await envoyerDevisTraiteur({
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        type_evenement: formData.type_evenement || 'Autre',
        nombre_personnes: Number(formData.personnes),
        date_evenement: formData.date,
        budget: formData.budget,
        details: formData.description,
      });
      setSuccess(true);
      setFormData({
        nom: '', email: '', telephone: '', date: '',
        type_evenement: '', personnes: '', budget: '', description: ''
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-20">
      <SEO
        title="Service Traiteur"
        description="Service traiteur camerounais pour vos événements. Mariages, anniversaires, séminaires. Cuisine 100% Halal, devis gratuit sous 24h."
        canonical="/traiteur"
      />
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555244162-803279f50793?w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Service Traiteur
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Pour vos événements privés ou professionnels, faites confiance à DFOOD
              pour une expérience culinaire africaine unique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text mb-4">
              Nos prestations
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              De l'anniversaire au séminaire d'entreprise, nous adaptons notre offre à vos besoins.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: <Users size={32} />,
                title: 'Événements privés',
                description: 'Anniversaires, soirées entre amis, fêtes de famille'
              },
              {
                icon: <Calendar size={32} />,
                title: 'Mariages',
                description: 'Buffet africain, cocktail dinatoire, repas assis'
              },
              {
                icon: <MapPin size={32} />,
                title: 'Événements corporate',
                description: 'Séminaires, conférences, lancements de produit'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-card text-center"
              >
                <div className="text-yellow mb-4 flex justify-center">{item.icon}</div>
                <h3 className="font-display text-xl font-bold text-text mb-2">{item.title}</h3>
                <p className="text-text-light">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Formulaire de devis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-card p-8 lg:p-12"
          >
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-text text-center mb-8">
              Demandez un devis personnalisé
            </h2>

            {success ? (
              <div className="text-center py-12">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-text mb-2">Demande envoyée !</h3>
                <p className="text-text-light mb-4">Nous vous contacterons sous 24h avec un devis personnalisé.</p>
                <Button variant="primary" onClick={() => setSuccess(false)}>
                  Envoyer une autre demande
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">Nom complet</label>
                    <input
                      type="text" required
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">Email</label>
                    <input
                      type="email" required
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">Téléphone</label>
                    <input
                      type="tel" required
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">Date de l'événement</label>
                    <input
                      type="date" required
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">Type d'événement</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                      value={formData.type_evenement}
                      onChange={(e) => setFormData({...formData, type_evenement: e.target.value})}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="anniversaire">Anniversaire</option>
                      <option value="mariage">Mariage</option>
                      <option value="soiree_privee">Soirée privée</option>
                      <option value="corporate">Événement corporate</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">Nombre de personnes</label>
                    <input
                      type="number" required min="10"
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                      value={formData.personnes}
                      onChange={(e) => setFormData({...formData, personnes: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Budget estimé</label>
                  <select
                    className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  >
                    <option value="">Sélectionnez une fourchette</option>
                    <option value="500-1000">500€ - 1 000€</option>
                    <option value="1000-2000">1 000€ - 2 000€</option>
                    <option value="2000-5000">2 000€ - 5 000€</option>
                    <option value="5000+">Plus de 5 000€</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Description de l'événement</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent transition-all"
                    placeholder="Décrivez votre événement, vos attentes..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="animate-spin" size={20} /> Envoi en cours...</>
                  ) : (
                    <><Send size={20} /> Envoyer ma demande</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
