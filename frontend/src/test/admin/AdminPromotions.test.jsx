import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminPromotions } from '../../pages/admin/AdminPromotions';

// Mock admin service
vi.mock('../../services/admin', () => ({
  fetchPromotions: vi.fn(),
  createPromotion: vi.fn(),
  updatePromotion: vi.fn(),
  deletePromotion: vi.fn(),
}));

// Mock ConfirmDialog
vi.mock('../../components/admin/ConfirmDialog', () => ({
  ConfirmDialog: ({ open, title, onConfirm, onCancel }) =>
    open ? (
      <div data-testid="confirm-dialog">
        <p>{title}</p>
        <button onClick={onConfirm}>Confirmer</button>
        <button onClick={onCancel}>Annuler</button>
      </div>
    ) : null,
}));

import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from '../../services/admin';

const mockPromos = [
  {
    id: 1,
    code: 'BIENVENUE10',
    type_reduction: 'pourcentage',
    valeur: 10,
    minimum_commande: null,
    usage_max: 100,
    usage_actuel: 23,
    date_debut: '2026-01-01T00:00:00Z',
    date_fin: '2026-12-31T23:59:59Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    code: 'LIVRAISON5',
    type_reduction: 'montant_fixe',
    valeur: 5,
    minimum_commande: 25,
    usage_max: null,
    usage_actuel: 8,
    date_debut: '2026-01-01T00:00:00Z',
    date_fin: '2025-12-31T23:59:59Z', // expired
    active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/promotions']}>
      <Routes>
        <Route path="/admin/promotions" element={<AdminPromotions />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminPromotions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchPromotions.mockResolvedValue(mockPromos);
  });

  it('renders the promotions table with data', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('BIENVENUE10')).toBeInTheDocument();
      expect(screen.getByText('LIVRAISON5')).toBeInTheDocument();
    });
  });

  it('shows promo count', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('2 code(s) promo')).toBeInTheDocument();
    });
  });

  it('shows expired badge for expired promo', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Expiré')).toBeInTheDocument();
    });
  });

  it('shows active badge for valid promo', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Actif')).toBeInTheDocument();
    });
  });

  it('filters by search', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('BIENVENUE10')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Rechercher un code...'), {
      target: { value: 'LIVRAISON' },
    });

    expect(screen.queryByText('BIENVENUE10')).not.toBeInTheDocument();
    expect(screen.getByText('LIVRAISON5')).toBeInTheDocument();
  });

  it('opens create form when clicking new button', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Nouveau code promo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Nouveau code promo'));
    expect(screen.getByText('Nouvelle promotion')).toBeInTheDocument();
  });

  it('toggles active status', async () => {
    updatePromotion.mockResolvedValue({});
    fetchPromotions.mockResolvedValue(mockPromos);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('BIENVENUE10')).toBeInTheDocument();
    });

    // Click first toggle button (BIENVENUE10 is active → deactivate)
    const toggleButtons = screen.getAllByTitle('Désactiver');
    fireEvent.click(toggleButtons[0]);

    await waitFor(() => {
      expect(updatePromotion).toHaveBeenCalledWith(1, { active: false });
    });
  });

  it('shows delete confirmation dialog', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('BIENVENUE10')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Supprimer');
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
  });

  it('displays percentage type correctly', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('Pourcentage')).toBeInTheDocument();
    });
  });

  it('displays fixed amount type correctly', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('5€')).toBeInTheDocument();
      expect(screen.getByText('Montant fixe')).toBeInTheDocument();
    });
  });

  it('displays usage counters', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('23 / 100')).toBeInTheDocument();
    });
  });
});
