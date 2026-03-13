import { useState, useEffect, useCallback } from 'react';
import { fetchAllPlats, createPlat, updatePlat, deletePlat, fetchCategories } from '../../services/admin';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Loader2, Plus, Pencil, Trash2, X, Search, RefreshCw } from 'lucide-react';
import { resetStock } from '../../services/admin';

const emptyPlat = {
  nom: '',
  description: '',
  prix: '',
  categorie_id: '',
  image_url: '',
  allergens: [],
  populaire: false,
  disponible: true,
  portions_max: '',
  portions_restantes: '',
};

export function AdminPlats() {
  const [plats, setPlats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlat, setEditingPlat] = useState(null);
  const [form, setForm] = useState(emptyPlat);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [platsData, catsData] = await Promise.all([fetchAllPlats(), fetchCategories()]);
      setPlats(platsData);
      setCategories(catsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditingPlat(null);
    setForm(emptyPlat);
    setError('');
    setShowForm(true);
  };

  const openEdit = (plat) => {
    setEditingPlat(plat);
    setForm({
      nom: plat.nom,
      description: plat.description || '',
      prix: plat.prix,
      categorie_id: plat.categorie_id || '',
      image_url: plat.image_url || '',
      allergens: plat.allergens || [],
      populaire: plat.populaire,
      disponible: plat.disponible,
      portions_max: plat.portions_max ?? '',
      portions_restantes: plat.portions_restantes ?? '',
    });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.prix) {
      setError('Nom et prix sont requis.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const portionsMax = form.portions_max !== '' ? Number(form.portions_max) : null;
      let portionsRestantes = form.portions_restantes !== '' ? Number(form.portions_restantes) : null;

      // New dish: default portions_restantes to portions_max
      if (!editingPlat && portionsMax !== null && portionsRestantes === null) {
        portionsRestantes = portionsMax;
      }

      const payload = {
        ...form,
        prix: Number(form.prix),
        categorie_id: form.categorie_id ? Number(form.categorie_id) : null,
        portions_max: portionsMax,
        portions_restantes: portionsRestantes,
      };

      if (editingPlat) {
        await updatePlat(editingPlat.id, payload);
      } else {
        await createPlat(payload);
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
      await deletePlat(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestock = async (plat) => {
    try {
      await resetStock(plat.id);
      await loadData();
    } catch (err) {
      console.error('Erreur réapprovisionnement:', err);
    }
  };

  const filtered = plats.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      (p.categories?.nom || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-text">Gestion des Plats</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue text-white rounded-xl font-medium text-sm hover:bg-blue/90 transition-colors"
        >
          <Plus size={18} /> Ajouter un plat
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un plat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-medium text-text-light">Nom</th>
                <th className="text-left py-3 px-4 font-medium text-text-light">Catégorie</th>
                <th className="text-left py-3 px-4 font-medium text-text-light">Prix</th>
                <th className="text-center py-3 px-4 font-medium text-text-light">Stock</th>
                <th className="text-center py-3 px-4 font-medium text-text-light">Dispo</th>
                <th className="text-center py-3 px-4 font-medium text-text-light">Populaire</th>
                <th className="text-right py-3 px-4 font-medium text-text-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((plat) => (
                <tr key={plat.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium">{plat.nom}</td>
                  <td className="py-3 px-4 text-text-light">{plat.categories?.nom || '—'}</td>
                  <td className="py-3 px-4">{Number(plat.prix).toFixed(2)} €</td>
                  <td className="py-3 px-4 text-center">
                    {plat.portions_max === null ? (
                      <span className="text-text-light text-xs" title="Stock illimité">∞</span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          plat.portions_restantes === 0
                            ? 'bg-red-100 text-red-700'
                            : plat.portions_restantes <= 5
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {plat.portions_restantes} / {plat.portions_max}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${plat.disponible ? 'bg-green-500' : 'bg-red-400'}`} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {plat.populaire ? '⭐' : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {plat.portions_max !== null && plat.portions_restantes < plat.portions_max && (
                        <button
                          onClick={() => handleRestock(plat)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Réapprovisionner"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(plat)}
                        className="p-1.5 text-blue hover:bg-blue/10 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(plat)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-light">
                    Aucun plat trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-display font-bold text-text mb-4">
              {editingPlat ? 'Modifier le plat' : 'Nouveau plat'}
            </h2>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Nom *</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.prix}
                    onChange={(e) => setForm({ ...form, prix: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Catégorie</label>
                  <select
                    value={form.categorie_id}
                    onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                  >
                    <option value="">— Aucune —</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">URL de l'image</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Aperçu"
                    className="mt-2 w-full h-32 object-cover rounded-xl border border-gray-100"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Portions max <span className="text-text-light font-normal">(vide = illimité)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.portions_max}
                    onChange={(e) => setForm({ ...form, portions_max: e.target.value })}
                    placeholder="∞"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Portions restantes</label>
                  <input
                    type="number"
                    min="0"
                    value={form.portions_restantes}
                    onChange={(e) => setForm({ ...form, portions_restantes: e.target.value })}
                    placeholder="—"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.disponible}
                    onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue"
                  />
                  Disponible
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.populaire}
                    onChange={(e) => setForm({ ...form, populaire: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue"
                  />
                  Populaire
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-text-light hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingPlat ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer ce plat ?"
        message={`Le plat "${deleteTarget?.nom}" sera définitivement supprimé.`}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
