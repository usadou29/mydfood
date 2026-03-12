const statusConfig = {
  en_attente: { label: 'En attente', bg: 'bg-amber-100', text: 'text-amber-800' },
  confirmee: { label: 'Confirmée', bg: 'bg-blue-100', text: 'text-blue-800' },
  en_preparation: { label: 'En préparation', bg: 'bg-purple-100', text: 'text-purple-800' },
  prete: { label: 'Prête', bg: 'bg-cyan-100', text: 'text-cyan-800' },
  en_livraison: { label: 'En livraison', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  livree: { label: 'Livrée', bg: 'bg-green-100', text: 'text-green-800' },
  annulee: { label: 'Annulée', bg: 'bg-red-100', text: 'text-red-800' },
  // Devis
  nouveau: { label: 'Nouveau', bg: 'bg-amber-100', text: 'text-amber-800' },
  en_cours: { label: 'En cours', bg: 'bg-blue-100', text: 'text-blue-800' },
  devis_envoye: { label: 'Devis envoyé', bg: 'bg-purple-100', text: 'text-purple-800' },
  accepte: { label: 'Accepté', bg: 'bg-green-100', text: 'text-green-800' },
  refuse: { label: 'Refusé', bg: 'bg-red-100', text: 'text-red-800' },
};

export function StatusBadge({ statut }) {
  const config = statusConfig[statut] || {
    label: statut,
    bg: 'bg-gray-100',
    text: 'text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
