import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { PolitiqueConfidentialite } from '../../pages/PolitiqueConfidentialite';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PolitiqueConfidentialite />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('PolitiqueConfidentialite', () => {
  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText('Politique de Confidentialité')).toBeInTheDocument();
  });

  it('contains RGPD rights section', () => {
    renderPage();
    expect(screen.getByText('6. Vos droits (RGPD)')).toBeInTheDocument();
  });

  it('contains cookies section', () => {
    renderPage();
    expect(screen.getByText('7. Cookies')).toBeInTheDocument();
  });

  it('contains security section', () => {
    renderPage();
    expect(screen.getByText('9. Sécurité')).toBeInTheDocument();
  });
});
