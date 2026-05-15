-- PATH: supabase/migrations/001_init.sql

-- ─── SCHEMA ──────────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS ht;

-- ─── ENUMS ───────────────────────────────────────────────────────────────────
CREATE TYPE ht.order_status AS ENUM (
  'pending_payment',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE ht.user_role AS ENUM ('b2b', 'b2c');

-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE TABLE ht.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       ht.user_role NOT NULL DEFAULT 'b2c',
  full_name  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── COMPANIES (B2B only) ─────────────────────────────────────────────────────
CREATE TABLE ht.companies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES ht.profiles(id) ON DELETE CASCADE,
  business_number TEXT NOT NULL,
  company_name    TEXT NOT NULL,
  tax_email       TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
CREATE TABLE ht.products (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku          TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL,
  price        NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  unit         TEXT NOT NULL DEFAULT 'ea',
  description  TEXT,
  image_url    TEXT,
  version      INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
CREATE TABLE ht.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id),
  status           ht.order_status NOT NULL DEFAULT 'pending_payment',
  type             ht.user_role NOT NULL,
  total_amount     NUMERIC(12, 2) NOT NULL,
  shipping_name    TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_phone   TEXT NOT NULL,
  -- B2B fields (nullable for B2C)
  business_number  TEXT,
  company_name     TEXT,
  tax_invoice_email TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
CREATE TABLE ht.order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES ht.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES ht.products(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL
);

-- ─── INVENTORY LOGS ──────────────────────────────────────────────────────────
CREATE TABLE ht.inventory_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES ht.products(id),
  delta      INTEGER NOT NULL,
  reason     TEXT NOT NULL,
  actor_id   UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ht.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON ht.products
  FOR EACH ROW EXECUTE FUNCTION ht.update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON ht.orders
  FOR EACH ROW EXECUTE FUNCTION ht.update_updated_at();

-- ─── OPTIMISTIC LOCKING: DECREMENT STOCK ─────────────────────────────────────
CREATE OR REPLACE FUNCTION ht.decrement_stock(
  p_product_id UUID,
  p_qty        INTEGER,
  p_version    INTEGER
) RETURNS VOID AS $$
DECLARE
  current_version INTEGER;
  current_stock   INTEGER;
BEGIN
  SELECT version, stock
    INTO current_version, current_stock
    FROM ht.products
   WHERE id = p_product_id
     FOR UPDATE;

  IF current_version != p_version THEN
    RAISE EXCEPTION 'VERSION_MISMATCH: product % version % expected %, got %',
      p_product_id, current_version, p_version, current_version
      USING ERRCODE = 'P0001';
  END IF;

  IF current_stock < p_qty THEN
    RAISE EXCEPTION 'INSUFFICIENT_STOCK: product % has % units, requested %',
      p_product_id, current_stock, p_qty
      USING ERRCODE = 'P0002';
  END IF;

  UPDATE ht.products
     SET stock   = stock - p_qty,
         version = version + 1
   WHERE id = p_product_id;

  INSERT INTO ht.inventory_logs (product_id, delta, reason)
  VALUES (p_product_id, -p_qty, 'order_checkout');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE ht.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ht.companies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ht.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ht.orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ht.order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ht.inventory_logs ENABLE ROW LEVEL SECURITY;

-- products: anon + authenticated can SELECT
CREATE POLICY "products_select_public"
  ON ht.products FOR SELECT
  TO anon, authenticated
  USING (true);

-- products: only service_role can INSERT/UPDATE/DELETE
CREATE POLICY "products_write_service_role"
  ON ht.products FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- profiles: users can read/update own profile
CREATE POLICY "profiles_own"
  ON ht.profiles FOR ALL
  TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- companies: B2B users can read/update own company
CREATE POLICY "companies_own"
  ON ht.companies FOR ALL
  TO authenticated
  USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- orders: authenticated users can INSERT; SELECT own orders only
CREATE POLICY "orders_insert"
  ON ht.orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_select_own"
  ON ht.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- order_items: readable if related order belongs to user
CREATE POLICY "order_items_select_own"
  ON ht.order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM ht.orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert"
  ON ht.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM ht.orders WHERE user_id = auth.uid()
    )
  );

-- inventory_logs: service_role only
CREATE POLICY "inventory_logs_service_role"
  ON ht.inventory_logs FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- ─── EXPOSE ht SCHEMA TO SUPABASE CLIENT ─────────────────────────────────────
-- Supabase by default only exposes 'public'. Add 'ht' to the search path
-- so PostgREST can query ht.* tables via the JS client.
ALTER ROLE authenticator SET search_path TO ht, public, extensions;
ALTER ROLE anon          SET search_path TO ht, public, extensions;
ALTER ROLE authenticated SET search_path TO ht, public, extensions;
ALTER ROLE service_role  SET search_path TO ht, public, extensions;
