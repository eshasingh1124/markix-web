# Markix website

The marketing site for Markix (markix.app). It is a static site with no build step: plain HTML, CSS and JavaScript.

## What's here

    index.html        page markup and copy
    css/styles.css    all styling: palette, type, layout, responsive rules
    js/main.js        behaviour: scroll highlights, the channel slider, the contact form
    README.md         this file

## View it locally

Serve the folder (opening `index.html` directly also works in most desktop browsers):

    python3 -m http.server 8000

then go to http://localhost:8000.

Note: a phone's file preview does not run scripts, so the "Every channel has a
limit" slider looks empty there. Use a real browser or the live site.

## Deploy (Cloudflare)

The live site is a Cloudflare project with markix.app as its custom domain.

1. In the Cloudflare dashboard, open Workers & Pages and pick the project.
2. Create a new deployment and upload the whole folder (or a zip of it), keeping
   the `css` and `js` folders next to `index.html`.
3. The address stays the same; the new version is live in about a minute.

## Contact form

The form posts to Formspree. The endpoint is set near the bottom of
`js/main.js`:

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myewzwqz';

If a submission fails, the page shows the visitor a ready-made message to email
to contact@markix.app, so a lead is not lost. Submissions are managed in the
Formspree dashboard.

The form only sends from a hosted copy of the site. Opened as a local file, it
may fall back to the copy-and-email message.

## Editing

- Text: edit the HTML in `index.html` directly.
- Colours and fonts: the palette is the `:root` block at the top of
  `css/styles.css`. Fonts load from Google Fonts in the `<head>` of `index.html`.
- Sample figures (the channel table, the proof numbers and the slider curves)
  come from a fictional demo brand. The slider's curve values are in the `CH`
  array in `js/main.js`.
