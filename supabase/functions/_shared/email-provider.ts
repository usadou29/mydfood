/**
 * Email Provider Abstraction Layer
 *
 * Currently: Placeholder (console.log)
 * To switch to a real provider (Resend, SendGrid, etc.):
 *   1. Set EMAIL_PROVIDER env var (e.g. 'resend')
 *   2. Set the provider's API key (e.g. RESEND_API_KEY)
 *   3. Implement the provider case in sendEmail()
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
}

const FROM_EMAIL = 'DFOOD by Tata Dow <noreply@mydfood.com>';

/**
 * Send an email using the configured provider.
 * Currently logs to console (placeholder mode).
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const provider = Deno.env.get('EMAIL_PROVIDER') || 'placeholder';

  try {
    switch (provider) {
      case 'placeholder':
        return await sendPlaceholder(payload);

      // Future providers — uncomment and implement when ready:
      // case 'resend':
      //   return await sendViaResend(payload);
      // case 'sendgrid':
      //   return await sendViaSendGrid(payload);

      default:
        console.warn(`[Email] Unknown provider "${provider}", falling back to placeholder.`);
        return await sendPlaceholder(payload);
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Email] Error sending email:`, errorMsg);
    return { success: false, provider, error: errorMsg };
  }
}

/**
 * Placeholder: logs email details to console instead of sending.
 */
async function sendPlaceholder(payload: EmailPayload): Promise<EmailResult> {
  const timestamp = new Date().toISOString();
  const messageId = `placeholder_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Extract a short text preview from HTML (strip tags, first 120 chars)
  const textPreview = payload.html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

  console.log(`
╔══════════════════════════════════════════════════════╗
║  📧 PLACEHOLDER EMAIL — ${timestamp}
╠══════════════════════════════════════════════════════╣
║  From:    ${FROM_EMAIL}
║  To:      ${payload.to}
║  Subject: ${payload.subject}
║  ID:      ${messageId}
╠══════════════════════════════════════════════════════╣
║  Preview: ${textPreview}...
╚══════════════════════════════════════════════════════╝
  `);

  return { success: true, provider: 'placeholder', messageId };
}
