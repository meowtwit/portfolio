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

await context.close()

const reducedContext = await contextFor({ reducedMotion: 'reduce' })
const reduced = await reducedContext.newPage()
await reduced.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
await reduced.locator('.primary-cta').click()
check(await reduced.locator('.works-page').count() === 1, 'reduced motion did not switch immediately')
check(await reduced.locator('.transition-layer[class*="transition-layer--"]').count() === 0, 'reduced motion created a transition run')
await reducedContext.close()

await browser.close()
console.log(JSON.stringify({ failures }, null, 2))
if (failures.length) process.exitCode = 1
