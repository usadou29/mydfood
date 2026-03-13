import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockFrom, mockSelect, mockEq, mockSingle, mockRpc, mockUpdate, chainable,
} = vi.hoisted(() => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockSingle = vi.fn();
  const mockRpc = vi.fn();
  const mockUpdate = vi.fn();

  const chainable = {
    from: mockFrom,
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
    update: mockUpdate,
  };

  Object.values(chainable).forEach((fn) => fn.mockReturnValue(chainable));

  return { mockFrom, mockSelect, mockEq, mockSingle, mockRpc, mockUpdate, chainable };
});

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    rpc: mockRpc,
  },
}));

import { validerCodePromo, incrementerUsage } from '../../services/promotions';

const makePromo = (overrides = {}) => ({
  id: 1,
  code: 'BIENVENUE10',
  type_reduction: 'pourcentage',
  valeur: 10,
  minimum_commande: null,
  usage_max: null,
  usage_actuel: 0,
  date_debut: new Date(Date.now() - 86400000).toISOString(),
  date_fin: new Date(Date.now() + 86400000 * 30).toISOString(),
  active: true,
  ...overrides,
});

describe('promotions service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(chainable).forEach((fn) => fn.mockReturnValue(chainable));
  });

  describe('validerCodePromo', () => {
    it('returns invalid for empty code', async () => {
      const result = await validerCodePromo('', 50);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('saisir');
    });

    it('returns invalid for null code', async () => {
      const result = await validerCodePromo(null, 50);
      expect(result.valid).toBe(false);
    });

    it('returns invalid for non-existent code', async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });
      const result = await validerCodePromo('FAUX', 50);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('invalide');
    });

    it('returns invalid for inactive promo', async () => {
      mockSingle.mockResolvedValueOnce({ data: makePromo({ active: false }), error: null });
      const result = await validerCodePromo('BIENVENUE10', 50);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('actif');
    });

    it('returns invalid for future promo (not yet started)', async () => {
      const future = new Date(Date.now() + 86400000 * 10).toISOString();
      mockSingle.mockResolvedValueOnce({ data: makePromo({ date_debut: future }), error: null });
      const result = await validerCodePromo('BIENVENUE10', 50);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('pas encore valide');
    });

    it('returns invalid for expired promo', async () => {
      const past = new Date(Date.now() - 86400000).toISOString();
      mockSingle.mockResolvedValueOnce({ data: makePromo({ date_fin: past }), error: null });
      const result = await validerCodePromo('BIENVENUE10', 50);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('expiré');
    });

    it('returns invalid for promo with max usage reached', async () => {
      mockSingle.mockResolvedValueOnce({
        data: makePromo({ usage_max: 5, usage_actuel: 5 }),
        error: null,
      });
      const result = await validerCodePromo('BIENVENUE10', 50);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('maximum');
    });

    it('returns invalid when subtotal is below minimum_commande', async () => {
      mockSingle.mockResolvedValueOnce({
        data: makePromo({ minimum_commande: 30 }),
        error: null,
      });
      const result = await validerCodePromo('BIENVENUE10', 20);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('30.00€');
    });

    it('validates and calculates percentage reduction', async () => {
      mockSingle.mockResolvedValueOnce({ data: makePromo(), error: null });
      const result = await validerCodePromo('bienvenue10', 80);
      expect(result.valid).toBe(true);
      expect(result.montantReduction).toBe(8); // 10% of 80
      expect(result.promo.code).toBe('BIENVENUE10');
      expect(result.message).toContain('-10%');
    });

    it('validates and calculates fixed amount reduction', async () => {
      const promo = makePromo({ type_reduction: 'montant_fixe', valeur: 5 });
      mockSingle.mockResolvedValueOnce({ data: promo, error: null });
      const result = await validerCodePromo('BIENVENUE10', 80);
      expect(result.valid).toBe(true);
      expect(result.montantReduction).toBe(5);
      expect(result.message).toContain('-5.00€');
    });

    it('caps fixed amount reduction to subtotal', async () => {
      const promo = makePromo({ type_reduction: 'montant_fixe', valeur: 50 });
      mockSingle.mockResolvedValueOnce({ data: promo, error: null });
      const result = await validerCodePromo('BIENVENUE10', 20);
      expect(result.valid).toBe(true);
      expect(result.montantReduction).toBe(20); // capped at sousTotal
    });

    it('normalizes code to uppercase', async () => {
      mockSingle.mockResolvedValueOnce({ data: makePromo(), error: null });
      await validerCodePromo('  bienvenue10  ', 50);
      expect(mockEq).toHaveBeenCalledWith('code', 'BIENVENUE10');
    });
  });

  describe('incrementerUsage', () => {
    it('calls rpc increment_promo_usage', async () => {
      mockRpc.mockResolvedValueOnce({ data: null, error: null });
      await incrementerUsage(42);
      expect(mockRpc).toHaveBeenCalledWith('increment_promo_usage', { promo_id: 42 });
    });

    it('falls back to select+update if rpc fails', async () => {
      mockRpc.mockRejectedValueOnce(new Error('RPC not found'));
      mockSingle.mockResolvedValueOnce({ data: { usage_actuel: 3 } });
      mockUpdate.mockReturnValueOnce({ eq: vi.fn().mockResolvedValue({ error: null }) });

      await incrementerUsage(42);
      expect(mockFrom).toHaveBeenCalledWith('promotions');
    });
  });
});
