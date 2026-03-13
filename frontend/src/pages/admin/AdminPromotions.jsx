import { useState, useEffect, useCallback } from 'react';
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from '../../services/admin';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Loader2, Plus, Pencil, Trash2, X, Search, Tag, ToggleLeft, ToggleRight } from 'lucide-react';

const emptyPromo = {
  code: '',
  type_reduction: 'pourcentage',
  valeur: '',
  minimum_commande: '',
  usage_max: '',
  date_debut: '',
  date_fin: '',
  active: true,
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function toLocalDatetimeInput(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form, setForm] = useState(emptyPromo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchPromotions();
      setPromotions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingPromo(null);
    const now = new Date();
    const inOneMonth = new Date(now);
    inOneMonth.setMonth(inOneMonth.getMonth() + 1);
    setForm({
      ...emptyPromo,
      date_debut: now.toISOString(),
      date_fin: inOneMonth.toISOString(),
    });
    setError('');
    setShowForm(true);
  };

  const openEdit = (promo) => {
    setEditingPromo(promo);
    setForm({
      code: promo.code,
      type_reduction: promo.type_reduction,
      valeur: promo.valeur,
      minimum_commande: promo.minimum_commande ?? '',
      usage_max: promo.usage_max ?? '',
      date_debut: promo.date_debut,
      date_fin: promo.date_fin,
      active: promo.active,
    });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.valeur) {
      setError('Le code et la valeur sont requis.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type_reduction: form.type_reduction,
        valeur: Number(form.valeur),
        minimum_commande: form.minimum_commande ? Number(form.minimum_commande) : null,
        usage_max: form.usage_max ? Number(form.usage_max) : null,
        date_debut: form.date_debut || new Date().toISOString(),
        date_fin: form.date_fin,
        active: form.active,
      };

      if (editingPromo) {
        await updatePromotion(editingPromo.id, payload);
      } else {
        await createPromotion(payload);
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePromotion(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      await updatePromotion(promo.id, { active: !promo.active });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = promotions.filter((p) =>
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (promo) => new Date(promo.date_fin) < new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag size={24} className="text-blue" />
            Promotions
          </h1>
          <p className="text-sm text-gray-500 mt-1">{promotions.length} code(s) promo</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue/90 transition-colors"
        >
          <Plus size={18} />
          Nouveau code promo
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un code..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Valeur</th>
                <th className="px-4 py-3 hidden sm:table-cell">Min. commande</th>
                <th className="px-4 py-3 hidden md:table-cell">Usage</th>
                <th className="px-4 py-3 hidden lg:table-cell">Validité</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold text-blue">
                    {promo.code}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {promo.type_reduction === 'pourcentage' ? 'Pourcentage' : 'Montant fixe'}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {promo.type_reduction === 'pourcentage' ? `${promo.valeur}%` : `${promo.valeur}€`}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                    {promo.minimum_commande ? `${promo.minimum_commande}€` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                    {promo.usage_actuel}{promo.usage_max ? ` / ${promo.usage_max}` : ' / ∞'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                    {formatDate(promo.date_debut)} → {formatDate(promo.date_fin)}
                  </td>
                  <td className="px-4 py-3">
                    {isExpired(promo) ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        Expiré
                      </span>
                    ) : promo.active ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Actif
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(promo)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title={promo.active ? 'Désactiver' : 'Activer'}
                      >
                        {promo.active ? (
                          <ToggleRight size={18} className="text-green-600" />
                        ) : (
                          <ToggleLeft size={18} className="text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(promo)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(promo)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    Aucune promotion trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900">
                {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code promo</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="BIENVENUE10"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={form.type_reduction}
                    onChange={(e) => setForm((f) => ({ ...f, type_reduction: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                  >
                    <option value="pourcentage">Pourcentage (%)</option>
                    <option value="montant_fixe">Montant fixe (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valeur {form.type_reduction === 'pourcentage' ? '(%)' : '(€)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.valeur}
                    onChange={(e) => setForm((f) => ({ ...f, valeur: e.target.value }))}
                    placeholder={form.type_reduction === 'pourcentage' ? '10' : '5.00'}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. commande (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.minimum_commande}
                    onChange={(e) => setForm((f) => ({ ...f, minimum_commande: e.target.value }))}
                    placeholder="Aucun minimum"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage max</label>
                  <input
                    type="number"
                    min="1"
                    value={form.usage_max}
                    onChange={(e) => setForm((f) => ({ ...f, usage_max: e.target.value }))}
                    placeholder="Illimité"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeInput(form.date_debut)}
                    onChange={(e) => setForm((f) => ({ ...f, date_debut: new Date(e.target.value).toISOString() }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeInput(form.date_fin)}
                    onChange={(e) => setForm((f) => ({ ...f, date_fin: new Date(e.target.value).toISOString() }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="promo-active"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="promo-active" className="text-sm text-gray-700">Actif</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue text-white text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingPromo ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer cette promotion ?"
        message={`Le code "${deleteTarget?.code}" sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
