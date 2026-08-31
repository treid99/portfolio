export type Role = {
  title: string
  company: string
  location: string
  start: string
  end: string
  /** Rendered as the timeline's short summary line. */
  summary: string
  highlights: string[]
  stack: string[]
  current?: boolean
}

export const experience: Role[] = [
  {
    title: 'Test Engineer',
    company: 'ClassLink Inc.',
    location: 'Clifton, NJ',
    start: 'Dec 2025',
    end: 'Present',
    current: true,
    summary:
      'Turned a manual-first QA function into an automation-led testing strategy, using AI tooling to keep pace with a rapidly evolving development ecosystem.',
    highlights: [
      'Expanded the QA workflow into an automation-focused testing strategy, leveraging AI tooling to accelerate test creation, maintenance, and release validation.',
      'Built and maintained end-to-end Playwright suites, expanding coverage by more than 10× in six months while supporting increased engineering output.',
      'Created AI-assisted QA workflows with Claude multi-agent orchestration, custom skills, and MCP integrations to automate requirement analysis, test generation, execution, and reporting.',
    ],
    stack: ['Playwright', 'TypeScript', 'Claude / MCP'],
  },
  {
    title: 'Quality Assurance Analyst',
    company: 'ClassLink Inc.',
    location: 'Clifton, NJ',
    start: 'Nov 2021',
    end: 'Dec 2025',
    summary:
      'Enforced quality across the full Analytics product suite through a full-stack overhaul, including UI redesign, database migration, API refactor, and several sub-product launches.',
    highlights: [
      'Performed manual QA across the full suite of ClassLink Analytics products. Feature validation, regression testing, and post-release smoke testing over every front-end and back-end system.',
      'Developed and maintained automated end-to-end coverage using Cypress.',
      'Authored and managed 4,000+ test cases, tailored test plans for bi-weekly releases, and documented 400+ defects, preventing hundreds from reaching production.',
      'Supported a long-term full-stack overhaul including a UI redesign, a database migration, and several new product launches, safeguarding the accuracy of millions of data points.',
    ],
    stack: ['Cypress', 'JavaScript', 'TestRail', 'Jira', 'Postman'],
  },
  {
    title: 'Product Support Specialist (Tier 2)',
    company: 'ClassLink Inc.',
    location: 'Clifton, NJ',
    start: 'Aug 2020',
    end: 'Nov 2021',
    summary:
      'Front line support for school districts and IT administrators. The vantage point that still shapes how I test.',
    highlights: [
      'Provided Tier 2 support to districts and IT admins across rostering, account provisioning, authentication, analytics, admin configuration and data import/export workflows.',
      'Configured and troubleshot SSO integrations with external platforms like Canvas and Schoology using SAML, LTI and OAuth2, plus custom automation scripts when needed.',
      'Resolved complex issues alongside onboarding, product and engineering teams, and led client-facing troubleshooting sessions with district administrators and third-party vendors.',
    ],
    stack: ['SAML', 'OAuth2', 'LTI', 'Active Directory', 'Jamf School'],
  },
]

export const education = {
  /** Short form, for the compact "At a glance" card. */
  degree: 'B.S. Computer Science',
  /** Long form, for the Education entry on the timeline. */
  degreeFull: 'Bachelor of Science in Computer Science',
  school: 'Rowan University',
  location: 'Glassboro, NJ',
  date: 'May 2021',
  coursework: [
    'Data Structures & Algorithms',
    'Operating Systems',
    'Algorithm Design & Analysis',
    'Cybersecurity',
  ],
  /**
   * Named coursework projects, rendered as a bullet under Education.
   * Empty means the bullet is skipped, so add titles here to show it.
   */
  projects: [] as string[],
  extracurricular: 'NCAA Division III Football',
}

export const certifications = [
  {
    name: 'Certified Software Test Professional (Associate)',
    issuer: 'International Institute of Software Testing',
    date: 'June 2023',
  },
]
