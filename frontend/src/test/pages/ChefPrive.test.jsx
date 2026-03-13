import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { ChefPrive } from '../../pages/ChefPrive';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ChefPrive />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('ChefPrive', () => {
  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText('Chef Privé & Professionnels')).toBeInTheDocument();
  });

  it('displays all service cards', () => {
    renderPage();
    expect(screen.getByText('Événements privés')).toBeInTheDocument();
    expect(screen.getByText('Traiteur entreprise')).toBeInTheDocument();
    expect(screen.getByText('Mariages & cérémonies')).toBeInTheDocument();
    expect(screen.getByText('Cours de cuisine')).toBeInTheDocument();
  });

  it('shows how it works section', () => {
    renderPage();
    expect(screen.getByText('Comment ça marche ?')).toBeInTheDocument();
    expect(screen.getByText('Contactez-nous')).toBeInTheDocument();
    expect(screen.getByText('Devis personnalisé')).toBeInTheDocument();
    expect(screen.getByText('Jour J')).toBeInTheDocument();
  });

  it('shows CTA buttons', () => {
    renderPage();
    expect(screen.getByText('Demander un devis')).toBeInTheDocument();
    expect(screen.getByText('Nous contacter')).toBeInTheDocument();
  });
});
