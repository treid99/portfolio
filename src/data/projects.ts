/** One screenshot in a case-study gallery. */
export type Screenshot = {
  /** Path under /public, without the deploy base prefix. */
  src: string
  alt: string
  caption: string
  /** Intrinsic pixel size, so a card reserves its space before the file loads. */
  w: number
  h: number
  /** Spans the full grid width — for the lead shot of a group. */
  wide?: boolean
  /** Portrait capture: letterboxed in its card rather than cropped to fill it. */
  phone?: boolean
}

/** A titled run of screenshots, e.g. "Public site" vs "Dashboard". */
export type GalleryGroup = { heading: string; shots: Screenshot[] }

export type Project = {
  /** URL segment: /projects/<slug> */
  slug: string
  title: string
  /** One-line hook shown on the card. */
  blurb: string
  /** Longer framing shown at the top of the case-study page. */
  summary?: string
  year: string
  status: 'Active' | 'Maintained' | 'Archived' | 'Experiment'
  /**
   * Who it was built for. Sits beside the status chip so a reader can tell
   * a side project from work at a glance, without inferring it from the copy.
   */
  kind: 'Personal' | 'Professional'
  /**
   * Public source. Absent for work projects, which have no repository to
   * link: the pages and cards drop the button rather than linking nowhere.
   */
  repo?: string
  demo?: string
  tags: string[]
  /**
   * Captioned screenshots, the body of /projects/<slug>.
   *
   * Absent means the project has no page behind it: `hasGallery` is then
   * false, so the card shows as plain text and /projects/<slug> falls through
   * to the 404 page rather than rendering a title above nothing.
   */
  gallery?: GalleryGroup[]
  /**
   * Replaces the default line above the gallery — for saying why a set of
   * captures is partial, e.g. when the rest show data that cannot be shared.
   */
  galleryNote?: string
}

/**
 * PROJECTS
 *
 * Replace example copies and the `repo` URLs with real repositories.
 * Add or delete entries freely: the projects grid and every
 * /projects/:slug route are generated from this array.
 */
