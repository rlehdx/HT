# HAE Ordering Platform

B2B/B2C hybrid ordering system built with Next.js 14, Supabase, and a minimal pink design system.

## Prerequisites

- Node.js 20+
- Supabase CLI (`npm install -g supabase`)
- A Supabase project (free tier works)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API (secret) |

### 3. Run Database Migration

Link to your Supabase project and push the migration:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Or for local development with Docker:

```bash
npx supabase start
npx supabase db push
```

### 4. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|---|---|
| `/` | Homepage with product bento grid |
| `/products/[sku]` | Product detail + add to cart |
| `/checkout` | Unified B2B/B2C checkout (requires auth) |
| `/dashboard` | Admin bento dashboard |
| `/inventory` | Admin Excel upload UI |

## B2B vs B2C

Users are assigned a `role` (`b2b` or `b2c`) in the `profiles` table via Supabase Auth. B2B users see additional tax invoice fields at checkout (business registration number, company name, billing email).

## Inventory Upload

1. Navigate to `/inventory`
2. Upload an `.xlsx` file with columns: `SKU, ProductName, Category, Price, Stock, Unit, Description, ImageURL`
3. Click **Validate** to dry-run (no DB changes)
4. Review the validation report, then click **Commit** to upsert products

## Key Design Decisions

- **Optimistic locking**: `decrement_stock()` PostgreSQL function raises an exception on version mismatch → API returns `409 Conflict` with message "Stock has been updated. Please review your cart."
- **Bundle isolation**: `xlsx` (SheetJS) is never imported in order API routes — only in inventory routes and the excel pipeline lib — keeping cold-start bundle lean
- **Realtime stock**: Supabase Realtime subscription on `products` table auto-adjusts cart quantities and shows toast warnings when stock drops below cart quantity

## Design System

Pink design tokens defined in `app/globals.css` as CSS variables, extended in `tailwind.config.ts`:

| Token | Color | Usage |
|---|---|---|
| `--color-primary` | #E91E8C | CTA buttons only |
| `--color-soft` | #FFB6C1 | Backgrounds, hover states |
| `--color-accent` | #FF69B4 | Badges, tags |
| `--color-surface` | #FFF5F8 | Card backgrounds |
| `--color-text-main` | #1A1A1A | All body text |
| `--color-text-sub` | #6B7280 | Captions, labels |
| `--color-border` | #F9A8D4 | Dividers |
