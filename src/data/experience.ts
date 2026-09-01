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
    title: 'Test Engineer (IC2)',
    company: 'ClassLink Inc.',
    location: 'Clifton, NJ',
    start: 'Dec 2025',
    end: 'Present',
    current: true,
    summary:
      'Turned a manual-first QA function into an automation-led testing strategy, using AI tooling to keep pace with a rapidly evolving development ecosystem.',
    highlights: [
      'Transformed the QA workflow into an automation-focused testing strategy by leveraging AI tooling to accelerate test creation, maintenance, and release validation across the rapidly evolving development ecosystem.',
      'Built, maintained, and executed end-to-end tests in Playwright, vastly expanding automated test coverage while supporting increased engineering output.',
      'Created AI-assisted QA workflows using Claude multi-agent orchestration, custom skills, and MCP integrations to automate requirement analysis, test generation, execution, and reporting.',
      'Accelerated and improved bug investigations and root-cause analysis by precisely identifying defects within source code and delivering detailed, actionable reports.',
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
      'Performed manual QA testing across the full suite of ClassLink Analytics products, including feature validation, regression testing, and post-release sanity testing covering all front-end and back-end systems.',
      'Developed and maintained automated end-to-end test coverage using Cypress.',
      'Authored and managed over 4,000 test cases, tailored test plans for bi-weekly releases, documented over 400 defects, and prevented hundreds more from reaching production.',
      'Supported a long-term full stack overhaul including a UI redesign, database migration, and several new product launches while ensuring a consistently high-quality user experience and data accuracy.',
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
      'Provided Tier 2 technical support to school districts and IT administrators for issues related to rostering, account provisioning, authentication, analytics, admin configuration, and data imports/exports.',
      'Configured and troubleshot SSO integrations connecting to external ed-tech vendors using SAML, LTI, and OAuth2 protocols, and custom automated scripts for seamless access.',
      'Resolved complex technical issues in collaboration with onboarding and engineering teams, and led client-facing troubleshooting sessions with district administrators and third-party vendors.',
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
