export const services = [
  {
    id: 'traiteur',
    title: 'Service Traiteur',
    subtitle: 'Événementiel',
    description: 'Pour vos anniversaires, soirées privées et événements spéciaux. Une cuisine camerounaise raffinée qui émerveillera vos invités.',
    features: ['Menu personnalisé', 'Devis sur mesure', 'Livraison incluse', 'Service disponible'],
    cta: 'Demander un devis',
    link: '/traiteur',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop'
  },
  {
    id: 'familial',
    title: 'Service Familial',
    subtitle: 'Menus partagés',
    description: 'Des menus complets pour 1 à 8 personnes. Parfait pour les dîners en famille ou entre amis.',
    features: ['Menu 1-3 personnes', 'Menu 4 personnes', 'Menu 6 personnes', 'Menu 8 personnes'],
    cta: 'Voir les menus',
    link: '/menus-famille',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop'
  },
  {
    id: 'individuel',
    title: 'Service Privé',
    subtitle: 'Commande individuelle',
    description: 'Commandez vos plats préférés à la carte. Livraison ou retrait sous 24h.',
    features: ['Fried rice camerounais', 'Suya box', 'Poulet braisé', 'Plats végétariens'],
    cta: 'Commander',
    link: '/commander',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=600&fit=crop'
  },
  {
    id: 'professionnels',
    title: 'Service Professionnels',
    subtitle: 'B2B & Corporate',
    description: 'Pour les entreprises, réunions et événements corporate. Plateaux repas, buffets et cocktails dinatoires.',
    features: ['Plateaux repas', 'Buffets', 'Cocktails dinatoires', 'Devis entreprise'],
    cta: 'Devis pro',
    link: '/professionnels',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
  }
];

export const plats = [
  {
    id: 1,
    name: 'Fried Rice Camerounais',
    description: 'Riz sauté aux légumes de saison, poulet mariné aux épices douces',
    price: 12,
    category: 'individuel',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
    popular: true,
    allergens: ['gluten', 'soja']
  },
  {
    id: 2,
    name: 'Suya Box',
    description: 'Brochettes de bœuf épicées, sauce cacahuète maison, plantain frit',
    price: 10,
    category: 'individuel',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d580690a9b?w=600&h=400&fit=crop',
    popular: true,
    allergens: ['cacahuète', 'gluten']
  },
  {
    id: 3,
    name: 'Poulet Braisé',
    description: 'Poulet mariné aux épices camerounaises, braisé au feu de bois, légumes grillés',
    price: 13,
    category: 'individuel',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
    popular: false,
    allergens: []
  },
  {
    id: 4,
    name: 'Ndolé',
    description: 'Feuilles de ndolé sautées, crevettes, cacahuètes, plantain frit',
    price: 14,
    category: 'individuel',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop',
    popular: false,
    allergens: ['fruits de mer', 'cacahuète']
  },
  {
    id: 5,
    name: 'Poulet DG',
    description: 'Poulet frit aux légumes (plantain, carottes, poivrons), sauce tomate épicée',
    price: 13,
    category: 'individuel',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop',
    popular: true,
    allergens: []
  },
  {
    id: 6,
    name: 'Koki',
    description: 'Purée de haricots blancs aux épices, huile de palme, plantain vapeur',
    price: 11,
    category: 'individuel',
    image: 'https://images.unsplash.com/photo-1546552356-3fae876a61ca?w=600&h=400&fit=crop',
    popular: false,
    allergens: []
  }
];

export const menusFamille = [
  {
    id: 'famille-1',
    name: 'Menu Famille Africain',
    description: 'Pour 4 personnes',
    content: ['Poulet braisé (4 parts)', 'Fried rice (4 parts)', 'Plantain frit', 'Salade africaine', 'Sauce piment'],
    price: 45,
    image: 'https://images.unsplash.com/photo-1547592180-85b74394b95c6?w=600&h=400&fit=crop'
  },
  {
    id: 'famille-2',
    name: 'Menu Dimanche',
    description: 'Pour 4 personnes',
    content: ['Poulet DG (4 parts)', 'Riz blanc', 'Légumes sautés', 'Beignets de poisson', 'Dessert maison'],
    price: 42,
    image: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=600&h=400&fit=crop'
  },
  {
    id: 'famille-3',
    name: 'Menu Fête',
    description: 'Pour 6 personnes',
    content: ['Assortiment de suya', 'Poulet braisé (6 parts)', 'Fried rice (6 parts)', 'Ndolé', 'Plantain frit', 'Boissons maison'],
    price: 68,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop'
  }
];

export const evenements = [
  {
    id: 1,
    title: 'Soirée Dégustation Camerounaise',
    description: 'Découvrez les saveurs authentiques du Cameroun lors d\'une soirée gastronomique unique.',
    date: '2026-03-15',
    time: '19:00',
    location: 'Restaurant La Sanaga, Issoire',
    price: 35,
    places: 20,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'
  },
  {
    id: 2,
    title: 'Atelier Cuisine Afro-Fusion',
    description: 'Apprenez à préparer des plats camerounais modernisés avec Tata Dow.',
    date: '2026-03-22',
    time: '14:00',
    location: 'Cuisine DFOOD, Antony',
    price: 45,
    places: 12,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
  }
];

export const menuSemaine = {
  semaine: '10-15 Juin',
  plats: [
    { jour: 'Lundi', plat: 'Fried Rice Camerounais', accompagnement: 'Plantain frit', prix: 12 },
    { jour: 'Mardi', plat: 'Poulet DG', accompagnement: 'Riz blanc', prix: 13 },
    { jour: 'Mercredi', plat: 'Suya Box', accompagnement: 'Frites de manioc', prix: 10 },
    { jour: 'Jeudi', plat: 'Ndolé', accompagnement: 'Plantain vapeur', prix: 14 },
    { jour: 'Vendredi', plat: 'Poulet Braisé', accompagnement: 'Fried rice', prix: 13 },
    { jour: 'Samedi', plat: 'Menu Famille Africain', accompagnement: 'Pour 4 personnes', prix: 45 }
  ]
};

export const zonesLivraison = [
  { nom: 'Antony (92)', prix: 0, minCommande: 15 },
  { nom: '5km autour', prix: 3, minCommande: 20 },
  { nom: 'Paris Centre', prix: 5, minCommande: 25 },
  { nom: 'Île-de-France', prix: 8, minCommande: 35 }
];

export const temoignages = [
  {
    id: 1,
    nom: 'Marie L.',
    commentaire: 'Une découverte ! Les saveurs sont authentiques et le service impeccable.',
    note: 5,
    date: '2026-02-15'
  },
  {
    id: 2,
    nom: 'Jean P.',
    commentaire: 'Menu famille parfait pour nos dîners entre amis. Tata Dow est une chef exceptionnelle.',
    note: 5,
    date: '2026-02-10'
  },
  {
    id: 3,
    nom: 'Sophie D.',
    commentaire: 'Traiteur pour mon anniversaire, tous mes invités ont adoré. Merci !',
    note: 5,
    date: '2026-01-28'
  }
];
