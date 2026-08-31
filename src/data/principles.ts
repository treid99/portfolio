export type Principle = {
  index: string
  title: string
  body: string
}

/**
 * The "beyond the resume" section: how I actually approach the work.
 * Rewrite freely - this is voice, not fact.
 */
export const principles: Principle[] = [
  {
    index: '01',
    title: 'A flaky test is a broken test',
    body: 'A suite people re-run until it passes has stopped being a signal and started being a ritual. I would rather delete ten unreliable tests than let a team learn to ignore red.',
  },
  {
    index: '02',
    title: 'Test the risk, not the surface',
    body: 'Coverage percentage is a vanity metric. I weight effort toward the paths where failure is expensive — auth, rostering, data accuracy — and stay deliberately thin where it is cheap and obvious.',
  },
  {
    index: '03',
    title: 'Support taught me the failure modes',
    body: 'A year of Tier 2 escalations is the best test-design training I have had. I watched exactly how real districts break software, and I write tests for those paths before the elegant ones.',
  },
  {
    index: '04',
    title: 'AI drafts, engineers decide',
    body: 'Agents are genuinely good at reading a ticket and proposing coverage. They are not accountable for what ships. Every generated test passes through review before it earns a place in the suite.',
  },
]
