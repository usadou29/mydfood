import { Link, useLocation } from 'react-router-dom';
import { LogoSmall } from './Logo';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/commander', label: 'Commander' },
    { path: '/menus-famille', label: 'Menus Famille' },
    { path: '/traiteur', label: 'Traiteur' },
    { path: '/evenements', label: 'Événements' },
    { path: '/chef-prive', label: 'Chef Privé' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft py-3'
          : 'bg-white/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <LogoSmall className="w-12 h-12 transition-transform group-hover:scale-105" />
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold text-text">DFOOD</span>
              <span className="block text-[10px] tracking-[0.15em] text-text-light uppercase">
                by Tata Dow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-blue font-semibold'
                    : 'text-text-light hover:text-text'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + Cart + Auth */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/commander" className="relative p-2 text-text-light hover:text-text transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow text-text text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm text-blue hover:text-blue/80 transition-colors font-medium"
                  >
                    <Settings size={16} />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profil"
                  className="flex items-center gap-2 text-sm text-text-light hover:text-text transition-colors"
                >
                  <User size={18} />
                  <span className="font-medium">{profile?.prenom || 'Mon compte'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-text-light hover:text-red-600 transition-colors"
                  aria-label="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/connexion"
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile: Cart + Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/commander" className="relative p-2 text-text-light hover:text-text transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow text-text text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-cream-dark transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`h-0.5 bg-text rounded-full transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 bg-text rounded-full transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 bg-text rounded-full transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-cream-dark animate-fade-in-up">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-yellow text-text'
                      : 'text-text-light hover:bg-cream-dark hover:text-text'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-cream-dark mt-2 pt-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-blue hover:bg-blue/10 transition-colors"
                      >
                        <Settings size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profil"
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-text-light hover:bg-cream-dark hover:text-text transition-colors"
                    >
                      <User size={16} />
                      {profile?.prenom || 'Mon compte'}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-text-light hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/connexion"
                    className="btn-primary text-sm text-center block"
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
