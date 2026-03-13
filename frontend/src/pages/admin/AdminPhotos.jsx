import { useState, useEffect, useCallback } from 'react';
import { fetchAllPhotos, updatePhoto, createPhoto, deletePhoto } from '../../services/admin';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Loader2, Pencil, Plus, Trash2, X, Image, ExternalLink, Check } from 'lucide-react';
import { SkeletonTable } from '../../components/Skeleton';

const emptyPhoto = {
  cle: '',
  url: '',
  alt_text: '',
  section: '',
  description: '',
};

export function AdminPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [form, setForm] = useState(emptyPhoto);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageValid, setImageValid] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchAllPhotos();
      setPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const validateUrl = (url) => {
    if (!url) { setImageValid(null); return; }
    if (!url.startsWith('https://') && !url.startsWith('/')) {
      setImageValid(false);
      return;
    }
    setImageValid('loading');
    const img = new window.Image();
    img.onload = () => setImageValid(true);
    img.onerror = () => setImageValid(false);
    img.src = url;
  };

  const openCreate = () => {
    setEditingPhoto(null);
    setForm(emptyPhoto);
    setError('');
    setImageValid(null);
    setShowForm(true);
  };

  const openEdit = (photo) => {
    setEditingPhoto(photo);
    setForm({
      cle: photo.cle,
      url: photo.url,
      alt_text: photo.alt_text || '',
      section: photo.section,
      description: photo.description || '',
    });
    setError('');
    setImageValid(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url) {
      setError("L'URL de l'image est requise.");
      return;
    }
    if (!form.url.startsWith('https://') && !form.url.startsWith('/')) {
      setError("L'URL doit commencer par https:// ou / (chemin local).");
      return;
    }
    if (!editingPhoto && !form.cle) {
      setError('La clé est requise pour une nouvelle photo.');
      return;
    }
    if (!form.section) {
      setError('La section est requise.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (editingPhoto) {
        await updatePhoto(editingPhoto.id, {
          url: form.url,
          alt_text: form.alt_text,
          section: form.section,
          description: form.description,
        });
      } else {
        await createPhoto(form);
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
      await deletePhoto(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="animate-pulse bg-cream-dark rounded h-8 w-48" />
          <div className="animate-pulse bg-cream-dark rounded h-10 w-32" />
        </div>
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Photos du site</h1>
          <p className="text-sm text-text-light mt-1">
            Gérez les images affichées sur le site via leurs URLs HTTPS.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue text-white rounded-xl font-medium text-sm hover:bg-blue/90 transition-colors"
        >
          <Plus size={18} /> Ajouter une photo
        </button>
      </div>

      {/* Photos grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
          >
            <div className="relative h-40 bg-gray-100">
              <img
                src={photo.url}
                alt={photo.alt_text || photo.cle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="absolute inset-0 items-center justify-center bg-gray-100 hidden"
              >
                <Image size={32} className="text-gray-300" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEdit(photo)}
                  className="p-2 bg-white rounded-xl shadow-md text-blue hover:bg-blue hover:text-white transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteTarget(photo)}
                  className="p-2 bg-white rounded-xl shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-text-light">
                  {photo.cle}
                </span>
                <span className="text-xs text-text-light capitalize">{photo.section}</span>
              </div>
              {photo.description && (
                <p className="text-xs text-text-light mt-1 line-clamp-1">{photo.description}</p>
              )}
              <a
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-blue hover:underline"
              >
                Voir l'image <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}

        {photos.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Image size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-text-light">Aucune photo configurée.</p>
          </div>
        )}
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
              {editingPhoto ? `Modifier "${editingPhoto.cle}"` : 'Nouvelle photo'}
            </h2>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingPhoto && (
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Clé unique *
                  </label>
                  <input
                    type="text"
                    value={form.cle}
                    onChange={(e) => setForm({ ...form, cle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    placeholder="ex: hero-bg, about-img"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text mb-1">URL de l'image *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => {
                      setForm({ ...form, url: e.target.value });
                      validateUrl(e.target.value);
                    }}
                    placeholder="https://images.example.com/photo.jpg"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                  />
                  {imageValid === true && (
                    <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
                  {imageValid === false && (
                    <X size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                  )}
                  {imageValid === 'loading' && (
                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue animate-spin" />
                  )}
                </div>
                {form.url && imageValid === true && (
                  <img
                    src={form.url}
                    alt="Aperçu"
                    className="mt-2 w-full h-40 object-cover rounded-xl border border-gray-100"
                  />
                )}
                {imageValid === false && form.url && (
                  <p className="mt-1 text-xs text-red-500">
                    Image inaccessible. Vérifiez l'URL.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Section *</label>
                  <select
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                  >
                    <option value="">— Choisir —</option>
                    <option value="hero">Hero</option>
                    <option value="about">À propos</option>
                    <option value="popular">Plats populaires</option>
                    <option value="reservation">Réservation</option>
                    <option value="services">Services</option>
                    <option value="meta">Meta / SEO</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Texte alternatif</label>
                  <input
                    type="text"
                    value={form.alt_text}
                    onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                    placeholder="Description de l'image"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Usage de cette image sur le site"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue focus:outline-none"
                />
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
                  {editingPhoto ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer cette photo ?"
        message={`La photo "${deleteTarget?.cle}" sera supprimée. Les composants du site qui l'utilisent afficheront une image par défaut.`}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
