import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Star,
  Image,
  Tag,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/plats', label: 'Plats', icon: UtensilsCrossed },
  { path: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { path: '/admin/promotions', label: 'Promotions', icon: Tag },
  { path: '/admin/temoignages', label: 'Témoignages', icon: Star },
  { path: '/admin/photos', label: 'Photos du site', icon: Image },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-text transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow flex items-center justify-center">
                <span className="font-display font-bold text-text text-lg">D</span>
              </div>
              <div>
                <span className="font-display text-lg font-bold text-white">DFOOD</span>
                <span className="block text-[10px] tracking-wider text-white/50 uppercase">
                  Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-6 right-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-yellow text-text'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/50 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              <ChevronLeft size={18} />
              Retour au site
            </Link>
            <div className="flex items-center justify-between px-4 py-2.5 mt-1">
              <span className="text-sm text-white/70 truncate">
                {profile?.prenom || 'Admin'}
              </span>
              <button
                onClick={signOut}
                className="text-white/50 hover:text-red-400 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text hover:text-blue transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="font-display font-bold text-text">DFOOD Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
