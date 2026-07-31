# briqx

Landing site for briqx — a software studio in Kigali, Rwanda.

React 18 · TypeScript · Vite · Tailwind CSS. No backend, no client-side router: one
static page, deployed as static files.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-checks, then writes dist/
npm run preview  # serve the built output locally
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/content.ts` | **All copy and prices.** Edit here, not in the layout files. |
| `src/sections/` | One file per page section, in the order they appear in `App.tsx` |
| `src/components/TopoField.tsx` | The animated contour background |
| `src/components/GlassSurface.tsx` | The glass panels (React Bits, ported to TypeScript) |
| `public/` | Logo assets derived from `logo.png` |

### Changing prices

Everything lives in `TIERS` and `BESPOKE` in `src/content.ts`.

- `price` is what a customer pays and is what appears everywhere on the site.
- `priceBefore` and `saving` are the promotion. They render as the struck-through
  figure and the "Save …" chip **on the price sheet only**. Delete both fields to end
  the promotion — nothing else needs touching.
- `BESPOKE` entries may omit `price` entirely and use `note` instead, for work that is
  only ever quoted after a conversation.

If you change a tier price, also check `CAPABILITIES[].meta`, the `FOOTER` packages
column, and the FAQ answers — those quote figures too.

## Deploying to Render

The repo contains `render.yaml`, so Render can configure itself:

1. Render dashboard → **New** → **Blueprint**
2. Connect this repository
3. Approve the plan — it creates a static site with:
   - Build command `npm ci && npm run build`
   - Publish directory `dist`
   - Long cache headers on `/assets/*`, no-cache on the HTML
   - Pull request previews enabled

To set it up manually instead, use the same build command and publish directory.

Node version is pinned in `.node-version`.

## Before this goes public

- [ ] **Contact links are placeholders.** The two buttons in the contact panel and the
      "Ask us on WhatsApp" link in the FAQ are `href="#"`. They need a real WhatsApp
      link (`https://wa.me/250…`) and an email or form.
- [ ] Footer navigation links are `href="#"` — point them somewhere or remove them.
- [ ] Confirm the capability matrix in `MATRIX` matches what each package really
      includes. It was derived from the packages' own wording, not from a spec.
