import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Commander } from './pages/Commander';
import { MenusFamille } from './pages/MenusFamille';
import { Traiteur } from './pages/Traiteur';
import { Evenements } from './pages/Evenements';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { NotFound } from './pages/NotFound';
import { MentionsLegales } from './pages/MentionsLegales';
import { CGV } from './pages/CGV';
import { APropos } from './pages/APropos';
import { PolitiqueConfidentialite } from './pages/PolitiqueConfidentialite';
import { FAQ } from './pages/FAQ';
import { ChefPrive } from './pages/ChefPrive';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPlats } from './pages/admin/AdminPlats';
import { AdminCommandes } from './pages/admin/AdminCommandes';
import { AdminTemoignages } from './pages/admin/AdminTemoignages';
import { AdminPhotos } from './pages/admin/AdminPhotos';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
