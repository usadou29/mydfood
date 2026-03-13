import { supabase } from '../lib/supabase';
import { incrementerUsage } from './promotions';

// ── Notification helper (fire-and-forget) ───────────

/**
 * Trigger an email notification via the send-notification Edge Function.
 * Never throws — failures are logged silently so they don't block user flows.
 */
export async function triggerNotification(commandeId, eventType, extra = {}) {
  try {
    const { data: { session: authSession } } = await supabase.auth.getSession();
    const token = authSession?.access_token;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          commande_id: commandeId,
          event_type: eventType,
          ...extra,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.warn(`[Notification] Échec (${eventType}):`, text);
    }
  } catch (err) {
    console.warn(`[Notification] Erreur (${eventType}):`, err.message);
  }
}

export async function fetchZonesLivraison() {
  const { data, error } = await supabase
    .from('zones_livraison')
    .select('*')
    .eq('active', true)
    .order('frais_livraison');
  if (error) throw error;
  return data;
}

export async function creerCommande({
  client,
  zone_livraison_id,
  type_livraison,
  creneau_livraison,
  items,
  sous_total,
  frais_livraison,
  pourboire,
  total,
  message_client,
  mode_paiement = 'especes',
  code_promo = null,
  reduction = 0,
}) {
  const user = (await supabase.auth.getUser()).data.user;

  const { data: commande, error: errCommande } = await supabase
    .from('commandes')
    .insert({
      user_id: user?.id || null,
      client_nom: client.nom,
      client_email: client.email,
      client_telephone: client.telephone,
      client_adresse: client.adresse || null,
      zone_livraison_id: zone_livraison_id || null,
      type_livraison,
      creneau_livraison,
      sous_total,
      frais_livraison,
      pourboire: pourboire || 0,
      total,
      message_client,
      mode_paiement,
      code_promo,
      reduction,
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

  if (errLignes) {
    // Stock insufficient — the DB trigger raises an exception
    if (errLignes.message && errLignes.message.includes('portions disponibles')) {
      // Clean up the orphan order
      await supabase.from('commandes').delete().eq('id', commande.id);
      throw new Error('STOCK_INSUFFISANT');
    }
    throw errLignes;
  }

  // Trigger order creation email (fire-and-forget)
  triggerNotification(commande.id, 'creation');

  // Increment promo usage counter (fire-and-forget)
  if (code_promo) {
    supabase
      .from('promotions')
      .select('id')
      .eq('code', code_promo.toUpperCase())
      .single()
      .then(({ data: promo }) => {
        if (promo) incrementerUsage(promo.id);
      })
      .catch(() => {}); // Silent — don't block order
  }

  return commande;
}

export async function fetchMesCommandes(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('commandes')
    .select('*, commande_lignes(*), zones_livraison(nom, frais_livraison)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchCommandeByNumero(numero) {
  const { data, error } = await supabase
    .from('commandes')
    .select('*, commande_lignes(*), zones_livraison(nom, frais_livraison, delai_minutes)')
    .eq('numero', numero)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Create a Stripe Checkout Session via Supabase Edge Function.
 * @param {Object} commande - The commande object (from creerCommande)
 * @param {Array} cartItems - Cart items [{ nom, prix, quantite }]
 * @returns {{ sessionUrl: string }} - URL to redirect to Stripe Checkout
 */
export async function createStripeCheckoutSession(commande, cartItems) {
  const { data: { session: authSession } } = await supabase.auth.getSession();
  const token = authSession?.access_token;

  if (!token) {
    throw new Error('Vous devez être connecté pour payer par carte.');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const origin = window.location.origin;

  const response = await fetch(
    `${supabaseUrl}/functions/v1/create-checkout-session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        commande_id: commande.id,
        line_items: cartItems.map((item) => ({
          nom: item.nom,
          prix_unitaire: item.prix_unitaire,
          quantite: item.quantite,
        })),
        success_url: `${origin}/confirmation/${commande.numero}?payment=success`,
        cancel_url: `${origin}/checkout?payment=cancelled`,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de la création de la session de paiement.');
  }

  return data;
}
