import { chromium } from '/Users/huuto/data/projects/portfolio_mono/node_modules/playwright/index.mjs'
import path from 'node:path'

const baseURL = 'http://portfolio.local'
const dist = path.resolve('dist')
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ headless: true, executablePath: chrome })
const failures = []

function check(condition, message) {
  if (!condition) failures.push(message)
}

async function contextFor(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options })
  await context.route('http://portfolio.local/**', async (route) => {
    const url = new URL(route.request().url())
    const file = url.pathname.startsWith('/assets/')
      ? path.join(dist, url.pathname.slice(1))
      : path.join(dist, 'index.html')
    await route.fulfill({ status: 200, path: file })
  })
  return context
}

const context = await contextFor()
const page = await context.newPage()
page.on('pageerror', (error) => failures.push(`page error: ${error.message}`))
page.on('console', (message) => {
  if (message.type() === 'error') failures.push(`console error: ${message.text()}`)
})

await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
await page.locator('.primary-cta').click()
await page.waitForTimeout(150)
check(await page.locator('.transition-layer--fan').count() === 1, 'home -> works did not select fan')
check(await page.locator('.transition-fan line[style*="visible"]').count() > 0, 'fan ribs were not visible while opening')
await page.waitForTimeout(230)
check(await page.locator('.works-page').count() === 1, 'fan did not swap to works under cover')
await page.waitForTimeout(340)
check(await page.locator('.transition-layer--fan').count() === 0, 'fan did not finish')

await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
await page.locator('.primary-cta').click()
await page.waitForTimeout(70)
await page.locator('.global-nav__link[href="/about"]').click()
check(new URL(page.url()).pathname === '/about', 'navigation was blocked during a running transition')
await page.waitForTimeout(620)
check(await page.locator('.about-page').count() === 1, 'interrupted transition did not land on latest route')

await page.locator('.global-nav__link[href="/contact"]').click()
await page.waitForTimeout(90)
await page.goBack()
await page.waitForTimeout(620)
check(new URL(page.url()).pathname === '/about', 'popstate during transition did not restore URL')
check(await page.locator('.about-page').count() === 1, 'popstate during transition did not restore page')

await page.goto(`${baseURL}/works`, { waitUntil: 'networkidle' })
await page.locator('.work-row').nth(2).hover()
await page.waitForTimeout(20)
check(await page.locator('.preview-media-swap__out').count() === 1, 'preview replacement did not retain outgoing frame')
await page.waitForTimeout(150)
check(await page.locator('.preview-media-swap__out').count() === 0, 'preview replacement exceeded 150ms')
await page.locator('.work-row').nth(2).click()
check(new URL(page.url()).pathname === '/works/quoridor-ai', 'works -> detail URL was not immediate')
await page.waitForTimeout(40)
check(await page.locator('.transition-shared-frame').count() === 1, 'works -> detail did not create shared frame')
check(await page.locator('[data-transition-media].is-transition-target').count() === 1, 'detail target was not held behind shared frame')
await page.waitForTimeout(570)
check(await page.locator('.transition-shared-frame').count() === 0, 'shared frame did not finish')

await page.locator('.detail-breadcrumb a').click()
check(new URL(page.url()).pathname === '/works', 'detail -> works URL was not immediate')
await page.waitForTimeout(40)
check(await page.locator('.transition-layer--expand-reverse').count() === 1, 'detail -> works did not select reverse expand')
await page.waitForTimeout(570)
check(await page.locator('.work-row.is-selected strong').textContent() === 'コリドールAI', 'returning to works lost the selected work')

await page.goto(`${baseURL}/works/tsukuyomi`, { waitUntil: 'networkidle' })
await page.locator('.prev-next a').last().click()
await page.waitForTimeout(100)
check(await page.locator('.route-stage--flip-out').count() === 1, 'detail -> detail did not flip outgoing paper')
await page.waitForTimeout(220)
check(await page.locator('.route-stage--flip-in').count() === 1, 'detail -> detail did not flip incoming paper')
await page.waitForTimeout(260)
check(new URL(page.url()).pathname === '/works/aiment', 'detail flip landed on wrong work')

await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
const initialOffset = await page.locator('.hero-progress-arc').evaluate((element) => getComputedStyle(element).strokeDashoffset)
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.55))
await page.waitForTimeout(50)
const scrolledOffset = await page.locator('.hero-progress-arc').evaluate((element) => getComputedStyle(element).strokeDashoffset)
check(initialOffset !== scrolledOffset, 'hero INPUT -> OUTPUT arc did not follow scroll')
await page.locator('.domains').scrollIntoViewIfNeeded()
await page.waitForTimeout(50)
check(await page.locator('.domain-map li.is-active').count() === 1, 'scene 2 did not expose exactly one active role')
const domainDrawBefore = await page.locator('.domains').evaluate((element) => getComputedStyle(element).getPropertyValue('--scene-progress'))
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.35))
await page.waitForTimeout(50)
const domainDrawAfter = await page.locator('.domains').evaluate((element) => getComputedStyle(element).getPropertyValue('--scene-progress'))
check(Number(domainDrawAfter) > Number(domainDrawBefore), 'scene 2 geometry lines did not advance with scroll')

