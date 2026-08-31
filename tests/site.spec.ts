import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { site } from '../src/data/site'

/**
 * Smoke coverage for the portfolio. The point is not exhaustive assertion —
 * it is that a bad deploy (broken route, missing resume, dead theme toggle)
 * fails CI instead of a recruiter's browser.
 */

// Paths are relative on purpose: baseURL already carries the /portfolio/ base,
// and a leading slash would discard it.

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('')
  })

  test('renders the hero with name and role', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: site.name })).toBeVisible()
    await expect(
      page.getByText(site.role, { exact: true }).first(),
    ).toBeVisible()
  })

  test('every main section is present', async ({ page }) => {
    for (const id of ['experience', 'skills', 'projects', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })

  test('metric counters settle on their final values', async ({ page }) => {
    const metrics = page.locator('.metrics__value')
    await page.locator('.metrics').scrollIntoViewIfNeeded()
    await expect(metrics.first()).toHaveText('10×', { timeout: 5000 })
    await expect(metrics.nth(1)).toHaveText('4,000+')
  })

  test('the page has exactly one h1', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
    await page.reload()
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
})

test.describe('theme', () => {
  test('toggles, and the choice survives a reload', async ({ page }) => {
    await page.goto('')
    const html = page.locator('html')
    const before = await html.getAttribute('data-theme')

    await page.getByRole('button', { name: /switch to (light|dark) theme/i }).click()
    const after = before === 'dark' ? 'light' : 'dark'
    await expect(html).toHaveAttribute('data-theme', after)

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', after)
  })
})

test.describe('resume downloads', () => {
  for (const file of ['ThomasReid_Resume_2026.pdf', 'ThomasReid_Resume_2026.docx']) {
    test(`${file} is served`, async ({ request, baseURL }) => {
      const res = await request.get(new URL(file, baseURL).toString())
      expect(res.status()).toBe(200)
      expect(Number(res.headers()['content-length'] ?? 1)).toBeGreaterThan(0)
    })
  }

  // The menu is portalled to <body>, so it is not a descendant of the trigger.
  const resumeMenu = (page: Page) => page.getByRole('menu')

  test('the hero resume button opens a menu with both formats', async ({ page }) => {
    await page.goto('')
    const trigger = page.locator('.hero__cta .resume-dl__trigger')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await trigger.click()

    const menu = resumeMenu(page)
    await expect(menu.getByRole('menuitem', { name: /PDF/ })).toHaveAttribute(
      'href',
      /ThomasReid_Resume_2026\.pdf$/,
    )
    await expect(menu.getByRole('menuitem', { name: /DOCX/ })).toHaveAttribute(
      'href',
      /ThomasReid_Resume_2026\.docx$/,
    )
  })

  /** Regression: the hero clips its overflow, so the menu must escape it. */
  test('the open menu is not clipped by the section below it', async ({ page }) => {
    await page.goto('')
    await page.locator('.hero__cta .resume-dl__trigger').click()

    const menu = resumeMenu(page)
    const box = (await menu.boundingBox())!
    // Every corner of the menu must belong to the menu, not to whatever
    // paints over it — the "Updated" line sits on the bottom edge.
    const corners = [
      { x: box.x + 4, y: box.y + 4 },
      { x: box.x + box.width - 4, y: box.y + box.height - 4 },
    ]
    for (const point of corners) {
      const owned = await page.evaluate(
        (p) => document.elementFromPoint(p.x, p.y)?.closest('.resume-dl__menu') != null,
        point,
      )
      expect(owned).toBe(true)
    }
  })

  test('the resume menu closes on Escape', async ({ page }) => {
    await page.goto('')
    const trigger = page.locator('.hero__cta .resume-dl__trigger')
    await trigger.click()
    await expect(resumeMenu(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(resumeMenu(page)).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})

test.describe('routing', () => {
  test('opens a project case study and can come back', async ({ page }) => {
    await page.goto('')
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.locator('.project__link', { hasText: 'Agentic QA Dashboard' }).click()

    await expect(page).toHaveURL(/\/projects\/agentic-qa-dashboard$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Agentic QA Dashboard')

    await page.getByRole('link', { name: 'All projects' }).click()
    await expect(page).toHaveURL(/\/#projects$/)
  })

  test('an unknown URL renders the 404 page rather than a blank screen', async ({ page }) => {
    await page.goto('no-such-page')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('404 Not Found')
  })

  test('a bad project slug falls through to the 404 page', async ({ page }) => {
    await page.goto('projects/does-not-exist')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('404 Not Found')
  })

  test('a listed project with no screenshots is not a link and owns no route', async ({ page }) => {
    await page.goto('')
    await page.locator('#projects').scrollIntoViewIfNeeded()

    const card = page.locator('.project', { hasText: 'Playwright E2E Framework' })
    await expect(card).toBeVisible()
    await expect(card.locator('.project__link')).toHaveCount(0)
    await expect(card.getByText('See more')).toHaveCount(0)

    await page.goto('projects/playwright-e2e-framework')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('404 Not Found')
  })
})

test.describe('accessibility basics', () => {
  test('every image has alt text', async ({ page }) => {
    await page.goto('')
    for (const img of await page.locator('img').all()) {
      expect(await img.getAttribute('alt')).toBeTruthy()
    }
  })

  test('the skip link is the first thing keyboard focus reaches', async ({ page }) => {
    await page.goto('')
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
  })

  test('external links do not leak the opener', async ({ page }) => {
    await page.goto('')
    for (const link of await page.locator('a[target="_blank"]').all()) {
      expect(await link.getAttribute('rel')).toContain('noopener')
    }
  })
})

test.describe('reduced motion', () => {
  test('content is visible without any animation having to run', async ({ page }) => {
    // Emulated on the page rather than via test.use so the preference is set
    // explicitly before the first navigation.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('')

    // Reveals render in place rather than waiting for a scroll trigger.
    await expect(page.locator('#contact .contact__panel')).toBeVisible()
    await expect(page.locator('#contact .contact__panel')).toHaveCSS('opacity', '1')

    // Counters show their final value without needing to be scrolled to.
    await expect(page.locator('.metrics__value').first()).toHaveText('10×')

    // The pipeline shows a completed pass instead of looping.
    await page.locator('.pipeline').scrollIntoViewIfNeeded()
    await expect(page.locator('.pipeline__verdict')).toBeVisible()
  })
})
