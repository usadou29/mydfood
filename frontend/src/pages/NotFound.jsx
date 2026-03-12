import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <h1 className="font-display text-8xl font-bold text-yellow mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-text mb-4">
          Page introuvable
        </h2>
        <p className="text-text-light mb-8 max-w-md mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée.
          Retournez à l'accueil pour découvrir nos plats camerounais.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary">
              <Home size={18} />
              Retour à l'accueil
            </Button>
          </Link>
          <Link to="/commander">
            <Button variant="secondary">
              <ArrowLeft size={18} />
              Commander
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
