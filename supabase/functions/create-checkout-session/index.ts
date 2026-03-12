// supabase/functions/create-checkout-session/index.ts
// Supabase Edge Function — Creates a Stripe Checkout Session
//
// Expects POST with JSON body:
//   { commande_id, line_items: [{ nom, prix_unitaire, quantite }], success_url, cancel_url }
//
// Returns: { sessionUrl: "https://checkout.stripe.com/..." }

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import Stripe from 'https://esm.sh/stripe@17.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Validate environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe non configuré sur le serveur.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate JWT (Supabase auth)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentification requise.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Create Supabase admin client to verify user & fetch commande
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user from JWT
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token invalide.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Parse request body
    const { commande_id, line_items, success_url, cancel_url } = await req.json();

    if (!commande_id || !line_items || !success_url || !cancel_url) {
      return new Response(
        JSON.stringify({ error: 'Paramètres manquants: commande_id, line_items, success_url, cancel_url.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Fetch commande from DB to verify ownership and get numero
    const { data: commande, error: dbError } = await supabase
      .from('commandes')
      .select('id, numero, total, user_id, mode_paiement, statut')
      .eq('id', commande_id)
      .single();

    if (dbError || !commande) {
      return new Response(
        JSON.stringify({ error: 'Commande introuvable.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify ownership (user_id matches, or commande has no user_id for guest)
    if (commande.user_id && commande.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Accès non autorisé à cette commande.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Create Stripe Checkout Session
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    });

    const stripeLineItems = line_items.map((item: { nom: string; prix_unitaire: number; quantite: number }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.nom,
        },
        unit_amount: Math.round(item.prix_unitaire * 100), // Stripe expects cents
      },
      quantity: item.quantite,
    }));

    // Add delivery fees if present
    if (commande.total > line_items.reduce((sum: number, i: { prix_unitaire: number; quantite: number }) =>
      sum + i.prix_unitaire * i.quantite, 0)) {
      const fraisLivraison = commande.total - line_items.reduce((sum: number, i: { prix_unitaire: number; quantite: number }) =>
        sum + i.prix_unitaire * i.quantite, 0);
      if (fraisLivraison > 0) {
        stripeLineItems.push({
          price_data: {
            currency: 'eur',
            product_data: { name: 'Frais de livraison' },
            unit_amount: Math.round(fraisLivraison * 100),
          },
          quantity: 1,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      success_url,
      cancel_url,
      metadata: {
        commande_id: String(commande.id),
        numero: commande.numero,
      },
      customer_email: user.email,
    });

    // 7. Return session URL
    return new Response(
      JSON.stringify({ sessionUrl: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Erreur create-checkout-session:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Erreur interne.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
