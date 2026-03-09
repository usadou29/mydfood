import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, X, ChefHat, Info } from 'lucide-react';
import { Button } from '../components/Button';
import { plats, zonesLivraison } from '../data/mockData';

export function Commander() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(zonesLivraison[0]);
  const [showAllergens, setShowAllergens] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToCart = (plat) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === plat.id);
      if (existing) {
        return prev.map(item => 
          item.id === plat.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...plat, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (platId) => {
    setCart(prev => prev.filter(item => item.id !== platId));
  };

  const updateQuantity = (platId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === platId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithDelivery = cartTotal + selectedZone.prix;
  const canOrder = cartTotal >= selectedZone.minCommande;

  return (
    <div className="min-h-screen bg-cream pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-anthracite">
            Commander vos plats
          </h1>
          <p className="mt-4 text-gray-600">
            Livraison ou retrait sous 24h. Commande minimum : {selectedZone.minCommande}€
          </p>
        </motion.div>

        {/* Zone de livraison */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 mb-8 shadow-lg"
        >
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Info size={20} className="text-terracotta" />
            Zone de livraison
          </h2>
          <div className="flex flex-wrap gap-3">
            {zonesLivraison.map((zone) => (
              <button
                key={zone.nom}
                onClick={() => setSelectedZone(zone)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedZone.nom === zone.nom
                    ? 'bg-terracotta text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {zone.nom} {zone.prix > 0 ? `(+${zone.prix}€)` : '(Gratuit)'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plats.map((plat, index) => (
            <motion.div
              key={plat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img 
                  src={plat.image} 
                  alt={plat.name}
                  className="w-full h-full object-cover"
                />
                {plat.popular && (
                  <span className="absolute top-3 left-3 bg-terracotta text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Populaire
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-lg font-bold">{plat.name}</h3>
                  <span className="text-xl font-bold text-terracotta">{plat.price}€</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{plat.description}</p>
                
                {plat.allergens.length > 0 && (
                  <div className="mb-4">
                    <button 
                      onClick={() => setShowAllergens(showAllergens === plat.id ? null : plat.id)}
                      className="text-xs text-gray-500 underline"
                    >
                      Allergènes
                    </button>
                    {showAllergens === plat.id && (
                      <p className="text-xs text-gray-600 mt-1">
                        Contient : {plat.allergens.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => addToCart(plat)}
                >
                  <Plus size={18} />
                  Ajouter au panier
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
              className="fixed bottom-6 right-6 z-40 bg-terracotta text-white p-4 rounded-full shadow-xl lg:hidden"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-gold text-anthracite text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
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
                <div className="flex items-center justify-between p-4 border-b lg:hidden">
                  <h2 className="font-display text-xl font-bold">Votre panier</h2>
                  <button onClick={() => setIsCartOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                {/* Desktop cart */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    <ShoppingCart size={24} className="text-terracotta" />
                    Votre panier
                  </h2>

                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Votre panier est vide</p>
                  ) : (
                    <>
                      <div className="space-y-4 max-h-64 overflow-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                              <p className="text-terracotta font-bold">{item.price}€</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sous-total</span>
                          <span>{cartTotal.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Livraison ({selectedZone.nom})</span>
                          <span>{selectedZone.prix > 0 ? `${selectedZone.prix}€` : 'Gratuit'}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>Total</span>
                          <span className="text-terracotta">{totalWithDelivery.toFixed(2)}€</span>
                        </div>
                      </div>

                      {!canOrder && (
                        <p className="text-amber-600 text-sm mt-4 text-center">
                          Minimum {selectedZone.minCommande}€ pour commander
                        </p>
                      )}

                      <Button 
                        variant="primary" 
                        className="w-full mt-4"
                        disabled={!canOrder}
                        onClick={() => alert('Redirection vers la page de paiement...')}
                      >
                        Passer commande
                      </Button>

                      <a 
                        href={`https://wa.me/33600000000?text=${encodeURIComponent(`Commande DFOOD:\n${cart.map(item => `- ${item.quantity}x ${item.name} (${item.price}€)`).join('\n')}\n\nTotal: ${totalWithDelivery.toFixed(2)}€`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-green-600 text-sm mt-3 hover:underline"
                      >
                        Commander sur WhatsApp
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
