import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock framer-motion — AnimatePresence mode="wait" blocks step transitions in jsdom
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, tag) => {
      const Comp = ({ children, className, onClick, onSubmit, type, disabled, ...rest }) => {
        const Tag = typeof tag === 'string' ? tag : 'div';
        const props = {};
        if (className) props.className = className;
        if (onClick) props.onClick = onClick;
        if (onSubmit) props.onSubmit = onSubmit;
        if (type) props.type = type;
        if (disabled !== undefined) props.disabled = disabled;
        return <Tag {...props}>{children}</Tag>;
      };
      return Comp;
    },
  }),
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// IMPORTANT: Stable references to avoid infinite useEffect re-render loops
const mockCart = [
  { id: 1, type: 'plat', nom: 'Thiep Poulet', prix: 12, image_url: '/img.jpg', quantite: 2 },
];
const mockClearCart = vi.fn();

vi.mock('../../context/CartContext', () => ({
  useCart: () => ({
    cart: mockCart,
    cartTotal: 24,
    cartCount: 2,
    clearCart: mockClearCart,
  }),
}));

// Stable references for user/profile
const stableUser = { id: 'u1', email: 'test@test.com' };
const stableProfile = { prenom: 'Jean', nom: 'Dupont', telephone: '0612345678', adresse: '10 rue Test', code_postal: '75001', ville: 'Paris' };

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: stableUser,
    profile: stableProfile,
  }),
}));

// Stable zones reference
const mockZones = [
  { id: 1, nom: 'Paris', frais_livraison: 3, minimum_commande: 15, delai_minutes: 45 },
  { id: 2, nom: 'Banlieue', frais_livraison: 5, minimum_commande: 25, delai_minutes: 60 },
];

vi.mock('../../hooks/useSupabaseQuery', () => ({
  useSupabaseQuery: () => ({ data: mockZones, loading: false, error: null }),
}));

const { mockCreerCommande, mockCreateStripeCheckoutSession } = vi.hoisted(() => ({
  mockCreerCommande: vi.fn().mockResolvedValue({ id: 1, numero: 'DF-20260312-0001', type_livraison: 'livraison', creneau_livraison: '12h00 - 13h00', mode_paiement: 'especes', total: 27 }),
  mockCreateStripeCheckoutSession: vi.fn(),
}));

vi.mock('../../services/commandes', () => ({
  fetchZonesLivraison: vi.fn(),
  creerCommande: mockCreerCommande,
  createStripeCheckoutSession: mockCreateStripeCheckoutSession,
}));

vi.mock('../../lib/stripe', () => ({
  isStripeConfigured: () => true,
}));

import { Checkout } from '../../pages/Checkout';

function renderCheckout(initialEntries = ['/checkout']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Checkout />
    </MemoryRouter>
  );
}

