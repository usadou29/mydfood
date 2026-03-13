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

// Home en import statique (page d'atterrissage, FCP critique)
import { Home } from './pages/Home';

// --- Lazy loading des pages publiques ---
const Commander = lazy(() => import('./pages/Commander').then(m => ({ default: m.Commander })));
const MenusFamille = lazy(() => import('./pages/MenusFamille').then(m => ({ default: m.MenusFamille })));
const Traiteur = lazy(() => import('./pages/Traiteur').then(m => ({ default: m.Traiteur })));
const Evenements = lazy(() => import('./pages/Evenements').then(m => ({ default: m.Evenements })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales').then(m => ({ default: m.MentionsLegales })));
const CGV = lazy(() => import('./pages/CGV').then(m => ({ default: m.CGV })));
const APropos = lazy(() => import('./pages/APropos').then(m => ({ default: m.APropos })));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite').then(m => ({ default: m.PolitiqueConfidentialite })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const ChefPrive = lazy(() => import('./pages/ChefPrive').then(m => ({ default: m.ChefPrive })));

// --- Lazy loading des pages admin ---
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminPlats = lazy(() => import('./pages/admin/AdminPlats').then(m => ({ default: m.AdminPlats })));
const AdminCommandes = lazy(() => import('./pages/admin/AdminCommandes').then(m => ({ default: m.AdminCommandes })));
const AdminTemoignages = lazy(() => import('./pages/admin/AdminTemoignages').then(m => ({ default: m.AdminTemoignages })));
const AdminPhotos = lazy(() => import('./pages/admin/AdminPhotos').then(m => ({ default: m.AdminPhotos })));
const AdminPromotions = lazy(() => import('./pages/admin/AdminPromotions').then(m => ({ default: m.AdminPromotions })));

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
