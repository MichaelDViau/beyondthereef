# Beyond the Reef Mexico — beyondthereefmexico.com

Static marketing site for Beyond the Reef Mexico, a private-tour company in
the Riviera Maya. No build step, no framework — every page is a standalone
HTML file that can be served directly from any static host or CDN.

## Project structure

```
/                          HTML pages (served at the site root — these URLs
│                          are canonical, indexed and listed in sitemap.xml,
│                          so they must stay at the root)
├── index.html             Home: hero slideshow, experiences slider, reviews, contact
├── welcome.html           Language-selection splash (noindex, animated canvas)
├── tours.html             All experiences (card grid + "build your own" CTA)
├── tour-*.html            One page per experience (12 pages, shared template)
├── reviews.html           All guest reviews
├── our-story.html         About the company
├── build-your-experience.html  11-step custom-experience builder form
│
├── robots.txt             Crawl rules (welcome.html excluded)
├── sitemap.xml            All indexable URLs
│
└── assets/
    ├── css/
    │   ├── global.css     Loaded by EVERY page: performance/stability rules,
    │   │                  focus styles, lightbox styles (markup injected by tour.js)
    │   └── tour.css       Shared stylesheet for all tour-*.html pages
    │                      (design system + photo slider + booking card)
    ├── js/
    │   ├── site.js        Loaded by every page: nav bar, mobile menu, scroll reveal
    │   ├── perf.js        Loaded by every page: lazy-loading/hydration of
    │   │                  data-src images & iframes, promo widget
    │   ├── tour.js        Tour pages only: photo slider, fullscreen lightbox,
    │   │                  booking form (configured per page via window.BTR_TOUR)
    │   └── i18n.js        Translations (en/fr/es/de/it/pt) applied via
    │                      data-i18n attributes; zero-flash boot sequence
    ├── img/               Site imagery (logo, welcome-page logo)
    ├── indexslider/       40 hero slideshow photos (home page)
    ├── tour-sliders/      Photo-slider galleries, one folder per experience
    └── Tourcardsprivate/  Card thumbnails used on home/tours pages and as
                           og:image previews
```

`indexslider/`, `tour-sliders/` and `Tourcardsprivate/` keep their historical
names and paths on purpose: the files are referenced by absolute URLs in
`og:image` tags and schema.org metadata that are already indexed by search
engines and social scrapers. Don't rename or move them.

## Page architecture

Each page follows the same pattern:

1. **i18n boot snippet** (first lines of `<head>`) — reads the preferred
   language from `localStorage` and hides the body until translations apply,
   so non-English visitors never see an English flash.
2. **SEO/social metadata** — canonical URL, Open Graph, Twitter cards and
   schema.org JSON-LD (organization, product, trip, breadcrumbs, FAQ).
3. **Fonts** — Google Fonts (Montserrat) loaded asynchronously via
   `rel="preload"` with a `<noscript>` fallback.
4. **Styles** — `assets/css/global.css` everywhere; tour pages add
   `assets/css/tour.css`; page-specific styles stay inline in that page to
   keep first paint free of extra blocking requests.
5. **Body** — sections are marked with `<!-- ============ ... -->` banners.
6. **Scripts** (all `defer`) — `site.js`, page-specific code, `perf.js`,
   then the i18n apply snippet.

### Tour pages

All 12 `tour-*.html` pages share `tour.css` + `tour.js`. The only
page-specific script is the booking configuration:

```html
<script>
window.BTR_TOUR = {
  name: "Sea Turtles & Cenote Experience",   // booking email subject/body
  pricing: {1:340, 2:218, ...}               // USD per person by group size
};                                           // empty {} = price on request
</script>
```

To add a new tour page: copy an existing one, update the metadata, photos,
copy and `BTR_TOUR` config, then add the URL to `sitemap.xml`.

## Booking & forms

Bookings and the experience-builder form submit via
[FormSubmit](https://formsubmit.co) (AJAX, no backend) to
`info@beyondthereefmexico.com`. No payment is collected on the site.

## Images

All photos are JPEG, capped at 1920px on the longest edge (the maximum size
ever displayed: fullscreen hero/lightbox), progressive, quality 82. When
adding new photos, match those constraints. Image hydration is handled by
`perf.js` — give below-the-fold images `data-src` instead of `src` and they
lazy-load automatically.
