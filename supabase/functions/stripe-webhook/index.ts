// supabase/functions/stripe-webhook/index.ts
// Supabase Edge Function — Handles Stripe webhook events
//
// Events handled:
//   - checkout.session.completed → Update commande: statut='confirmee', stripe_payment_id
//   - checkout.session.expired   → Update commande: statut='annulee' (if still en_attente)
//
// Auth: Stripe webhook signature (not JWT)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import Stripe from 'https://esm.sh/stripe@17.0.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Validate environment
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeSecretKey || !webhookSecret) {
      console.error('Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
      return new Response(
        JSON.stringify({ error: 'Configuration serveur manquante.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Get Stripe signature from header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Signature Stripe manquante.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Verify webhook signature
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    });

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Signature webhook invalide:', err.message);
      return new Response(
        JSON.stringify({ error: 'Signature invalide.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Create Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Handle events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const commandeId = session.metadata?.commande_id;

        if (!commandeId) {
          console.warn('checkout.session.completed sans commande_id dans metadata');
          break;
        }

        console.log(`Paiement réussi pour commande ${commandeId} (${session.metadata?.numero})`);

        // Update commande status and Stripe payment ID
        const { error: updateError } = await supabase
          .from('commandes')
          .update({
            statut: 'confirmee',
            stripe_payment_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', Number(commandeId))
          .eq('statut', 'en_attente'); // Only update if still pending (idempotency)

        if (updateError) {
          console.error('Erreur mise à jour commande:', updateError);
          // Don't return 500 — Stripe would retry. Log and acknowledge.
        }

        // Trigger payment confirmed notification (fire-and-forget)
        await triggerNotification(supabaseUrl, supabaseServiceKey, Number(commandeId), 'payment_confirmed');

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const commandeId = session.metadata?.commande_id;

        if (!commandeId) break;

        console.log(`Session expirée pour commande ${commandeId}`);

        // Only cancel if still pending (don't cancel already confirmed orders)
        const { data: cancelledData } = await supabase
          .from('commandes')
          .update({
            statut: 'annulee',
            notes_admin: 'Session de paiement Stripe expirée.',
            updated_at: new Date().toISOString(),
          })
          .eq('id', Number(commandeId))
          .eq('statut', 'en_attente')
          .select('id')
          .single();

        // Only notify if the update actually happened (order was still en_attente)
        if (cancelledData) {
          await triggerNotification(
            supabaseUrl, supabaseServiceKey, Number(commandeId), 'cancelled',
            { cancellation_reason: 'Session de paiement Stripe expirée.' }
          );
        }

        break;
      }

      default:
        console.log(`Event Stripe non géré: ${event.type}`);
    }

    // 6. Always return 200 to acknowledge receipt
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Erreur stripe-webhook:', err);
    // Return 200 to prevent Stripe from retrying on unexpected errors
    return new Response(
      JSON.stringify({ received: true, error: err.message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Trigger an email notification via the send-notification Edge Function.
 * Fire-and-forget: errors are logged but never thrown.
 */
async function triggerNotification(
  supabaseUrl: string,
  serviceRoleKey: string,
  commandeId: number,
  eventType: string,
  extra: Record<string, unknown> = {}
) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceRoleKey}`,
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
      console.warn(`[stripe-webhook] Notification ${eventType} failed:`, text);
    }
  } catch (err) {
    console.warn(`[stripe-webhook] Notification ${eventType} error:`, err.message);
  }
}
