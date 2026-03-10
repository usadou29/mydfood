import { Link } from 'react-router-dom';
import { LogoSmall } from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Commander', path: '/commander' },
      { label: 'Menus Famille', path: '/menus-famille' },
      { label: 'Traiteur', path: '/traiteur' },
      { label: 'Événements', path: '/evenements' },
    ],
    company: [
      { label: 'À propos', path: '/contact' },
      { label: 'Nos Chefs', path: '/#' },
      { label: 'Carrières', path: '/#' },
      { label: 'Blog', path: '/#' },
    ],
    support: [
      { label: 'FAQ', path: '/#' },
      { label: 'Livraison', path: '/#' },
      { label: 'Contact', path: '/contact' },
      { label: 'Mentions légales', path: '/#' },
    ],
  };

  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <LogoSmall className="w-12 h-12" />
              <div>
                <span className="font-display text-xl font-bold text-text">DFOOD</span>
                <span className="block text-[10px] tracking-[0.15em] text-text-light uppercase">
                  Freshly Cooked
                </span>
              </div>
            </Link>
            <p className="text-text-light mb-6 max-w-sm">
              Une cuisine maison d'exception, préparée avec amour et livrée chez vous. 
              Frais, local et délicieux.
            </p>
            
            {/* Newsletter */}
            <div>
              <p className="font-semibold text-text mb-3">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:border-yellow focus:outline-none transition-colors text-sm"
                />
                <button className="px-4 py-2.5 bg-yellow rounded-xl text-text font-medium hover:bg-yellow-dark transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-text mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-text-light hover:text-text transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-text mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-text-light hover:text-text transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-text mb-4">Aide</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-text-light hover:text-text transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-cream-dark flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-light text-sm">
            © {currentYear} DFOOD. Tous droits réservés.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 3h9a4.5 4.5 0 014.5 4.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3z' },
              { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-text-light hover:bg-yellow hover:text-text transition-colors"
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