await page.locator('.breadth').scrollIntoViewIfNeeded()
await page.waitForTimeout(50)
const breadthBefore = await page.locator('.breadth-item').last().evaluate((element) => getComputedStyle(element).transform)
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.35))
await page.waitForTimeout(50)
const breadthAfter = await page.locator('.breadth-item').last().evaluate((element) => getComputedStyle(element).transform)
check(breadthAfter !== breadthBefore, 'scene 3 activity panels did not place themselves with scroll')

await page.locator('.exit-scene').scrollIntoViewIfNeeded()
await page.waitForTimeout(50)
const exitBefore = await page.locator('.exit-link').first().evaluate((element) => getComputedStyle(element).transform)
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.25))
await page.waitForTimeout(50)
const exitAfter = await page.locator('.exit-link').first().evaluate((element) => getComputedStyle(element).transform)
check(exitAfter !== exitBefore, 'scene 4 split panels did not open with scroll')

await page.goto(`${baseURL}/works`, { waitUntil: 'networkidle' })
await page.locator('.work-row').first().focus()
await page.keyboard.press('ArrowDown')
await page.keyboard.press('ArrowDown')
check(await page.locator('.work-row[aria-current="true"] strong').textContent() === 'コリドールAI', 'keyboard row movement lost aria-current')
await page.keyboard.press('Enter')
await page.waitForTimeout(80)
check(await page.locator('.work-detail h1').evaluate((element) => element === document.activeElement), 'detail h1 did not receive focus at commit')
await page.keyboard.press('Escape')
await page.waitForTimeout(80)
check(new URL(page.url()).pathname === '/works', 'Escape did not return from detail to works')
check(await page.locator('.works-page h1').evaluate((element) => element === document.activeElement), 'works h1 did not receive focus after Escape')
check(await page.locator('.work-row[aria-current="true"] strong').textContent() === 'コリドールAI', 'Escape return lost list selection')

await context.close()

const reducedContext = await contextFor({ reducedMotion: 'reduce' })
const reduced = await reducedContext.newPage()
await reduced.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
await reduced.locator('.primary-cta').click()
check(await reduced.locator('.works-page').count() === 1, 'reduced motion did not switch immediately')
check(await reduced.locator('.transition-layer[class*="transition-layer--"]').count() === 0, 'reduced motion created a transition run')
await reduced.locator('.work-row').first().click()
check(await reduced.locator('.work-detail').count() === 1, 'reduced motion did not immediately open a detail')
await reduced.locator('.prev-next a').last().click()
check(new URL(reduced.url()).pathname === '/works/aiment', 'reduced motion did not immediately switch details')
await reduced.locator('.global-nav__link[href="/about"]').click()
check(await reduced.locator('.about-page').count() === 1, 'reduced motion did not immediately open about')
await reduced.locator('.global-nav__link[href="/contact"]').click()
check(await reduced.locator('.contact-page').count() === 1, 'reduced motion did not immediately open contact')
check(await reduced.locator('.transition-layer[class*="transition-layer--"]').count() === 0, 'reduced motion created a later transition run')
await reducedContext.close()

const mobileContext = await contextFor({ viewport: { width: 390, height: 844 }, hasTouch: true })
const mobile = await mobileContext.newPage()
for (const route of ['/', '/works', '/works/tsukuyomi', '/about', '/contact', '/missing-page']) {
  await mobile.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
  const layout = await mobile.evaluate(() => ({
    pathname: window.location.pathname,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    undersizedTargets: Array.from(document.querySelectorAll('a, button, input, textarea, select')).filter((element) => {
      const rect = element.getBoundingClientRect()
      const intentionallyHidden = element.classList.contains('skip-link') && element !== document.activeElement
      return !intentionallyHidden && rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)
    }).map((element) => element.textContent?.trim()).filter(Boolean),
  }))
  check(layout.overflow <= 1, `390px ${route} overflows horizontally by ${layout.overflow}px`)
  check(layout.undersizedTargets.length === 0, `390px ${route} has undersized targets: ${layout.undersizedTargets.join(', ')}`)
}
await mobile.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
await mobile.locator('.primary-cta').tap()
await mobile.waitForTimeout(920)
check(await mobile.locator('.works-page').count() === 1, '390px fan did not land on works')
await mobile.locator('.work-row').first().tap()
await mobile.waitForTimeout(580)
check(await mobile.locator('.work-detail').count() === 1, '390px list tap did not open detail')
await mobileContext.close()

await browser.close()
console.log(JSON.stringify({ failures }, null, 2))
if (failures.length) process.exitCode = 1
