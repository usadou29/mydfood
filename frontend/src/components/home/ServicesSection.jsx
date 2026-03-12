import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, UtensilsCrossed, Users, ChefHat, Building2 } from 'lucide-react';
import { services } from '../../data/mockData';

const iconMap = {
  traiteur: <ChefHat size={32} />,
  familial: <Users size={32} />,
  individuel: <UtensilsCrossed size={32} />,
  professionnels: <Building2 size={32} />,
};

export function ServicesSection() {
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
            Nos Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
            Un service pour chaque besoin
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Du repas individuel au banquet, DFOOD s'adapte à toutes vos envies.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream rounded-2xl p-6 shadow-card card-hover group"
            >
              <div className="text-blue mb-4">
                {iconMap[service.id] || <UtensilsCrossed size={32} />}
              </div>
              <h3 className="font-display text-lg font-bold text-text mb-1">{service.title}</h3>
              <p className="text-xs text-blue font-semibold mb-3 uppercase tracking-wide">{service.subtitle}</p>
              <p className="text-text-light text-sm mb-4 line-clamp-3">{service.description}</p>
              <Link
                to={service.link}
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue hover:text-blue-dark transition-colors"
              >
                {service.cta}
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
