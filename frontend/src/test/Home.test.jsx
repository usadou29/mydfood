import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../pages/Home';

// Mock all sub-components to test composition
vi.mock('../components/home/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">HeroSection</div>,
}));
vi.mock('../components/home/PopularDishes', () => ({
  PopularDishes: () => <div data-testid="popular-dishes">PopularDishes</div>,
}));
vi.mock('../components/home/AboutSection', () => ({
  AboutSection: () => <div data-testid="about-section">AboutSection</div>,
}));
vi.mock('../components/home/ServicesSection', () => ({
  ServicesSection: () => <div data-testid="services-section">ServicesSection</div>,
}));
vi.mock('../components/home/ReservationCTA', () => ({
  ReservationCTA: () => <div data-testid="reservation-cta">ReservationCTA</div>,
}));
vi.mock('../components/home/Testimonials', () => ({
  Testimonials: () => <div data-testid="testimonials">Testimonials</div>,
}));

describe('Home page composition', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  });

  it('renders HeroSection', () => {
    expect(screen.getByTestId('hero-section')).toBeTruthy();
  });

  it('renders PopularDishes', () => {
    expect(screen.getByTestId('popular-dishes')).toBeTruthy();
  });

  it('renders AboutSection', () => {
    expect(screen.getByTestId('about-section')).toBeTruthy();
  });

  it('renders ServicesSection', () => {
    expect(screen.getByTestId('services-section')).toBeTruthy();
  });

  it('renders ReservationCTA', () => {
    expect(screen.getByTestId('reservation-cta')).toBeTruthy();
  });

  it('renders Testimonials', () => {
    expect(screen.getByTestId('testimonials')).toBeTruthy();
  });

  it('renders all 6 sections in the correct order', () => {
    const sections = [
      'hero-section',
      'popular-dishes',
      'about-section',
      'services-section',
      'reservation-cta',
      'testimonials',
    ];
    const elements = sections.map((id) => screen.getByTestId(id));
    // Verify all exist
    expect(elements).toHaveLength(6);
    // Verify DOM order
    for (let i = 0; i < elements.length - 1; i++) {
      const pos = elements[i].compareDocumentPosition(elements[i + 1]);
      // DOCUMENT_POSITION_FOLLOWING = 4
      expect(pos & 4).toBeTruthy();
    }
  });
});
