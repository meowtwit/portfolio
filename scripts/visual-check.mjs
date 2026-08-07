import { chromium } from '/Users/huuto/data/projects/portfolio_mono/node_modules/playwright/index.mjs'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const baseURL = 'http://portfolio.local'
const output = path.resolve('artifacts/screenshots')
const dist = path.resolve('dist')
await mkdir(output, { recursive: true })

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ headless: true, executablePath: chrome })
const errors = []
const results = []

async function existingFile(candidate) {
  try {
    return (await stat(candidate)).isFile()
  } catch {
    return false
  }
}

async function installStaticRoute(context) {
  await context.route('http://portfolio.local/**', async (route) => {
    const url = new URL(route.request().url())
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '')
    const direct = path.join(dist, relative || 'index.html')
    const nested = path.join(dist, relative, 'index.html')
    const file = await existingFile(direct)
      ? direct
      : await existingFile(nested)
        ? nested
        : path.join(dist, 'index.html')
    await route.fulfill({ status: 200, path: file })
  })
}

async function capture(context, name, route, fullPage = true) {
  const page = await context.newPage()
  page.on('pageerror', (error) => errors.push(`${name}: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${name}: console ${message.text()}`)
  })
  page.on('requestfailed', (request) => errors.push(`${name}: request failed ${request.url()} ${request.failure()?.errorText ?? ''}`))
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
  if (!response?.ok()) errors.push(`${name}: HTTP ${response?.status()}`)
  const layout = await page.evaluate(() => ({
    title: document.title,
    height: document.documentElement.scrollHeight,
    overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    hashLinks: Array.from(document.querySelectorAll('a[href="#"]')).length,
  }))
  if (layout.overflow > 1) errors.push(`${name}: horizontal overflow ${layout.overflow}px`)
  if (layout.hashLinks > 0) errors.push(`${name}: ${layout.hashLinks} href="#" link(s)`)
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage })
  results.push({ name, route, ...layout })
  return page
}

const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
await installStaticRoute(desktop)
const desktopRoutes = [
  ['desktop-home', '/'],
  ['desktop-works', '/works'],
  ['desktop-detail', '/works/tsukuyomi'],
  ['desktop-about', '/about'],
  ['desktop-contact', '/contact'],
  ['desktop-404', '/missing-page'],
]
for (const [name, route] of desktopRoutes) {
  const page = await capture(desktop, name, route, true)
  await page.close()
}

const slugs = ['aiment', 'quoridor-ai', 'linegraphify', 'preference-fractal', 'tsubooji', 'bird-tracking', 'board-game-ai', 'evolving-car', 'tetris-explosion']
for (const slug of slugs) {
  const page = await capture(desktop, `desktop-detail-${slug}`, `/works/${slug}`, false)
  await page.close()
}

const linegraphDesktop = await desktop.newPage()
await linegraphDesktop.goto(`${baseURL}/works/linegraphify`, { waitUntil: 'networkidle' })
const desktopOverlap = await linegraphDesktop.evaluate(() => {
  const title = document.querySelector('.work-hero__title h1')?.getBoundingClientRect()
  const claim = document.querySelector('.work-hero__claim')?.getBoundingClientRect()
  if (!title || !claim) return true
  return title.left < claim.right && title.right > claim.left && title.top < claim.bottom && title.bottom > claim.top
})
if (desktopOverlap) errors.push('desktop-linegraphify: title overlaps claim')
results.push({ linegraphifyDesktopTitleOverlap: desktopOverlap })
await linegraphDesktop.close()

const filterPage = await desktop.newPage()
await filterPage.goto(`${baseURL}/works`, { waitUntil: 'networkidle' })
const chipLabels = await filterPage.locator('.work-filter-chip').allTextContents()
const expectedFilters = {
  'すべて': ['tsukuyomi', 'aiment', 'quoridor-ai', 'linegraphify', 'preference-fractal', 'tsubooji', 'bird-tracking', 'board-game-ai', 'evolving-car', 'tetris-explosion'],
  'AI・学習': ['tsukuyomi', 'quoridor-ai', 'preference-fractal', 'tsubooji', 'board-game-ai', 'evolving-car'],
  'プロダクト・ツール': ['aiment', 'linegraphify'],
  '表現・身体': ['bird-tracking', 'tetris-explosion'],
}
if (JSON.stringify(chipLabels) !== JSON.stringify(Object.keys(expectedFilters))) {
  errors.push(`works-filter: wrong chips ${JSON.stringify(chipLabels)}`)
}
for (const [label, expected] of Object.entries(expectedFilters)) {
  await filterPage.getByRole('button', { name: label, exact: true }).click()
  const actual = await filterPage.locator('.work-row').evaluateAll((rows) => rows.map((row) => row.getAttribute('href')?.split('/').pop()))
  if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`works-filter ${label}: ${JSON.stringify(actual)}`)
}
results.push({ filters: chipLabels })
await filterPage.close()

const progressPage = await desktop.newPage()
await progressPage.goto(`${baseURL}/`, { waitUntil: 'networkidle' })
await progressPage.locator('.breadth').evaluate((element) => {
  const rect = element.getBoundingClientRect()
  window.scrollTo(0, window.scrollY + rect.top + (rect.height - window.innerHeight) / 2)
})
await progressPage.waitForTimeout(80)
const breadthProgress = await progressPage.locator('.breadth-item').evaluateAll((items) => items.map((item) => getComputedStyle(item).getPropertyValue('--item-progress').trim()))
if (breadthProgress.some((value) => Number(value) !== 1)) errors.push(`home breadth center progress: ${breadthProgress.join(', ')}`)
await progressPage.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
await progressPage.waitForTimeout(80)
const exitProgress = await progressPage.locator('.exit-scene').evaluate((element) => getComputedStyle(element).getPropertyValue('--exit-panel-progress').trim())
if (Number(exitProgress) !== 1) errors.push(`home exit end progress: ${exitProgress}`)
results.push({ breadthProgressAtCenter: breadthProgress, exitProgressAtDocumentEnd: exitProgress })
await progressPage.close()
await desktop.close()

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await installStaticRoute(mobile)
const mobileRoutes = [
  ['mobile-home', '/'],
  ['mobile-works', '/works'],
  ['mobile-detail', '/works/tsukuyomi'],
  ['mobile-linegraphify', '/works/linegraphify'],
  ['mobile-about', '/about'],
  ['mobile-contact', '/contact'],
  ['mobile-404', '/missing-page'],
]
for (const [name, route] of mobileRoutes) {
  const page = await capture(mobile, name, route, true)
  if (name === 'mobile-linegraphify') {
    const overlap = await page.evaluate(() => {
      const title = document.querySelector('.work-hero__title h1')?.getBoundingClientRect()
      const claim = document.querySelector('.work-hero__claim')?.getBoundingClientRect()
      if (!title || !claim) return true
      return title.left < claim.right && title.right > claim.left && title.top < claim.bottom && title.bottom > claim.top
    })
    if (overlap) errors.push('mobile-linegraphify: title overlaps claim')
    results.push({ linegraphifyMobileTitleOverlap: overlap })
  }
  await page.close()
}
await mobile.close()
await browser.close()

console.log(JSON.stringify({ results, errors }, null, 2))
if (errors.length) process.exitCode = 1
