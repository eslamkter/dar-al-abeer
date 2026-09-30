# Shadha perfume & incense storefront

Original bilingual theme rebuild, approved 2026-09-30. Next.js 16 / React 19, TypeScript and Zod. This is a customer-hosted storefront preview; no dashboard, payment service or production merchant database is claimed.

## Run

```powershell
npm ci
npm run dev -- --port 3020
```

Open `/ar` or `/en`. Production: `npm run build` then `npm run start -- --port 3020`. `npm test` runs commerce/data invariants; `npm run lint -- src` checks the application. `npm run images` updates optimized WebP assets and also runs automatically before builds.

## Runtime settings

See [the integration contract](docs/RUNTIME-CONTRACT.md). To edit the preview without a rebuild:

```powershell
npx tsx scripts/export-preview.ts preview-settings.json
$env:SHADHA_STORE_FILE=(Resolve-Path preview-settings.json).Path
npm run start -- --port 3020
```

A configured source failure is an error, never a fallback to demo inventory. Live mode requires explicit merchant settings and rejects illustrative assets/reviews. Never put service credentials in public environment variables.

## Structure

- `src/data`: complete bilingual preview document and editorial copy.
- `src/lib/schema.ts`: ten discriminated product types and runtime store validation.
- `src/lib/catalog.ts`: matching-SKU search, availability, scheduled prices and cart quotation.
- `src/lib/runtime.ts`: per-request file/HTTPS settings adapter.
- `src/components`: original storefront composition and focused client interactions.
- `src/app`: localized routing, metadata, APIs, robots and sitemap.
- `assets/source` / `public/images`: original generated artwork and optimized output. See [ASSETS.md](ASSETS.md).
- `tests/catalog.test.ts`: variant boundaries, stock aggregation, sets, coupons, publication and URL contracts.

Repeatable Playwright scripts live in the workspace's `tools/structure-audit`: `perfume-rebuild.mjs`, `perfume-flows.mjs`, `perfume-runtime.mjs`, `perfume-pairwise.mjs`. Evidence is in `analysis/perfume-rebuild-2026-09-30/qa`. The runtime script intentionally edits its isolated fixture and restores it afterward; do not run it against a merchant's settings.

The original theme remains at `themes/dar-al-abeer`, unchanged. This checkout is `worktrees/perfume-rebuild`, branch `rebuild/shadha-20260930`. Earlier source, artwork manifest and demo assets were preserved under the workspace analysis archive. Retired fictional URLs have an explicit discovery-page redirect map.

The preview uses made-up inventory and clearly labelled illustrative media/reviews. Merchant-accurate photography, policies, stock, domain, contact details and connected services are required before live delivery.