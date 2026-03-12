import { supabase } from '../lib/supabase';

export async function fetchMenusFamille() {
  const { data, error } = await supabase
    .from('menus_famille')
    .select('*')
    .eq('disponible', true)
    .order('nb_personnes');
  if (error) throw error;
  return data;
}

export async function fetchMenuSemaine() {
  const { data, error } = await supabase
    .from('menus_semaine')
    .select(`
      *,
      menus_semaine_plats(
        *,
        plats(nom, prix, image_url)
      )
    `)
    .eq('actif', true)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // Pas de menu actif
    throw error;
  }
  return data;
}
