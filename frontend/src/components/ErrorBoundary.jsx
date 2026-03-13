import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Erreur capturée :', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-card p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-text mb-3">
              Oups, une erreur est survenue
            </h1>
            <p className="text-text-light mb-8">
              Quelque chose s'est mal passé. Vous pouvez essayer de recharger
              la page ou revenir à l'accueil.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow rounded-xl font-medium text-text hover:bg-yellow-dark transition-colors"
              >
                <RefreshCw size={18} />
                Recharger la page
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-cream-dark rounded-xl font-medium text-text-light hover:bg-cream-dark transition-colors"
              >
                <Home size={18} />
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
