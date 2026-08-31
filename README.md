# Portfolio — Thomas Reid

Personal portfolio site for a Test Engineer.
Static, free to host, and deployed to GitHub Pages by GitHub Actions.

**Live:** https://treid99.github.io/portfolio/

---

## Stack

| Piece | Choice | Why |
| --- | --- | --- |
| Build | [Vite](https://vite.dev) 7 | Instant dev server; compiles to plain static files, which is all Pages can serve. |
| UI | React 19 + TypeScript | Typed components, and the data files stay decoupled from the markup. |
| Motion | [motion.dev](https://motion.dev) (`motion/react`) | Small, hardware-accelerated, and honours `prefers-reduced-motion`. |
| Routing | React Router 7 | Real URLs for the project case studies rather than `#` fragments. |
| Tests | Playwright | Smoke coverage on desktop and mobile, run in CI on every push. |

No paid services. Public repos get unlimited GitHub Actions minutes and free
Pages hosting, so the running cost of this site is zero.

---

## Local development

```sh
npm install
npm run dev        # http://localhost:5173/portfolio/
```

Other scripts:

```sh
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ on :4173, exactly as Pages will
npm run typecheck  # tsc only
npm test           # Playwright suite (builds and previews automatically)
npm run test:ui    # Playwright's interactive runner
```

First time running tests on a new machine:

```sh
npx playwright install chromium
```

---

## Editing the content

Almost nothing needs a component change. The copy lives in `src/data/`:

| File | Contents |
| --- | --- |
| `src/data/site.ts` | Name, role, location, email, tagline, **social links**, resume filenames. |
| `src/data/experience.ts` | Roles, bullet points, tech tags, education, certifications. |
| `src/data/skills.ts` | Toolkit groups. |
| `src/data/projects.ts` | **Projects and their case-study pages.** |

### Things to replace before sharing the link

Search the repo for `PLACEHOLDER` — every spot that needs your input is marked.

1. **Project repos** — `src/data/projects.ts`. Each entry needs a real `repo`
   URL and real case-study copy. Adding or deleting an entry automatically
   updates both the projects grid and the `/projects/:slug` routes.

### Swapping the resume

The PDF and DOCX live in `public/` — that is the only copy, so there is
nothing to keep in sync. Replace them there and, if you rename them, update
`site.resume` in `src/data/site.ts`. Every resume button on the site is the
same `ResumeDownload` dropdown (hero, nav, mobile sheet, "At a glance" card in
Experience),
so both formats stay reachable from one place; the contact panel keeps its
plain PDF · DOCX links.

### Photos

`public/assets/portrait.jpg` (hero, 4:5) and `public/assets/venice-wide.jpg`
(unused since the Beyond Work page was retired) are compressed derivatives of
originals kept outside the repo. Keep new images under ~200 KB.

---

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which typechecks,
builds, and publishes `dist/` to Pages.

**One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment**, and set **Source** to **GitHub Actions**. Without that, the
workflow will build but nothing will go live.

### If you change the repo name or add a domain

The base path is set in one place, `BASE` in `vite.config.ts`, and everything
else derives from it via `import.meta.env.BASE_URL`.

- Repo renamed to `treid99.github.io` → set `BASE = '/'`.
- Custom domain → set `BASE = '/'` and add `public/CNAME` containing the
  domain.

Also update the absolute URLs in `index.html` (`og:url`, `og:image`),
`public/robots.txt`, `public/sitemap.xml`, and `baseURL` in
`playwright.config.ts`.

### Deep links on Pages

Pages has no server-side rewrite, so `/projects/agentic-qa-dashboard` would normally
404. The `spaFallback` plugin in `vite.config.ts` copies `index.html` to
`404.html` at build time, and Pages serves that for unknown paths — React
Router then renders the right route.

---

## Tests

`tests/site.spec.ts` runs against the real production build in Chromium and a
mobile viewport. It covers the hero and section structure, the animated
counters reaching their final values, theme toggling and persistence, both
resume files returning 200, project and 404 routing, and a few accessibility
basics (single `h1`, alt text everywhere, skip link focus order,
`rel="noopener"` on external links).

`.github/workflows/test.yml` runs the suite on every push and pull request and
uploads the HTML report as an artifact.

---

## Accessibility and motion

Every animation is gated on `prefers-reduced-motion`: reveals render
statically, counters show their final value immediately, and the pipeline
diagram displays a completed pass instead of looping.

Both themes are defined as CSS custom properties in `src/styles/tokens.css`.
The theme follows the OS until the visitor picks one, after which the choice
persists in `localStorage`. An inline script in `index.html` applies it before
first paint so a reload never flashes the wrong theme.

---

## Local git identity

This repo uses a repo-local git identity so it stays separate from any work
account configured globally on this machine:

| Setting | Value |
| --- | --- |
| `user.name` | Tom Reid |
| `user.email` | `treid99@users.noreply.github.com` |
| `credential.username` | `treid99` |
| `origin` | `https://treid99@github.com/treid99/portfolio.git` |

Verify before committing:

```sh
git config user.email   # -> treid99@users.noreply.github.com
```
