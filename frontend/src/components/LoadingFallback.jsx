import { Loader2 } from 'lucide-react';

export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-yellow mx-auto mb-4" />
        <p className="text-text-light text-sm">Chargement...</p>
      </div>
    </div>
  );
}
