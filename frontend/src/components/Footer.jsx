import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-anthracite text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-bold text-terracotta">DFOOD</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Cuisine camerounaise moderne par Tata Dow. 
              Des saveurs authentiques préparées avec amour.
            </p>
            <div className="mt-6 flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-terracotta transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-terracotta transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/commander" className="text-gray-400 hover:text-white transition-colors">Commander</Link>
              </li>
              <li>
                <Link to="/menus-famille" className="text-gray-400 hover:text-white transition-colors">Menus Famille</Link>
              </li>
              <li>
                <Link to="/traiteur" className="text-gray-400 hover:text-white transition-colors">Traiteur</Link>
              </li>
              <li>
                <Link to="/evenements" className="text-gray-400 hover:text-white transition-colors">Événements</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Nos Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Plats individuels</li>
              <li className="text-gray-400">Menus famille</li>
              <li className="text-gray-400">Traiteur événementiel</li>
              <li className="text-gray-400">Corporate & B2B</li>
              <li className="text-gray-400">Ateliers cuisine</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={16} className="text-terracotta" />
                +33 6 00 00 00 00
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={16} className="text-terracotta" />
                contact@mydfood.com
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin size={16} className="text-terracotta flex-shrink-0 mt-1" />
                Antony, 92160
              </li>
            </ul>
            <a 
              href="https://wa.me/33600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Phone size={16} />
              Commander sur WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 DFOOD by Tata Dow. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/mentions-legales" className="text-gray-500 hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv" className="text-gray-500 hover:text-white transition-colors">
              CGV
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
