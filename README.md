# Rwaqan — Landing Page

A fast, modern, SEO- and CRO-optimized marketing site for **Rwaqan (رواقان)**, the Egyptian
marketplace app for shopping local stores and brands with delivery.

Static site — no build step. Just host the folder (or open `index.html`).

## Files
```
index.html              English home — markup + SEO meta + JSON-LD
ar/index.html           Arabic (RTL) home
b/                      Merchant store interstitial (`/b/{id}`)
.well-known/            Apple AASA + Android Digital Asset Links
vercel.json             Rewrites for `/b/:id` + well-known content types
privacy/                Privacy Policy (EN)
ar/privacy/             سياسة الخصوصية
terms/                  Terms of Service (EN)
ar/terms/               الشروط والأحكام
delete-account/         Account deletion page for Google Play (EN)
ar/delete-account/      صفحة حذف الحساب
styles.css              Design system + legal page styles + RTL
script.js               Mobile nav, scroll reveals, FAQ accordion
site.webmanifest        PWA manifest
robots.txt              Crawl + sitemap pointer
sitemap.xml             Sitemap with hreflang (en / ar / x-default)
assets/                 Favicons, logos, social image
```

## Merchant QR deep links (M1)
- **Link contract:** `https://rawqan-landing.vercel.app/b/{id}`
  - Optional preview query (from Provider share): `?n={name}` and/or `?c={coverUrl}`
  - QR payload is the HTTPS URL only (no Firebase Dynamic Links).
- **Customer store URLs used on the interstitial:**
  - Google Play: `https://play.google.com/store/apps/details?id=com.rwaqan.customer`
  - App Store: `https://apps.apple.com/eg/app/rwaqan/id6739463193`
- **Association files** (must be live on the same host):
  - `/.well-known/apple-app-site-association` — team `7U37S34SQ4`, bundle `com.armjld.rwqanCustomer`, paths `/b/*`
  - `/.well-known/assetlinks.json` — package `com.rwaqan.customer`
- **SHA-256 fingerprint placeholder (blocks Android App Links until set):**
  `.well-known/assetlinks.json` still contains `REPLACE_WITH_PLAY_APP_SIGNING_SHA256`.
  Do **not** invent a fingerprint. Replace it with the real value from:
  1. [Play Console](https://play.google.com/console) → app `com.rwaqan.customer`
  2. **App integrity** → **App signing** → **App signing key certificate** → SHA-256
  3. Paste colon-separated or continuous hex as Play shows it (Digital Asset Links accepts both)
  4. Redeploy Landing (`vercel --prod` from this folder)
  5. Verify: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://rawqan-landing.vercel.app&relation=delegate_permission/common.handle_all_urls`
  Optional: also add your **upload key** SHA-256 for local/debug APKs.
  Until this is set, Android will open the browser interstitial instead of the app; iOS AASA is unaffected.
- **M1b deferred handoff:** the interstitial copies `https://rawqan-landing.vercel.app/b/{id}` to
  the clipboard on load / store-badge tap, and Play badges include
  `referrer=utm_source=qr&utm_medium=store&utm_content={id}`. The Customer app consumes clipboard
  + Install Referrer once after splash when no live App Link arrived.
- Store user docs are not publicly readable in Firestore; the interstitial shows a branded
  fallback and uses optional `n` / `c` query params when the Provider app includes them.
  Without `n`/`c`, copy explains the storefront and still shows the store id.

## Languages
- English at `/` and Arabic at `/ar/`, cross-linked with the header language pill and
  `hreflang` tags. The Arabic page is right-to-left (`dir="rtl"`) and uses the Cairo webfont.
- The shared `styles.css` uses CSS logical properties, so both directions share one stylesheet.

## What's already real (pulled from the app source)
- **Brand name, logo & colors** — green `#019B1A`, gold `#FEBA22`, from the Customer app assets.
- **Product story** — browse & buy from stores and brands; cart with stock checks; wishlist;
  search & sorting; discount vouchers; deliver-now/scheduled; order tracking & history;
  maps & addresses; push notifications; Arabic/English; Google/Apple/email sign-in.
- **Payments** — Cash on Delivery + online card (Visa/Mastercard) via **Kashier**.
- **Seller side** — product management; order flow (new → accepted → ready → out for delivery →
  delivered); courier handoff; order commission; in-app wallet (deposit/withdraw).
- **Market** — Egypt, EGP pricing.
- **Google Play links** — wired to the real package IDs:
  - Shoppers: `com.rwaqan.customer`
  - Sellers: `com.rwaqan.seller`

## Google Play — account deletion URL
Use: `https://rwaqan.com/delete-account/` (Arabic: `/ar/delete-account/`).

## ⚠️ Before going live — replace these placeholders
1. **Domain** — all `https://rwaqan.com/` references (canonical, OG, hreflang, sitemap, robots,
   JSON-LD). Swap for the production domain if different.
2. **Support email** — pages currently use the app contact email
   (`khazeen.elbait.alex@gmail.com`). Swap for a branded address if you have one.
3. **Social profiles** — add them to the footer if they exist.

## SEO notes
- Unique `<title>` + meta description, canonical, robots directives.
- Open Graph + Twitter card with a 1200×630 social image (`assets/og-image.jpg`).
- JSON-LD: `Organization`, `WebSite`, `MobileApplication`, `FAQPage`.
- `hreflang` set for `en` / `ar` / `x-default` — an Arabic version can live at `/ar/`
  (set `<html lang="ar" dir="rtl">`; the CSS already uses logical properties and has RTL hooks).
- Semantic headings (single `h1`), descriptive alt text, skip link, keyboard-focusable.

## CRO notes
- Primary CTA ("Get the app" / store badges) repeated in nav, hero, and closing band.
- Sticky header keeps the CTA in reach; mobile hamburger for small screens.
- Trust signals up high: payment methods, bilingual, Egypt-wide delivery.
- Clear 3-step "how it works" and a dedicated seller CTA for the two-sided marketplace.
