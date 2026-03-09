# DFOOD by Tata Dow

Site web e-commerce pour DFOOD by Tata Dow - Cuisine camerounaise moderne et cuisine française de saison.

## 🌐 URL du site

https://mydfood.com

## 📝 Description

DFOOD by Tata Dow est une plateforme de vente en ligne de plats camerounais modernisés avec une influence française. Le site propose 4 services distincts :

1. **Service Traiteur** - Pour événements privés et professionnels
2. **Service Familial** - Menus pour 1 à 8 personnes
3. **Service Privé** - Commande de plats individuels
4. **Service Professionnels** - Pour entreprises et corporate

## 🚀 Fonctionnalités

- **E-commerce complet** - Panier, commande, paiement
- **Menu de la semaine** - Modifiable par l'administrateur
- **Billetterie événements** - Réservation pour ateliers et soirées
- **Base de données clients** - Newsletter et marketing
- **Système de livraison** - Zones et créneaux horaires
- **Commande WhatsApp** - Alternative au site web
- **Responsive** - Mobile-first design
- **SEO optimisé** - Référencement local

## 🛠️ Technologies

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend (à venir)
- **Node.js** + **Express**
- **PostgreSQL** - Base de données
- **Stripe** - Paiement
- **JWT** - Authentification

## 📦 Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/usadou29/mydfood.git
cd mydfood
```

2. **Installer les dépendances**
```bash
cd frontend
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera disponible sur `http://localhost:5173`

4. **Build pour production**
```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/`

## 🎨 Design System

### Couleurs
- **Terracotta** (`#E2725B`) - Couleur principale
- **Gold** (`#C5B358`) - Accents
- **Anthracite** (`#2F2F2F`) - Texte
- **Cream** (`#F5F0E8`) - Fond
- **Sand** (`#E8DFD0`) - Fond secondaire

### Typographie
- **Inter** - Texte
- **Playfair Display** - Titres

## 📁 Structure du projet

```
mydfood/
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages du site
│   │   ├── data/           # Données mock
│   │   ├── App.jsx         # Router principal
│   │   └── main.jsx        # Point d'entrée
│   ├── public/             # Assets statiques
│   └── dist/               # Build production
├── backend/                # API (à venir)
└── database/              # Schémas SQL
```

## 🔄 Déploiement

Le site peut être déployé sur :
- **Vercel** (recommandé)
- **Netlify**
- **Firebase Hosting**

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

## 📧 Contact

- **Email** : contact@mydfood.com
- **WhatsApp** : +33 6 00 00 00 00
- **Instagram** : @dfoodbytatadow

## 📄 Licence

Propriétaire - DFOOD by Tata Dow

## 🙏 Crédits

- Design et développement : Équipe DFOOD
- Photos : Unsplash
- Icons : Lucide

---

Développé avec ❤️ pour Tata Dow
