/**
 * Email Templates for DFOOD by Tata Dow
 *
 * Each function returns a complete HTML email string.
 * Templates are responsive, branded, and in French.
 */

export interface OrderForEmail {
  numero: string;
  client_nom: string;
  client_email: string;
  client_telephone?: string;
  client_adresse?: string;
  type_livraison: string;
  creneau_livraison: string;
  mode_paiement: string;
  sous_total: number;
  frais_livraison: number;
  pourboire?: number;
  total: number;
  message_client?: string;
  created_at: string;
  commande_lignes: Array<{
    nom: string;
    prix_unitaire: number;
    quantite: number;
  }>;
  zones_livraison?: { nom: string } | null;
}

// ── Brand constants ─────────────────────────────────

const BRAND = {
  name: 'DFOOD by Tata Dow',
  color: '#2F79A0',      // blue
  colorLight: '#E8F4FD',
  yellow: '#F4C25A',
  cream: '#FFF8F2',
  text: '#1A1A2E',
  textLight: '#6B7280',
  siteUrl: 'https://mydfood.com',
  phone: '+33 7 56 94 95 37',
};

// ── Base layout ─────────────────────────────────────

function baseLayout(title: string, preheader: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${BRAND.cream}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${BRAND.text}; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: ${BRAND.color}; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 0; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); font-size: 13px; margin: 6px 0 0; }
    .body { padding: 32px 24px; }
    .body h2 { font-size: 20px; color: ${BRAND.text}; margin: 0 0 16px; }
    .body p { font-size: 14px; line-height: 1.6; color: ${BRAND.textLight}; margin: 0 0 12px; }
    .highlight { background: ${BRAND.colorLight}; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .highlight .label { font-size: 12px; color: ${BRAND.textLight}; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .highlight .value { font-size: 24px; font-weight: 700; color: ${BRAND.color}; margin: 0; }
    table.items { width: 100%; border-collapse: collapse; margin: 16px 0; }
    table.items th { text-align: left; font-size: 12px; color: ${BRAND.textLight}; padding: 8px 0; border-bottom: 1px solid #E5E7EB; text-transform: uppercase; letter-spacing: 0.5px; }
    table.items td { font-size: 14px; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
    table.items td.right { text-align: right; font-weight: 600; }
    .totals { border-top: 2px solid ${BRAND.color}; padding-top: 12px; margin-top: 8px; }
    .totals .row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; }
    .totals .total-row { font-size: 18px; font-weight: 700; color: ${BRAND.color}; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
    .info-block .label { font-size: 11px; color: ${BRAND.textLight}; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 2px; }
    .info-block .value { font-size: 14px; font-weight: 600; color: ${BRAND.text}; margin: 0; }
    .cta { display: inline-block; background: ${BRAND.color}; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; margin: 20px 0; }
    .footer { background: ${BRAND.cream}; padding: 24px; text-align: center; }
    .footer p { font-size: 12px; color: ${BRAND.textLight}; margin: 0 0 4px; }
    .footer a { color: ${BRAND.color}; text-decoration: none; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .preheader { display: none !important; font-size: 1px; color: ${BRAND.cream}; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="container">
    <div class="header">
      <h1>${BRAND.name}</h1>
      <p>Cuisine africaine authentique</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>${BRAND.name} &mdash; Antony &amp; Île-de-France</p>
      <p><a href="tel:${BRAND.phone}">${BRAND.phone}</a> &middot; <a href="${BRAND.siteUrl}">${BRAND.siteUrl}</a></p>
      <p style="margin-top: 12px; font-size: 11px;">Cet email a été envoyé suite à votre commande sur ${BRAND.name}.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────

function formatPrice(n: number): string {
  return Number(n).toFixed(2) + '€';
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

function buildItemsTable(items: OrderForEmail['commande_lignes']): string {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td>${item.nom}</td>
      <td style="text-align:center">${item.quantite}</td>
      <td class="right">${formatPrice(item.prix_unitaire * item.quantite)}</td>
    </tr>`
    )
    .join('');

  return `
  <table class="items">
    <thead>
      <tr>
        <th>Article</th>
        <th style="text-align:center">Qté</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function buildTotals(order: OrderForEmail): string {
  let html = `<div class="totals">`;
  html += `<div class="row"><span>Sous-total</span><span>${formatPrice(order.sous_total)}</span></div>`;
  if (order.frais_livraison > 0) {
    html += `<div class="row"><span>Frais de livraison</span><span>${formatPrice(order.frais_livraison)}</span></div>`;
  }
  if (order.pourboire && order.pourboire > 0) {
    html += `<div class="row"><span>Pourboire</span><span>${formatPrice(order.pourboire)}</span></div>`;
  }
  html += `<div class="row total-row"><span>Total</span><span>${formatPrice(order.total)}</span></div>`;
  html += `</div>`;
  return html;
}

function buildDeliveryInfo(order: OrderForEmail): string {
  const mode =
    order.type_livraison === 'livraison'
      ? `Livraison à domicile${order.zones_livraison ? ` — ${order.zones_livraison.nom}` : ''}`
      : 'Retrait sur place';

  const paiement =
    order.mode_paiement === 'carte' ? 'Carte bancaire (Stripe)' : 'Espèces';

  return `
  <div style="margin: 16px 0;">
    <table style="width:100%; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: ${BRAND.textLight};">Mode</td>
        <td style="padding: 6px 0; font-weight: 600;">${mode}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${BRAND.textLight};">Créneau</td>
        <td style="padding: 6px 0; font-weight: 600;">${order.creneau_livraison}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${BRAND.textLight};">Paiement</td>
        <td style="padding: 6px 0; font-weight: 600;">${paiement}</td>
      </tr>
      ${order.client_adresse ? `<tr>
        <td style="padding: 6px 0; color: ${BRAND.textLight};">Adresse</td>
        <td style="padding: 6px 0; font-weight: 600;">${order.client_adresse}</td>
      </tr>` : ''}
    </table>
  </div>`;
}

// ── Template builders ───────────────────────────────

export function buildOrderCreatedEmail(order: OrderForEmail): string {
  const content = `
    <h2>Merci pour votre commande !</h2>
    <p>Bonjour <strong>${order.client_nom}</strong>,</p>
    <p>Votre commande a bien été enregistrée. Nous la préparons avec soin dès que possible.</p>

    <div class="highlight">
      <p class="label">Numéro de commande</p>
      <p class="value">${order.numero}</p>
    </div>

    ${buildItemsTable(order.commande_lignes)}
    ${buildTotals(order)}
    ${buildDeliveryInfo(order)}

    ${order.message_client ? `<div style="background: #FEF3C7; border-radius: 8px; padding: 12px; margin: 16px 0;">
      <p style="font-size: 12px; color: #92400E; margin: 0 0 4px; font-weight: 600;">📝 Vos instructions</p>
      <p style="font-size: 14px; color: #78350F; margin: 0;">${order.message_client}</p>
    </div>` : ''}

    <p>Vous recevrez un email à chaque étape de la préparation de votre commande.</p>
  `;

  return baseLayout(
    `Commande ${order.numero} confirmée`,
    `Votre commande ${order.numero} a été enregistrée — ${formatPrice(order.total)}`,
    content
  );
}

export function buildPaymentConfirmedEmail(order: OrderForEmail): string {
  const content = `
    <h2>Paiement confirmé ✓</h2>
    <p>Bonjour <strong>${order.client_nom}</strong>,</p>
    <p>Votre paiement par carte bancaire a été accepté avec succès.</p>

    <div class="highlight">
      <p class="label">Numéro de commande</p>
      <p class="value">${order.numero}</p>
    </div>

    <div style="background: #D1FAE5; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
      <p style="font-size: 16px; font-weight: 700; color: #065F46; margin: 0;">
        💳 ${formatPrice(order.total)} payés par carte
      </p>
    </div>

    <p>Votre commande va être préparée très prochainement. Nous vous tiendrons informé(e) par email.</p>

    ${buildDeliveryInfo(order)}
  `;

  return baseLayout(
    `Paiement confirmé — ${order.numero}`,
    `Paiement de ${formatPrice(order.total)} confirmé pour la commande ${order.numero}`,
    content
  );
}

export function buildPreparingEmail(order: OrderForEmail): string {
  const content = `
    <h2>Votre commande est en préparation 👨‍🍳</h2>
    <p>Bonjour <strong>${order.client_nom}</strong>,</p>
    <p>Bonne nouvelle ! Notre équipe a commencé la préparation de votre commande.</p>

    <div class="highlight">
      <p class="label">Commande</p>
      <p class="value">${order.numero}</p>
    </div>

    ${buildItemsTable(order.commande_lignes)}

    <p>Créneau prévu : <strong>${order.creneau_livraison}</strong></p>
    <p>Nous vous préviendrons dès que votre commande sera prête !</p>
  `;

  return baseLayout(
    `En préparation — ${order.numero}`,
    `Votre commande ${order.numero} est en cours de préparation`,
    content
  );
}

export function buildReadyEmail(order: OrderForEmail): string {
  const isDelivery = order.type_livraison === 'livraison';
  const content = `
    <h2>Votre commande est prête ! 🎉</h2>
    <p>Bonjour <strong>${order.client_nom}</strong>,</p>
    <p>${isDelivery
      ? 'Votre commande est prête et sera bientôt confiée au livreur.'
      : 'Votre commande est prête ! Vous pouvez venir la récupérer.'
    }</p>

    <div class="highlight">
      <p class="label">Commande</p>
      <p class="value">${order.numero}</p>
    </div>

    ${!isDelivery ? `
    <div style="background: #DBEAFE; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="font-size: 14px; font-weight: 600; color: #1E40AF; margin: 0;">
        📍 Retrait : présentez votre numéro de commande
      </p>
    </div>` : ''}

    <p>Créneau : <strong>${order.creneau_livraison}</strong></p>
  `;

  return baseLayout(
    `Commande prête — ${order.numero}`,
    `Votre commande ${order.numero} est prête ${isDelivery ? 'pour la livraison' : 'à retirer'}`,
    content
  );
}

export function buildDeliveryEmail(order: OrderForEmail): string {
  const content = `
    <h2>Votre commande est en route ! 🚗</h2>
    <p>Bonjour <strong>${order.client_nom}</strong>,</p>
    <p>Votre commande est en cours de livraison. Elle arrivera bientôt !</p>

    <div class="highlight">
      <p class="label">Commande</p>
      <p class="value">${order.numero}</p>
    </div>

    ${order.client_adresse ? `
    <div style="background: #EDE9FE; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="font-size: 14px; font-weight: 600; color: #5B21B6; margin: 0;">
        📍 Livraison : ${order.client_adresse}
      </p>
    </div>` : ''}

    <p>Créneau prévu : <strong>${order.creneau_livraison}</strong></p>
    <p>Si vous avez des questions, contactez-nous au <a href="tel:${BRAND.phone}" style="color: ${BRAND.color}; font-weight: 600;">${BRAND.phone}</a>.</p>
  `;

  return baseLayout(
    `En livraison — ${order.numero}`,
    `Votre commande ${order.numero} est en cours de livraison`,
    content
  );
}

export function buildDeliveredEmail(order: OrderForEmail): string {
  const content = `
    <h2>Commande livrée — Bon appétit ! 🍽️</h2>
    <p>Bonjour <strong>${order.client_nom}</strong>,</p>
    <p>Votre commande <strong>${order.numero}</strong> a été livrée avec succès. Nous espérons que vous allez régaler !</p>

    ${buildTotals(order)}

    <div style="background: ${BRAND.colorLight}; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="font-size: 16px; font-weight: 600; color: ${BRAND.color}; margin: 0 0 8px;">
        Votre avis compte !
      </p>
      <p style="font-size: 14px; color: ${BRAND.textLight}; margin: 0 0 16px;">
        Partagez votre expérience pour aider d'autres gourmands.
      </p>
      <a href="${BRAND.siteUrl}" class="cta" style="color: #ffffff;">Laisser un avis</a>
    </div>

    <p>Merci pour votre confiance et à très bientôt !</p>
  `;

  return baseLayout(
    `Commande livrée — ${order.numero}`,
    `Votre commande ${order.numero} a été livrée. Bon appétit !`,
    content
  );
}

export function buildCancelledEmail(order: OrderForEmail, reason?: string): string {
  const content = `
    <h2>Commande annulée</h2>
    <p>Bonjour <strong>${order.client_nom}</strong>,</p>
    <p>Nous sommes désolés de vous informer que votre commande <strong>${order.numero}</strong> a été annulée.</p>

    ${reason ? `
    <div style="background: #FEF2F2; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="font-size: 12px; color: #991B1B; margin: 0 0 4px; font-weight: 600;">Motif</p>
      <p style="font-size: 14px; color: #7F1D1D; margin: 0;">${reason}</p>
    </div>` : ''}

    ${order.mode_paiement === 'carte' ? `
    <div style="background: #FEF3C7; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="font-size: 14px; color: #92400E; margin: 0;">
        💳 Si un paiement a été effectué, le remboursement sera traité automatiquement sous 5 à 10 jours ouvrés.
      </p>
    </div>` : ''}

    <p>Pour toute question, n'hésitez pas à nous contacter au <a href="tel:${BRAND.phone}" style="color: ${BRAND.color}; font-weight: 600;">${BRAND.phone}</a>.</p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${BRAND.siteUrl}/commander" class="cta" style="color: #ffffff;">Commander à nouveau</a>
    </div>
  `;

  return baseLayout(
    `Commande annulée — ${order.numero}`,
    `Votre commande ${order.numero} a été annulée`,
    content
  );
}
