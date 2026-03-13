import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock supabase auth
const mockGetSession = vi.hoisted(() => vi.fn());
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { getSession: mockGetSession },
  },
}));

import { triggerNotification } from '../../services/commandes';

describe('triggerNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('') });
    mockGetSession.mockResolvedValue({ data: { session: { access_token: 'jwt-123' } } });
  });

  afterEach(() => {
    delete globalThis.fetch;
  });

  it('calls send-notification edge function with correct payload', async () => {
    await triggerNotification(42, 'creation');

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = globalThis.fetch.mock.calls[0];
    expect(url).toContain('/functions/v1/send-notification');
    expect(opts.method).toBe('POST');
    expect(opts.headers['Content-Type']).toBe('application/json');
    expect(opts.headers.Authorization).toBe('Bearer jwt-123');

    const body = JSON.parse(opts.body);
    expect(body.commande_id).toBe(42);
    expect(body.event_type).toBe('creation');
  });

  it('includes extra fields in payload', async () => {
    await triggerNotification(10, 'cancelled', { cancellation_reason: 'Rupture' });

    const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(body.commande_id).toBe(10);
    expect(body.event_type).toBe('cancelled');
    expect(body.cancellation_reason).toBe('Rupture');
  });

  it('sends without Authorization header when no session', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });

    await triggerNotification(1, 'preparing');

    const headers = globalThis.fetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('does not throw on fetch failure (fire-and-forget)', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

    // Should not throw
    await expect(triggerNotification(1, 'creation')).resolves.toBeUndefined();
  });

  it('does not throw on non-ok response', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Server error'),
    });

    await expect(triggerNotification(1, 'delivered')).resolves.toBeUndefined();
  });

  it('supports all valid event types', async () => {
    const eventTypes = ['creation', 'payment_confirmed', 'preparing', 'ready', 'delivery', 'delivered', 'cancelled'];

    for (const eventType of eventTypes) {
      vi.clearAllMocks();
      globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('') });
      mockGetSession.mockResolvedValue({ data: { session: { access_token: 'tok' } } });

      await triggerNotification(1, eventType);

      const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
      expect(body.event_type).toBe(eventType);
    }
  });
});
