export type Metric = {
  /** Numeric target the counter animates toward. */
  value: number
  prefix?: string
  suffix?: string
  label: string
  detail: string
}

export const metrics: Metric[] = [
  {
    value: 10,
    suffix: '×',
    label: 'E2E coverage growth',
    detail: 'Playwright suite expansion in six months, while engineering output climbed.',
  },
  {
    value: 4000,
    suffix: '+',
    label: 'Test cases authored',
    detail: 'Written, organized and maintained across the full analytics product suite.',
  },
  {
    value: 400,
    suffix: '+',
    label: 'Defects documented',
    detail: 'Reproduced, triaged and tracked — plus hundreds more caught pre-release.',
  },
  {
    value: 6,
    suffix: ' yrs',
    label: 'In edtech at scale',
    detail: 'Support → QA → Test Engineering on a platform processing millions of daily data points.',
  },
]
