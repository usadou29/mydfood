import { useState, useEffect, useCallback } from 'react';
import { fetchAllTemoignages, toggleTemoignage, deleteTemoignage } from '../../services/admin';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { Loader2, Check, X, Trash2, Star } from 'lucide-react';

const filtres = [
  { value: 'tous', label: 'Tous' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'approuve', label: 'Approuvés' },
];

export function AdminTemoignages() {
  const [temoignages, setTemoignages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('en_attente');
  const [acting, setActing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchAllTemoignages(filtre);
      setTemoignages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filtre]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleToggle = async (id, approuve) => {
    setActing(id);
    try {
      await toggleTemoignage(id, approuve);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTemoignage(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (note) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < note ? 'text-yellow fill-yellow' : 'text-gray-200'}
        />
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-text mb-6">Gestion des Témoignages</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {filtres.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltre(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtre === f.value
                ? 'bg-blue text-white'
                : 'bg-gray-100 text-text-light hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue" />
        </div>
      ) : temoignages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Star size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-text-light">Aucun témoignage dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {temoignages.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl shadow-sm border p-5 ${
                t.approuve ? 'border-green-200' : 'border-amber-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold text-sm">
                      {t.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-text text-sm">{t.nom}</p>
                      <div className="flex items-center gap-2">
                        {renderStars(t.note)}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          t.approuve
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {t.approuve ? 'Approuvé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-text-light leading-relaxed ml-12">
                    "{t.commentaire}"
                  </p>
                  <p className="text-xs text-gray-400 mt-2 ml-12">
                    {new Date(t.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!t.approuve ? (
                    <button
                      onClick={() => handleToggle(t.id, true)}
                      disabled={acting === t.id}
                      className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
                      title="Approuver"
                    >
                      {acting === t.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggle(t.id, false)}
                      disabled={acting === t.id}
                      className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors"
                      title="Retirer l'approbation"
                    >
                      {acting === t.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(t)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer ce témoignage ?"
        message={`Le témoignage de "${deleteTarget?.nom}" sera définitivement supprimé.`}
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
