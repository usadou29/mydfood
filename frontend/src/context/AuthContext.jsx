import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  // Ref pour éviter les appels concurrents de loadProfile
  const profileLoadRef = useRef(null);

  // Charger le profil utilisateur depuis la table profiles
  // IMPORTANT : cette fonction ne doit PAS être appelée à l'intérieur
  // d'un callback onAuthStateChange car supabase-js v2 détient un
  // navigator.lock pendant ces callbacks → deadlock si on fait une
  // requête Supabase à l'intérieur.
  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('[Auth] Erreur chargement profil:', err);
      setProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
      }
      // Si user existe, le useEffect [user] ci-dessous chargera le profil
    });

    // Écouter les changements d'auth
    // ATTENTION : ne PAS faire de requête Supabase (await loadProfile, etc.)
    // dans ce callback — cela provoque un deadlock avec navigator.locks.
    // On se contente de mettre à jour le state user. Le profil sera chargé
    // par le useEffect dédié qui réagit au changement de user.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (!currentUser) {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Charger le profil quand user change — en dehors du contexte auth lock
  useEffect(() => {
    if (user) {
      // Annuler tout chargement précédent en cours
      if (profileLoadRef.current) {
        profileLoadRef.current.cancelled = true;
      }
      const ref = { cancelled: false };
      profileLoadRef.current = ref;

      loadProfile(user.id).then(() => {
        if (!ref.cancelled) {
          setLoading(false);
        }
      });
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, loadProfile]);

  async function signUp({ email, password, nom, prenom, telephone }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom, prenom, telephone },
      },
    });
    if (error) throw error;
    return data;
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Note : le profil sera chargé automatiquement par le useEffect [user]
    // quand onAuthStateChange mettra à jour le state user.
    // On attend un tick pour que le state se propage.
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  }

  async function updateProfile(updates) {
    if (!user) throw new Error('Non connecté');
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  }

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    profile,
    loading,
    profileLoading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loadProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
