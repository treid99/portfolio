export type SkillGroup = {
  title: string
  /** Short framing line so the grid reads as more than a keyword dump. */
  note: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Test Automation',
    note: 'Where most of my day goes — building suites that stay trustworthy as the product moves.',
    items: ['Playwright', 'Cypress', 'Mocha', 'Chai', 'Testim', 'Postman'],
  },
  {
    title: 'Languages',
    note: 'TypeScript first; the rest as the problem demands.',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'HTML/CSS', 'SQL'],
  },
  {
    title: 'AI-Assisted QA',
    note: 'Agents that read requirements, draft coverage and report back — reviewed by a human every time.',
    items: ['Claude', 'Multi-agent orchestration', 'MCP integrations', 'Custom skills', 'Cursor'],
  },
  {
    title: 'Platform & Data',
    note: 'Verifying what the UI shows against what the system actually stored.',
    items: ['Snowflake', 'Redis', 'Grafana', 'AWS CodeCommit', 'GitHub', 'VSCode'],
  },
  {
    title: 'Process & Tracking',
    note: 'Test strategy is only real once it is written down and owned.',
    items: ['TestRail', 'Jira', 'Linear', 'Confluence', 'Test strategy', 'Release validation'],
  },
  {
    title: 'Identity & Devices',
    note: 'Carried over from Tier 2 support — still useful for integration testing.',
    items: ['SAML', 'OAuth2', 'LTI', 'Active Directory', 'Azure AD', 'Jamf School'],
  },
]
