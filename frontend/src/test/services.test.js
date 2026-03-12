import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase avant les imports
vi.mock('../lib/supabase', () => {
  const mockFrom = vi.fn();
  const mockAuth = {
    getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  };

  return {
    supabase: {
      from: mockFrom,
      auth: mockAuth,
    },
  };
});

describe('Services Supabase', () => {
  let supabase;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import('../lib/supabase');
    supabase = mod.supabase;
  });

  describe('fetchPlats', () => {
    it('doit appeler supabase.from("plats") avec les bons filtres', async () => {
      const mockData = [
        { id: 1, nom: 'Fried Rice', prix: 12, disponible: true },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const { fetchPlats } = await import('../services/plats');
      const result = await fetchPlats();

      expect(supabase.from).toHaveBeenCalledWith('plats');
      expect(mockChain.select).toHaveBeenCalledWith('*, categories(nom)');
      expect(result).toEqual(mockData);
    });

    it('doit lever une erreur si supabase retourne une erreur', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      };
      supabase.from.mockReturnValue(mockChain);

      const { fetchPlats } = await import('../services/plats');
      await expect(fetchPlats()).rejects.toThrow();
    });
  });

  describe('fetchCategories', () => {
    it('doit récupérer les catégories actives triées par ordre', async () => {
      const mockData = [
        { id: 1, nom: 'Plats principaux', ordre: 1 },
        { id: 2, nom: 'Boissons', ordre: 5 },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const { fetchCategories } = await import('../services/plats');
      const result = await fetchCategories();

      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(mockChain.eq).toHaveBeenCalledWith('active', true);
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchMenusFamille', () => {
    it('doit récupérer les menus famille disponibles', async () => {
      const mockData = [
        { id: 1, nom: 'Menu Famille Africain', prix: 45, nb_personnes: 4 },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const { fetchMenusFamille } = await import('../services/menus');
      const result = await fetchMenusFamille();

      expect(supabase.from).toHaveBeenCalledWith('menus_famille');
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchZonesLivraison', () => {
    it('doit récupérer les zones de livraison actives', async () => {
      const mockData = [
        { id: 1, nom: 'Antony (92)', frais_livraison: 0, minimum_commande: 15 },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const { fetchZonesLivraison } = await import('../services/commandes');
      const result = await fetchZonesLivraison();

      expect(supabase.from).toHaveBeenCalledWith('zones_livraison');
      expect(result).toEqual(mockData);
    });
  });

  describe('envoyerContact', () => {
    it('doit insérer un message de contact', async () => {
      const mockContact = { id: 1, nom: 'Test', email: 'test@test.com', sujet: 'test', message: 'Hello' };

      const mockChain = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockContact, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const { envoyerContact } = await import('../services/contact');
      const result = await envoyerContact({ nom: 'Test', email: 'test@test.com', sujet: 'test', message: 'Hello' });

      expect(supabase.from).toHaveBeenCalledWith('contacts');
      expect(result).toEqual(mockContact);
    });
  });

  describe('inscrireNewsletter', () => {
    it('doit upsert un email newsletter', async () => {
      const mockData = { id: 1, email: 'test@test.com', actif: true };

      const mockChain = {
        upsert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      supabase.from.mockReturnValue(mockChain);

      const { inscrireNewsletter } = await import('../services/contact');
      const result = await inscrireNewsletter('test@test.com');

      expect(supabase.from).toHaveBeenCalledWith('newsletter');
      expect(result).toEqual(mockData);
    });
  });
});
