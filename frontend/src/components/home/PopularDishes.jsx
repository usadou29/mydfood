import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { fetchPlats } from '../../services/plats';
import { useCart } from '../../context/CartContext';

export function PopularDishes() {
  const { data: plats, loading } = useSupabaseQuery(() => fetchPlats({ populaire: true }));
  const { addToCart } = useCart();

  const handleAddToCart = (plat) => {
    addToCart({
      id: plat.id,
      type: 'plat',
      nom: plat.nom,
      prix: plat.prix,
      image_url: plat.image_url,
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full mb-4">
            Nos Best-Sellers
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
            Plats Populaires
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Découvrez les plats camerounais les plus appréciés par nos clients
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue" size={40} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plats && plats.slice(0, 4).map((plat, index) => (
              <motion.div
                key={plat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-cream rounded-2xl overflow-hidden shadow-card card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={plat.image_url}
                    alt={plat.nom}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  {plat.populaire && (
                    <div className="absolute top-3 left-3 bg-yellow text-text px-3 py-1 rounded-full text-xs font-semibold">
                      Populaire
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-text mb-1">{plat.nom}</h3>
                  <p className="text-sm text-text-light mb-3 line-clamp-2">{plat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue">{Number(plat.prix).toFixed(0)}€</span>
                    <button
                      onClick={() => handleAddToCart(plat)}
                      className="p-2 bg-yellow rounded-xl text-text hover:bg-yellow-dark transition-colors"
                      aria-label={`Ajouter ${plat.nom} au panier`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
