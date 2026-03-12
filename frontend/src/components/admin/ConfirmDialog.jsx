import { AlertTriangle, X } from 'lucide-react';

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              danger ? 'bg-red-100' : 'bg-amber-100'
            }`}
          >
            <AlertTriangle size={20} className={danger ? 'text-red-600' : 'text-amber-600'} />
          </div>
          <div>
            <h3 className="font-display font-bold text-text text-lg">{title}</h3>
            <p className="text-text-light text-sm mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text-light hover:text-text rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              danger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue text-white hover:bg-blue/90'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
