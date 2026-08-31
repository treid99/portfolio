/**
 * Single source of truth for identity + links.
 * Edit here; every component reads from this file.
 */
export const site = {
  name: 'Thomas Reid',
  shortName: 'Tom Reid',
  role: 'Test Engineer',
  roleShort: 'Test Engineer',
  location: 'New Jersey',
  email: 'treid1409@gmail.com',

  /** One-liner used in the hero. */
  tagline:
    'Building the automation and test strategy that lets engineers ship fast without regressions.',

  /** Longer positioning statement — hero sub-copy. */
  intro:
    'Six years inside a single education-technology platform, moving from the support queue to the test bench: first learning exactly how software fails in customers’ hands, then building the systems that stop it from failing at all.',

  resume: {
    pdf: 'ThomasReid_Resume_2026.pdf',
    docx: 'ThomasReid_Resume_2026.docx',
    updated: 'Updated 2026',
  },

  socials: [
    { label: 'GitHub', href: 'https://github.com/treid99', handle: '@treid99' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/thomas-reid-36a249186',
      handle: 'in/thomas-reid-36a249186',
    },
  ],
} as const

export const nav = [
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
] as const
