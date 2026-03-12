import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function CGV() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-20">
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-8">
              Conditions Générales de Vente
            </h1>

            <div className="bg-white rounded-2xl shadow-card p-8 space-y-8 text-text-light leading-relaxed">
              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">1. Objet</h2>
                <p>
                  Les présentes conditions régissent les ventes de plats préparés et services
                  de restauration proposés par DFOOD by Tata Dow via le site mydfood.com.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">2. Commandes</h2>
                <p>
                  Les commandes sont passées via notre site web. Toute commande implique
                  l'acceptation des présentes conditions. Un montant minimum de commande
                  est requis selon la zone de livraison.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">3. Prix</h2>
                <p>
                  Les prix sont indiqués en euros TTC. DFOOD by Tata Dow se réserve le droit
                  de modifier ses prix à tout moment. Les frais de livraison varient selon
                  la zone géographique.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">4. Livraison</h2>
                <p>
                  Les livraisons sont effectuées dans les zones couvertes (Antony, proche
                  banlieue, Paris, Île-de-France). Les délais de livraison sont estimatifs
                  et varient selon la zone. Le retrait est gratuit à nos points de collecte.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">5. Paiement</h2>
                <p>
                  Le paiement s'effectue en ligne par carte bancaire via notre partenaire
                  de paiement sécurisé Stripe. Le paiement en espèces est accepté
                  uniquement pour les retraits sur place.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">6. Annulation</h2>
                <p>
                  Toute commande peut être annulée gratuitement dans un délai de 2 heures
                  après la commande. Au-delà, aucun remboursement ne sera effectué sauf
                  en cas de non-conformité du produit.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">7. Allergènes</h2>
                <p>
                  Les allergènes présents dans nos plats sont indiqués sur chaque fiche produit.
                  En cas de doute, contactez-nous avant de passer commande.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">8. Réclamations</h2>
                <p>
                  Pour toute réclamation, contactez-nous à contact@mydfood.com ou
                  au +33 6 00 00 00 00. Nous nous engageons à traiter votre demande
                  dans un délai de 48 heures.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
