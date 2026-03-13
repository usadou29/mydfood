import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, X, Info, Loader2 } from 'lucide-react';
import { SkeletonCardGrid } from '../components/Skeleton';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { useToast } from '../context/ToastContext';
import { fetchPlats } from '../services/plats';
import { fetchZonesLivraison } from '../services/commandes';
import { SEO } from '../components/SEO';

export function Commander() {
  const navigate = useNavigate();
  const { data: plats, loading: loadingPlats, error: errorPlats } = useSupabaseQuery(fetchPlats);
  const { data: zones, loading: loadingZones } = useSupabaseQuery(fetchZonesLivraison);

  const { cart, addToCart, updateQuantite, cartTotal, cartCount } = useCart();
  const { addToast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showAllergens, setShowAllergens] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sélectionner la première zone par défaut quand les données arrivent
  useEffect(() => {
    if (zones && zones.length > 0 && !selectedZone) {
      setSelectedZone(zones[0]);
    }
  }, [zones, selectedZone]);

  const fraisLivraison = selectedZone ? Number(selectedZone.frais_livraison) : 0;
  const minimumCommande = selectedZone ? Number(selectedZone.minimum_commande) : 0;
  const totalWithDelivery = cartTotal + fraisLivraison;
  const canOrder = cartTotal >= minimumCommande;

  const handleAddToCart = (plat) => {
    // Check stock limit before adding
    if (plat.portions_restantes !== null) {
      const inCart = cart.find((i) => i.id === plat.id && i.type === 'plat');
      const qtyInCart = inCart ? inCart.quantite : 0;
      if (qtyInCart >= plat.portions_restantes) {
        addToast(`Stock limité à ${plat.portions_restantes} portion${plat.portions_restantes > 1 ? 's' : ''} pour "${plat.nom}"`, 'warning');
        return;
      }
    }
    addToCart({
      id: plat.id,
      type: 'plat',
      nom: plat.nom,
      prix: plat.prix,
      image_url: plat.image_url,
    });
    setIsCartOpen(true);
  };

  if (loadingPlats || loadingZones) {
    return (
      <div className="min-h-screen bg-cream pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-cream-dark rounded h-10 w-64 mx-auto mb-4" />
            <div className="animate-pulse bg-cream-dark rounded h-4 w-48 mx-auto" />
          </div>
          <SkeletonCardGrid count={6} />
        </div>
      </div>
    );
  }

  if (errorPlats) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur de chargement : {errorPlats}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20 pb-32">
      <SEO
        title="Commander"
        description="Commandez vos plats camerounais préférés en ligne. Livraison en Île-de-France sous 24h. Viandes 100% Halal, fait maison."
        canonical="/commander"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text">
            Commander vos plats
          </h1>
          <p className="mt-4 text-text-light">
            Livraison ou retrait sous 24h. Commande minimum : {minimumCommande}€
          </p>
        </motion.div>

        {/* Zone de livraison */}
        {zones && zones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 mb-8 shadow-card"
          >
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-text">
              <Info size={20} className="text-blue" />
              Zone de livraison
            </h2>
            <div className="flex flex-wrap gap-3">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedZone?.id === zone.id
                      ? 'bg-yellow text-text'
                      : 'bg-cream text-text-light hover:bg-cream-dark'
                  }`}
                >
                  {zone.nom} {Number(zone.frais_livraison) > 0 ? `(+${zone.frais_livraison}€)` : '(Gratuit)'}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Plats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plats && plats.map((plat, index) => (
            <motion.div
              key={plat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={plat.image_url}
                  alt={plat.nom}
                  className="w-full h-full object-cover"
                />
                {plat.populaire && (
                  <span className="absolute top-3 left-3 bg-yellow text-text px-3 py-1 rounded-full text-xs font-semibold">
                    Populaire
                  </span>
                )}
                {plat.portions_restantes !== null && plat.portions_restantes <= 5 && plat.portions_restantes > 0 && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Plus que {plat.portions_restantes} !
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-lg font-bold text-text">{plat.nom}</h3>
                  <span className="text-xl font-bold text-blue">{Number(plat.prix).toFixed(0)}€</span>
                </div>
                <p className="text-text-light text-sm mb-4">{plat.description}</p>

                {plat.allergens && plat.allergens.length > 0 && (
                  <div className="mb-4">
                    <button
                      onClick={() => setShowAllergens(showAllergens === plat.id ? null : plat.id)}
                      className="text-xs text-text-light underline"
                    >
                      Allergènes
                    </button>
                    {showAllergens === plat.id && (
                      <p className="text-xs text-text-light mt-1">
                        Contient : {plat.allergens.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleAddToCart(plat)}
                  disabled={plat.portions_restantes !== null && plat.portions_restantes <= 0}
                >
                  <Plus size={18} />
                  {plat.portions_restantes !== null && plat.portions_restantes <= 0 ? 'Épuisé' : 'Ajouter au panier'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Panier flottant */}
      <AnimatePresence>
        {cart.length > 0 && (
          <>
            {/* Bouton panier mobile */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="fixed bottom-6 right-6 z-40 bg-blue text-white p-4 rounded-full shadow-xl lg:hidden"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-yellow text-text text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </motion.button>

            {/* Sidebar panier */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: isCartOpen ? 0 : '100%' }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 lg:translate-x-0 lg:static lg:w-auto lg:bg-transparent lg:shadow-none"
            >
              <div className="h-full flex flex-col lg:fixed lg:right-8 lg:top-24 lg:w-80 lg:h-auto lg:max-h-[calc(100vh-8rem)]">
                {/* Header panier */}
                <div className="flex items-center justify-between p-4 border-b border-cream-dark lg:hidden">
                  <h2 className="font-display text-xl font-bold text-text">Votre panier</h2>
                  <button onClick={() => setIsCartOpen(false)}>
                    <X size={24} className="text-text" />
                  </button>
                </div>

                {/* Desktop cart */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-card p-6">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-text">
                    <ShoppingCart size={24} className="text-blue" />
                    Votre panier
                  </h2>

                  <div className="space-y-4 max-h-64 overflow-auto">
                    {cart.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="flex items-center gap-3">
                        <img src={item.image_url} alt={item.nom} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-text">{item.nom}</h4>
                          <p className="text-blue font-bold">{item.prix}€</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantite(item.id, -1, item.type)}
                            className="w-8 h-8 bg-cream rounded-full flex items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-text">{item.quantite}</span>
                          <button
                            onClick={() => {
                              const plat = plats?.find((p) => p.id === item.id);
                              if (plat?.portions_restantes !== null && plat?.portions_restantes !== undefined && item.quantite >= plat.portions_restantes) {
                                addToast(`Stock limité à ${plat.portions_restantes} pour "${item.nom}"`, 'warning');
                                return;
                              }
                              updateQuantite(item.id, 1, item.type);
                            }}
                            className="w-8 h-8 bg-cream rounded-full flex items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-cream-dark space-y-2">
                    <div className="flex justify-between text-sm text-text">
                      <span>Sous-total</span>
                      <span>{cartTotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm text-text">
                      <span>Livraison ({selectedZone?.nom})</span>
                      <span>{fraisLivraison > 0 ? `${fraisLivraison}€` : 'Gratuit'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-cream-dark">
                      <span>Total</span>
                      <span className="text-blue">{totalWithDelivery.toFixed(2)}€</span>
                    </div>
                  </div>

                  {!canOrder && (
                    <p className="text-yellow-warning text-sm mt-4 text-center font-medium">
                      Minimum {minimumCommande}€ pour commander
                    </p>
                  )}

                  <Button
                    variant="primary"
                    className="w-full mt-4"
                    disabled={!canOrder}
                    onClick={() => navigate('/checkout')}
                  >
                    Passer commande
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
