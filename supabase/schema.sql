-- ============================================================
-- DFOOD by Tata Dow – Schéma de base de données
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- =====================
-- 1. TABLES
-- =====================

-- Profils utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone TEXT,
  adresse TEXT,
  code_postal TEXT,
  ville TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  parrain_id UUID REFERENCES public.profiles(id),
  points_fidelite INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catégories de plats
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  description TEXT,
  ordre INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plats
CREATE TABLE IF NOT EXISTS public.plats (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  prix DECIMAL(8,2) NOT NULL CHECK (prix > 0),
  categorie_id INTEGER REFERENCES public.categories(id),
  image_url TEXT,
  allergens TEXT[] DEFAULT '{}',
  populaire BOOLEAN DEFAULT FALSE,
  disponible BOOLEAN DEFAULT TRUE,
  portions_max INTEGER,
  portions_restantes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menus famille
CREATE TABLE IF NOT EXISTS public.menus_famille (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  contenu TEXT[] NOT NULL,
  prix DECIMAL(8,2) NOT NULL CHECK (prix > 0),
  nb_personnes INTEGER NOT NULL,
  image_url TEXT,
  disponible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu de la semaine
CREATE TABLE IF NOT EXISTS public.menus_semaine (
  id SERIAL PRIMARY KEY,
  semaine_debut DATE NOT NULL,
  semaine_fin DATE NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menus_semaine_plats (
  id SERIAL PRIMARY KEY,
  menu_semaine_id INTEGER REFERENCES public.menus_semaine(id) ON DELETE CASCADE,
  jour TEXT NOT NULL CHECK (jour IN ('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')),
  plat_id INTEGER REFERENCES public.plats(id),
  accompagnement TEXT,
  prix_special DECIMAL(8,2)
);

-- Zones de livraison
CREATE TABLE IF NOT EXISTS public.zones_livraison (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  codes_postaux TEXT[] DEFAULT '{}',
  frais_livraison DECIMAL(6,2) NOT NULL DEFAULT 0,
  minimum_commande DECIMAL(6,2) NOT NULL DEFAULT 0,
  delai_minutes INTEGER DEFAULT 60,
  active BOOLEAN DEFAULT TRUE
);

-- Commandes
CREATE TABLE IF NOT EXISTS public.commandes (
  id SERIAL PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  -- Infos client (pour commandes sans compte)
  client_nom TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_telephone TEXT NOT NULL,
  client_adresse TEXT,
  -- Livraison
  zone_livraison_id INTEGER REFERENCES public.zones_livraison(id),
  type_livraison TEXT NOT NULL CHECK (type_livraison IN ('livraison', 'retrait')),
  creneau_livraison TEXT,
  -- Montants
  sous_total DECIMAL(8,2) NOT NULL,
  frais_livraison DECIMAL(6,2) DEFAULT 0,
  pourboire DECIMAL(6,2) DEFAULT 0,
  total DECIMAL(8,2) NOT NULL,
  -- Paiement
  stripe_payment_id TEXT,
  mode_paiement TEXT CHECK (mode_paiement IN ('carte', 'apple_pay', 'google_pay', 'especes')),
  -- Statut
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN (
    'en_attente', 'confirmee', 'en_preparation', 'prete', 'en_livraison', 'livree', 'annulee'
  )),
  message_client TEXT,
  notes_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lignes de commande
CREATE TABLE IF NOT EXISTS public.commande_lignes (
  id SERIAL PRIMARY KEY,
  commande_id INTEGER REFERENCES public.commandes(id) ON DELETE CASCADE,
  plat_id INTEGER REFERENCES public.plats(id),
  menu_famille_id INTEGER REFERENCES public.menus_famille(id),
  nom TEXT NOT NULL,
  prix_unitaire DECIMAL(8,2) NOT NULL,
  quantite INTEGER NOT NULL CHECK (quantite > 0),
  sous_total DECIMAL(8,2) NOT NULL
);

-- Événements
CREATE TABLE IF NOT EXISTS public.evenements (
  id SERIAL PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  date_evenement TIMESTAMPTZ NOT NULL,
  heure TEXT,
  lieu TEXT,
  prix DECIMAL(8,2),
  places_total INTEGER NOT NULL,
  places_restantes INTEGER NOT NULL,
  image_url TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Réservations événements
CREATE TABLE IF NOT EXISTS public.reservations (
  id SERIAL PRIMARY KEY,
  evenement_id INTEGER REFERENCES public.evenements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  nb_places INTEGER NOT NULL CHECK (nb_places > 0),
  stripe_payment_id TEXT,
  qr_code TEXT,
  statut TEXT NOT NULL DEFAULT 'confirmee' CHECK (statut IN ('confirmee', 'annulee', 'utilisee')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demandes de devis traiteur
CREATE TABLE IF NOT EXISTS public.devis_traiteur (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  type_evenement TEXT NOT NULL,
  nombre_personnes INTEGER NOT NULL CHECK (nombre_personnes > 0),
  date_evenement DATE NOT NULL,
  budget TEXT,
  details TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'devis_envoye', 'accepte', 'refuse')),
  reponse_admin TEXT,
  montant_devis DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages de contact
CREATE TABLE IF NOT EXISTS public.contacts (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  repondu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter
CREATE TABLE IF NOT EXISTS public.newsletter (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 2. INDEX
-- =====================

CREATE INDEX IF NOT EXISTS idx_plats_categorie ON public.plats(categorie_id);
CREATE INDEX IF NOT EXISTS idx_plats_disponible ON public.plats(disponible);
CREATE INDEX IF NOT EXISTS idx_commandes_user ON public.commandes(user_id);
CREATE INDEX IF NOT EXISTS idx_commandes_statut ON public.commandes(statut);
CREATE INDEX IF NOT EXISTS idx_commandes_numero ON public.commandes(numero);
CREATE INDEX IF NOT EXISTS idx_reservations_evenement ON public.reservations(evenement_id);
CREATE INDEX IF NOT EXISTS idx_menus_semaine_actif ON public.menus_semaine(actif);

-- =====================
-- 3. FONCTIONS
-- =====================

-- Génération automatique du numéro de commande
CREATE OR REPLACE FUNCTION generate_numero_commande()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero := 'DF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_commande_numero
  BEFORE INSERT ON public.commandes
  FOR EACH ROW
  EXECUTE FUNCTION generate_numero_commande();

-- Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER tr_plats_updated BEFORE UPDATE ON public.plats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER tr_commandes_updated BEFORE UPDATE ON public.commandes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER tr_evenements_updated BEFORE UPDATE ON public.evenements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER tr_devis_updated BEFORE UPDATE ON public.devis_traiteur FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER tr_menus_famille_updated BEFORE UPDATE ON public.menus_famille FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Création automatique du profil à l'inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nom, prenom)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Décrémenter les places restantes à la réservation
CREATE OR REPLACE FUNCTION decrement_places()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.evenements
  SET places_restantes = places_restantes - NEW.nb_places
  WHERE id = NEW.evenement_id
    AND places_restantes >= NEW.nb_places;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plus assez de places disponibles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_reservation_places
  AFTER INSERT ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION decrement_places();

-- Décrémenter les portions restantes à la commande
CREATE OR REPLACE FUNCTION decrement_portions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.plat_id IS NOT NULL THEN
    UPDATE public.plats
    SET portions_restantes = portions_restantes - NEW.quantite
    WHERE id = NEW.plat_id
      AND (portions_restantes IS NULL OR portions_restantes >= NEW.quantite);

    IF NOT FOUND AND (SELECT portions_restantes FROM public.plats WHERE id = NEW.plat_id) IS NOT NULL THEN
      RAISE EXCEPTION 'Plus assez de portions disponibles pour ce plat';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_commande_ligne_portions
  AFTER INSERT ON public.commande_lignes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_portions();

-- =====================
-- 4. ROW LEVEL SECURITY
-- =====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus_famille ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus_semaine ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus_semaine_plats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones_livraison ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande_lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devis_traiteur ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Profiles : chacun voit/modifie le sien, admin voit tout
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Plats, catégories, menus : lecture publique, écriture admin
CREATE POLICY "plats_select_public" ON public.plats FOR SELECT USING (true);
CREATE POLICY "plats_admin_write" ON public.plats FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "categories_select_public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "menus_famille_select_public" ON public.menus_famille FOR SELECT USING (true);
CREATE POLICY "menus_famille_admin_write" ON public.menus_famille FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "menus_semaine_select_public" ON public.menus_semaine FOR SELECT USING (true);
CREATE POLICY "menus_semaine_admin_write" ON public.menus_semaine FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "menus_semaine_plats_select_public" ON public.menus_semaine_plats FOR SELECT USING (true);
CREATE POLICY "menus_semaine_plats_admin_write" ON public.menus_semaine_plats FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "zones_select_public" ON public.zones_livraison FOR SELECT USING (true);
CREATE POLICY "zones_admin_write" ON public.zones_livraison FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Événements : lecture publique, écriture admin
CREATE POLICY "evenements_select_public" ON public.evenements FOR SELECT USING (true);
CREATE POLICY "evenements_admin_write" ON public.evenements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Commandes : le client voit les siennes, admin voit tout
CREATE POLICY "commandes_select_own" ON public.commandes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "commandes_insert_auth" ON public.commandes FOR INSERT WITH CHECK (true);
CREATE POLICY "commandes_admin_all" ON public.commandes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "commande_lignes_select_own" ON public.commande_lignes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.commandes WHERE id = commande_id AND user_id = auth.uid())
);
CREATE POLICY "commande_lignes_insert" ON public.commande_lignes FOR INSERT WITH CHECK (true);
CREATE POLICY "commande_lignes_admin_all" ON public.commande_lignes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Réservations : le client voit les siennes
CREATE POLICY "reservations_select_own" ON public.reservations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "reservations_insert" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_admin_all" ON public.reservations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Devis : le client voit les siens
CREATE POLICY "devis_select_own" ON public.devis_traiteur FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "devis_insert" ON public.devis_traiteur FOR INSERT WITH CHECK (true);
CREATE POLICY "devis_admin_all" ON public.devis_traiteur FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contact : tout le monde peut envoyer, admin voit tout
CREATE POLICY "contacts_insert_public" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_admin_all" ON public.contacts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Newsletter : tout le monde peut s'inscrire
CREATE POLICY "newsletter_insert_public" ON public.newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_all" ON public.newsletter FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
