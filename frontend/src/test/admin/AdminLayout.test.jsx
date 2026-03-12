import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    signOut: vi.fn(),
    profile: { prenom: 'Doriane' },
  }),
}));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AdminLayout />
    </MemoryRouter>
  );
}

describe('AdminLayout', () => {
  it('renders sidebar navigation items', () => {
    renderLayout();
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Plats')).toBeTruthy();
    expect(screen.getByText('Commandes')).toBeTruthy();
    expect(screen.getByText('Témoignages')).toBeTruthy();
    expect(screen.getByText('Photos du site')).toBeTruthy();
  });

  it('displays admin name', () => {
    renderLayout();
    expect(screen.getByText('Doriane')).toBeTruthy();
  });

  it('has a link back to the site', () => {
    renderLayout();
    expect(screen.getByText('Retour au site')).toBeTruthy();
  });

  it('shows DFOOD Admin branding', () => {
    renderLayout();
    expect(screen.getByText('DFOOD')).toBeTruthy();
    expect(screen.getByText('Admin Panel')).toBeTruthy();
  });
});
