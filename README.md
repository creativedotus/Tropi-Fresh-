# TropiFresh – Homepage Mockup

Static, responsive, SEO-friendly homepage mockup for **TropiFresh** (tropical fruit store).
Plain HTML + CSS + JavaScript, no build step and no dependencies.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` by double-click also works.)

## Project structure

```
index.html            page markup, meta tags, JSON-LD structured data
css/style.css         all styles (design tokens are CSS variables at the top)
js/main.js            hero slider, bestsellers slider, cart, menus, newsletter
assets/img/*.webp     transparent fruit cut-outs (mango, pineapple, dragon, mangosteen, papaya, passion, kiwi, gift platter)
assets/fonts/         self-hosted Bricolage Grotesque + Figtree (SIL OFL licence)
assets/og-image.jpg   social share image (1200×630)
assets/favicon.svg
robots.txt, sitemap.xml
```

## What is interactive

- Hero slider: 7 fruits with glossy colour changes, auto-play, arrows, thumbnails, swipe.
- Explore panels: hover (desktop) or tap (mobile) to expand a category.
- Customer favorites: non-stop scrolling slider; hover pauses it and pops the card up.
- Build-your-own fruit box: pick fruits with +/−, the crate fills up (max 12), live total with the 10% first-order discount, adds the box to the cart.
- Cart panel and a demo checkout with payment options (card, PayPal, Apple Pay / Google Pay, cash on delivery).

## Payments

The checkout is a **front-end demo only**: nothing is charged and no card data is stored or sent anywhere.
For real payments use a payment gateway on the live store (for example Stripe or PayPal through WooCommerce) and replace the demo form.

## Changing things

- **Images:** replace the files in `assets/img/` keeping the same file names (transparent WebP/PNG cut-outs, about 560 px on the long side). If the file extension changes, update the `src` values in `index.html`.
- **Hero fruits, colours and prices:** edit the `FRUITS` list at the top of `js/main.js`. The order must match the `<img class="fr">` order inside `.stage` in `index.html`.
- **Speeds:** `HERO_MS` (time per hero fruit) and the box limits `BOX_MAX`, `BOX_MIN`, `FIRST_ORDER` at the top of `js/main.js`. The bestsellers scroll speed is the `52s` value in `@keyframes`/`.mt` in `css/style.css`; hero transition speeds are in `.fr` and `.bgl`.
- **Brand colours:** `--brand` and the other variables in `:root` at the top of `css/style.css`.
- **Domain:** the canonical URL, Open Graph URLs, sitemap and JSON-LD currently use `https://blue-elk-470481.hostingersite.com/`. Search and replace it with the final domain before launch.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: TropiFresh homepage mockup"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Optional preview hosting: repo **Settings → Pages → Deploy from branch → main / root**.

## Notes

- This is a front-end mockup. Buttons that point to other pages (Shop, Blog, Track Order…) show a small notice instead of navigating; the cart, filters, sliders, menus and newsletter form are working demos.
- The WordPress/Elementor build can reuse the same layout, colours and animations. The cart and products here are demo data, not WooCommerce.
- Fruit photos are cut-outs from client-supplied images. Placeholder logo is a text wordmark; add the real logo file when available.
