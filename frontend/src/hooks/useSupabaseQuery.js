import { useState, useEffect } from 'react';

/**
 * Hook générique pour charger des données depuis Supabase.
 * @param {Function} queryFn - Fonction async qui retourne les données
 * @param {Array} deps - Dépendances pour re-fetch (comme useEffect)
 */
export function useSupabaseQuery(queryFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await queryFn();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Erreur de chargement');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error, refetch: () => setData(null) };
}
