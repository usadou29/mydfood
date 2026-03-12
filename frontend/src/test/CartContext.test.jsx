import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

// Composant test qui expose les actions du cart
function CartTestHelper() {
  const { cart, addToCart, updateQuantite, removeFromCart, clearCart, cartCount, cartTotal } = useCart();

  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="total">{cartTotal}</span>
      <span data-testid="cart-length">{cart.length}</span>
      <button
        data-testid="add-plat"
        onClick={() => addToCart({ id: 1, type: 'plat', nom: 'Fried Rice', prix: 12, image_url: 'test.jpg' })}
      />
      <button
        data-testid="add-menu"
        onClick={() => addToCart({ id: 1, type: 'menu_famille', nom: 'Menu Famille', prix: 45, image_url: 'menu.jpg' })}
      />
      <button data-testid="increment" onClick={() => updateQuantite(1, 1, 'plat')} />
      <button data-testid="decrement" onClick={() => updateQuantite(1, -1, 'plat')} />
      <button data-testid="remove" onClick={() => removeFromCart(1, 'plat')} />
      <button data-testid="clear" onClick={() => clearCart()} />
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('doit démarrer avec un panier vide', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('total').textContent).toBe('0');
  });

  it('doit ajouter un plat au panier', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('total').textContent).toBe('12');
  });

  it('doit incrémenter la quantité si le même plat est ajouté', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    fireEvent.click(screen.getByTestId('add-plat'));
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('total').textContent).toBe('24');
  });

  it('doit gérer plat et menu_famille comme items distincts', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    fireEvent.click(screen.getByTestId('add-menu'));
    expect(screen.getByTestId('cart-length').textContent).toBe('2');
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('total').textContent).toBe('57'); // 12 + 45
  });

  it('doit mettre à jour la quantité', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    fireEvent.click(screen.getByTestId('increment'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('doit retirer l\'item quand la quantité atteint 0', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    fireEvent.click(screen.getByTestId('decrement'));
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
  });

  it('doit retirer un item spécifique', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    fireEvent.click(screen.getByTestId('add-menu'));
    fireEvent.click(screen.getByTestId('remove'));
    expect(screen.getByTestId('cart-length').textContent).toBe('1');
    expect(screen.getByTestId('total').textContent).toBe('45'); // Seul le menu reste
  });

  it('doit vider le panier', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    fireEvent.click(screen.getByTestId('add-menu'));
    fireEvent.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
    expect(screen.getByTestId('total').textContent).toBe('0');
  });

  it('doit persister le panier dans localStorage', () => {
    render(
      <CartProvider>
        <CartTestHelper />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-plat'));
    const stored = JSON.parse(localStorage.getItem('dfood_cart'));
    expect(stored).toHaveLength(1);
    expect(stored[0].nom).toBe('Fried Rice');
  });

  it('doit lever une erreur si useCart est utilisé hors CartProvider', () => {
    // Supprime les erreurs console attendues
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<CartTestHelper />)).toThrow('useCart doit être utilisé dans un CartProvider');
    consoleSpy.mockRestore();
  });
});
