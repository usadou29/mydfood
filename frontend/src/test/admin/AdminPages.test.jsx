import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock auth context
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '123' },
    isAdmin: true,
    profile: { prenom: 'Doriane', role: 'admin' },
    signOut: vi.fn(),
    loading: false,
  }),
}));

// Mock admin services
const mockStats = {
  totalPlats: 12,
  totalCommandes: 45,
  revenue: 1250.5,
  commandesEnAttente: 3,
  temoignagesEnAttente: 5,
  commandesRecentes: [
    {
      id: 1,
      numero: 'DF-20260312-0001',
      client_nom: 'Jean',
      total: 25.5,
      statut: 'en_attente',
      created_at: '2026-03-12T10:00:00Z',
    },
  ],
};

const mockPlats = [
  {
    id: 1,
    nom: 'Thiep Poulet',
    prix: 10,
    disponible: true,
    populaire: true,
    categories: { nom: 'Plats en sauce' },
  },
  {
    id: 2,
    nom: 'Poulet Braisé',
    prix: 11,
    disponible: true,
    populaire: false,
    categories: { nom: 'Grillades' },
  },
];

const mockCommandes = [
  {
    id: 1,
    numero: 'DF-20260312-0001',
    client_nom: 'Jean Dupont',
    client_email: 'jean@test.com',
    client_telephone: '0600000000',
    total: 25.5,
    sous_total: 22,
    frais_livraison: 3.5,
    type_livraison: 'livraison',
    statut: 'en_attente',
    created_at: '2026-03-12T10:00:00Z',
    commande_lignes: [{ id: 1, nom: 'Thiep', quantite: 2, sous_total: 20, prix_unitaire: 10 }],
    zones_livraison: { nom: 'Paris' },
  },
];

const mockTemoignages = [
  { id: 1, nom: 'Marie', commentaire: 'Excellent !', note: 5, approuve: false, created_at: '2026-03-12T10:00:00Z' },
  { id: 2, nom: 'Paul', commentaire: 'Très bon.', note: 4, approuve: true, created_at: '2026-03-11T10:00:00Z' },
];

const mockPhotos = [
  { id: 1, cle: 'hero-bg', url: 'https://example.com/hero.jpg', alt_text: 'Hero', section: 'hero', description: 'Hero background' },
  { id: 2, cle: 'about-img', url: 'https://example.com/about.jpg', alt_text: 'About', section: 'about', description: 'About section' },
];

vi.mock('../../services/admin', () => ({
  fetchDashboardStats: vi.fn(() => Promise.resolve(mockStats)),
  fetchAllPlats: vi.fn(() => Promise.resolve(mockPlats)),
  fetchCategories: vi.fn(() => Promise.resolve([{ id: 1, nom: 'Plats en sauce' }, { id: 2, nom: 'Grillades' }])),
  createPlat: vi.fn(() => Promise.resolve({ id: 3 })),
  updatePlat: vi.fn(() => Promise.resolve({})),
  deletePlat: vi.fn(() => Promise.resolve()),
  fetchAllCommandes: vi.fn(() => Promise.resolve(mockCommandes)),
  updateCommandeStatut: vi.fn(() => Promise.resolve({})),
  fetchAllTemoignages: vi.fn(() => Promise.resolve(mockTemoignages)),
  toggleTemoignage: vi.fn(() => Promise.resolve({})),
  deleteTemoignage: vi.fn(() => Promise.resolve()),
  fetchAllPhotos: vi.fn(() => Promise.resolve(mockPhotos)),
  updatePhoto: vi.fn(() => Promise.resolve({})),
  createPhoto: vi.fn(() => Promise.resolve({ id: 3 })),
  deletePhoto: vi.fn(() => Promise.resolve()),
}));

import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminPlats } from '../../pages/admin/AdminPlats';
import { AdminCommandes } from '../../pages/admin/AdminCommandes';
import { AdminTemoignages } from '../../pages/admin/AdminTemoignages';
import { AdminPhotos } from '../../pages/admin/AdminPhotos';

function wrap(component) {
  return render(<MemoryRouter>{component}</MemoryRouter>);
}

// =====================
// DASHBOARD
// =====================
describe('AdminDashboard', () => {
  it('renders dashboard title', async () => {
    wrap(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeTruthy();
    });
  });

  it('displays stat cards after loading', async () => {
    wrap(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('12')).toBeTruthy(); // totalPlats
      expect(screen.getByText('45')).toBeTruthy(); // totalCommandes
      expect(screen.getByText('5')).toBeTruthy(); // temoignagesEnAttente
    });
  });

  it('shows recent orders', async () => {
    wrap(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Commandes récentes')).toBeTruthy();
      expect(screen.getByText('DF-20260312-0001')).toBeTruthy();
    });
  });
});

