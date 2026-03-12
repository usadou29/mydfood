import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button.jsx';

describe('Button Component', () => {
  it('doit rendre le texte du bouton', () => {
    render(<Button>Commander</Button>);
    expect(screen.getByText('Commander')).toBeInTheDocument();
  });

  it('doit appliquer la variante primary par défaut', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('button');
    // Primary = fond jaune (bg-[var(--color-yellow)])
    expect(button).toBeTruthy();
  });

  it('doit gérer le clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquez</Button>);
    fireEvent.click(screen.getByText('Cliquez'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ne doit pas déclencher le clic quand disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Désactivé</Button>);
    fireEvent.click(screen.getByText('Désactivé'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('doit accepter le type submit pour les formulaires', () => {
    const { container } = render(<Button type="submit">Envoyer</Button>);
    const button = container.querySelector('button');
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('doit appliquer les classes CSS additionnelles', () => {
    const { container } = render(<Button className="ma-classe">Test</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('ma-classe');
  });
});
