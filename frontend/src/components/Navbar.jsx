import { Link, useLocation } from 'react-router-dom';
import { LogoSmall } from './Logo';
import { useState, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/commander', label: 'Commander' },
    { path: '/menus-famille', label: 'Menus Famille' },
    { path: '/traiteur', label: 'Traiteur' },
    { path: '/evenements', label: 'Événements' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft py-3'
          : 'bg-transparent py-5'
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
                Freshly Cooked
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

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              to="/commander"
              className="btn-primary text-sm inline-flex items-center gap-2"
            >
              Commander
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-cream-dark transition-colors"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 bg-text rounded-full transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 bg-text rounded-full transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 bg-text rounded-full transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-cream-dark animate-fade-in-up">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-yellow text-text'
                      : 'text-text-light hover:bg-cream-dark'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/commander"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary text-sm text-center mt-2"
              >
                Commander
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
