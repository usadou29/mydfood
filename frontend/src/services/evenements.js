import { supabase } from '../lib/supabase';

export async function fetchEvenements() {
  const { data, error } = await supabase
    .from('evenements')
    .select('*')
    .eq('actif', true)
    .gte('date_evenement', new Date().toISOString())
    .order('date_evenement');
  if (error) throw error;
  return data;
}

export async function fetchEvenementById(id) {
  const { data, error } = await supabase
    .from('evenements')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function reserverEvenement({ evenement_id, nom, email, telephone, nb_places }) {
  const { data, error } = await supabase
    .from('reservations')
    .insert({ evenement_id, nom, email, telephone, nb_places })
    .select()
    .single();
  if (error) throw error;
  return data;
}
