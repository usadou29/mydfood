/**
 * Skeleton loaders — remplacent les spinners pendant le chargement.
 * Utilisent l'animation pulse de Tailwind pour un effet shimmer.
 */

function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse bg-cream-dark rounded ${className}`} />;
}

/**
 * Skeleton pour une carte de plat (Commander, PopularDishes)
 * Reproduit : image 192px + titre + description + prix + bouton
 */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <SkeletonBlock className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-6 w-12" />
        </div>
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-3/4" />
        <SkeletonBlock className="h-11 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

/**
 * Grille de SkeletonCard
 */
export function SkeletonCardGrid({ count = 6 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour une ligne de table admin
 */
export function SkeletonTableRow({ columns = 6 }) {
  return (
    <tr>
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonBlock className={`h-4 ${i === 0 ? 'w-24' : i === columns - 1 ? 'w-16' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Grille de lignes skeleton pour table admin
 */
export function SkeletonTable({ rows = 5, columns = 6 }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {Array.from({ length: columns }, (_, i) => (
                <th key={i} className="px-4 py-3">
                  <SkeletonBlock className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: rows }, (_, i) => (
              <SkeletonTableRow key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Skeleton pour le profil utilisateur
 */
export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-8 space-y-5">
      {/* 2 champs côte à côte */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <SkeletonBlock className="h-3 w-16 mb-2" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
        <div>
          <SkeletonBlock className="h-3 w-12 mb-2" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      </div>
      {/* Téléphone */}
      <div>
        <SkeletonBlock className="h-3 w-20 mb-2" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </div>
      {/* Adresse */}
      <div>
        <SkeletonBlock className="h-3 w-32 mb-2" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </div>
      {/* Ville + Code postal */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <SkeletonBlock className="h-3 w-12 mb-2" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
        <div>
          <SkeletonBlock className="h-3 w-20 mb-2" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      </div>
      {/* Bouton */}
      <SkeletonBlock className="h-11 w-40 rounded-xl" />
    </div>
  );
}

/**
 * Skeleton pour la liste des commandes (Profile tab commandes)
 */
export function SkeletonOrderList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="h-5 w-20 rounded-full" />
              </div>
              <SkeletonBlock className="h-3 w-48" />
            </div>
            <SkeletonBlock className="h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
