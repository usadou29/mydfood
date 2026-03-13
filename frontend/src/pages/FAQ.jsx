import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SEO } from '../components/SEO';

const faqData = [
  {
    categorie: 'Commandes',
    questions: [
      {
        q: 'Comment passer une commande ?',
        a: 'Rendez-vous sur la page "Commander", sélectionnez vos plats, ajoutez-les au panier puis validez votre commande en renseignant vos informations de livraison et votre mode de paiement.',
      },
      {
        q: 'Y a-t-il un minimum de commande ?',
        a: 'Oui, le minimum de commande dépend de votre zone de livraison. Il est affiché sur la page de commande une fois votre zone sélectionnée.',
      },
      {
        q: 'Puis-je modifier ou annuler ma commande ?',
        a: 'Vous pouvez nous contacter par téléphone ou WhatsApp dans les 30 minutes suivant votre commande pour toute modification ou annulation. Au-delà, la préparation ayant déjà commencé, les modifications ne sont plus possibles.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Après validation, vous recevez un email de confirmation avec un numéro de suivi. Vous pouvez aussi consulter l\'état de votre commande depuis votre espace "Mon compte".',
      },
    ],
  },
  {
    categorie: 'Livraison',
    questions: [
      {
        q: 'Quelles sont les zones de livraison ?',
        a: 'Nous livrons actuellement en Île-de-France. Les zones disponibles et les frais associés sont affichés lors de la commande. Nous étendons régulièrement notre couverture.',
      },
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Les commandes sont livrées sous 24h. Vous choisissez un créneau de livraison lors de la commande. Nous faisons notre maximum pour respecter le créneau choisi.',
      },
      {
        q: 'Puis-je récupérer ma commande sur place ?',
        a: 'Oui, l\'option "Retrait sur place" est disponible et gratuite. L\'adresse de retrait vous sera communiquée lors de la confirmation de commande.',
      },
    ],
  },
  {
    categorie: 'Paiement',
    questions: [
      {
        q: 'Quels modes de paiement acceptez-vous ?',
        a: 'Nous acceptons le paiement par carte bancaire (Visa, Mastercard) via Stripe, ainsi que le paiement en espèces à la livraison.',
      },
      {
        q: 'Le paiement en ligne est-il sécurisé ?',
        a: 'Absolument. Nous utilisons Stripe, un prestataire de paiement certifié PCI-DSS. Vos données bancaires ne transitent jamais par nos serveurs.',
      },
      {
        q: 'Puis-je obtenir une facture ?',
        a: 'Oui, un récapitulatif de commande vous est envoyé par email après chaque achat. Pour une facture détaillée, contactez-nous à dfood237@gmail.com.',
      },
    ],
  },
  {
    categorie: 'Allergènes & régimes',
    questions: [
      {
        q: 'Vos plats sont-ils Halal ?',
        a: 'Oui, toutes nos viandes sont 100% Halal certifiées. C\'est un engagement fondamental de DFOOD by Tata Dow.',
      },
      {
        q: 'Comment connaître les allergènes présents dans un plat ?',
        a: 'Chaque plat sur notre carte indique la liste des allergènes. Cliquez sur "Allergènes" sous la description du plat pour voir le détail. En cas de doute, contactez-nous.',
      },
      {
        q: 'Proposez-vous des options végétariennes ?',
        a: 'Certains de nos plats et accompagnements sont végétariens. Consultez notre carte ou contactez-nous pour connaître les options disponibles du moment.',
      },
      {
        q: 'Comment signaler une allergie alimentaire ?',
        a: 'Lors de votre commande, vous pouvez ajouter un message pour signaler toute allergie ou restriction alimentaire. Nous adaptons la préparation en conséquence dans la mesure du possible.',
      },
    ],
  },
];

export function FAQ() {
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-cream pt-20">
      <SEO
        title="FAQ — Questions Fréquentes"
        description="Trouvez les réponses à vos questions sur les commandes, la livraison, le paiement et les allergènes chez DFOOD by Tata Dow."
        canonical="/faq"
      />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
              Questions fréquentes
            </h1>
            <p className="mt-4 text-text-light">
              Tout ce que vous devez savoir sur DFOOD et nos services.
            </p>
          </motion.div>

          <div className="space-y-10">
            {faqData.map((section, sectionIdx) => (
              <motion.div
                key={section.categorie}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIdx * 0.1 }}
              >
                <h2 className="font-display text-xl font-bold text-text mb-4">
                  {section.categorie}
                </h2>
                <div className="space-y-3">
                  {section.questions.map((item, qIdx) => {
                    const key = `${sectionIdx}-${qIdx}`;
                    const isOpen = openItems[key];
                    return (
                      <div
                        key={key}
                        className="bg-white rounded-xl shadow-card overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left"
                        >
                          <span className="font-medium text-text pr-4">
                            {item.q}
                          </span>
                          <ChevronDown
                            size={20}
                            className={`text-text-light shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-text-light leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