export const projects: Project[] = [
  {
    slug: 'agentic-qa-dashboard',
    title: 'Agentic QA Dashboard',
    blurb:
      'A QA control room. Import tickets, draft and execute test plans, report the results. Run root-cause analysis on a known defect and post it to Linear. Agent-driven, source-backed, human in the loop.',
    summary:
      'A local-first QA dashboard that runs in two directions. One reads a ticket’s requirements against the application’s own source code and returns a test plan I can edit before it executes in a real browser; the other takes a short defect description and investigates it against that same code before drafting the ticket. Every step streams as it runs, token spend included, and nothing reaches a live ticket until I approve it.',
    year: '2026',
    status: 'Active',
    kind: 'Professional',
    tags: ['Next.js 15', 'TypeScript', 'Claude Agent SDK', 'MCP', 'Playwright', 'SQLite'],
    galleryNote:
      'Given this is a work tool, potentially sensitive information has been redacted.',
    gallery: [
      {
        heading: 'Ticket to verdict',
        shots: [
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-01-tickets.png',
            alt: 'The ticket queue: a filtered list of QA-ready tickets, each row showing whether a plan and a run exist for it.',
            caption:
              'The ticket queue: a filtered list of QA-ready tickets, each row showing whether a plan and a run exist for it.',
            w: 2880,
            h: 1800,
            wide: true,
          },
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-02-ticket-plan.png',
            alt: 'A generated test plan open in an editor, each step typed as a scenario and an expectation. Each step is individually mutable.',
            caption:
              'A generated test plan open in an editor, each step typed as a scenario and an expectation. Each step is individually mutable.',
            w: 2880,
            h: 1800,
          },
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-03-run-execution.png',
            alt: 'Test execution streams its results in real-time, each step with its own pass or fail badge, the observed values, and a screenshot if warranted.',
            caption:
              'Test execution streams its results in real-time, each step with its own pass or fail badge, the observed values, and a screenshot if warranted.',
            w: 2880,
            h: 1800,
          },
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-04-run-verdict.png',
            alt: 'A finished run headed “conditionally passed”, with the posted ticket comment above the step-by-step evidence.',
            caption:
              'A finished run leads with a verdict: passed, conditionally passed, failed, or inconclusive. Above the evidence sits a proposed comment that publishes to the Linear ticket, which I read and approve before publishing.',
            w: 2880,
            h: 1800,
          },
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-07-runs.png',
            alt: 'The runs list: every execution with its ticket, environment, outcome, and start time.',
            caption:
              'Runs: every execution keeps its steps, screenshots, and agent transcript as artifacts. A whole plan can be re-run, or only the steps that failed, and artifacts age out on a customizable retention window.',
            w: 2880,
            h: 1800,
          },
        ],
      },
      {
        heading: 'Defect to ticket',
        shots: [
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-05-cases.png',
            alt: 'The investigation list: reported defects with environment, workflow status, agent verdict, and the ticket each one became.',
            caption:
              'Investigate: describe a bug you noticed and an agent works backwards from the claim, validates it against the code, and reproduces it. Each case carries a verdict of confirmed, not reproduced, or needs more information.',
            w: 2880,
            h: 1800,
            wide: true,
          },
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-06-case-detail.png',
            alt: 'Investigation details: the observable evidence to back a claim, and a generated ticket draft.',
            caption:
              'A confirmed defect drafts its own ticket, built from the evidence captured. I can edit the draft inline, or re-prompt the agent.',
            w: 2880,
            h: 1800,
          },
        ],
      },
      {
        heading: 'What the agents read, and what it costs',
        shots: [
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-10-repos.png',
            alt: 'The repos view: a read-only listing of every connected repository in the context folder, with its description and last pull.',
            caption:
              'The repos view: a read-only listing of every connected repository in the context folder, with its description and last pull.',
            w: 2880,
            h: 1800,
            wide: true,
          },
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-08-stats.png',
            alt: 'The stats view: usage and cost totals per kind of agent action, above a twelve-month token trend chart.',
            caption:
              'Stats shows a cumulative view of token usage and estimated dollar cost for every plan, execution, investigation, and draft.',
            w: 2880,
            h: 1800,
          },
          {
            src: 'assets/projects/agentic-qa-dashboard/showcase-09-settings.png',
            alt: 'The settings page showing a setup checklist, and a theme toggle.',
            caption:
              'A settings page to configure project dependencies.',
            w: 2880,
            h: 1800,
          },
        ],
      },
    ],
  },
  {
    slug: 'wedding-website-demo',
    title: 'Wedding Website Demo',
    blurb:
      'A proof-of-concept wedding platform. A public-facing guest site plus a couple’s dashboard to manage RSVPs, seating, registry, meal choices, and more.',
    summary:
      'A wedding site in two halves: an eight-page public site for guests, and a private dashboard where the couple manages the guest list, seating, registry and page content. Inspired by true frustrations with existing commercial options.',
    year: '2026',
    status: 'Active',
    kind: 'Personal',
    repo: 'https://github.com/treid99/Wedding-Website-Demo',
    tags: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind v4', 'SQLite', 'Playwright'],
    gallery: [
      {
        heading: 'Public site',
        shots: [
          {
            src: 'assets/projects/wedding-website-demo/01-home-hero.png',
            alt: 'Wedding site home page with a hero photograph and a live countdown.',
            caption:
              'Home: a crossfading photo carousel, a live countdown to the day, and quick links.',
            w: 1440,
            h: 900,
            wide: true,
          },
          {
            src: 'assets/projects/wedding-website-demo/09-rsvp-lookup.png',
            alt: 'RSVP lookup asking for a single guest name.',
            caption:
              'RSVP, step one: a guest types their name.',
            w: 1440,
            h: 900,
          },
          {
            src: 'assets/projects/wedding-website-demo/10-rsvp-party.png',
            alt: 'RSVP form listing every guest in a resolved invitation.',
            caption:
              'RSVP, step two: the whole invitation group resolves, then collects attendance, meal choice, and dietary notes per person.',
            w: 1440,
            h: 2482,
          },
          {
            src: 'assets/projects/wedding-website-demo/08-registry.png',
            alt: 'Registry grid with search, filter, and sort controls.',
            caption:
              'Registry: browse gifts with filters for keyword search, item availability, store, and price. Sorting and pagination all live in the URL, so any view is shareable and survives the back button.',
            w: 1440,
            h: 3459,
          },
          {
            src: 'assets/projects/wedding-website-demo/03-gallery.png',
            alt: 'Photo gallery.',
            caption:
              'Photo gallery.',
            w: 1440,
            h: 3006,
          },
          {
            src: 'assets/projects/wedding-website-demo/04-gallery-lightbox.png',
            alt: 'Photo gallery lightbox.',
            caption:
              'Photo gallery lightbox.',
            w: 1440,
            h: 900,
          },
          {
            src: 'assets/projects/wedding-website-demo/02-story.png',
            alt: 'Chaptered story page with a fictional story.',
            caption:
              'Our Story: a chaptered story page with alternating imagery, editable from the dashboard.',
            w: 1440,
            h: 4699,
          },
          {
            src: 'assets/projects/wedding-website-demo/06-travel.png',
            alt: 'Travel page with a map, written directions, and the hotel room block.',
            caption:
              'Travel page with a map, written directions, and the hotel room block.',
            w: 1440,
            h: 4134,
          },
          {
            src: 'assets/projects/wedding-website-demo/05-schedule.png',
            alt: 'Three-day wedding schedule.',
            caption:
              'Schedule detailing three days of wedding events.',
            w: 1440,
            h: 4268,
          },
          {
            src: 'assets/projects/wedding-website-demo/07-faq.png',
            alt: 'Question and answer page.',
            caption:
              'Q&A page, customizable from the dashboard.',
            w: 1440,
            h: 3586,
          },
          {
            src: 'assets/projects/wedding-website-demo/18-mobile-home.png',
            alt: 'The wedding home page as seen on mobile devices.',
            caption:
              'The wedding home page as seen on mobile devices.',
            w: 414,
            h: 896,
            phone: true,
          },
        ],
      },
      {
        heading: 'Couple’s dashboard',
        shots: [
          {
            src: 'assets/projects/wedding-website-demo/12-admin-dashboard.png',
            alt: 'Admin dashboard with headcounts, a meal breakdown, and progress cards.',
            caption:
              'Dashboard: headcounts, meal breakdown, seating and registry progress, recent RSVP notes, and dietary restrictions.',
            w: 1440,
            h: 2099,
            wide: true,
          },
          {
            src: 'assets/projects/wedding-website-demo/13-admin-guests.png',
            alt: 'Guest list table with inline editing and filters.',
            caption:
              'Guests: a flat list with inline editing.',
            w: 1440,
            h: 3088,
          },
          {
            src: 'assets/projects/wedding-website-demo/14-admin-groups.png',
            alt: 'Invitation groups view of the same guest list.',
            caption:
              'Groups: the same guests seen as invitation groups.',
            w: 1440,
            h: 6125,
          },
          {
            src: 'assets/projects/wedding-website-demo/15-admin-seating.png',
            alt: 'Drag-and-drop seating chart with tables and a pool of unseated guests.',
            caption:
              'Seating: drag-and-drop seating chart with tables and a pool of unseated guests.',
            w: 1440,
            h: 3016,
            wide: true,
          },
          {
            src: 'assets/projects/wedding-website-demo/16-admin-registry.png',
            alt: 'Registry management screen with purchase state.',
            caption:
              'Registry management: mark an item purchased and it dims on the public page, or add and remove items as you wish.',
            w: 1440,
            h: 3740,
          },
          {
            src: 'assets/projects/wedding-website-demo/17-admin-content.png',
            alt: 'Content editor for page copy, schedule, Q&A and photos.',
            caption:
              'Content: page copy, schedule of events, Q&A, hotels, and which photos appear in the gallery and hero, all editable without touching code.',
            w: 1440,
            h: 6440,
          },
        ],
      },
    ],
  },
  {
    slug: 'playwright-e2e-framework',
    title: 'Playwright E2E Framework',
    blurb:
      'The end-to-end suite behind ClassLink Analytics. Over 500 tests spanning the product, built on a page object model, ensuring a regression is caught before a release goes out rather than after.',
    year: '2026',
    status: 'Active',
    kind: 'Professional',
    tags: ['Playwright', 'TypeScript', 'CI', 'Fixtures'],
  },
]

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

/** A project whose screenshots exist, so the detail page has a body to render. */
export type Illustrated = Project & { gallery: NonNullable<Project['gallery']> }

/**
 * Whether a project has a page to open. Some entries exist to be listed and
 * nothing more — work I can name but not show — so they render as a plain
 * card and own no route.
 */
export const hasGallery = (project: Project): project is Illustrated =>
  Boolean(project.gallery?.length)
