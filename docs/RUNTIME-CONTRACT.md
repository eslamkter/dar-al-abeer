# Shadha store document and delivery contract

This is a customer-hosted Next.js storefront. It does not create a dashboard or connect the old generic product editor to the new models. The future shared Next.js/Supabase dashboard should write the validated store document through the adapter below.

## Settings loading

`src/lib/schema.ts` is the executable contract. `src/data/preview.ts` is the fictional seed, not a production database. `getStore()` in `src/lib/runtime.ts` reads and validates settings once per request; there is no cross-request build cache.

1. `SHADHA_STORE_FILE`: absolute JSON path, useful for customer-hosted file adapters and local verification.
2. Otherwise, `SHADHA_STORE_URL`: HTTPS JSON endpoint with optional server-only `SHADHA_STORE_TOKEN` bearer credential. Fetch uses `no-store` and an eight-second timeout.
3. With no configured source, the explicit fictional preview is used. Set `SHADHA_MODE=live` for delivery: a missing source or a preview document then fails closed. A configured source that is invalid/unavailable never falls back to preview.

Export a complete example with `npx tsx scripts/export-preview.ts preview-settings.json`. Update file settings atomically (write a temporary file, then rename, retrying transient Windows sharing violations). Never expose tokens through public environment variables. `preview-settings.json` contains no credentials or customer data.

Design tokens and per-language heading/body font choices become request-time CSS variables. Font family names must be in the supplied font registry; hosted font assets must already exist. Typography changes between registered fonts require no build. All page copy, product relations, home sections, named product selections, scheduled visibility and social entries come from the document.

## Catalog and commerce

Ten discriminated models: perfume, oil, oud, bakhoor, maamoul, home spray, diffuser, burner, gift set, discovery set. Each has its own required details and SKU dimensions. Burner dimensions are numeric centimetres; liquids have millilitres; oud/incense have grams; tablets also have piece count. Missing origin/performance/grade data stay absent rather than being invented.

Matching variants drive filter boundaries, sorting, card image/price, stock, PDP selection and unit pricing. `?sku=` preserves the selected option. Sizes accept typed values such as `ml:50` or `g:50`; previous numeric size links remain understood. Filters, sort, search and SKU survive Arabic/English switching.

Optional SKU discounts use `compareAt`, `offerStartsAt` and `offerEndsAt`. Expired/not-yet-started offers resolve to the reference price on every request. Campaign visibility has its own start/end dates; hiding a campaign alone does not change a SKU price. No resetting countdowns or fabricated bestseller/sales counts.

`quote()` validates every line, gift restrictions, sample limits and combined inventory demands. Gift-set component SKUs compete with individually purchased SKUs for the same stock. Prices supplied by a browser are never trusted. A changed server quote returns 409. Unknown delivery fees block confirmation instead of becoming free shipping. Tax-exclusive live checkout is blocked until a proper tax adapter is supplied.

Cart, wishlist, recent history and comparisons are stored under a versioned per-store/per-mode browser key. Comparison allows up to three of the same product type and displays the specific card size and unit price. Adding a different type starts a new comparison. Preview receipts are stored locally without customer contact/address fields. They are not live orders, payment records or inventory reservations.

## Services

`SHADHA_CONTACT_URL`, `SHADHA_NEWSLETTER_URL`, `SHADHA_CHECKOUT_URL` and server-only `SHADHA_SERVICE_TOKEN` connect the respective service adapters. The document's matching `services` flag must also be enabled. A disabled live form is omitted. Missing/failing receivers never return success.

Adapters accept JSON by authenticated HTTPS POST. They must return `{"accepted":true,"reference":"durable-reference"}` only after recording the request. Checkout forwards the `Idempotency-Key`; the receiving order service must enforce durable idempotency, transact/revalidate inventory, calculate its authoritative tax/shipping and implement any payment flow. This storefront does not capture cards or claim that unconnected payments work. Production authentication, rate limiting, persistence, mail delivery and fulfilment belong to those services.

In preview mode the API validates input/quote and returns a clearly identified local demo acknowledgment. Nothing is sent externally. Retry/error states keep the user's inputs/cart. Checkout receipts explicitly state that no money was collected and no stock reserved.

## Social settings and optional modes

Preview update: `sampleSocials` is enabled in the default theme demonstration. `previewSocialProfiles` supplies independently enabled, ordered, bilingual sample icons (Instagram, Snapchat, TikTok, X and Facebook). Samples are unlinked and visibly labelled; they appear only in preview mode when no valid configured real profiles exist. Empty sample lists stay empty. Real `socialProfiles` take precedence. The existing live-mode guard still rejects `sampleSocials: true`.

`socialProfiles` is the merchant's ordered list. Each entry has its own stable ID, supported platform, URL, bilingual accessible label and `enabled` flag. Disabling retains details; deletion removes the record; re-adding is supported. Icon definitions are independent of this list. X accepts legacy Twitter URLs; Facebook is supported. Unsupported hosts, script URLs, bare platform homepages and empty lists produce no linked icons. Optional unlinked sample icons require both `preview` and `sampleSocials`, with a visible sample label.

`features` independently enables multi-brand, gifts, samples, wishlist, recent, compare and scent finder. `floating` independently controls utilities. A real non-placeholder WhatsApp number is necessary. Back-to-top is on by default. Empty/disabled/expired sections have no wrappers or reserved spacing. Multi-brand mode adds published brand routes, a configured identity strip and brand filtering; QA supplies two fictional brands to verify this enabled path.

## Publication

### Campaign and background configuration

`background.texture` and `background.size` select the repeatable mineral texture at request time. The derived `--paper` variable resolves on `body`, alongside runtime color tokens. Defining it on `:root` before those colors exist invalidates it. The audit now checks computed backgrounds, not merely source declarations.

Homepage sections accept `kind: "promotions"` with a `banners` collection. Each banner has its own ID, bilingual title/body/action, destination, desktop image, optional mobile image, image position, visibility, start/end dates and optional gifts/samples requirement. Hidden, future, expired, missing-art and unavailable-destination entries are omitted. Empty banner sections collapse. Array order determines placement. Discounts are not inferred from artwork: numerical offers must also be configured in actual SKU pricing/commerce rules.

The default banners promote gifting and discovery sets without a fabricated discount or countdown. The photographic hero promotes the signature collection. Oud and gift editorials render explicitly named product selections alongside their content.

Product media can configure `fallbackSrc` and bilingual `fallbackAlt` for an honestly related illustrative replacement. If both sources fail, the gallery displays a labelled unavailable state while product details remain usable. The fallback must never be described as an exact SKU photograph when it is not one.

Preview is noindex and has an empty sitemap. Live robots, sitemap, metadata and Product/Offer schema resolve at request time. Arbitrary filters/search and functional pages are noindex. Product schema uses actual SKU availability, including set components, and contains no fabricated ratings.

Two old fictional product slugs remain. Retired product slugs redirect to their relevant note/family discovery pages, not to a different SKU pretending to be the old one. The mapping lives in `src/data/legacy-redirects.ts` and is copied into runtime settings. Customer deployment needs a merchant-approved URL migration inventory.

Before live delivery, supply real inventory and exact photos, commercial policies, brand/contact/social details, origin and claims where appropriate, an indexable real domain, and connected production services. The validator rejects preview product/media/review records in live mode. Merely changing a flag is not a delivery process.
