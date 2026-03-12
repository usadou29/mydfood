-- ============================================================
-- DFOOD – Données initiales (seed)
-- À exécuter APRÈS schema.sql dans Supabase SQL Editor
-- ============================================================

-- Catégories
INSERT INTO public.categories (nom, description, ordre) VALUES
  ('Plats principaux', 'Nos plats signature camerounais', 1),
  ('Accompagnements', 'Plantain, riz, frites de manioc...', 2),
  ('Entrées', 'Brochettes, beignets, accras...', 3),
  ('Desserts', 'Douceurs maison', 4),
  ('Boissons', 'Jus frais et boissons maison', 5),
  ('Végétarien', 'Options sans viande', 6);

-- Plats
INSERT INTO public.plats (nom, description, prix, categorie_id, image_url, allergens, populaire, disponible, portions_max, portions_restantes) VALUES
  ('Fried Rice Camerounais', 'Riz sauté aux légumes de saison, poulet mariné aux épices douces', 12.00, 1, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop', ARRAY['gluten', 'soja'], true, true, 30, 30),
  ('Suya Box', 'Brochettes de bœuf épicées, sauce cacahuète maison, plantain frit', 10.00, 1, 'https://images.unsplash.com/photo-1529193591184-b1d580690a9b?w=600&h=400&fit=crop', ARRAY['cacahuète', 'gluten'], true, true, 25, 25),
  ('Poulet Braisé', 'Poulet mariné aux épices camerounaises, braisé au feu de bois, légumes grillés', 13.00, 1, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop', ARRAY[]::TEXT[], false, true, 20, 20),
  ('Ndolé', 'Feuilles de ndolé sautées, crevettes, cacahuètes, plantain frit', 14.00, 1, 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop', ARRAY['fruits de mer', 'cacahuète'], false, true, 15, 15),
  ('Poulet DG', 'Poulet frit aux légumes (plantain, carottes, poivrons), sauce tomate épicée', 13.00, 1, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop', ARRAY[]::TEXT[], true, true, 20, 20),
  ('Koki', 'Purée de haricots blancs aux épices, huile de palme, plantain vapeur', 11.00, 6, 'https://images.unsplash.com/photo-1546552356-3fae876a61ca?w=600&h=400&fit=crop', ARRAY[]::TEXT[], false, true, 15, 15);

-- Menus famille
INSERT INTO public.menus_famille (nom, description, contenu, prix, nb_personnes, image_url) VALUES
  ('Menu Famille Africain', 'Pour 4 personnes', ARRAY['Poulet braisé (4 parts)', 'Fried rice (4 parts)', 'Plantain frit', 'Salade africaine', 'Sauce piment'], 45.00, 4, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop'),
  ('Menu Dimanche', 'Pour 4 personnes', ARRAY['Poulet DG (4 parts)', 'Riz blanc', 'Légumes sautés', 'Beignets de poisson', 'Dessert maison'], 42.00, 4, 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?w=600&h=400&fit=crop'),
  ('Menu Fête', 'Pour 6 personnes', ARRAY['Assortiment de suya', 'Poulet braisé (6 parts)', 'Fried rice (6 parts)', 'Ndolé', 'Plantain frit', 'Boissons maison'], 68.00, 6, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop');

-- Zones de livraison
INSERT INTO public.zones_livraison (nom, codes_postaux, frais_livraison, minimum_commande, delai_minutes) VALUES
  ('Antony (92)', ARRAY['92160'], 0.00, 15.00, 30),
  ('5km autour', ARRAY['92140', '92220', '92290', '92330', '92340'], 3.00, 20.00, 45),
  ('Paris Centre', ARRAY['75001', '75002', '75003', '75004', '75005', '75006', '75007', '75008', '75009', '75010', '75011', '75012', '75013', '75014', '75015', '75016', '75017', '75018', '75019', '75020'], 5.00, 25.00, 60),
  ('Île-de-France', ARRAY[]::TEXT[], 8.00, 35.00, 90);

-- Événements
INSERT INTO public.evenements (titre, description, date_evenement, heure, lieu, prix, places_total, places_restantes, image_url) VALUES
  ('Soirée Dégustation Camerounaise', 'Découvrez les saveurs authentiques du Cameroun lors d''une soirée gastronomique unique.', '2026-03-15 19:00:00+01', '19:00', 'Restaurant La Sanaga, Issoire', 35.00, 20, 20, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'),
  ('Atelier Cuisine Afro-Fusion', 'Apprenez à préparer des plats camerounais modernisés avec Tata Dow.', '2026-03-22 14:00:00+01', '14:00', 'Cuisine DFOOD, Antony', 45.00, 12, 12, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop');

-- Menu de la semaine (exemple)
INSERT INTO public.menus_semaine (semaine_debut, semaine_fin, actif) VALUES
  ('2026-03-09', '2026-03-15', true);

INSERT INTO public.menus_semaine_plats (menu_semaine_id, jour, plat_id, accompagnement) VALUES
  (1, 'Lundi', 1, 'Plantain frit'),
  (1, 'Mardi', 5, 'Riz blanc'),
  (1, 'Mercredi', 2, 'Frites de manioc'),
  (1, 'Jeudi', 4, 'Plantain vapeur'),
  (1, 'Vendredi', 3, 'Fried rice'),
  (1, 'Samedi', 5, 'Menu Famille');
