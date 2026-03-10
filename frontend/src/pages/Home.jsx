import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

// Mock data for dishes
const popularDishes = [
  {
    id: 1,
    name: 'Poulet Rôti aux Herbes',
    description: 'Poulet fermier rôti avec herbes de Provence',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Saumon Grillé',
    description: 'Filet de saumon avec sauce citronnée',
    price: 22.50,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Risotto aux Champignons',
    description: 'Risotto crémeux aux champignons sauvages',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Bowl Végétarien',
    description: 'Quinoa, avocat, légumes grillés et houmous',
    price: 14.90,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    rating: 4.6,
  },
];

const menuItems = [
  { id: 1, name: 'Burger Gourmet', price: 15.90, category: 'burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { id: 2, name: 'Pizza Margherita', price: 13.50, category: 'pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
  { id: 3, name: 'Pâtes Carbonara', price: 14.90, category: 'pasta', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop' },
  { id: 4, name: 'Salade César', price: 12.90, category: 'salad', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop' },
  { id: 5, name: 'Steak Frites', price: 21.90, category: 'plat', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop' },
  { id: 6, name: 'Tacos Poulet', price: 11.90, category: 'burger', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop' },
  { id: 7, name: 'Sushi Mix', price: 19.90, category: 'asian', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop' },
  { id: 8, name: 'Ramen Bowl', price: 16.50, category: 'asian', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop' },
];

const testimonials = [
  {
    id: 1,
    name: 'Marie L.',
    text: 'Une cuisine maison d\'exception ! Les plats sont frais, savoureux et parfaitement présentés.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Pierre D.',
    text: 'Le service traiteur pour mon anniversaire était impeccable. Mes invités ont adoré !',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Sophie M.',
    text: 'Je commande chaque semaine le menu famille. Qualité constante et livraison ponctuelle.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
];

const chefs = [
  {
    id: 1,
    name: 'Chef Antoine',
    role: 'Chef Exécutif',
    image: 'https://images.unsplash.com/photo-1583394293214-28ez9e9c8f75?w=300&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Chef Sarah',
    role: 'Chef Pâtissière',
    image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Chef Marco',
    role: 'Chef Italian',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&h=400&fit=crop',
  },
];

const filters = ['Tout', 'Burger', 'Pizza', 'Pâtes', 'Salade', 'Asiatique'];

export function Home() {
  const [activeFilter, setActiveFilter] = useState('Tout');
  const [animatedSection, setAnimatedSection] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedSection((prev) => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const filteredMenu = activeFilter === 'Tout'
    ? menuItems
    : menuItems.filter(item => {
        const filterMap = {
          'Burger': 'burger',
          'Pizza': 'pizza',
          'Pâtes': 'pasta',
          'Salade': 'salad',
          'Asiatique': 'asian',
        };
        return item.category === filterMap[activeFilter];
      });

  const isVisible = (id) => animatedSection.includes(id);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-yellow/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} data-animate id="hero">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="w-20 h-20" />
                <div>
                  <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full">
                    Frais & Maison
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text leading-tight mb-6">
                Des plats <span className="text-blue">maison</span> livrés chez vous
              </h1>
              
              <p className="text-lg text-text-light mb-8 max-w-lg leading-relaxed">
                Découvrez une cuisine authentique, préparée avec amour et des ingrédients frais. 
                Livraison rapide et emballages éco-responsables.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/commander" className="btn-primary text-center inline-flex items-center justify-center gap-2">
                  Commander maintenant
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/menus-famille" className="btn-secondary text-center">
                  Voir les menus famille
                </Link>
              </div>
              
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  className="w-full px-6 py-4 pr-14 rounded-2xl border-2 border-cream-dark bg-white focus:border-yellow focus:outline-none transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow rounded-xl text-text hover:bg-yellow-dark transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex gap-8 mt-10 pt-8 border-t border-cream-dark">
                <div>
                  <p className="text-3xl font-display font-bold text-blue">15K+</p>
                  <p className="text-sm text-text-light">Clients satisfaits</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-blue">200+</p>
                  <p className="text-sm text-text-light">Plats disponibles</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-blue">4.9</p>
                  <p className="text-sm text-text-light">Note moyenne</p>
                </div>
              </div>
            </div>
            
            <div className={`relative transition-all duration-700 delay-200 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px] mx-auto">
                  <div className="absolute inset-0 rounded-full bg-yellow/30 animate-pulse" />
                  <div className="absolute inset-4 rounded-full bg-cream-dark overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop"
                      alt="Plat gourmet"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card p-4 animate-float">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="font-bold text-text">4.9</p>
                        <p className="text-xs text-text-light">Note moyenne</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card p-4 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <p className="font-bold text-text">30 min</p>
                        <p className="text-xs text-text-light">Livraison</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-20 bg-white" id="popular" data-animate>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible('popular') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full mb-4">
              Nos Best-Sellers
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
              Plats Populaires
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Découvrez nos créations les plus appréciées par nos clients
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-cream rounded-2xl overflow-hidden shadow-card card-hover group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <span className="text-yellow">★</span>
                    <span className="text-sm font-semibold">{dish.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg text-text mb-1">{dish.name}</h3>
                  <p className="text-sm text-text-light mb-3 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue">{dish.price.toFixed(2)}€</span>
                    <button className="p-2 bg-yellow rounded-xl text-text hover:bg-yellow-dark transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20" id="about" data-animate>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
                <div className="absolute inset-0 rounded-full bg-blue/10" />
                <div className="absolute inset-4 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=600&fit=crop"
                    alt="Chef cuisinant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-8 right-8 bg-yellow rounded-2xl p-4 shadow-card">
                <p className="text-3xl font-display font-bold text-text">10+</p>
                <p className="text-sm text-text-light">Années d'expérience</p>
              </div>
            </div>
            
            <div>
              <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full mb-4">
                À Propos de Nous
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-6">
                Plus qu'un simple service de livraison
              </h2>
              <p className="text-text-light mb-6 leading-relaxed">
                Chez DFOOD, nous croyons que chaque repas doit être une expérience. 
                Nos chefs passionnés préparent chaque plat avec soin, en utilisant 
                uniquement des ingrédients frais et locaux.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Ingrédients 100% frais et locaux',
                  'Chefs professionnels expérimentés',
                  'Emballages éco-responsables',
                  'Livraison rapide et soignée',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-text">{item}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                En savoir plus
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 bg-white" id="menu" data-animate>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible('menu') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full mb-4">
              Notre Carte
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
              Menu Régulier
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-yellow text-text shadow-soft'
                    : 'bg-cream text-text-light hover:bg-cream-dark'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="bg-cream rounded-2xl overflow-hidden shadow-card card-hover group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-text mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue">{item.price.toFixed(2)}€</span>
                    <button className="px-3 py-1.5 bg-yellow rounded-lg text-sm font-medium text-text hover:bg-yellow-dark transition-colors">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/commander" className="btn-secondary inline-flex items-center gap-2">
              Voir tout le menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation CTA Section */}
      <section className="py-20" id="reservation" data-animate>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible('reservation') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-blue rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                  Envie d'un événement privé ?
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Notre service traiteur s'occupe de tout pour vos réceptions. 
                  Du buffet au service à table, nous adaptons notre offre à vos besoins.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/evenements" className="inline-flex items-center justify-center gap-2 bg-yellow text-text px-6 py-3.5 rounded-xl font-semibold hover:bg-yellow-dark transition-colors">
                    Réserver
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Link>
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                    Nous contacter
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:flex justify-end">
                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1555244162-803279f50793?w=600&h=600&fit=crop"
                    alt="Événement traiteur"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" id="testimonials" data-animate>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full mb-4">
              Témoignages
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
              Ce que disent nos clients
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-cream rounded-2xl p-6 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow text-lg">★</span>
                  ))}
                </div>
                <p className="text-text mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-text">{testimonial.name}</p>
                    <p className="text-sm text-text-light">Client vérifié</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chefs Section */}
      <section className="py-20" id="chefs" data-animate>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible('chefs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-yellow/20 text-text font-medium text-sm rounded-full mb-4">
              Notre Équipe
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
              Rencontrez nos Chefs
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8">
            {chefs.map((chef) => (
              <div
                key={chef.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card card-hover text-center p-6"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow/30">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display font-bold text-xl text-text mb-1">{chef.name}</h3>
                <p className="text-text-light text-sm">{chef.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
