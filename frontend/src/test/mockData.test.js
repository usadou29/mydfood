import { describe, it, expect } from 'vitest';
import {
  plats,
  menusFamille,
  evenements,
  zonesLivraison,
  services,
  menuSemaine,
  temoignages
} from '../data/mockData.js';

describe('Mock Data – Plats', () => {
  it('doit contenir au moins 1 plat', () => {
    expect(plats.length).toBeGreaterThan(0);
  });

  it('chaque plat doit avoir id, name, price, description', () => {
    plats.forEach((plat) => {
      expect(plat).toHaveProperty('id');
      expect(plat).toHaveProperty('name');
      expect(plat).toHaveProperty('price');
      expect(plat).toHaveProperty('description');
      expect(plat.price).toBeGreaterThan(0);
      expect(plat.name.length).toBeGreaterThan(0);
    });
  });

  it('les allergens doivent être un tableau', () => {
    plats.forEach((plat) => {
      expect(Array.isArray(plat.allergens)).toBe(true);
    });
  });

  it('doit avoir des plats populaires', () => {
    const populaires = plats.filter((p) => p.popular);
    expect(populaires.length).toBeGreaterThan(0);
  });
});

describe('Mock Data – Menus Famille', () => {
  it('doit contenir au moins 1 menu', () => {
    expect(menusFamille.length).toBeGreaterThan(0);
  });

  it('chaque menu doit avoir un contenu (liste de plats)', () => {
    menusFamille.forEach((menu) => {
      expect(menu).toHaveProperty('content');
      expect(Array.isArray(menu.content)).toBe(true);
      expect(menu.content.length).toBeGreaterThan(0);
    });
  });

  it('chaque menu doit avoir un prix positif', () => {
    menusFamille.forEach((menu) => {
      expect(menu.price).toBeGreaterThan(0);
    });
  });
});

describe('Mock Data – Événements', () => {
  it('chaque événement doit avoir titre, date, lieu, places', () => {
    evenements.forEach((evt) => {
      expect(evt).toHaveProperty('title');
      expect(evt).toHaveProperty('date');
      expect(evt).toHaveProperty('location');
      expect(evt).toHaveProperty('places');
      expect(evt.places).toBeGreaterThan(0);
    });
  });
});

describe('Mock Data – Zones de livraison', () => {
  it('la première zone (Antony) doit être gratuite', () => {
    const antony = zonesLivraison[0];
    expect(antony.prix).toBe(0);
  });

  it('chaque zone doit avoir un minimum de commande', () => {
    zonesLivraison.forEach((zone) => {
      expect(zone).toHaveProperty('minCommande');
      expect(zone.minCommande).toBeGreaterThanOrEqual(0);
    });
  });

  it('les frais de livraison doivent être croissants', () => {
    for (let i = 1; i < zonesLivraison.length; i++) {
      expect(zonesLivraison[i].prix).toBeGreaterThanOrEqual(zonesLivraison[i - 1].prix);
    }
  });
});

describe('Mock Data – Services', () => {
  it('doit contenir 4 services', () => {
    expect(services.length).toBe(4);
  });

  it('chaque service doit avoir un lien de navigation', () => {
    services.forEach((service) => {
      expect(service.link).toMatch(/^\//);
    });
  });
});

describe('Mock Data – Menu Semaine', () => {
  it('doit contenir des plats pour chaque jour', () => {
    expect(menuSemaine.plats.length).toBeGreaterThanOrEqual(5);
  });

  it('chaque jour doit avoir un plat et un prix', () => {
    menuSemaine.plats.forEach((jour) => {
      expect(jour).toHaveProperty('jour');
      expect(jour).toHaveProperty('plat');
      expect(jour).toHaveProperty('prix');
      expect(jour.prix).toBeGreaterThan(0);
    });
  });
});

describe('Mock Data – Témoignages', () => {
  it('chaque témoignage doit avoir une note entre 1 et 5', () => {
    temoignages.forEach((t) => {
      expect(t.note).toBeGreaterThanOrEqual(1);
      expect(t.note).toBeLessThanOrEqual(5);
    });
  });
});
