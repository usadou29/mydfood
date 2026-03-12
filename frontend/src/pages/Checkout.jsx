import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, ClipboardList, CheckCircle, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Truck, Store, Clock, Banknote, CreditCard,
  ShoppingBag, Home,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';
import { fetchZonesLivraison, creerCommande, createStripeCheckoutSession } from '../services/commandes';
import { isStripeConfigured } from '../lib/stripe';

const CRENEAUX = [
  '12h00 - 13h00',
  '13h00 - 14h00',
  '18h00 - 19h00',
  '19h00 - 20h00',
  '20h00 - 21h00',
];

const STEPS = [
  { id: 1, label: 'Informations', icon: User },
  { id: 2, label: 'Livraison', icon: MapPin },
  { id: 3, label: 'Récapitulatif', icon: ClipboardList },
  { id: 4, label: 'Confirmation', icon: CheckCircle },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = s.id === currentStep;
        const isDone = s.id < currentStep;
        return (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <div className={`w-6 sm:w-10 h-0.5 ${isDone ? 'bg-blue' : 'bg-cream-dark'}`} />
            )}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              isActive ? 'bg-blue text-white' : isDone ? 'bg-blue/10 text-blue' : 'bg-cream text-text-light'
            }`}>
              <Icon size={14} />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(tel) {
  return /^[\d\s+()-]{8,}$/.test(tel);
}

export function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { data: zones, loading: loadingZones } = useSupabaseQuery(fetchZonesLivraison);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  // Step 1: Client info
  const [clientInfo, setClientInfo] = useState({
    prenom: '', nom: '', email: '', telephone: '', adresse: '', code_postal: '', ville: '',
  });

  // Step 2: Delivery
  const [typeLivraison, setTypeLivraison] = useState('livraison');
  const [selectedZone, setSelectedZone] = useState(null);
  const [creneau, setCreneau] = useState('');

  // Step 3: Payment & message
  const [messageClient, setMessageClient] = useState('');
  const [modePaiement, setModePaiement] = useState('especes');
  const [searchParams] = useSearchParams();

  // Show message if returning from cancelled Stripe payment
  useEffect(() => {
    if (searchParams.get('payment') === 'cancelled') {
      setError('Le paiement a été annulé. Vous pouvez réessayer ou choisir un autre mode de paiement.');
      setStep(3);
    }
  }, [searchParams]);

  // Redirect if cart empty (except on confirmation step)
  useEffect(() => {
    if (cart.length === 0 && step < 4) {
      navigate('/commander');
    }
  }, [cart, step, navigate]);

  // Prefill from profile
  useEffect(() => {
    if (profile) {
      setClientInfo((prev) => ({
        prenom: profile.prenom || prev.prenom,
        nom: profile.nom || prev.nom,
        email: user?.email || prev.email,
        telephone: profile.telephone || prev.telephone,
        adresse: profile.adresse || prev.adresse,
        code_postal: profile.code_postal || prev.code_postal,
        ville: profile.ville || prev.ville,
      }));
    }
  }, [profile, user]);

  // Auto-select first zone
  useEffect(() => {
    if (zones?.length > 0 && !selectedZone) {
      setSelectedZone(zones[0]);
    }
  }, [zones, selectedZone]);

  const fraisLivraison = typeLivraison === 'livraison' && selectedZone
    ? Number(selectedZone.frais_livraison)
    : 0;
  const minimumCommande = typeLivraison === 'livraison' && selectedZone
    ? Number(selectedZone.minimum_commande)
    : 0;
  const total = cartTotal + fraisLivraison;
  const canOrder = typeLivraison === 'retrait' || cartTotal >= minimumCommande;

  // Validation per step
  const step1Errors = useMemo(() => {
    const errs = {};
    if (!clientInfo.nom.trim()) errs.nom = 'Le nom est requis';
    if (!clientInfo.prenom.trim()) errs.prenom = 'Le prénom est requis';
    if (!clientInfo.email.trim()) errs.email = "L'email est requis";
    else if (!validateEmail(clientInfo.email)) errs.email = 'Email invalide';
    if (!clientInfo.telephone.trim()) errs.telephone = 'Le téléphone est requis';
    else if (!validatePhone(clientInfo.telephone)) errs.telephone = 'Numéro invalide';
    return errs;
  }, [clientInfo]);

  const step2Errors = useMemo(() => {
    const errs = {};
    if (!creneau) errs.creneau = 'Choisissez un créneau';
    if (typeLivraison === 'livraison') {
      if (!selectedZone) errs.zone = 'Choisissez une zone de livraison';
      if (!clientInfo.adresse.trim()) errs.adresse = "L'adresse est requise pour la livraison";
      if (!canOrder) errs.minimum = `Minimum de commande : ${minimumCommande}€`;
    }
    return errs;
  }, [creneau, typeLivraison, selectedZone, clientInfo.adresse, canOrder, minimumCommande]);

  const isStep1Valid = Object.keys(step1Errors).length === 0;
  const isStep2Valid = Object.keys(step2Errors).length === 0;

  const handleNextStep = () => {
    setError('');
    if (step === 1 && !isStep1Valid) {
      setError('Veuillez corriger les champs en erreur.');
      return;
    }
    if (step === 2 && !isStep2Valid) {
      const firstErr = Object.values(step2Errors)[0];
      setError(firstErr);
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handlePrevStep = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const items = cart.map((item) => ({
        plat_id: item.type === 'plat' ? item.id : null,
        menu_famille_id: item.type === 'menu_famille' ? item.id : null,
        nom: item.nom,
        prix_unitaire: item.prix,
        quantite: item.quantite,
      }));

      const commande = await creerCommande({
        client: {
          nom: `${clientInfo.prenom} ${clientInfo.nom}`.trim(),
          email: clientInfo.email,
          telephone: clientInfo.telephone,
          adresse: typeLivraison === 'livraison'
            ? `${clientInfo.adresse}, ${clientInfo.code_postal} ${clientInfo.ville}`.trim()
            : null,
        },
        zone_livraison_id: typeLivraison === 'livraison' ? selectedZone?.id : null,
        type_livraison: typeLivraison,
        creneau_livraison: creneau,
        items,
        sous_total: cartTotal,
        frais_livraison: fraisLivraison,
        pourboire: 0,
        total,
        message_client: messageClient || null,
        mode_paiement: modePaiement,
      });

      // If paying by card → redirect to Stripe Checkout
      if (modePaiement === 'carte') {
        try {
          const { sessionUrl } = await createStripeCheckoutSession(commande, items);
          // Clear cart before redirecting (order is already created)
          clearCart();
          // Redirect to Stripe hosted checkout page
          window.location.href = sessionUrl;
          return; // Don't setSubmitting(false) — page is redirecting
        } catch (stripeErr) {
          // Order was created but Stripe failed — show error + allow retry
          setOrderResult(commande);
          setError(
            `Commande créée (${commande.numero}) mais le paiement a échoué : ${stripeErr.message}. ` +
            'Vous pouvez réessayer via votre historique de commandes.'
          );
          setSubmitting(false);
          return;
        }
      }

      // Cash payment → show confirmation immediately
      setOrderResult(commande);
      clearCart();
      setStep(4);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la commande.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInfoChange = (e) => {
    setClientInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loadingZones) {
    return (
      <div className="min-h-screen bg-cream pt-28 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text text-center mb-2">
            {step < 4 ? 'Finaliser votre commande' : 'Commande confirmée'}
          </h1>
          <StepIndicator currentStep={step} />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm"
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* STEP 1: Informations client */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
                >
                  <h2 className="font-display text-xl font-bold text-text mb-6 flex items-center gap-2">
                    <User size={20} className="text-blue" />
                    Vos informations
                  </h2>

                  {!user && (
                    <div className="bg-blue/5 border border-blue/20 rounded-xl p-4 mb-6">
                      <p className="text-sm text-text">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="text-blue font-medium hover:underline">
                          Connectez-vous
                        </Link>{' '}
                        pour pré-remplir vos informations.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <InputField
                        label="Prénom" name="prenom" value={clientInfo.prenom}
                        onChange={handleInfoChange} error={step1Errors.prenom} required
                      />
                      <InputField
                        label="Nom" name="nom" value={clientInfo.nom}
                        onChange={handleInfoChange} error={step1Errors.nom} required
                      />
                    </div>
                    <InputField
                      label="Email" name="email" type="email" value={clientInfo.email}
                      onChange={handleInfoChange} error={step1Errors.email} required
                    />
                    <InputField
                      label="Téléphone" name="telephone" type="tel" value={clientInfo.telephone}
                      onChange={handleInfoChange} error={step1Errors.telephone}
                      placeholder="+33 7 56 94 95 37" required
                    />
                    <InputField
                      label="Adresse" name="adresse" value={clientInfo.adresse}
                      onChange={handleInfoChange} placeholder="123 rue Exemple"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <InputField
                        label="Code postal" name="code_postal" value={clientInfo.code_postal}
                        onChange={handleInfoChange} placeholder="75001"
                      />
                      <InputField
                        label="Ville" name="ville" value={clientInfo.ville}
                        onChange={handleInfoChange} placeholder="Paris"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Livraison */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
                >
                  <h2 className="font-display text-xl font-bold text-text mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-blue" />
                    Mode de livraison
                  </h2>

                  {/* Type livraison */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setTypeLivraison('livraison')}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                        typeLivraison === 'livraison'
                          ? 'border-blue bg-blue/5'
                          : 'border-cream-dark hover:border-blue/30'
                      }`}
                    >
                      <Truck size={24} className={typeLivraison === 'livraison' ? 'text-blue' : 'text-text-light'} />
                      <div>
                        <p className="font-semibold text-text">Livraison à domicile</p>
                        <p className="text-xs text-text-light">Livré chez vous en Île-de-France</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setTypeLivraison('retrait')}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                        typeLivraison === 'retrait'
                          ? 'border-blue bg-blue/5'
                          : 'border-cream-dark hover:border-blue/30'
                      }`}
                    >
                      <Store size={24} className={typeLivraison === 'retrait' ? 'text-blue' : 'text-text-light'} />
                      <div>
                        <p className="font-semibold text-text">Retrait sur place</p>
                        <p className="text-xs text-text-light">Venez récupérer votre commande</p>
                      </div>
                    </button>
                  </div>

                  {/* Zone de livraison */}
                  {typeLivraison === 'livraison' && zones && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-text mb-2">Zone de livraison</label>
                      <div className="flex flex-wrap gap-2">
                        {zones.map((zone) => (
                          <button
                            key={zone.id}
                            onClick={() => setSelectedZone(zone)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedZone?.id === zone.id
                                ? 'bg-yellow text-text'
                                : 'bg-cream text-text-light hover:bg-cream-dark'
                            }`}
                          >
                            {zone.nom}
                            <span className="ml-1 opacity-75">
                              {Number(zone.frais_livraison) > 0 ? `(+${zone.frais_livraison}€)` : '(Gratuit)'}
                            </span>
                          </button>
                        ))}
                      </div>
                      {selectedZone && (
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-text-light">
                          <span>Minimum : <strong className="text-text">{selectedZone.minimum_commande}€</strong></span>
                          <span>Frais : <strong className="text-text">{fraisLivraison > 0 ? `${fraisLivraison}€` : 'Gratuit'}</strong></span>
                          {selectedZone.delai_minutes && (
                            <span>Délai : <strong className="text-text">~{selectedZone.delai_minutes} min</strong></span>
                          )}
                        </div>
                      )}
                      {!canOrder && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          Votre commande ({cartTotal.toFixed(2)}€) n'atteint pas le minimum de {minimumCommande}€ pour cette zone.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Créneau horaire */}
                  <div>
                    <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                      <Clock size={16} className="text-blue" />
                      Créneau horaire souhaité
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CRENEAUX.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCreneau(c)}
                          className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            creneau === c
                              ? 'bg-blue text-white'
                              : 'bg-cream text-text-light hover:bg-cream-dark'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {step2Errors.creneau && !creneau && (
                      <p className="text-red-500 text-xs mt-1">{step2Errors.creneau}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Récapitulatif */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
                >
                  <h2 className="font-display text-xl font-bold text-text mb-6 flex items-center gap-2">
                    <ClipboardList size={20} className="text-blue" />
                    Récapitulatif
                  </h2>

                  {/* Client info summary */}
                  <div className="bg-cream rounded-xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-text mb-2">Client</h3>
                    <p className="text-sm text-text">{clientInfo.prenom} {clientInfo.nom}</p>
                    <p className="text-sm text-text-light">{clientInfo.email} · {clientInfo.telephone}</p>
                    {typeLivraison === 'livraison' && clientInfo.adresse && (
                      <p className="text-sm text-text-light mt-1">
                        {clientInfo.adresse}, {clientInfo.code_postal} {clientInfo.ville}
                      </p>
                    )}
                  </div>

                  {/* Delivery summary */}
                  <div className="bg-cream rounded-xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-text mb-2">Livraison</h3>
                    <p className="text-sm text-text">
                      {typeLivraison === 'livraison' ? (
                        <>Livraison à domicile — {selectedZone?.nom}</>
                      ) : (
                        'Retrait sur place'
                      )}
                    </p>
                    <p className="text-sm text-text-light">Créneau : {creneau}</p>
                  </div>

                  {/* Cart items */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text mb-3">Articles ({cart.length})</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="flex items-center gap-3">
                          <img
                            src={item.image_url}
                            alt={item.nom}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text truncate">{item.nom}</p>
                            <p className="text-xs text-text-light">x{item.quantite}</p>
                          </div>
                          <p className="text-sm font-semibold text-text">
                            {(item.prix * item.quantite).toFixed(2)}€
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message client */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Instructions spéciales (optionnel)
                    </label>
                    <textarea
                      value={messageClient}
                      onChange={(e) => setMessageClient(e.target.value)}
                      rows={3}
                      placeholder="Allergies, préférences de cuisson, instructions de livraison..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-cream-dark bg-cream focus:border-blue focus:bg-white focus:outline-none transition-colors text-sm resize-none"
                    />
                  </div>

                  {/* Mode de paiement */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text mb-2">Mode de paiement</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setModePaiement('especes')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                          modePaiement === 'especes'
                            ? 'border-blue bg-blue/5'
                            : 'border-cream-dark hover:border-blue/30'
                        }`}
                      >
                        <Banknote size={20} className={modePaiement === 'especes' ? 'text-blue' : 'text-text-light'} />
                        <div>
                          <p className="font-medium text-sm text-text">Espèces</p>
                          <p className="text-xs text-text-light">Paiement à la livraison/retrait</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setModePaiement('carte')}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                          modePaiement === 'carte'
                            ? 'border-blue bg-blue/5'
                            : 'border-cream-dark hover:border-blue/30'
                        }`}
                      >
                        <CreditCard size={20} className={modePaiement === 'carte' ? 'text-blue' : 'text-text-light'} />
                        <div>
                          <p className="font-medium text-sm text-text">Carte bancaire</p>
                          <p className="text-xs text-text-light">
                            {isStripeConfigured() ? 'Paiement sécurisé via Stripe' : 'Bientôt disponible'}
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Confirmation */}
              {step === 4 && orderResult && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-card p-6 sm:p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-text mb-2">
                    Commande confirmée !
                  </h2>
                  <p className="text-text-light mb-6">
                    Merci pour votre commande. Vous recevrez une confirmation prochainement.
                  </p>

                  <div className="bg-cream rounded-xl p-6 mb-6 text-left">
                    <div className="text-center mb-4">
                      <p className="text-sm text-text-light">Numéro de commande</p>
                      <p className="font-display text-2xl font-bold text-blue">{orderResult.numero}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-light">Mode</p>
                        <p className="font-medium text-text">
                          {orderResult.type_livraison === 'livraison' ? 'Livraison à domicile' : 'Retrait sur place'}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-light">Créneau</p>
                        <p className="font-medium text-text">{orderResult.creneau_livraison}</p>
                      </div>
                      <div>
                        <p className="text-text-light">Paiement</p>
                        <p className="font-medium text-text">
                          {orderResult.mode_paiement === 'especes' ? 'Espèces' : 'Carte bancaire'}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-light">Total</p>
                        <p className="font-bold text-xl text-blue">{Number(orderResult.total).toFixed(2)}€</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/"
                      className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                      <Home size={18} />
                      Retour à l'accueil
                    </Link>
                    <Link
                      to={`/confirmation/${orderResult.numero}`}
                      className="btn-outline inline-flex items-center justify-center gap-2"
                    >
                      <ClipboardList size={18} />
                      Voir le détail
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: order summary (steps 1-3) */}
          {step < 4 && (
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
                <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2 text-text">
                  <ShoppingBag size={20} className="text-blue" />
                  Votre panier
                </h3>

                <div className="space-y-3 max-h-48 overflow-auto mb-4">
                  {cart.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                      <span className="text-text">
                        {item.nom} <span className="text-text-light">x{item.quantite}</span>
                      </span>
                      <span className="font-medium text-text">{(item.prix * item.quantite).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream-dark pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-text">
                    <span>Sous-total</span>
                    <span>{cartTotal.toFixed(2)}€</span>
                  </div>
                  {typeLivraison === 'livraison' && (
                    <div className="flex justify-between text-sm text-text">
                      <span>Livraison</span>
                      <span>{fraisLivraison > 0 ? `${fraisLivraison.toFixed(2)}€` : 'Gratuit'}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-cream-dark">
                    <span>Total</span>
                    <span className="text-blue">{total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons (steps 1-3) */}
        {step < 4 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={step === 1 ? () => navigate('/commander') : handlePrevStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-text-light hover:text-text hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} />
              {step === 1 ? 'Retour au menu' : 'Précédent'}
            </button>

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                className="btn-primary flex items-center gap-2"
              >
                Suivant
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                {submitting ? 'Envoi en cours...' : 'Confirmer la commande'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, name, type = 'text', value, onChange, error, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-text mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-cream focus:bg-white focus:outline-none transition-colors ${
          error ? 'border-red-300 focus:border-red-500' : 'border-cream-dark focus:border-blue'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
