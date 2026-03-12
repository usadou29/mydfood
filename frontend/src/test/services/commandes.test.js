import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockFrom, mockSelect, mockInsert, mockUpdate, mockEq, mockOrder,
  mockSingle, mockGetUser, mockGetSession, chainable,
} = vi.hoisted(() => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockSingle = vi.fn();
  const mockGetUser = vi.fn();
  const mockGetSession = vi.fn();

  const chainable = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    eq: mockEq,
    order: mockOrder,
    single: mockSingle,
    from: mockFrom,
  };

  Object.values(chainable).forEach((fn) => fn.mockReturnValue(chainable));

  return { mockFrom, mockSelect, mockInsert, mockUpdate, mockEq, mockOrder, mockSingle, mockGetUser, mockGetSession, chainable };
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    auth: { getUser: mockGetUser, getSession: mockGetSession },
  },
}));

import {
  fetchZonesLivraison,
  creerCommande,
  fetchMesCommandes,
  fetchCommandeByNumero,
  createStripeCheckoutSession,
} from '../../services/commandes';

describe('commandes service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(chainable).forEach((fn) => fn.mockReturnValue(chainable));
  });

  describe('fetchZonesLivraison', () => {
    it('fetches active zones ordered by frais', async () => {
      mockOrder.mockResolvedValueOnce({ data: [{ id: 1, nom: 'Paris' }], error: null });

      const result = await fetchZonesLivraison();
      expect(mockFrom).toHaveBeenCalledWith('zones_livraison');
      expect(mockEq).toHaveBeenCalledWith('active', true);
      expect(result).toEqual([{ id: 1, nom: 'Paris' }]);
    });

    it('throws on error', async () => {
      mockOrder.mockResolvedValueOnce({ data: null, error: new Error('DB error') });
      await expect(fetchZonesLivraison()).rejects.toThrow('DB error');
    });
  });

  describe('fetchMesCommandes', () => {
    it('returns empty array if no userId', async () => {
      const result = await fetchMesCommandes(null);
      expect(result).toEqual([]);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('fetches orders filtered by user_id', async () => {
      mockOrder.mockResolvedValueOnce({ data: [{ id: 1, numero: 'DF-001' }], error: null });

      const result = await fetchMesCommandes('user-123');
      expect(mockFrom).toHaveBeenCalledWith('commandes');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(result).toEqual([{ id: 1, numero: 'DF-001' }]);
    });
  });

  describe('fetchCommandeByNumero', () => {
    it('fetches a single order by numero', async () => {
      const order = { id: 1, numero: 'DF-20260312-0001' };
      mockSingle.mockResolvedValueOnce({ data: order, error: null });

      const result = await fetchCommandeByNumero('DF-20260312-0001');
      expect(mockFrom).toHaveBeenCalledWith('commandes');
      expect(mockEq).toHaveBeenCalledWith('numero', 'DF-20260312-0001');
      expect(result).toEqual(order);
    });

    it('throws on error', async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: new Error('Not found') });
      await expect(fetchCommandeByNumero('INVALID')).rejects.toThrow('Not found');
    });
  });

  describe('creerCommande', () => {
    it('creates order with items and correct mode_paiement', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
      // creerCommande chains: from().insert().select().single()
      // Then from().insert() for lignes
      // First chain: commandes insert → select → single resolves
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 1, numero: 'DF-001' }, error: null }),
          }),
        }),
      });
      // Second chain: commande_lignes insert
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      const result = await creerCommande({
        client: { nom: 'Test', email: 'test@test.com', telephone: '0600', adresse: '1 rue' },
        zone_livraison_id: 1,
        type_livraison: 'livraison',
        creneau_livraison: '12h-13h',
        items: [{ plat_id: 1, nom: 'Thiep', prix_unitaire: 12, quantite: 2 }],
        sous_total: 24,
        frais_livraison: 3,
        pourboire: 0,
        total: 27,
        message_client: null,
        mode_paiement: 'especes',
      });

      expect(result).toEqual({ id: 1, numero: 'DF-001' });
      expect(mockFrom).toHaveBeenCalledWith('commandes');
      expect(mockFrom).toHaveBeenCalledWith('commande_lignes');
    });

    it('defaults mode_paiement to especes', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null } });
      const mockInnerInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 2 }, error: null }),
        }),
      });
      mockFrom.mockReturnValueOnce({ insert: mockInnerInsert });
      mockFrom.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      await creerCommande({
        client: { nom: 'Guest', email: 'g@g.com', telephone: '0600' },
        type_livraison: 'retrait',
        items: [{ nom: 'Pasta', prix_unitaire: 8.5, quantite: 1 }],
        sous_total: 8.5,
        frais_livraison: 0,
        total: 8.5,
      });

      const insertCall = mockInnerInsert.mock.calls[0][0];
      expect(insertCall.mode_paiement).toBe('especes');
    });
  });

  describe('createStripeCheckoutSession', () => {
    const commande = { id: 42, numero: 'DF-20260312-0042' };
    const cartItems = [
      { nom: 'Thiep', prix_unitaire: 12, quantite: 2 },
      { nom: 'Jus', prix_unitaire: 3, quantite: 1 },
    ];

    beforeEach(() => {
      globalThis.fetch = vi.fn();
    });

    afterEach(() => {
      delete globalThis.fetch;
    });

    it('calls edge function and returns sessionUrl on success', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: { access_token: 'jwt-token-123' } },
      });
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sessionUrl: 'https://checkout.stripe.com/sess_123' }),
      });

      const result = await createStripeCheckoutSession(commande, cartItems);

      expect(result).toEqual({ sessionUrl: 'https://checkout.stripe.com/sess_123' });
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const [url, opts] = globalThis.fetch.mock.calls[0];
      expect(url).toContain('/functions/v1/create-checkout-session');
      expect(opts.method).toBe('POST');
      expect(opts.headers.Authorization).toBe('Bearer jwt-token-123');
      const body = JSON.parse(opts.body);
      expect(body.commande_id).toBe(42);
      expect(body.line_items).toHaveLength(2);
      expect(body.success_url).toContain('payment=success');
      expect(body.cancel_url).toContain('payment=cancelled');
    });

    it('throws when user has no session (not authenticated)', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
      });

      await expect(createStripeCheckoutSession(commande, cartItems))
        .rejects.toThrow('connecté');
    });

    it('throws when edge function returns an error', async () => {
      mockGetSession.mockResolvedValueOnce({
        data: { session: { access_token: 'jwt-token-123' } },
      });
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Commande introuvable.' }),
      });

      await expect(createStripeCheckoutSession(commande, cartItems))
        .rejects.toThrow('Commande introuvable.');
    });
  });
});
