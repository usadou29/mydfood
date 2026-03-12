import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, Users, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { fetchEvenements, reserverEvenement } from '../services/evenements';

export function Evenements() {
  const { data: evenements, loading, error } = useSupabaseQuery(fetchEvenements);
  const [reservationModal, setReservationModal] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    nom: '', email: '', telephone: '', nb_places: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReserver = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reserverEvenement({
        evenement_id: reservationModal.id,
        ...reservationForm,
        nb_places: Number(reservationForm.nb_places),
      });
      setSuccess(true);
      setTimeout(() => {
        setReservationModal(null);
        setSuccess(false);
        setReservationForm({ nom: '', email: '', telephone: '', nb_places: 1 });
      }, 2000);
    } catch (err) {
      setSubmitError(err.message || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur de chargement : {error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

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
          {evenements && evenements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-light text-lg">Aucun événement à venir pour le moment.</p>
              <p className="text-text-light mt-2">Revenez bientôt pour découvrir nos prochaines dates !</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {evenements && evenements.map((event, index) => (
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
                      src={event.image_url}
                      alt={event.titre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8">
                    <h2 className="font-display text-2xl font-bold text-text mb-3">{event.titre}</h2>
                    <p className="text-text-light mb-6">{event.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-text-light">
                        <Calendar size={18} className="text-blue" />
                        {new Date(event.date_evenement).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-light">
                        <Clock size={18} className="text-blue" />
                        {event.heure}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-light">
                        <MapPin size={18} className="text-blue" />
                        {event.lieu}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-light">
                        <Users size={18} className="text-blue" />
                        {event.places_restantes} places disponibles
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-cream-dark">
                      <div>
                        <span className="text-sm text-text-light">Prix par personne</span>
                        <p className="text-3xl font-bold text-blue">{Number(event.prix).toFixed(0)}€</p>
                      </div>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setReservationModal(event)}
                        disabled={event.places_restantes <= 0}
                      >
                        <Ticket size={20} />
                        {event.places_restantes <= 0 ? 'Complet' : 'Réserver'}
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
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

      {/* Modal de réservation */}
      {reservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full max-h-[90vh] overflow-auto"
          >
            {success ? (
              <div className="text-center py-8">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-text mb-2">Réservation confirmée !</h3>
                <p className="text-text-light">Vous recevrez un email de confirmation.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-text">{reservationModal.titre}</h3>
                    <p className="text-text-light text-sm mt-1">
                      {new Date(reservationModal.date_evenement).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long'
                      })} à {reservationModal.heure}
                    </p>
                  </div>
                  <button onClick={() => setReservationModal(null)} className="text-text-light hover:text-text">
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                <form onSubmit={handleReserver} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Nom complet</label>
                    <input
                      type="text" required
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent"
                      value={reservationForm.nom}
                      onChange={(e) => setReservationForm(f => ({ ...f, nom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Email</label>
                    <input
                      type="email" required
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent"
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Téléphone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent"
                      value={reservationForm.telephone}
                      onChange={(e) => setReservationForm(f => ({ ...f, telephone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">
                      Nombre de places (max {reservationModal.places_restantes})
                    </label>
                    <input
                      type="number" required min="1" max={reservationModal.places_restantes}
                      className="w-full px-4 py-3 border border-cream-dark rounded-xl bg-cream focus:ring-2 focus:ring-yellow focus:border-transparent"
                      value={reservationForm.nb_places}
                      onChange={(e) => setReservationForm(f => ({ ...f, nb_places: e.target.value }))}
                    />
                  </div>

                  <div className="pt-2 border-t border-cream-dark">
                    <div className="flex justify-between font-bold text-lg mb-4">
                      <span>Total</span>
                      <span className="text-blue">
                        {(Number(reservationModal.prix) * Number(reservationForm.nb_places)).toFixed(0)}€
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-red-500 text-sm">{submitError}</p>
                  )}

                  <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="animate-spin" size={18} /> Réservation en cours...</>
                    ) : (
                      <><Ticket size={18} /> Confirmer la réservation</>
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
