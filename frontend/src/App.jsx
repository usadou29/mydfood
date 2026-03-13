import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';

// Home et Login en imports statiques (pages critiques pour UX)
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// --- Helper: lazy import avec retry + logging ---
function lazyRetry(importFn, name) {
  return lazy(() =>
    importFn().catch((err) => {
      console.error(`[LazyLoad] Erreur chargement ${name}:`, err);
      // Retry une fois après 1s
      return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        importFn().catch((retryErr) => {
          console.error(`[LazyLoad] Retry échoué ${name}:`, retryErr);
          // Retourner un composant d'erreur en fallback
          return {
            default: () => (
              <div className="min-h-screen bg-cream flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-card p-8 max-w-md text-center">
                  <p className="text-red-600 font-medium mb-4">
                    Erreur de chargement de la page.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Recharger
                  </button>
                </div>
              </div>
            ),
          };
        })
      );
    })
  );
}

// --- Lazy loading des pages publiques ---
const Commander = lazyRetry(() => import('./pages/Commander').then(m => ({ default: m.Commander })), 'Commander');
const MenusFamille = lazyRetry(() => import('./pages/MenusFamille').then(m => ({ default: m.MenusFamille })), 'MenusFamille');
const Traiteur = lazyRetry(() => import('./pages/Traiteur').then(m => ({ default: m.Traiteur })), 'Traiteur');
const Evenements = lazyRetry(() => import('./pages/Evenements').then(m => ({ default: m.Evenements })), 'Evenements');
const Contact = lazyRetry(() => import('./pages/Contact').then(m => ({ default: m.Contact })), 'Contact');
const Profile = lazyRetry(() => import('./pages/Profile').then(m => ({ default: m.Profile })), 'Profile');
const Checkout = lazyRetry(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })), 'Checkout');
const OrderConfirmation = lazyRetry(() => import('./pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })), 'OrderConfirmation');
const NotFound = lazyRetry(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })), 'NotFound');
const MentionsLegales = lazyRetry(() => import('./pages/MentionsLegales').then(m => ({ default: m.MentionsLegales })), 'MentionsLegales');
const CGV = lazyRetry(() => import('./pages/CGV').then(m => ({ default: m.CGV })), 'CGV');
const APropos = lazyRetry(() => import('./pages/APropos').then(m => ({ default: m.APropos })), 'APropos');
const PolitiqueConfidentialite = lazyRetry(() => import('./pages/PolitiqueConfidentialite').then(m => ({ default: m.PolitiqueConfidentialite })), 'PolitiqueConfidentialite');
const FAQ = lazyRetry(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })), 'FAQ');
const ChefPrive = lazyRetry(() => import('./pages/ChefPrive').then(m => ({ default: m.ChefPrive })), 'ChefPrive');

// --- Lazy loading des pages admin ---
const AdminLayout = lazyRetry(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })), 'AdminLayout');
const AdminDashboard = lazyRetry(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })), 'AdminDashboard');
const AdminPlats = lazyRetry(() => import('./pages/admin/AdminPlats').then(m => ({ default: m.AdminPlats })), 'AdminPlats');
const AdminCommandes = lazyRetry(() => import('./pages/admin/AdminCommandes').then(m => ({ default: m.AdminCommandes })), 'AdminCommandes');
const AdminTemoignages = lazyRetry(() => import('./pages/admin/AdminTemoignages').then(m => ({ default: m.AdminTemoignages })), 'AdminTemoignages');
const AdminPhotos = lazyRetry(() => import('./pages/admin/AdminPhotos').then(m => ({ default: m.AdminPhotos })), 'AdminPhotos');
const AdminPromotions = lazyRetry(() => import('./pages/admin/AdminPromotions').then(m => ({ default: m.AdminPromotions })), 'AdminPromotions');

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="plats" element={<AdminPlats />} />
            <Route path="commandes" element={<AdminCommandes />} />
            <Route path="temoignages" element={<AdminTemoignages />} />
            <Route path="photos" element={<AdminPhotos />} />
            <Route path="promotions" element={<AdminPromotions />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commander" element={<Commander />} />
            <Route path="/menus-famille" element={<MenusFamille />} />
            <Route path="/traiteur" element={<Traiteur />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation/:numero" element={<OrderConfirmation />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/chef-prive" element={<ChefPrive />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <AppLayout />
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
