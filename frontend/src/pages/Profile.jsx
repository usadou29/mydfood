import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Save, LogOut, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut, updateProfile } = useAuth();

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/connexion', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        prenom: profile.prenom || '',
        nom: profile.nom || '',
        telephone: profile.telephone || '',
        adresse: profile.adresse || '',
        ville: profile.ville || '',
        code_postal: profile.code_postal || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await updateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Erreur lors de la mise à jour. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-blue" size={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream pt-28 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-text">Mon Profil</h1>
              <p className="text-text-light text-sm">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-text-light hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            {success && (
              <div className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm">
                <CheckCircle size={18} />
                Profil mis à jour avec succès.
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-text mb-1.5">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={form.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-text mb-1.5">
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={form.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-text mb-1.5">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={form.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-text mb-1.5">
                  Adresse de livraison
                </label>
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  value={form.adresse}
                  onChange={handleChange}
                  placeholder="123 rue Exemple"
                  className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ville" className="block text-sm font-medium text-text mb-1.5">
                    Ville
                  </label>
                  <input
                    id="ville"
                    name="ville"
                    type="text"
                    value={form.ville}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="code_postal" className="block text-sm font-medium text-text mb-1.5">
                    Code postal
                  </label>
                  <input
                    id="code_postal"
                    name="code_postal"
                    type="text"
                    value={form.code_postal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Enregistrer
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
