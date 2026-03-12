import { describe, it, expect, vi } from 'vitest';

// Mock des variables d'environnement avant l'import
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');

describe('Supabase Client', () => {
  it('doit exporter un client supabase valide', async () => {
    const { supabase } = await import('../lib/supabase.js');
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  it('doit avoir les méthodes de base (from, auth, storage)', async () => {
    const { supabase } = await import('../lib/supabase.js');
    expect(typeof supabase.from).toBe('function');
    expect(typeof supabase.auth.signUp).toBe('function');
    expect(typeof supabase.auth.signInWithPassword).toBe('function');
    expect(typeof supabase.auth.signOut).toBe('function');
  });
});
