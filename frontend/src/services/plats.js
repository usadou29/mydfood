import { supabase } from '../lib/supabase';

export async function fetchPlats({ disponible = true, populaire, categorie_id } = {}) {
  let query = supabase.from('plats').select('*, categories(nom)');

  if (disponible !== null) query = query.eq('disponible', disponible);
  if (populaire !== undefined) query = query.eq('populaire', populaire);
  if (categorie_id) query = query.eq('categorie_id', categorie_id);

  const { data, error } = await query.order('id');
  if (error) throw error;
  return data;
}

export async function fetchPlatById(id) {
  const { data, error } = await supabase
    .from('plats')
    .select('*, categories(nom)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
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
