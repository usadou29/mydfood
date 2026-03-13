// supabase/functions/send-notification/index.ts
// Supabase Edge Function — Dispatches email notifications for order events
//
// POST { commande_id, event_type, cancellation_reason? }
//
// event_type: 'creation' | 'payment_confirmed' | 'preparing' | 'ready'
//             | 'delivery' | 'delivered' | 'cancelled'
//
// Auth: Bearer JWT (frontend calls) or SERVICE_ROLE_KEY (inter-function calls)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { sendEmail } from '../_shared/email-provider.ts';
import {
  buildOrderCreatedEmail,
  buildPaymentConfirmedEmail,
  buildPreparingEmail,
  buildReadyEmail,
  buildDeliveryEmail,
  buildDeliveredEmail,
  buildCancelledEmail,
  type OrderForEmail,
} from '../_shared/email-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_EVENT_TYPES = [
  'creation',
  'payment_confirmed',
  'preparing',
  'ready',
  'delivery',
  'delivered',
  'cancelled',
] as const;

type EventType = (typeof VALID_EVENT_TYPES)[number];

interface NotificationRequest {
  commande_id: number;
  event_type: EventType;
  cancellation_reason?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Validate environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[send-notification] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({ error: 'Configuration serveur manquante.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse and validate request body
    const body: NotificationRequest = await req.json();
    const { commande_id, event_type, cancellation_reason } = body;

    if (!commande_id || !event_type) {
      return new Response(
        JSON.stringify({ error: 'commande_id et event_type sont requis.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!VALID_EVENT_TYPES.includes(event_type)) {
      return new Response(
        JSON.stringify({ error: `event_type invalide: ${event_type}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Fetch full commande with relations
    const { data: commande, error: fetchError } = await supabase
      .from('commandes')
      .select('*, commande_lignes(nom, prix_unitaire, quantite), zones_livraison(nom)')
      .eq('id', commande_id)
      .single();

    if (fetchError || !commande) {
      console.error(`[send-notification] Commande ${commande_id} introuvable:`, fetchError);
      return new Response(
        JSON.stringify({ error: `Commande ${commande_id} introuvable.` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Validate recipient email
    const recipientEmail = commande.client_email;
    if (!recipientEmail) {
      console.warn(`[send-notification] Pas d'email client pour commande ${commande_id}`);
      return new Response(
        JSON.stringify({ error: 'Pas d\'adresse email pour cette commande.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Build email template based on event type
    const order: OrderForEmail = commande as OrderForEmail;
    let subject: string;
    let html: string;

    switch (event_type) {
      case 'creation':
        subject = `Commande ${order.numero} enregistrée`;
        html = buildOrderCreatedEmail(order);
        break;
      case 'payment_confirmed':
        subject = `Paiement confirmé — ${order.numero}`;
        html = buildPaymentConfirmedEmail(order);
        break;
      case 'preparing':
        subject = `Commande ${order.numero} en préparation`;
        html = buildPreparingEmail(order);
        break;
      case 'ready':
        subject = `Commande ${order.numero} prête !`;
        html = buildReadyEmail(order);
        break;
      case 'delivery':
        subject = `Commande ${order.numero} en livraison`;
        html = buildDeliveryEmail(order);
        break;
      case 'delivered':
        subject = `Commande ${order.numero} livrée — Bon appétit !`;
        html = buildDeliveredEmail(order);
        break;
      case 'cancelled':
        subject = `Commande ${order.numero} annulée`;
        html = buildCancelledEmail(order, cancellation_reason);
        break;
    }

    // 7. Send email
    const result = await sendEmail({
      to: recipientEmail,
      subject,
      html,
      metadata: { commande_id, event_type, numero: order.numero },
    });

    console.log(
      `[send-notification] ${event_type} → ${recipientEmail} (${order.numero}) — ${result.success ? 'OK' : 'FAILED'}`
    );

    // 8. Return result
    return new Response(
      JSON.stringify({
        success: result.success,
        email_to: recipientEmail,
        event_type,
        numero: order.numero,
        provider: result.provider,
        messageId: result.messageId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[send-notification] Erreur:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Erreur interne.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
