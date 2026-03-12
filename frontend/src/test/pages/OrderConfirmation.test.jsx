import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockCommande = {
  id: 1,
  numero: 'DF-20260312-0001',
  client_nom: 'Jean Dupont',
  client_email: 'jean@test.com',
  client_telephone: '0612345678',
  client_adresse: '10 rue Test, 75001 Paris',
  type_livraison: 'livraison',
  creneau_livraison: '12h00 - 13h00',
  mode_paiement: 'especes',
  sous_total: 24,
  frais_livraison: 3,
  pourboire: 0,
  total: 27,
  statut: 'en_attente',
  message_client: 'Extra piment svp',
  created_at: '2026-03-12T14:00:00Z',
  commande_lignes: [
    { id: 1, nom: 'Thiep Poulet', quantite: 2, prix_unitaire: 12, sous_total: 24 },
  ],
  zones_livraison: { nom: 'Paris', frais_livraison: 3, delai_minutes: 45 },
};

vi.mock('../../hooks/useSupabaseQuery', () => ({
  useSupabaseQuery: () => ({ data: mockCommande, loading: false, error: null }),
}));

vi.mock('../../services/commandes', () => ({
  fetchCommandeByNumero: vi.fn(),
}));

vi.mock('../../components/admin/StatusBadge', () => ({
  StatusBadge: ({ statut }) => <span data-testid="status-badge">{statut}</span>,
}));

import { OrderConfirmation } from '../../pages/OrderConfirmation';

function renderWithRoute(searchParams = '') {
  return render(
    <MemoryRouter initialEntries={[`/confirmation/DF-20260312-0001${searchParams}`]}>
      <Routes>
        <Route path="/confirmation/:numero" element={<OrderConfirmation />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('OrderConfirmation', () => {
  it('displays order number', () => {
    renderWithRoute();
    expect(screen.getByText('Commande DF-20260312-0001')).toBeInTheDocument();
  });

  it('displays status badge', () => {
    renderWithRoute();
    expect(screen.getByTestId('status-badge')).toHaveTextContent('en_attente');
  });

  it('displays client info', () => {
    renderWithRoute();
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText(/jean@test.com/)).toBeInTheDocument();
  });

  it('displays delivery info', () => {
    renderWithRoute();
    expect(screen.getByText(/Livraison — Paris/)).toBeInTheDocument();
    expect(screen.getByText('12h00 - 13h00')).toBeInTheDocument();
  });

  it('displays order total', () => {
    renderWithRoute();
    expect(screen.getByText('27.00€')).toBeInTheDocument();
  });

  it('displays order items', () => {
    renderWithRoute();
    expect(screen.getByText(/Thiep Poulet/)).toBeInTheDocument();
    // 24.00€ appears in both line item and sous-total
    const matches = screen.getAllByText('24.00€');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('displays client message', () => {
    renderWithRoute();
    expect(screen.getByText('Extra piment svp')).toBeInTheDocument();
  });

  it('has navigation links', () => {
    renderWithRoute();
    expect(screen.getByText('Commander à nouveau')).toBeInTheDocument();
  });

  it('shows payment success badge when payment=success', () => {
    renderWithRoute('?payment=success');
    expect(screen.getByText('Paiement confirmé par carte')).toBeInTheDocument();
  });

  it('shows payment cancelled badge when payment=cancelled', () => {
    renderWithRoute('?payment=cancelled');
    expect(screen.getByText(/Paiement annulé/)).toBeInTheDocument();
  });
});
