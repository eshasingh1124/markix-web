# Markix website

The marketing site for Markix (markix.app). It is one static page with no build step.

## What's here

    index.html    the whole site: markup, styles and script in one file
    README.md     this file

## View it locally

Open `index.html` in a desktop browser, or serve the folder:

    python3 -m http.server 8000

then go to http://localhost:8000.

Note: a phone's file preview does not run scripts, so the "Every channel has a
limit" slider looks empty there. Use a real browser or the live site.

## Deploy (Cloudflare)

The live site is a Cloudflare project with markix.app as its custom domain.

1. In the Cloudflare dashboard, open Workers & Pages and pick the project.
2. Create a new deployment and upload `index.html` (or a zip containing it).
3. The address stays the same; the new version is live in about a minute.

## Contact form

The form posts to Formspree. The endpoint is set near the bottom of
`index.html`:

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myewzwqz';

If a submission fails, the page shows the visitor a ready-made message to email
to contact@markix.app, so a lead is not lost. Submissions are managed in the
Formspree dashboard.

The form only sends from a hosted copy of the site. Opened as a local file, it
may fall back to the copy-and-email message.

## Editing

- Text: edit the HTML in `index.html` directly.
- Colours: the palette is the `:root` block at the top of the `<style>` section.
- Sample figures (the channel table, the proof numbers and the slider curves)
  come from a fictional demo brand. The slider's curve values are in the `CH`
  array in the script.
