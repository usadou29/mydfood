import { useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle, Home, ShoppingBag, Clock, MapPin, Banknote,
  CreditCard, Loader2, AlertCircle, ArrowLeft,
} from 'lucide-react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { fetchCommandeByNumero } from '../services/commandes';
import { StatusBadge } from '../components/admin/StatusBadge';

export function OrderConfirmation() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const { data: commande, loading, error } = useSupabaseQuery(
    () => fetchCommandeByNumero(numero),
    [numero]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue" size={48} />
      </div>
    );
  }

  if (error || !commande) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-text mb-4">Commande introuvable.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <Home size={18} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const lignes = commande.commande_lignes || [];
  const date = new Date(commande.created_at).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text mb-1">
              Commande {commande.numero}
            </h1>
            <p className="text-text-light text-sm">{date}</p>
            <div className="mt-3">
              <StatusBadge statut={commande.statut} />
            </div>
            {paymentStatus === 'success' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                <CreditCard size={16} />
                Paiement confirmé par carte
              </div>
            )}
            {paymentStatus === 'cancelled' && (
              <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-medium">
                <AlertCircle size={16} />
                Paiement annulé — la commande est en attente
              </div>
            )}
          </div>

          {/* Détails */}
          <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
            {/* Infos client */}
            <div>
              <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-2">Client</h3>
              <p className="text-text font-medium">{commande.client_nom}</p>
              <p className="text-sm text-text-light">{commande.client_email} · {commande.client_telephone}</p>
              {commande.client_adresse && (
                <p className="text-sm text-text-light flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {commande.client_adresse}
                </p>
              )}
            </div>

            {/* Livraison */}
            <div>
              <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-2">Livraison</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-text">
                  {commande.type_livraison === 'livraison' ? <MapPin size={14} /> : <ShoppingBag size={14} />}
                  {commande.type_livraison === 'livraison'
                    ? `Livraison — ${commande.zones_livraison?.nom || ''}`
                    : 'Retrait sur place'}
                </span>
                {commande.creneau_livraison && (
                  <span className="flex items-center gap-1.5 text-text">
                    <Clock size={14} />
                    {commande.creneau_livraison}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-text">
                  {commande.mode_paiement === 'especes' ? <Banknote size={14} /> : <CreditCard size={14} />}
                  {commande.mode_paiement === 'especes' ? 'Espèces' : 'Carte bancaire'}
                </span>
              </div>
            </div>

            {/* Articles */}
            <div>
              <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-3">Articles</h3>
              <div className="space-y-2">
                {lignes.map((ligne) => (
                  <div key={ligne.id} className="flex justify-between text-sm">
                    <span className="text-text">
                      {ligne.nom} <span className="text-text-light">x{ligne.quantite}</span>
                    </span>
                    <span className="font-medium text-text">{Number(ligne.sous_total).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totaux */}
            <div className="border-t border-cream-dark pt-4 space-y-2">
              <div className="flex justify-between text-sm text-text">
                <span>Sous-total</span>
                <span>{Number(commande.sous_total).toFixed(2)}€</span>
              </div>
              {Number(commande.frais_livraison) > 0 && (
                <div className="flex justify-between text-sm text-text">
                  <span>Frais de livraison</span>
                  <span>{Number(commande.frais_livraison).toFixed(2)}€</span>
                </div>
              )}
              {Number(commande.pourboire) > 0 && (
                <div className="flex justify-between text-sm text-text">
                  <span>Pourboire</span>
                  <span>{Number(commande.pourboire).toFixed(2)}€</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-cream-dark">
                <span>Total</span>
                <span className="text-blue">{Number(commande.total).toFixed(2)}€</span>
              </div>
            </div>

            {/* Message client */}
            {commande.message_client && (
              <div className="bg-cream rounded-xl p-4">
                <p className="text-sm font-medium text-text mb-1">Instructions</p>
                <p className="text-sm text-text-light">{commande.message_client}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-text-light hover:text-text hover:bg-white transition-colors"
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <Link
              to="/commander"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Commander à nouveau
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
