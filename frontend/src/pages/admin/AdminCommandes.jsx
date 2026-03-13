import { useState, useEffect, useCallback } from 'react';
import { fetchAllCommandes, updateCommandeStatut } from '../../services/admin';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Loader2, Search, Eye, X, ChevronDown, Banknote, CreditCard } from 'lucide-react';
import { SkeletonTable } from '../../components/Skeleton';

const statuts = [
  { value: 'tous', label: 'Tous' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'en_preparation', label: 'En préparation' },
  { value: 'prete', label: 'Prête' },
  { value: 'en_livraison', label: 'En livraison' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' },
];

const statutTransitions = {
  en_attente: ['confirmee', 'annulee'],
  confirmee: ['en_preparation', 'annulee'],
  en_preparation: ['prete', 'annulee'],
  prete: ['en_livraison', 'annulee'],
  en_livraison: ['livree'],
  livree: [],
  annulee: [],
};

export function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [updating, setUpdating] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchAllCommandes(filtreStatut);
      setCommandes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filtreStatut]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleStatutChange = async (commandeId, newStatut) => {
    setUpdating(commandeId);
    try {
      await updateCommandeStatut(commandeId, newStatut);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = commandes.filter(
    (c) =>
      c.numero?.toLowerCase().includes(search.toLowerCase()) ||
      c.client_nom?.toLowerCase().includes(search.toLowerCase()) ||
      c.client_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-text mb-6">Gestion des Commandes</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="N°, client, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuts.map((s) => (
            <button
              key={s.value}
              onClick={() => setFiltreStatut(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filtreStatut === s.value
                  ? 'bg-blue text-white'
                  : 'bg-gray-100 text-text-light hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} columns={7} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium text-text-light">N°</th>
                  <th className="text-left py-3 px-4 font-medium text-text-light">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-text-light">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-text-light">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-text-light">Paiement</th>
                  <th className="text-left py-3 px-4 font-medium text-text-light">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-text-light">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-text-light">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cmd) => {
                  const transitions = statutTransitions[cmd.statut] || [];
                  return (
                    <tr key={cmd.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-mono text-xs">{cmd.numero}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{cmd.client_nom}</div>
                        <div className="text-xs text-text-light">{cmd.client_email}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">{Number(cmd.total).toFixed(2)} €</td>
                      <td className="py-3 px-4 text-text-light capitalize">{cmd.type_livraison}</td>
                      <td className="py-3 px-4">
                        {cmd.mode_paiement === 'carte' ? (
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                            cmd.stripe_payment_id
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            <CreditCard size={12} />
                            {cmd.stripe_payment_id ? 'Payée' : 'En attente'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-50 text-text-light">
                            <Banknote size={12} />
                            Espèces
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge statut={cmd.statut} />
                      </td>
                      <td className="py-3 px-4 text-text-light">
                        {new Date(cmd.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetail(cmd)}
                            className="p-1.5 text-blue hover:bg-blue/10 rounded-lg transition-colors"
                            title="Détails"
                          >
                            <Eye size={16} />
                          </button>
                          {transitions.length > 0 && (
                            <div className="relative group">
                              <button
                                className="p-1.5 text-text-light hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 text-xs"
                                disabled={updating === cmd.id}
                              >
                                {updating === cmd.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <ChevronDown size={14} />
                                )}
                              </button>
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-10 min-w-[160px]">
                                {transitions.map((t) => (
                                  <button
                                    key={t}
                                    onClick={() => handleStatutChange(cmd.id, t)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                  >
                                    <StatusBadge statut={t} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-text-light">
                      Aucune commande trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDetail(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-display font-bold text-text mb-1">
              Commande {detail.numero}
            </h2>
            <StatusBadge statut={detail.statut} />

            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-text-light">Client</p>
                  <p className="font-medium">{detail.client_nom}</p>
                </div>
                <div>
                  <p className="text-text-light">Email</p>
                  <p className="font-medium">{detail.client_email}</p>
                </div>
                <div>
                  <p className="text-text-light">Téléphone</p>
                  <p className="font-medium">{detail.client_telephone}</p>
                </div>
                <div>
                  <p className="text-text-light">Type</p>
                  <p className="font-medium capitalize">{detail.type_livraison}</p>
                </div>
                <div>
                  <p className="text-text-light">Paiement</p>
                  <p className="font-medium flex items-center gap-1">
                    {detail.mode_paiement === 'carte' ? <CreditCard size={14} /> : <Banknote size={14} />}
                    {detail.mode_paiement === 'carte' ? 'Carte bancaire' : 'Espèces'}
                  </p>
                </div>
              </div>

              {detail.stripe_payment_id && (
                <div>
                  <p className="text-text-light">ID Paiement Stripe</p>
                  <p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">{detail.stripe_payment_id}</p>
                </div>
              )}

              {detail.client_adresse && (
                <div>
                  <p className="text-text-light">Adresse</p>
                  <p className="font-medium">{detail.client_adresse}</p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3">
                <p className="font-medium mb-2">Articles</p>
                {detail.commande_lignes?.map((ligne) => (
                  <div key={ligne.id} className="flex justify-between py-1.5 border-b border-gray-50">
                    <span>
                      {ligne.nom} <span className="text-text-light">x{ligne.quantite}</span>
                    </span>
                    <span className="font-medium">{Number(ligne.sous_total).toFixed(2)} €</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                  <span>Sous-total</span>
                  <span>{Number(detail.sous_total).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-text-light">
                  <span>Livraison</span>
                  <span>{Number(detail.frais_livraison).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1">
                  <span>Total</span>
                  <span>{Number(detail.total).toFixed(2)} €</span>
                </div>
              </div>

              {detail.message_client && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-text-light text-xs mb-1">Message du client</p>
                  <p className="text-sm">{detail.message_client}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
