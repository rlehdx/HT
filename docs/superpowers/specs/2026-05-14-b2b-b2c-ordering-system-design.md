# B2B/B2C Hybrid Ordering System — Design Spec
**Date:** 2026-05-14  
**Status:** Approved  

---

## 1. Vision & Scope

A production-grade ordering platform combining Amazon-level order/inventory robustness with a minimal, luxurious pink aesthetic (inspired by ht.co.kr). Supports both B2B (role-authenticated corporate buyers) and B2C (general consumers) in a single Next.js application.

**In scope:**
- Product catalog with real-time stock display
- Single checkout page with role-conditional B2B fields (tax invoice)
- Admin dashboard: inventory upload via Excel, order management
- Optimistic-locking stock decrement to prevent race conditions
- Supabase Auth with `b2b` / `b2c` user roles

**Out of scope:**
- Payment gateway integration (order creation only; payment status mocked)
- Email/SMS notifications
- Multi-vendor/marketplace features

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router, Server Components) |
| Styling | Tailwind CSS v3 + CSS Variables (design tokens) |
| Animation | Framer Motion (micro-interactions only) |
| Backend | Supabase (Auth, PostgreSQL, Realtime) |
| Excel Parse | SheetJS (xlsx) |
| Validation | Zod |
| State | Zustand (cart + order state machine) |

---

## 3. Design System

### Color Tokens (CSS Variables)
```
--color-primary   : #E91E8C   /* Deep Pink – CTA buttons only */
--color-soft      : #FFB6C1   /* Soft Pink – backgrounds, hover */
--color-accent    : #FF69B4   /* Mid Pink  – badges, tags */
--color-surface   : #FFF5F8   /* Off-white – card backgrounds */
--color-text-main : #1A1A1A   /* Charcoal  – all body text */
--color-text-sub  : #6B7280   /* Gray-500  – captions, labels */
--color-border    : #F9A8D4   /* Pink-300  – dividers */
```

### Accessibility Rules
1. Never place light pink text on white background (fails WCAG AA 4.5:1).
2. CTA buttons: `--color-primary` bg + `#FFFFFF` text only.
3. Pink backgrounds (`--color-soft`): must pair with `--color-text-main`.
4. Glassmorphism cards: `rgba(255,255,255,0.6)` bg, `backdrop-blur-md`, `1px solid rgba(249,168,212,0.4)` border.
5. Bento Grid layout on dashboard only; standard 12-col grid everywhere else.

### Core UI Components
- `<GlassCard>` — glassmorphism wrapper with Framer Motion fade-in
- `<PinkButton>` — primary CTA with ripple micro-interaction
- `<StockBadge>` — green (≥20) / yellow (1–19) / red (0) badge
- `<BentoGrid>` — CSS Grid wrapper with named areas (dashboard only)

---

## 4. Database Schema

### Tables
```
profiles          — extends Supabase auth.users; stores role ('b2b'|'b2c')
companies         — B2B company info (business_number, company_name, tax_email)
products          — SKU, name, category, price, stock, unit, description, image_url, version (optimistic lock)
orders            — user_id, status ENUM, type ('b2b'|'b2c'), total_amount, tax_invoice fields
order_items       — order_id FK, product_id FK, quantity, unit_price
inventory_logs    — audit trail: product_id, delta, reason, actor_id, created_at
```

### Order Status ENUM
```
pending_payment → processing → shipped → delivered
any state       → cancelled  (except delivered)
delivered       → refunded
```

### RLS Policies
- `anon`: SELECT on products
- `authenticated`: INSERT on orders; SELECT own orders
- `service_role`: all writes on inventory, inventory_logs

### Optimistic Locking
`decrement_stock(p_product_id UUID, p_qty INTEGER, p_version INTEGER)` — PostgreSQL function that raises exception if `version` does not match current row, preventing concurrent oversell.

---

## 5. Application Architecture

### Route Structure
```
app/
├── (store)/
│   ├── page.tsx                  ← Bento Grid homepage
│   ├── products/[slug]/page.tsx  ← Product detail
│   └── checkout/page.tsx         ← Unified checkout (B2B/B2C conditional)
├── (admin)/
│   ├── dashboard/page.tsx        ← Inventory charts + bento grid
│   └── inventory/page.tsx        ← Excel upload UI
└── api/
    ├── orders/route.ts           ← POST: create order
    ├── inventory/validate/route.ts ← POST: dry-run Excel parse
    └── inventory/commit/route.ts  ← POST: upsert products to DB
```

### Key Library Modules
```
lib/
├── excel-pipeline.ts   ← parseExcelBuffer + validateRows (SheetJS + Zod)
├── order-machine.ts    ← state transition map + transitionOrder()
└── supabase/
    ├── client.ts
    └── server.ts
hooks/
└── useRealtimeStock.ts ← Supabase Realtime → Zustand cart sync
store/
└── cart.ts             ← Zustand cart store
```

---

## 6. B2B vs B2C Checkout Flow

Single `/checkout/page.tsx` page. After Supabase session load:

| Field | B2C | B2B |
|---|---|---|
| Shipping address | ✅ | ✅ |
| Contact info | ✅ | ✅ |
| Business number | ❌ | ✅ (required) |
| Company name | ❌ | ✅ (required) |
| Tax invoice email | ❌ | ✅ (required) |

Zod schema uses `discriminatedUnion('type', [...])` to enforce B2B fields only when `type === 'b2b'`.

Order API returns `409 Conflict` with message `"Stock has been updated. Please review your cart."` on optimistic lock failure.

---

## 7. Excel Upload Pipeline

Two-step API:
1. `POST /api/inventory/validate` — parse + validate, return `{ valid: Row[], errors: RowError[] }` (dry run, no DB write)
2. `POST /api/inventory/commit` — upsert valid rows to `products` table

### Excel Column Mapping
`SKU | ProductName | Category | Price | Stock | Unit | Description | ImageURL`

### Edge Cases Handled
- Missing header row → return error listing expected columns
- `₩1,200` price format → strip with `/[^0-9.]/g`
- Duplicate SKUs → last row wins (upsert by SKU)
- Empty required fields → RowError with field + rowIndex
- Formula cells → SheetJS extracts computed value (`cellType !== 'f'` guard)

---

## 8. Real-time Stock Sync

`useRealtimeStock` hook subscribes to Supabase Realtime `products` table UPDATE events. On update:
1. If product is in Zustand cart and new stock < cart quantity → reduce cart qty to new stock
2. Show `<ToastWarning>`: `"Stock for [Product] has been updated. Your cart quantity was adjusted."`

---

## 9. Bundle / Performance Constraints

- `xlsx` (SheetJS) is **only** imported in `lib/excel-pipeline.ts` and the two inventory API routes. Never in order creation routes (cold-start bundle size concern).
- Server Components used for all data-fetching pages; Client Components isolated to interactive islands.

---

## 10. Self-Review Checklist

- [ ] WCAG AA contrast verified for all token pairs
- [ ] `decrement_stock()` raises exception + API returns 409 (not 500) on version mismatch
- [ ] All 5 Excel edge cases handled
- [ ] `xlsx` not imported in order API route
- [ ] Checkout mobile: no horizontal overflow, tap targets ≥ 44×44px
