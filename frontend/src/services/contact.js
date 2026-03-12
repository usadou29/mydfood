import { supabase } from '../lib/supabase';

export async function envoyerContact({ nom, email, sujet, message }) {
  const { data, error } = await supabase
    .from('contacts')
    .insert({ nom, email, sujet, message })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function inscrireNewsletter(email) {
  const { data, error } = await supabase
    .from('newsletter')
    .upsert({ email, actif: true }, { onConflict: 'email' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function envoyerDevisTraiteur({ nom, email, telephone, type_evenement, nombre_personnes, date_evenement, budget, details }) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
    .from('devis_traiteur')
    .insert({
      user_id: user?.id || null,
      nom,
      email,
      telephone,
      type_evenement,
      nombre_personnes,
      date_evenement,
      budget,
      details,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
