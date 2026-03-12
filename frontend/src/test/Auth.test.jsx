import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Mock AuthContext
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockAuthValues = {
  user: null,
  profile: null,
  loading: false,
  isAdmin: false,
  signIn: mockSignIn,
  signUp: mockSignUp,
  signOut: vi.fn(),
  updateProfile: vi.fn(),
};

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthValues,
}));

// Mock Logo
vi.mock('../components/Logo', () => ({
  LogoSmall: ({ className }) => <div className={className} data-testid="logo">Logo</div>,
}));

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthValues.user = null;
  });

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Connexion')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Mot de passe')).toBeTruthy();
    expect(screen.getByText('Se connecter')).toBeTruthy();
  });

  it('shows error when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Se connecter'));
    await waitFor(() => {
      expect(screen.getByText('Veuillez remplir tous les champs.')).toBeTruthy();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn on valid submission', async () => {
    mockSignIn.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Se connecter'));
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });
  });

  it('shows error on invalid credentials', async () => {
    mockSignIn.mockRejectedValueOnce({ message: 'Invalid login credentials' });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Se connecter'));
    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect.')).toBeTruthy();
    });
  });

  it('toggles password visibility', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const passwordInput = screen.getByLabelText('Mot de passe');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(screen.getByLabelText('Afficher le mot de passe'));
    expect(passwordInput.type).toBe('text');
    fireEvent.click(screen.getByLabelText('Masquer le mot de passe'));
    expect(passwordInput.type).toBe('password');
  });

  it('has link to register page', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Créer un compte')).toBeTruthy();
  });
});

describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthValues.user = null;
  });

  it('renders registration form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText('Créer un compte')).toBeTruthy();
    expect(screen.getByLabelText(/Prénom/)).toBeTruthy();
    expect(screen.getByLabelText(/^Nom/)).toBeTruthy();
    expect(screen.getByLabelText(/Email/)).toBeTruthy();
    expect(screen.getByLabelText('Téléphone')).toBeTruthy();
  });

  it('validates password match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Prénom/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/^Nom/), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe \*/), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe *'), { target: { value: 'different' } });
    fireEvent.click(screen.getByText('Créer mon compte'));
    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas.')).toBeTruthy();
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('validates minimum password length', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Prénom/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/^Nom/), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe \*/), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe *'), { target: { value: '12345' } });
    fireEvent.click(screen.getByText('Créer mon compte'));
    await waitFor(() => {
      expect(screen.getByText('Le mot de passe doit contenir au moins 6 caractères.')).toBeTruthy();
    });
  });

  it('calls signUp and shows success on valid registration', async () => {
    mockSignUp.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Prénom/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/^Nom/), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe \*/), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe *'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Créer mon compte'));
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        nom: 'User',
        prenom: 'Test',
        telephone: '',
      });
    });
    await waitFor(() => {
      expect(screen.getByText('Compte créé !')).toBeTruthy();
    });
  });

  it('shows error for already registered email', async () => {
    mockSignUp.mockRejectedValueOnce({ message: 'User already registered' });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Prénom/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/^Nom/), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'existing@test.com' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe \*/), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirmer le mot de passe *'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Créer mon compte'));
    await waitFor(() => {
      expect(screen.getByText('Cet email est déjà utilisé. Essayez de vous connecter.')).toBeTruthy();
    });
  });

  it('has link to login page', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText('Se connecter')).toBeTruthy();
  });
});