describe('Checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step 1 by default with prefilled info', () => {
    renderCheckout();
    expect(screen.getByText('Finaliser votre commande')).toBeInTheDocument();
    expect(screen.getByText('Vos informations')).toBeInTheDocument();
    // Prefilled from profile
    expect(screen.getByDisplayValue('Jean')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dupont')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
  });

  it('shows cart sidebar with items', () => {
    renderCheckout();
    expect(screen.getByText('Votre panier')).toBeInTheDocument();
    expect(screen.getByText(/Thiep Poulet/)).toBeInTheDocument();
    // 24.00€ may appear in both line item and sous-total
    const matches = screen.getAllByText('24.00€');
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to step 2 on valid step 1', () => {
    renderCheckout();
    fireEvent.click(screen.getByText('Suivant'));
    expect(screen.getByText('Mode de livraison')).toBeInTheDocument();
  });

  it('shows delivery zones and créneau on step 2', () => {
    renderCheckout();
    fireEvent.click(screen.getByText('Suivant'));
    expect(screen.getByText('Livraison à domicile')).toBeInTheDocument();
    expect(screen.getByText('Retrait sur place')).toBeInTheDocument();
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
    expect(screen.getByText('12h00 - 13h00')).toBeInTheDocument();
  });

  it('navigates to step 3 after selecting créneau', () => {
    renderCheckout();
    // Step 1 → 2
    fireEvent.click(screen.getByText('Suivant'));
    // Select créneau
    fireEvent.click(screen.getByText('12h00 - 13h00'));
    // Step 2 → 3
    fireEvent.click(screen.getByText('Suivant'));
    // 'Récapitulatif' appears in both step indicator and heading — use role
    expect(screen.getByRole('heading', { name: /Récapitulatif/ })).toBeInTheDocument();
  });

  it('shows payment options on step 3', () => {
    renderCheckout();
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('12h00 - 13h00'));
    fireEvent.click(screen.getByText('Suivant'));
    expect(screen.getByText('Espèces')).toBeInTheDocument();
    expect(screen.getByText('Carte bancaire')).toBeInTheDocument();
  });

  it('submits order and shows confirmation', async () => {
    renderCheckout();
    // Step 1 → 2 → 3
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('12h00 - 13h00'));
    fireEvent.click(screen.getByText('Suivant'));
    // Submit
    fireEvent.click(screen.getByText('Confirmer la commande'));

    await waitFor(() => {
      expect(screen.getByText('Commande confirmée !')).toBeInTheDocument();
    });
    expect(screen.getByText('DF-20260312-0001')).toBeInTheDocument();
    expect(mockClearCart).toHaveBeenCalled();
  });

  it('allows going back between steps', () => {
    renderCheckout();
    fireEvent.click(screen.getByText('Suivant'));
    expect(screen.getByText('Mode de livraison')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Précédent'));
    expect(screen.getByText('Vos informations')).toBeInTheDocument();
  });

  // ── Stripe integration tests ──────────────────────────────────

  it('carte bancaire button is enabled when Stripe is configured', () => {
    renderCheckout();
    // Navigate to step 3
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('12h00 - 13h00'));
    fireEvent.click(screen.getByText('Suivant'));
    // Carte bancaire button should be clickable
    const carteBtn = screen.getByText('Carte bancaire').closest('button');
    expect(carteBtn).not.toBeDisabled();
    expect(screen.getByText('Paiement sécurisé via Stripe')).toBeInTheDocument();
  });

  it('redirects to Stripe when paying by card', async () => {
    // Mock window.location.href assignment
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, href: '', origin: 'http://localhost:3000' };

    mockCreateStripeCheckoutSession.mockResolvedValueOnce({
      sessionUrl: 'https://checkout.stripe.com/sess_test',
    });

    renderCheckout();
    // Navigate to step 3
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('12h00 - 13h00'));
    fireEvent.click(screen.getByText('Suivant'));
    // Select carte
    fireEvent.click(screen.getByText('Carte bancaire'));
    // Submit
    fireEvent.click(screen.getByText('Confirmer la commande'));

    await waitFor(() => {
      expect(mockCreerCommande).toHaveBeenCalled();
      expect(mockCreateStripeCheckoutSession).toHaveBeenCalled();
    });

    expect(window.location.href).toBe('https://checkout.stripe.com/sess_test');
    expect(mockClearCart).toHaveBeenCalled();

    // Restore
    window.location = originalLocation;
  });

  it('shows error when Stripe checkout fails after order creation', async () => {
    mockCreateStripeCheckoutSession.mockRejectedValueOnce(
      new Error('Stripe non configuré')
    );

    renderCheckout();
    // Navigate to step 3
    fireEvent.click(screen.getByText('Suivant'));
    fireEvent.click(screen.getByText('12h00 - 13h00'));
    fireEvent.click(screen.getByText('Suivant'));
    // Select carte
    fireEvent.click(screen.getByText('Carte bancaire'));
    // Submit
    fireEvent.click(screen.getByText('Confirmer la commande'));

    await waitFor(() => {
      expect(screen.getByText(/paiement a échoué/)).toBeInTheDocument();
    });
    // Order was created, so numero should appear in error message
    expect(screen.getByText(/DF-20260312-0001/)).toBeInTheDocument();
  });

  it('shows cancelled payment message when returning from Stripe', () => {
    renderCheckout(['/checkout?payment=cancelled']);
    // Should show error and be on step 3
    expect(screen.getByText(/paiement a été annulé/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Récapitulatif/ })).toBeInTheDocument();
  });
});
