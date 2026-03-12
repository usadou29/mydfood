import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so mocks are available inside vi.mock factory (which is hoisted)
const {
  mockFrom,
  mockSelect,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockEq,
  mockOrder,
  mockLimit,
  mockSingle,
  chainable,
} = vi.hoisted(() => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockLimit = vi.fn();
  const mockSingle = vi.fn();

  const chainable = {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle,
    from: mockFrom,
  };

  Object.values(chainable).forEach((fn) => fn.mockReturnValue(chainable));

  return {
    mockFrom, mockSelect, mockInsert, mockUpdate, mockDelete,
    mockEq, mockOrder, mockLimit, mockSingle, chainable,
  };
});

vi.mock('../../lib/supabase', () => ({
  supabase: { from: mockFrom },
}));

import {
  fetchAllPlats,
  createPlat,
  updatePlat,
  deletePlat,
  fetchCategories,
  fetchAllCommandes,
  updateCommandeStatut,
  fetchAllTemoignages,
  toggleTemoignage,
  deleteTemoignage,
  fetchAllPhotos,
  updatePhoto,
  createPhoto,
  deletePhoto,
} from '../../services/admin';

beforeEach(() => {
  vi.clearAllMocks();
  Object.values(chainable).forEach((fn) => fn.mockReturnValue(chainable));
});

describe('Admin Service - Plats', () => {
  it('fetchAllPlats calls supabase with correct params', async () => {
    mockOrder.mockResolvedValue({ data: [{ id: 1, nom: 'Test' }], error: null });
    const result = await fetchAllPlats();
    expect(mockFrom).toHaveBeenCalledWith('plats');
    expect(mockSelect).toHaveBeenCalledWith('*, categories(nom)');
    expect(result).toEqual([{ id: 1, nom: 'Test' }]);
  });

  it('createPlat inserts correctly', async () => {
    mockSingle.mockResolvedValue({ data: { id: 1 }, error: null });
    const result = await createPlat({ nom: 'Nouveau', prix: 10 });
    expect(mockFrom).toHaveBeenCalledWith('plats');
    expect(mockInsert).toHaveBeenCalledWith({ nom: 'Nouveau', prix: 10 });
    expect(result).toEqual({ id: 1 });
  });

  it('updatePlat updates correctly', async () => {
    mockSingle.mockResolvedValue({ data: { id: 1, nom: 'Updated' }, error: null });
    const result = await updatePlat(1, { nom: 'Updated' });
    expect(mockUpdate).toHaveBeenCalledWith({ nom: 'Updated' });
    expect(mockEq).toHaveBeenCalledWith('id', 1);
    expect(result).toEqual({ id: 1, nom: 'Updated' });
  });

  it('deletePlat deletes correctly', async () => {
    mockEq.mockResolvedValue({ error: null });
    await deletePlat(1);
    expect(mockFrom).toHaveBeenCalledWith('plats');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 1);
  });

  it('fetchAllPlats throws on error', async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: 'DB error' } });
    await expect(fetchAllPlats()).rejects.toThrow();
  });
});

describe('Admin Service - Commandes', () => {
  it('fetchAllCommandes calls supabase', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });
    await fetchAllCommandes();
    expect(mockFrom).toHaveBeenCalledWith('commandes');
  });

  it('fetchAllCommandes with filter', async () => {
    mockOrder.mockReturnValue(chainable);
    mockEq.mockResolvedValue({ data: [], error: null });
    await fetchAllCommandes('en_attente');
    expect(mockEq).toHaveBeenCalledWith('statut', 'en_attente');
  });

  it('updateCommandeStatut updates status', async () => {
    mockSingle.mockResolvedValue({ data: { id: 1, statut: 'confirmee' }, error: null });
    const result = await updateCommandeStatut(1, 'confirmee');
    expect(mockUpdate).toHaveBeenCalledWith({ statut: 'confirmee' });
    expect(result).toEqual({ id: 1, statut: 'confirmee' });
  });

  it('updateCommandeStatut with notes', async () => {
    mockSingle.mockResolvedValue({ data: { id: 1 }, error: null });
    await updateCommandeStatut(1, 'annulee', 'Client absent');
    expect(mockUpdate).toHaveBeenCalledWith({ statut: 'annulee', notes_admin: 'Client absent' });
  });
});

describe('Admin Service - Temoignages', () => {
  it('fetchAllTemoignages calls supabase', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });
    await fetchAllTemoignages();
    expect(mockFrom).toHaveBeenCalledWith('temoignages');
  });

  it('toggleTemoignage approves', async () => {
    mockSingle.mockResolvedValue({ data: { id: 1, approuve: true }, error: null });
    const result = await toggleTemoignage(1, true);
    expect(mockUpdate).toHaveBeenCalledWith({ approuve: true });
    expect(result.approuve).toBe(true);
  });

  it('deleteTemoignage deletes', async () => {
    mockEq.mockResolvedValue({ error: null });
    await deleteTemoignage(1);
    expect(mockFrom).toHaveBeenCalledWith('temoignages');
    expect(mockDelete).toHaveBeenCalled();
  });
});

describe('Admin Service - Photos', () => {
  it('fetchAllPhotos calls supabase', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });
    await fetchAllPhotos();
    expect(mockFrom).toHaveBeenCalledWith('photos_site');
  });

  it('updatePhoto updates correctly', async () => {
    mockSingle.mockResolvedValue({ data: { id: 1 }, error: null });
    await updatePhoto(1, { url: 'https://new.jpg' });
    expect(mockUpdate).toHaveBeenCalledWith({ url: 'https://new.jpg' });
  });

  it('createPhoto creates correctly', async () => {
    mockSingle.mockResolvedValue({ data: { id: 3 }, error: null });
    const result = await createPhoto({ cle: 'test', url: 'https://test.jpg', section: 'hero' });
    expect(mockInsert).toHaveBeenCalledWith({ cle: 'test', url: 'https://test.jpg', section: 'hero' });
    expect(result).toEqual({ id: 3 });
  });

  it('deletePhoto deletes correctly', async () => {
    mockEq.mockResolvedValue({ error: null });
    await deletePhoto(1);
    expect(mockFrom).toHaveBeenCalledWith('photos_site');
    expect(mockDelete).toHaveBeenCalled();
  });
});
