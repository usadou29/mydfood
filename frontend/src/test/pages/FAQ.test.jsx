import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { FAQ } from '../../pages/FAQ';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('FAQ', () => {
  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText('Questions fréquentes')).toBeInTheDocument();
  });

  it('displays all FAQ categories', () => {
    renderPage();
    expect(screen.getByText('Commandes')).toBeInTheDocument();
    expect(screen.getByText('Livraison')).toBeInTheDocument();
    expect(screen.getByText('Paiement')).toBeInTheDocument();
    expect(screen.getByText('Allergènes & régimes')).toBeInTheDocument();
  });

  it('toggles FAQ answer on click', () => {
    renderPage();
    const question = screen.getByText('Comment passer une commande ?');
    expect(screen.queryByText(/Rendez-vous sur la page/)).not.toBeInTheDocument();

    fireEvent.click(question);
    expect(screen.getByText(/Rendez-vous sur la page/)).toBeInTheDocument();

    fireEvent.click(question);
    expect(screen.queryByText(/Rendez-vous sur la page/)).not.toBeInTheDocument();
  });

  it('shows Halal question', () => {
    renderPage();
    expect(screen.getByText('Vos plats sont-ils Halal ?')).toBeInTheDocument();
  });
});
