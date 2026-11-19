# Markix website

The marketing site for Markix (markix.app). It is a static site with no build step: plain HTML, CSS and JavaScript.

## What's here

    public/                   everything published on markix.app
      index.html              page markup and copy
      css/styles.css          all styling: colours, type, layout, phone rules
      js/main.js              behaviour: animations, the "Ask Markix" demo, the contact form
      favicon.svg / .ico      the logo icon (browser tab and Google results)
      logo.png, icon-*.png, apple-touch-icon.png, site.webmanifest   logo sizes for Google, phones and sharing
      sitemap.xml             page list for search engines (submitted in Google Search Console)
      robots.txt              crawler rules; points to the sitemap
    wrangler.jsonc            Cloudflare settings: which Worker to deploy to, and to publish public/
    README.md                 this file

## View it locally

Serve the `public` folder (opening `public/index.html` directly also works in most desktop browsers):

    python3 -m http.server 8000 --directory public

then go to http://localhost:8000.

Note: a phone's file preview does not run scripts, so the "Every channel has a
limit" slider looks empty there. Use a real browser or the live site.

## Deploy (Cloudflare)

The live site is the Cloudflare Worker `mute-paper-4276`, with markix.app as its
custom domain. It is connected to this GitHub repository: every push to `main`
deploys automatically (Cloudflare runs `npx wrangler deploy`, which publishes
the `public` folder, as set in `wrangler.jsonc`). Pushes to other branches build
a preview version without changing the live site.

1. Change files under `public/` and push to `main` (or merge a pull request).
2. In the Cloudflare dashboard, Workers & Pages, `mute-paper-4276`, Deployments,
   watch the build finish; the new version is live about a minute later.
3. Check https://markix.app/sitemap.xml and https://markix.app/robots.txt show
   the files' text, not a blank page.

If you add a page, add its address to `public/sitemap.xml` and update `<lastmod>`.

## Contact form

The form posts to Formspree. The endpoint is set near the bottom of
`public/js/main.js`:

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myewzwqz';

If a submission fails, the page shows the visitor a ready-made message to email
to contact@markix.app, so a lead is not lost. Submissions are managed in the
Formspree dashboard.

The form only sends from a hosted copy of the site. Opened as a local file, it
may fall back to the copy-and-email message.

## Editing

- Text: edit the HTML in `public/index.html` directly.
- Colours and fonts: the `:root` block at the top of `public/css/styles.css`.
  The font (Inter Tight) loads from Google Fonts in the `<head>` of `public/index.html`.
- "Ask Markix" answers: the `A` object in `public/js/main.js`. They are real
  outputs from the Markix tool (`run_mmm.py --ask`) on its demo brand, shortened.
- Example figures (the ₹1,000 sale, the result cards) come from fictional demo
  brands with known results, as the footer says.
- Logo: `public/favicon.svg` is the source. If you change it, regenerate the PNG
  sizes and `favicon.ico` from it.
