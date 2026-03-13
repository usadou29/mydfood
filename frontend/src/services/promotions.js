import { supabase } from '../lib/supabase';

/**
 * Valide un code promo et calcule la réduction.
 * @param {string} code - Le code promo saisi par l'utilisateur
 * @param {number} sousTotal - Le sous-total du panier (avant frais livraison)
 * @returns {{ valid: boolean, promo?: object, montantReduction?: number, message: string }}
 */
export async function validerCodePromo(code, sousTotal) {
  if (!code || !code.trim()) {
    return { valid: false, message: 'Veuillez saisir un code promo.' };
  }

  const codeNorm = code.trim().toUpperCase();

  const { data: promo, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('code', codeNorm)
    .single();

  if (error || !promo) {
    return { valid: false, message: 'Code promo invalide.' };
  }

  if (!promo.active) {
    return { valid: false, message: 'Ce code promo n\'est plus actif.' };
  }

  const now = new Date();
  if (new Date(promo.date_debut) > now) {
    return { valid: false, message: 'Ce code promo n\'est pas encore valide.' };
  }

  if (new Date(promo.date_fin) < now) {
    return { valid: false, message: 'Ce code promo a expiré.' };
  }

  if (promo.usage_max !== null && promo.usage_actuel >= promo.usage_max) {
    return { valid: false, message: 'Ce code promo a atteint son nombre maximum d\'utilisations.' };
  }

  if (promo.minimum_commande !== null && sousTotal < Number(promo.minimum_commande)) {
    return {
      valid: false,
      message: `Commande minimum de ${Number(promo.minimum_commande).toFixed(2)}€ requise pour ce code.`,
    };
  }

  let montantReduction;
  if (promo.type_reduction === 'pourcentage') {
    montantReduction = Math.round(sousTotal * Number(promo.valeur) / 100 * 100) / 100;
  } else {
    montantReduction = Math.min(Number(promo.valeur), sousTotal);
  }

  return {
    valid: true,
    promo,
    montantReduction,
    message: promo.type_reduction === 'pourcentage'
      ? `-${Number(promo.valeur)}% appliqué`
      : `-${Number(promo.valeur).toFixed(2)}€ appliqué`,
  };
}

/**
 * Incrémente le compteur d'utilisation d'une promo (fire-and-forget).
 */
export async function incrementerUsage(promoId) {
  try {
    await supabase.rpc('increment_promo_usage', { promo_id: promoId });
  } catch (err) {
    // Fire-and-forget: on utilise un fallback si la RPC n'existe pas
    try {
      const { data: promo } = await supabase
        .from('promotions')
        .select('usage_actuel')
        .eq('id', promoId)
        .single();
      if (promo) {
        await supabase
          .from('promotions')
          .update({ usage_actuel: promo.usage_actuel + 1 })
          .eq('id', promoId);
      }
    } catch {
      console.warn('[Promotions] Erreur increment usage:', err.message);
    }
  }
}
