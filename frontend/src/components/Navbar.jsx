import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Phone } from 'lucide-react';

const navLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Commander', href: '/commander' },
  { name: 'Menus Famille', href: '/menus-famille' },
  { name: 'Traiteur', href: '/traiteur' },
  { name: 'Événements', href: '/evenements' },
  { name: 'Contact', href: '/contact' }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-cream/95 backdrop-blur-md shadow-lg' 
            : 'bg-gradient-to-b from-black/50 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl lg:text-3xl font-bold text-terracotta drop-shadow-lg">
                DFOOD
              </span>
              <span className={`hidden sm:block text-sm transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>by Tata Dow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-terracotta drop-shadow-md ${
                    location.pathname === link.href 
                      ? 'text-terracotta' 
                      : scrolled 
                        ? 'text-gray-700' 
                        : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/33600000000"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:flex items-center gap-2 text-sm font-medium transition-colors drop-shadow-md ${scrolled ? 'text-green-600 hover:text-green-700' : 'text-green-400 hover:text-green-300'}`}
              >
                <Phone size={18} />
                WhatsApp
              </a>
              <Link
                to="/commander"
                className="bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta-dark transition-colors"
              >
                Commander
              </Link>
              <button
                className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cream lg:hidden"
          >
            <div className="pt-20 px-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`block py-3 text-lg font-medium border-b border-gray-200 ${
                        location.pathname === link.href ? 'text-terracotta' : 'text-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4"
                >
                  <a
                    href="https://wa.me/33600000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 font-medium"
                  >
                    <Phone size={20} />
                    Commander sur WhatsApp
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
