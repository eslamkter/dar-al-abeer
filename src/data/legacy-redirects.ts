// Retired fictional products lead to the relevant discovery page, not to a
// different bottle presented as the same SKU. Oud royale / amber nights remain.
export const legacyRedirects = Object.fromEntries(
  Object.entries({
    "rose-damascena": "/notes/rose",
    "citrus-breeze": "/notes/bergamot",
    "white-musk": "/notes/musk",
    "saffron-luxe": "/notes/saffron",
    "midnight-oud": "/perfumes/oud",
    "royal-amber": "/notes/amber",
    "jasmine-nights": "/families/floral",
    "lemon-verbena": "/families/fresh",
    "vanilla-dusk": "/notes/vanilla",
    "cambodian-oud": "/perfumes/oud",
    "pink-peony": "/families/floral",
    "aqua-marine": "/families/fresh",
    "musk-tahara": "/notes/musk",
    "cedar-wood": "/notes/cedar",
    "orange-blossom": "/families/floral",
    "silk-musk": "/notes/musk",
    "imperial-saffron": "/notes/saffron",
    "fresh-bergamot": "/notes/bergamot",
  }).map(([slug, target]) => ["/products/" + slug, target]),
);
