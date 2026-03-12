import { supabase } from '../lib/supabase';

export async function fetchZonesLivraison() {
  const { data, error } = await supabase
    .from('zones_livraison')
    .select('*')
    .eq('active', true)
    .order('frais_livraison');
  if (error) throw error;
  return data;
}

export async function creerCommande({ client, zone_livraison_id, type_livraison, creneau_livraison, items, sous_total, frais_livraison, pourboire, total, message_client }) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data: commande, error: errCommande } = await supabase
    .from('commandes')
    .insert({
      user_id: user?.id || null,
      client_nom: client.nom,
      client_email: client.email,
      client_telephone: client.telephone,
      client_adresse: client.adresse || null,
      zone_livraison_id,
      type_livraison,
      creneau_livraison,
      sous_total,
      frais_livraison,
      pourboire: pourboire || 0,
      total,
      message_client,
      mode_paiement: 'carte',
    })
    .select()
    .single();

  if (errCommande) throw errCommande;

  const lignes = items.map((item) => ({
    commande_id: commande.id,
    plat_id: item.plat_id || null,
    menu_famille_id: item.menu_famille_id || null,
    nom: item.nom,
    prix_unitaire: item.prix_unitaire,
    quantite: item.quantite,
    sous_total: item.prix_unitaire * item.quantite,
  }));

  const { error: errLignes } = await supabase
    .from('commande_lignes')
    .insert(lignes);

  if (errLignes) throw errLignes;

  return commande;
}

export async function fetchMesCommandes() {
  const { data, error } = await supabase
    .from('commandes')
    .select('*, commande_lignes(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
