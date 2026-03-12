import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoSmall } from './Logo';
import { inscrireNewsletter } from '../services/contact';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [newsletterOk, setNewsletterOk] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await inscrireNewsletter(email);
      setNewsletterOk(true);
      setEmail('');
      setTimeout(() => setNewsletterOk(false), 4000);
    } catch {
      // Silencieux
    }
  };

  const footerLinks = {
    services: [
      { label: 'Commander', path: '/commander' },
      { label: 'Menus Famille', path: '/menus-famille' },
      { label: 'Traiteur', path: '/traiteur' },
      { label: 'Événements', path: '/evenements' },
    ],
    company: [
      { label: 'Contact', path: '/contact' },
      { label: 'Mentions légales', path: '/mentions-legales' },
      { label: 'CGV', path: '/cgv' },
    ],
    support: [
      { label: 'Contact', path: '/contact' },
      { label: 'WhatsApp', path: 'https://wa.me/33600000000', external: true },
    ],
  };

  return (
    <footer className="bg-text pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <LogoSmall className="w-12 h-12" />
              <div>
                <span className="font-display text-xl font-bold text-white">DFOOD</span>
                <span className="block text-[10px] tracking-[0.15em] text-white/60 uppercase">
                  by Tata Dow
                </span>
              </div>
            </Link>
            <p className="text-white/70 mb-6 max-w-sm">
              Cuisine camerounaise authentique, préparée avec amour par Tata Dow.
              Livraison en Île-de-France.
            </p>

            {/* Newsletter */}
            <div>
              <p className="font-semibold text-white mb-3">Newsletter</p>
              {newsletterOk ? (
                <p className="text-green-400 text-sm">Inscription réussie !</p>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Votre email"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-yellow focus:outline-none transition-colors text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-yellow rounded-xl text-text font-medium hover:bg-yellow-dark transition-colors"
                  >
                    OK
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/60 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-white/60 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4">Nous joindre</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.path} className="text-white/60 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="text-white/60 text-sm">+33 6 00 00 00 00</li>
              <li className="text-white/60 text-sm">contact@mydfood.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {currentYear} DFOOD by Tata Dow. Tous droits réservés.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', href: 'https://facebook.com' },
              { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 3h9a4.5 4.5 0 014.5 4.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3z', href: 'https://instagram.com' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-yellow hover:text-text transition-colors"
                aria-label={social.name}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
