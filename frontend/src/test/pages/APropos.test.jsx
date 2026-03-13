import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { APropos } from '../../pages/APropos';

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <APropos />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('APropos', () => {
  it('renders the page title', () => {
    renderPage();
    expect(screen.getByText('Notre Histoire')).toBeInTheDocument();
  });

  it('shows founder name', () => {
    renderPage();
    expect(screen.getByText('Doriane Fampou')).toBeInTheDocument();
  });

  it('displays the three values cards', () => {
    renderPage();
    expect(screen.getByText('100% Halal certifié')).toBeInTheDocument();
    expect(screen.getByText('Fait maison')).toBeInTheDocument();
    expect(screen.getByText('Saveurs camerounaises')).toBeInTheDocument();
  });

  it('shows the mission section', () => {
    renderPage();
    expect(screen.getByText('Notre mission')).toBeInTheDocument();
  });
});
