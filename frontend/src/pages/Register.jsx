import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LogoSmall } from '../components/Logo';

export function Register() {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.prenom || !form.nom || !form.email || !form.password) {
      return 'Veuillez remplir tous les champs obligatoires.';
    }
    if (form.password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Les mots de passe ne correspondent pas.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return 'Veuillez entrer un email valide.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp({
        email: form.email,
        password: form.password,
        nom: form.nom,
        prenom: form.prenom,
        telephone: form.telephone,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Cet email est déjà utilisé. Essayez de vous connecter.');
      } else {
        setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center bg-white rounded-2xl shadow-card p-10"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Compte créé !
          </h2>
          <p className="text-text-light mb-6">
            Un email de confirmation vous a été envoyé à <strong className="text-text">{form.email}</strong>.
            Vérifiez votre boîte mail pour activer votre compte.
          </p>
          <Link to="/connexion" className="btn-primary inline-flex items-center gap-2">
            Aller à la connexion
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <LogoSmall className="w-14 h-14" />
            <span className="font-display text-2xl font-bold text-text">DFOOD</span>
          </Link>
          <h1 className="text-2xl font-display font-bold text-text mb-2">
            Créer un compte
          </h1>
          <p className="text-text-light">
            Rejoignez la famille DFOOD pour commander facilement.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-text mb-1.5">
                  Prénom *
                </label>
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-text mb-1.5">
                  Nom *
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
              />
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
                placeholder="06 XX XX XX XX"
                className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
                Mot de passe * <span className="text-text-light font-normal">(min. 6 caractères)</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1.5">
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-light">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-blue font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
