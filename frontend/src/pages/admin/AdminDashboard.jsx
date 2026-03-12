import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../../services/admin';
import { StatusBadge } from '../../components/admin/StatusBadge';
import {
  UtensilsCrossed,
  ShoppingCart,
  Star,
  TrendingUp,
  Loader2,
  ArrowRight,
} from 'lucide-react';

const statCards = [
  { key: 'totalPlats', label: 'Plats', icon: UtensilsCrossed, color: 'bg-blue/10 text-blue' },
  { key: 'totalCommandes', label: 'Commandes', icon: ShoppingCart, color: 'bg-yellow/20 text-yellow-dark' },
  { key: 'revenue', label: 'Revenus (€)', icon: TrendingUp, color: 'bg-green-50 text-green-700', format: 'currency' },
  { key: 'temoignagesEnAttente', label: 'Témoignages en attente', icon: Star, color: 'bg-purple-50 text-purple-700' },
];

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-text mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats?.[card.key] ?? 0;
          const displayValue =
            card.format === 'currency' ? `${value.toFixed(2)} €` : value;
          return (
            <div
              key={card.key}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-display font-bold text-text">{displayValue}</p>
              <p className="text-sm text-text-light mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-text text-lg">Commandes récentes</h2>
          <Link
            to="/admin/commandes"
            className="text-sm text-blue hover:text-blue/80 font-medium flex items-center gap-1"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.commandesRecentes?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-medium text-text-light">N°</th>
                  <th className="text-left py-3 px-2 font-medium text-text-light">Client</th>
                  <th className="text-left py-3 px-2 font-medium text-text-light">Total</th>
                  <th className="text-left py-3 px-2 font-medium text-text-light">Statut</th>
                  <th className="text-left py-3 px-2 font-medium text-text-light">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.commandesRecentes.map((cmd) => (
                  <tr key={cmd.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-2 font-mono text-xs">{cmd.numero}</td>
                    <td className="py-3 px-2">{cmd.client_nom}</td>
                    <td className="py-3 px-2 font-medium">{Number(cmd.total).toFixed(2)} €</td>
                    <td className="py-3 px-2">
                      <StatusBadge statut={cmd.statut} />
                    </td>
                    <td className="py-3 px-2 text-text-light">
                      {new Date(cmd.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-light text-sm py-4 text-center">Aucune commande pour le moment.</p>
        )}
      </div>
    </div>
  );
}
