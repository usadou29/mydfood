import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Phone, UtensilsCrossed } from 'lucide-react';

export function ReservationCTA() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-blue rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                Un événement à préparer ?
              </h2>
              <p className="text-white/90 mb-6 leading-relaxed">
                Service traiteur camerounais pour vos anniversaires, mariages
                et soirées privées. Tata Dow s'occupe de régaler vos invités.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/traiteur"
                  className="inline-flex items-center justify-center gap-2 bg-yellow text-text px-6 py-3.5 rounded-xl font-semibold hover:bg-yellow-dark transition-colors"
                >
                  Demander un devis
                  <CalendarDays size={18} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  <Phone size={18} />
                  Nous contacter
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white/20 bg-white/10">
                {imgError ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed size={64} className="text-white/40" />
                  </div>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1555244162-803279f50793?w=600&h=600&fit=crop"
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