// =====================
// PLATS
// =====================
describe('AdminPlats', () => {
  it('renders plats management title', async () => {
    wrap(<AdminPlats />);
    await waitFor(() => {
      expect(screen.getByText('Gestion des Plats')).toBeTruthy();
    });
  });

  it('displays plats in table', async () => {
    wrap(<AdminPlats />);
    await waitFor(() => {
      expect(screen.getByText('Thiep Poulet')).toBeTruthy();
      expect(screen.getByText('Poulet Braisé')).toBeTruthy();
    });
  });

  it('has add button', async () => {
    wrap(<AdminPlats />);
    await waitFor(() => {
      expect(screen.getByText('Ajouter un plat')).toBeTruthy();
    });
  });

  it('opens create form on click', async () => {
    wrap(<AdminPlats />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Ajouter un plat'));
    });
    expect(screen.getByText('Nouveau plat')).toBeTruthy();
  });

  it('has search functionality', async () => {
    wrap(<AdminPlats />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Rechercher un plat...')).toBeTruthy();
    });
  });

  it('filters plats by search', async () => {
    wrap(<AdminPlats />);
    await waitFor(() => {
      const search = screen.getByPlaceholderText('Rechercher un plat...');
      fireEvent.change(search, { target: { value: 'Thiep' } });
    });
    expect(screen.getByText('Thiep Poulet')).toBeTruthy();
    expect(screen.queryByText('Poulet Braisé')).toBeNull();
  });
});

// =====================
// COMMANDES
// =====================
describe('AdminCommandes', () => {
  it('renders commandes management title', async () => {
    wrap(<AdminCommandes />);
    await waitFor(() => {
      expect(screen.getByText('Gestion des Commandes')).toBeTruthy();
    });
  });

  it('displays commandes in table', async () => {
    wrap(<AdminCommandes />);
    await waitFor(() => {
      expect(screen.getByText('DF-20260312-0001')).toBeTruthy();
      expect(screen.getByText('Jean Dupont')).toBeTruthy();
    });
  });

  it('has filter buttons', async () => {
    wrap(<AdminCommandes />);
    await waitFor(() => {
      expect(screen.getByText('Tous')).toBeTruthy();
      expect(screen.getByText('En attente')).toBeTruthy();
      expect(screen.getByText('Livrée')).toBeTruthy();
    });
  });

  it('opens detail modal on eye click', async () => {
    wrap(<AdminCommandes />);
    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeTruthy();
    });
    const detailBtn = screen.getByTitle('Détails');
    fireEvent.click(detailBtn);
    expect(screen.getByText('Commande DF-20260312-0001')).toBeTruthy();
    expect(screen.getByText('Articles')).toBeTruthy();
  });
});

// =====================
// TEMOIGNAGES
// =====================
describe('AdminTemoignages', () => {
  it('renders temoignages management title', async () => {
    wrap(<AdminTemoignages />);
    await waitFor(() => {
      expect(screen.getByText('Gestion des Témoignages')).toBeTruthy();
    });
  });

  it('displays temoignages', async () => {
    wrap(<AdminTemoignages />);
    await waitFor(() => {
      expect(screen.getByText('Marie')).toBeTruthy();
    });
  });

  it('has filter buttons', async () => {
    wrap(<AdminTemoignages />);
    await waitFor(() => {
      expect(screen.getByText('Tous')).toBeTruthy();
      expect(screen.getByText('En attente')).toBeTruthy();
      expect(screen.getByText('Approuvés')).toBeTruthy();
    });
  });

  it('shows approve button for pending testimonials', async () => {
    wrap(<AdminTemoignages />);
    await waitFor(() => {
      expect(screen.getByTitle('Approuver')).toBeTruthy();
    });
  });
});

// =====================
// PHOTOS
// =====================
describe('AdminPhotos', () => {
  it('renders photos management title', async () => {
    wrap(<AdminPhotos />);
    await waitFor(() => {
      expect(screen.getByText('Photos du site')).toBeTruthy();
    });
  });

  it('displays photos in grid', async () => {
    wrap(<AdminPhotos />);
    await waitFor(() => {
      expect(screen.getByText('hero-bg')).toBeTruthy();
      expect(screen.getByText('about-img')).toBeTruthy();
    });
  });

  it('has add button', async () => {
    wrap(<AdminPhotos />);
    await waitFor(() => {
      expect(screen.getByText('Ajouter une photo')).toBeTruthy();
    });
  });

  it('opens create form on click', async () => {
    wrap(<AdminPhotos />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('Ajouter une photo'));
    });
    expect(screen.getByText('Nouvelle photo')).toBeTruthy();
    expect(screen.getByPlaceholderText('https://images.example.com/photo.jpg')).toBeTruthy();
  });

  it('shows section badges', async () => {
    wrap(<AdminPhotos />);
    await waitFor(() => {
      expect(screen.getByText('hero')).toBeTruthy();
      expect(screen.getByText('about')).toBeTruthy();
    });
  });
});
