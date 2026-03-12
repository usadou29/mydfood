import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function MentionsLegales() {
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
              Mentions Légales
            </h1>

            <div className="bg-white rounded-2xl shadow-card p-8 space-y-8 text-text-light leading-relaxed">
              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">Éditeur du site</h2>
                <p>DFOOD by Tata Dow</p>
                <p>Adresse : Antony, 92160, France</p>
                <p>Email : contact@mydfood.com</p>
                <p>Téléphone : +33 6 00 00 00 00</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">Hébergement</h2>
                <p>Ce site est hébergé par Vercel Inc.</p>
                <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">Propriété intellectuelle</h2>
                <p>
                  L'ensemble du contenu de ce site (textes, images, logos, vidéos) est protégé
                  par le droit d'auteur. Toute reproduction, même partielle, est interdite sans
                  autorisation préalable de DFOOD by Tata Dow.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">Données personnelles</h2>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD),
                  vous disposez d'un droit d'accès, de rectification et de suppression de vos
                  données personnelles. Pour exercer ce droit, contactez-nous à contact@mydfood.com.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-text mb-3">Cookies</h2>
                <p>
                  Ce site utilise des cookies techniques nécessaires à son fonctionnement.
                  Aucun cookie publicitaire ou de suivi n'est utilisé.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
