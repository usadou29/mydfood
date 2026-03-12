import { motion } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery';
import { supabase } from '../../lib/supabase';

async function fetchTemoignages() {
  const { data, error } = await supabase
    .from('temoignages')
    .select('*')
    .eq('approuve', true)
    .order('created_at', { ascending: false })
    .limit(3);
  if (error) throw error;
  return data;
}

// Fallback data in case Supabase table is empty or not yet populated
const fallbackTemoignages = [
  {
    id: 1,
    nom: 'Marie L.',
    commentaire: "Une découverte ! Les saveurs sont authentiques et le service impeccable.",
    note: 5,
  },
  {
    id: 2,
    nom: 'Jean P.',
    commentaire: "Menu famille parfait pour nos dîners entre amis. Tata Dow est une chef exceptionnelle.",
    note: 5,
  },
  {
    id: 3,
    nom: 'Sophie D.',
    commentaire: "Traiteur pour mon anniversaire, tous mes invités ont adoré. Merci !",
    note: 5,
  },
];

export function Testimonials() {
  const { data: temoignages, loading } = useSupabaseQuery(fetchTemoignages);

  const items = temoignages && temoignages.length > 0 ? temoignages : fallbackTemoignages;

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
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
            Ce que disent nos clients
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            La satisfaction de nos clients est notre plus belle récompense
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue" size={40} />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-cream rounded-2xl p-6 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.note || 5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-yellow fill-yellow"
                    />
                  ))}
                </div>
                <p className="text-text mb-6 leading-relaxed">
                  "{t.commentaire}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue font-bold text-sm">
                      {t.nom?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-text">{t.nom}</p>
                    <p className="text-sm text-text-light">Client vérifié</p>
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
