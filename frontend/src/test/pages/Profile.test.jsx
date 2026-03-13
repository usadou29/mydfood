import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockUpdateProfile = vi.fn().mockResolvedValue({});
const mockSignOut = vi.fn().mockResolvedValue({});

// IMPORTANT: Stable references to avoid infinite useEffect re-render loops
const stableUser = { id: 'u1', email: 'test@test.com' };
const stableProfile = { prenom: 'Jean', nom: 'Dupont', telephone: '0612', adresse: '', ville: '', code_postal: '' };

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: stableUser,
    profile: stableProfile,
    loading: false,
    signOut: mockSignOut,
    updateProfile: mockUpdateProfile,
  }),
}));

const mockFetchMesCommandes = vi.fn().mockResolvedValue([
  {
    id: 1, numero: 'DF-001', statut: 'livree', total: 27,
    type_livraison: 'livraison', created_at: '2026-03-10T12:00:00Z',
    commande_lignes: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2, numero: 'DF-002', statut: 'en_attente', total: 15,
    type_livraison: 'retrait', created_at: '2026-03-12T12:00:00Z',
    commande_lignes: [{ id: 3 }],
  },
]);

vi.mock('../../services/commandes', () => ({
  fetchMesCommandes: (...args) => mockFetchMesCommandes(...args),
}));

vi.mock('../../components/admin/StatusBadge', () => ({
  StatusBadge: ({ statut }) => <span data-testid="status-badge">{statut}</span>,
}));

vi.mock('../../context/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn(), removeToast: vi.fn() }),
}));

import { Profile } from '../../pages/Profile';

function renderProfile() {
  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
}

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchMesCommandes.mockResolvedValue([
      {
        id: 1, numero: 'DF-001', statut: 'livree', total: 27,
        type_livraison: 'livraison', created_at: '2026-03-10T12:00:00Z',
        commande_lignes: [{ id: 1 }, { id: 2 }],
      },
      {
        id: 2, numero: 'DF-002', statut: 'en_attente', total: 15,
        type_livraison: 'retrait', created_at: '2026-03-12T12:00:00Z',
        commande_lignes: [{ id: 3 }],
      },
    ]);
  });

  it('renders profile form with prefilled data', () => {
    renderProfile();
    expect(screen.getByText('Mon compte')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jean')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dupont')).toBeInTheDocument();
  });

  it('shows both tabs', () => {
    renderProfile();
    expect(screen.getByText('Mon profil')).toBeInTheDocument();
    expect(screen.getByText('Mes commandes')).toBeInTheDocument();
  });

  it('saves profile on form submit', async () => {
    renderProfile();
    fireEvent.click(screen.getByText('Enregistrer'));
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it('switches to commandes tab and loads orders', async () => {
    renderProfile();
    fireEvent.click(screen.getByText('Mes commandes'));

    await waitFor(() => {
      expect(mockFetchMesCommandes).toHaveBeenCalledWith('u1');
    });

    expect(screen.getByText('DF-001')).toBeInTheDocument();
    expect(screen.getByText('DF-002')).toBeInTheDocument();
    expect(screen.getByText('27.00€')).toBeInTheDocument();
  });

  it('shows status badges for orders', async () => {
    renderProfile();
    fireEvent.click(screen.getByText('Mes commandes'));

    await waitFor(() => {
      const badges = screen.getAllByTestId('status-badge');
      expect(badges).toHaveLength(2);
      expect(badges[0]).toHaveTextContent('livree');
      expect(badges[1]).toHaveTextContent('en_attente');
    });
  });
});
