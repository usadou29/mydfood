import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const mockAuth = { user: null, isAdmin: false, loading: false };
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

afterEach(() => {
  cleanup();
});

function renderWith(children, route = '/admin') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ProtectedRoute>{children}</ProtectedRoute>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('shows loading spinner when auth is loading', () => {
    mockAuth.loading = true;
    mockAuth.user = null;
    mockAuth.isAdmin = false;
    renderWith(<div>Admin Content</div>);
    expect(screen.queryByText('Admin Content')).toBeNull();
  });

  it('redirects non-authenticated users', () => {
    mockAuth.loading = false;
    mockAuth.user = null;
    mockAuth.isAdmin = false;
    renderWith(<div>Admin Content</div>);
    expect(screen.queryByText('Admin Content')).toBeNull();
  });

  it('redirects authenticated non-admin users', () => {
    mockAuth.loading = false;
    mockAuth.user = { id: '123' };
    mockAuth.isAdmin = false;
    renderWith(<div>Admin Content</div>);
    expect(screen.queryByText('Admin Content')).toBeNull();
  });

  it('renders children for admin users', () => {
    mockAuth.loading = false;
    mockAuth.user = { id: '123' };
    mockAuth.isAdmin = true;
    renderWith(<div>Admin Content</div>);
    expect(screen.getByText('Admin Content')).toBeTruthy();
  });
});
