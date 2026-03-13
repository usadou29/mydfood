import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Composant qui lance une erreur volontairement
function BrokenComponent() {
  throw new Error('Test crash');
}

function WorkingComponent() {
  return <p>Tout va bien</p>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Supprime les logs d'erreur React dans la console pendant les tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Tout va bien')).toBeInTheDocument();
  });

  it('renders fallback UI when a child component throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oups, une erreur est survenue')).toBeInTheDocument();
    expect(screen.getByText(/Quelque chose s'est mal passé/)).toBeInTheDocument();
  });

  it('shows reload button that reloads the page', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    const reloadBtn = screen.getByText('Recharger la page');
    expect(reloadBtn).toBeInTheDocument();
    fireEvent.click(reloadBtn);
    expect(reloadMock).toHaveBeenCalled();
  });

  it('shows home button', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });
});
