# Shadha perfume rebuild: implementation review

**Visual status correction:** the first visual sign-off was withdrawn after user review. The root-scoped texture variable resolved before the body-scoped colors existed, so the browser rendered flat backgrounds. Section counts and passing overflow checks did not establish visual completeness. The approved campaign revision below supersedes the earlier framed-header/split-hero description.

## Approved campaign revision

Final screenshot refinements: fragrance-note titles/descriptions now occupy separate grid rows; the story image is constrained by its content panel instead of forcing a tall intrinsic image row. `campaign-copy-checks.json` records 16 locale/viewport checks for overlapping note copy, clipped story actions and overflow. The broad responsive matrix passed 96 cases, followed by targeted checks of these final CSS refinements.

The header is now compact with an unboxed wordmark, clearly bounded search and a textured oud-tone navigation band. A new original photographic campaign spans the hero, with separate mobile composition and readable copy. Background grain is visible and resolves alongside runtime tokens. Four curated perfumes appear near the top; gift/discovery promotional banners have independent runtime state; note links include ingredient images; oud/gift features include named product cards. The repeated old hero photograph was removed from the category and story placements.

Reapplied redesign, frontend, high-end and UI/UX guidance; retained the existing extracted palette and user-approved Almarai choice. The UI/UX search's generic liquid-glass, Latin font and alternate palette suggestions were rejected; responsive hierarchy and contrast guidance were used. No new invented reference tokens were substituted.

`perfume-campaigns.mjs` passed 16 locale/width render cases plus eight banner state cases. It verifies actual background images, header height, banner destinations and hide/expire/future/empty/missing-art/feature/mobile-image behavior. `perfume-rebuild.mjs` now rejects missing computed backgrounds as well as overflow, overlapping headers, broken images and excessive inter-section gaps. Browser shopping flows and 16 accessibility scans passed after the revision. All 12 structural comparisons pass using the refreshed perfume fingerprint and the unchanged other-theme captures from this session; coffee difference is 72.7%, all others 31.8-45.5%. The 1024/1280 comparison boards were visually reviewed again.

2026-09-30. Approved storefront rebuild completed as a bilingual, fictional commerce preview. No production deployment, dashboard integration or payment connection is claimed.

## Review links and isolation

- Arabic: http://localhost:3020/ar
- English: http://localhost:3020/en
- Worktree: `D:/Full them project/worktrees/perfume-rebuild`
- Branch: `rebuild/shadha-20260930`
- Original `themes/dar-al-abeer` remains on `main`, with a clean working tree. Its implementation and deployment were not replaced.
- Old source and assets are also retained under `analysis/perfume-rebuild-2026-09-30/legacy`.

The preview server is intentionally left running on port 3020 for review. It reads the restored baseline `analysis/perfume-rebuild-2026-09-30/qa/runtime-settings.json`. The README explains independent startup without this QA fixture.

## Direction and delivered scope

Almajed informed material warmth and Arabic discovery; Abdul Samad Al Qurashi informed sector taxonomy; Reef informed varied shopping entry points and content depth. Howeyah remains the client tone anchor. Exact live token evidence and the ordered redesign/frontend/high-end/UI-UX/Dembrandt workflow are in `design/reference-perfume.md` and the approved plan. No reference logo, proprietary product photography or copy was reused.

The composition uses warm stone texture, original amber-glass imagery, rounded arches, a framed wordmark and a compact linked fragrance-note index. Twelve default homepage sections provide category, note and occasion discovery, selected products, oud, gifting, story, explicitly illustrative reviews, visible FAQ answers and capture. An optional brand section has a tested enabled state. Flat backgrounds, oversized empty sections, hidden FAQ answers and repeated generic icon-card sections were removed from the rebuild.

The complete storefront includes Arabic/English home, searchable catalog and category routes, note/family/occasion discovery, scent finder, ten product types, SKU selection, gift choices, wishlist, recent items, optional comparison, cart, demo checkout/receipt, About, Contact, FAQ and policies. Configured legacy routes redirect to useful destinations. Locale changes preserve filter/search/sort and selected SKU state.

`src/lib/schema.ts`, `catalog.ts`, `routes.ts` and `runtime.ts` define the runtime contract. `src/data` supplies explicitly fictional bilingual content. `src/components` contains the rebuilt presentation and interactions. Runtime tokens/fonts, section visibility, named product selections, social CRUD, campaign dates and feature states require no storefront rebuild. Read [RUNTIME-CONTRACT.md](RUNTIME-CONTRACT.md) for integration responsibilities.

