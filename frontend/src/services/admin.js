import { supabase } from '../lib/supabase';

// =====================
// DASHBOARD STATS
// =====================

export async function fetchDashboardStats() {
  const [plats, commandes, temoignages, commandesRecentes] = await Promise.all([
    supabase.from('plats').select('id', { count: 'exact', head: true }),
    supabase.from('commandes').select('id, total, statut', { count: 'exact' }),
    supabase.from('temoignages').select('id, approuve', { count: 'exact' }),
    supabase
      .from('commandes')
      .select('id, numero, client_nom, total, statut, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const allCommandes = commandes.data || [];
  const revenue = allCommandes
    .filter((c) => c.statut === 'livree')
    .reduce((sum, c) => sum + Number(c.total), 0);
  const enAttente = allCommandes.filter((c) => c.statut === 'en_attente').length;
  const temoignagesEnAttente = (temoignages.data || []).filter((t) => !t.approuve).length;

  return {
    totalPlats: plats.count || 0,
    totalCommandes: commandes.count || 0,
    revenue,
    commandesEnAttente: enAttente,
    temoignagesEnAttente,
    commandesRecentes: commandesRecentes.data || [],
  };
}

// =====================
// PLATS CRUD
// =====================

export async function fetchAllPlats() {
  const { data, error } = await supabase
    .from('plats')
    .select('*, categories(nom)')
    .order('nom');
  if (error) throw error;
  return data;
}

export async function createPlat(plat) {
  const { data, error } = await supabase.from('plats').insert(plat).select().single();
  if (error) throw error;
  return data;
}

export async function updatePlat(id, updates) {
  const { data, error } = await supabase
    .from('plats')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlat(id) {
  const { error } = await supabase.from('plats').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('ordre');
  if (error) throw error;
  return data;
}

// =====================
// COMMANDES
// =====================

export async function fetchAllCommandes(filtreStatut = null) {
  let query = supabase
    .from('commandes')
    .select('*, commande_lignes(*), zones_livraison(nom)')
    .order('created_at', { ascending: false });

  if (filtreStatut && filtreStatut !== 'tous') {
    query = query.eq('statut', filtreStatut);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateCommandeStatut(id, statut, notesAdmin = '') {
  const updates = { statut };
  if (notesAdmin) updates.notes_admin = notesAdmin;

  const { data, error } = await supabase
    .from('commandes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// =====================
// TEMOIGNAGES
// =====================

export async function fetchAllTemoignages(filtre = 'tous') {
  let query = supabase.from('temoignages').select('*').order('created_at', { ascending: false });

  if (filtre === 'en_attente') query = query.eq('approuve', false);
  else if (filtre === 'approuve') query = query.eq('approuve', true);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function toggleTemoignage(id, approuve) {
  const { data, error } = await supabase
    .from('temoignages')
    .update({ approuve })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTemoignage(id) {
  const { error } = await supabase.from('temoignages').delete().eq('id', id);
  if (error) throw error;
}

// =====================
// PHOTOS DU SITE
// =====================

export async function fetchAllPhotos() {
  const { data, error } = await supabase
    .from('photos_site')
    .select('*')
    .order('section', { ascending: true });
  if (error) throw error;
  return data;
}

export async function updatePhoto(id, updates) {
  const { data, error } = await supabase
    .from('photos_site')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createPhoto(photo) {
  const { data, error } = await supabase.from('photos_site').insert(photo).select().single();
  if (error) throw error;
  return data;
}

export async function deletePhoto(id) {
  const { error } = await supabase.from('photos_site').delete().eq('id', id);
  if (error) throw error;
}
