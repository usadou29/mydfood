import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';

export function PolitiqueConfidentialite() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-20">
      <SEO
        title="Politique de Confidentialité"
        description="Politique de confidentialité de DFOOD by Tata Dow. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD."
        canonical="/politique-confidentialite"
      />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-text mb-8">
              Politique de Confidentialité
            </h1>

            <div className="bg-white rounded-2xl shadow-card p-8 space-y-8 text-text-light leading-relaxed">
              <p className="text-sm">Dernière mise à jour : mars 2026</p>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  1. Responsable du traitement
                </h2>
                <p>
                  DFOOD by Tata Dow, dont le siège social est situé à Antony (92160), France,
                  est responsable du traitement de vos données personnelles collectées via
                  le site mydfood.com.
                </p>
                <p className="mt-2">
                  Contact : dfood237@gmail.com
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  2. Données collectées
                </h2>
                <p>Nous collectons les données suivantes dans le cadre de nos services :</p>
                <p className="mt-2">
                  Données d'identification : nom, prénom, adresse email, numéro de téléphone,
                  adresse de livraison. Données de commande : historique des commandes, préférences
                  alimentaires, montants. Données de connexion : adresse IP, navigateur, pages
                  visitées (via cookies techniques).
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  3. Finalités du traitement
                </h2>
                <p>Vos données sont utilisées pour :</p>
                <p className="mt-2">
                  La gestion et le suivi de vos commandes, la communication relative à vos
                  commandes (confirmation, suivi de livraison), l'amélioration de nos services
                  et de votre expérience utilisateur, l'envoi de notre newsletter (avec votre
                  consentement), le respect de nos obligations légales et comptables.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  4. Base légale du traitement
                </h2>
                <p>
                  Le traitement de vos données repose sur l'exécution du contrat (commandes),
                  votre consentement (newsletter, cookies non essentiels), notre intérêt
                  légitime (amélioration des services) et nos obligations légales (comptabilité,
                  facturation).
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  5. Durée de conservation
                </h2>
                <p>
                  Vos données personnelles sont conservées pendant la durée nécessaire aux
                  finalités pour lesquelles elles ont été collectées : données de compte client
                  pendant 3 ans après le dernier contact, données de commande pendant 5 ans
                  (obligations comptables), données de newsletter jusqu'à votre désinscription.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  6. Vos droits (RGPD)
                </h2>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (UE 2016/679),
                  vous disposez des droits suivants : droit d'accès à vos données personnelles,
                  droit de rectification des données inexactes, droit à l'effacement
                  (« droit à l'oubli »), droit à la limitation du traitement, droit à la
                  portabilité de vos données, droit d'opposition au traitement.
                </p>
                <p className="mt-2">
                  Pour exercer ces droits, contactez-nous à dfood237@gmail.com. Nous répondrons
                  dans un délai d'un mois. Vous avez également le droit d'introduire une
                  réclamation auprès de la CNIL (www.cnil.fr).
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  7. Cookies
                </h2>
                <p>
                  Notre site utilise uniquement des cookies techniques nécessaires au
                  fonctionnement du site (authentification, panier). Aucun cookie
                  publicitaire ou de tracking tiers n'est utilisé. Ces cookies techniques
                  ne nécessitent pas votre consentement préalable conformément à la
                  directive ePrivacy.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  8. Partage des données
                </h2>
                <p>
                  Vos données peuvent être partagées avec nos sous-traitants techniques
                  (hébergement, paiement en ligne) dans le strict cadre de la fourniture
                  de nos services. Nous ne vendons ni ne louons vos données personnelles
                  à des tiers. En cas de paiement par carte bancaire, les données de
                  paiement sont traitées directement par Stripe, certifié PCI-DSS.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  9. Sécurité
                </h2>
                <p>
                  Nous mettons en œuvre les mesures techniques et organisationnelles
                  appropriées pour protéger vos données contre tout accès non autorisé,
                  altération, divulgation ou destruction. Les communications sont chiffrées
                  via HTTPS et les données stockées sont protégées par des mécanismes
                  d'authentification robustes.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">
                  10. Modifications
                </h2>
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité
                  à tout moment. Les modifications seront publiées sur cette page avec une
                  date de mise à jour. Nous vous encourageons à consulter régulièrement
                  cette page.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