## Verification evidence

Reports and screenshots are under `analysis/perfume-rebuild-2026-09-30/qa`. Scripts are under `tools/structure-audit`.

| Gate | Result | Evidence |
|---|---|---|
| Production compilation and TypeScript | Passed | `npm run build`, including standard WebP prebuild |
| Lint and commerce unit checks | Passed; 13 unit tests | `npm run lint`, `npm test` |
| Responsive production pages | 96 route/width cases; no reported issues or browser errors | `viewport-report.json`, `perfume-rebuild.mjs` |
| Shopping and navigation flows | 10 passed | `flows.json`, `perfume-flows.mjs` |
| Runtime settings and feature states | 9 groups passed, including social CRUD in both languages at mobile/desktop | `runtime-results.json`, `perfume-runtime.mjs` |
| Automated accessibility | 16 page/width cases; zero axe WCAG A/AA violations | `accessibility.json`, `perfume-accessibility.mjs` |
| Additional interaction and recovery checks | 7 passed | `edge-cases.json`, `perfume-edge-cases.mjs` |
| Whole-site structural diversity | All 12 comparisons passed across 22 rows | `pairwise/comparison.json`, [structural matrix](STRUCTURAL-MATRIX.md) |
| Manual visual gate | Reviewed all comparison header boards at 1024/1280, full home pages, listing/product and final optional-off screenshots | `pairwise/screenshots/comparison-*.jpg`, `final-*.png` and viewport captures |

Responsive widths: 390, 768, 1024, 1280, 1440, 1600, 1920 and 2560 CSS pixels. Checks cover home, listing, product, About, Contact, cart and checkout. Header overlap is explicitly checked. Final refinement corrected mobile wordmark overlap and strengthened muted text on tinted panels using the measured accent token. Essential content and FAQ answers remain visible without JavaScript. Directional controls mirror between locales.

Additional checks cover mobile filter sheets, brand/note search, finder empty states, failed photography, reduced motion, offscreen animation pause, resize/re-entry, legacy redirects and a 200% zoom-equivalent layout. This is automated and visual QA, not a claim of exhaustive assistive-technology certification. Local unthrottled performance observations are saved only as diagnostics, not production Core Web Vitals guarantees.

Twenty original illustrative images were encoded from approximately 48.8 MB of PNG sources to 3.51 MB of WebP. Source/output provenance and photo replacement needs are listed in [ASSETS.md](../ASSETS.md). The product gallery's second view is an honestly labelled detail crop, not another physical camera angle.

## Team feedback and delivery boundary

[TEAM-EDITS-TRACE.md](TEAM-EDITS-TRACE.md) maps all 111 historical perfume requirements to the rebuild and records delivery dependencies. Spreadsheet C2–G2 informed the work. H2 links to an abaya document and was excluded as a perfume-specific source. The original feedback report remains unchanged.

Before a merchant delivery, supply exact SKU photography, actual stock/prices and approved product claims, commercial policies, business details, real social profiles, domain and service connections. The current products, reviews and artwork are visibly illustrative. Live mode rejects preview records and missing runtime settings. Contact/newsletter/order adapters must connect to durable authenticated services; checkout does not capture cards, reserve stock or claim a real order in preview. The future shared dashboard remains a separate integration against the typed runtime contract.

Back-to-top is enabled. WhatsApp requires a real number; comparison and multi-brand are off by default but tested enabled. Empty social lists remain empty. No invented merchant accounts or unconnected-dashboard success claims are included.

## User typography correction, 2026-09-30

The user rejected the thin Arabic typography and uneven scent-finder form in the preview. Arabic now uses the already measured/licensed Almarai family for body and headings, with bold headings and field labels. English retains Plex Arabic's Latin glyphs. Both remain runtime settings. Search occupies a full row; the finder uses three equal field columns and the catalog four, with responsive reflow. Sorting, stock availability and submission have their own aligned action row. Checkbox width is explicitly bounded rather than inheriting the text-input width.

Production build and lint passed after this correction. `qa/typography-results.json` records 32 scent-finder/catalog cases across both locales and eight widths, checking font, containment, checkbox width, overlap and page overflow. `typography-form-390.png`, `typography-form-1280.png` and `typography-form-1920.png` show the revised layout. The production responsive and accessibility suites were rerun for the global font change.
