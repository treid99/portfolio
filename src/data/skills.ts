export type SkillGroup = {
  title: string
  /** Short framing line so the grid reads as more than a keyword dump. */
  note: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Test Automation',
    note: 'Automation tools, frameworks, and libraries.',
    items: ['Playwright', 'Cypress', 'Mocha', 'Chai', 'Testim', 'Postman'],
  },
  {
    title: 'Languages',
    note: 'Languages I have experience with.',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'HTML/CSS', 'SQL'],
  },
  {
    title: 'AI-Assisted QA',
    note: 'Agentic engineering tools and concepts put into practice.',
    items: ['Claude', 'Multi-agent orchestration', 'MCP integrations', 'Custom skills', 'Cursor'],
  },
  {
    title: 'Platform & Data',
    note: 'Commonly used developer platforms.',
    items: ['Snowflake', 'Grafana', 'AWS CodeCommit', 'GitHub', 'VSCode'],
  },
  {
    title: 'Process & Tracking',
    note: 'Documentation and collaboration.',
    items: ['TestRail', 'Jira', 'Linear', 'Confluence', 'Test strategy', 'Release validation'],
  },
  {
    title: 'Identity & Devices',
    note: 'Authentication, identity, and admin configuration.',
    items: ['SAML', 'OAuth2', 'LTI', 'Active Directory', 'Azure AD', 'Jamf School'],
  },
]
