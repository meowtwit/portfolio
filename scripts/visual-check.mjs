import { chromium } from '/Users/huuto/data/projects/portfolio_mono/node_modules/playwright/index.mjs'
import { mkdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const baseURL = 'http://portfolio.local'
const output = path.resolve('artifacts/screenshots')
const dist = path.resolve('dist')
await mkdir(output, { recursive: true })

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await chromium.launch({ headless: true, executablePath: chrome })
const errors = []
const results = []
const allSlugs = [
  'tsukuyomi', 'aiment', 'quoridor-ai', 'linegraphify', 'preference-fractal', 'tsubooji',
  'bird-tracking', 'board-game-ai', 'evolving-car', 'tetris-explosion', 'cooking-ai-league',
  'fruit-merge-rl', 'ai-secretary', 'ai-paper-trader', 'vowel-viz', 'tracking-cat',
  'fairy-assistant', 'site-blocker',
]
const expectedCoverImages = {
  'tsukuyomi': '/works/tsukuyomi-versus.png',
  'aiment': '/works/aiment-lp.png',
  'linegraphify': '/works/linegraphify-okinami.png',
  'preference-fractal': '/works/fractal-phoenix.png',
  'board-game-ai': '/works/board-game-ai.png',
  'tetris-explosion': '/works/explosion-burst.jpg',
  'ai-secretary': '/works/ai-secretary-claude.png',
  'ai-paper-trader': '/works/ai-paper-trader.png',
  'vowel-viz': '/works/voiceai-ui.png',
  'tracking-cat': '/works/tracking-cat2.gif',
  'fairy-assistant': '/works/fairy.gif',
  'site-blocker': '/works/site-blocker-code.png',
}
const requiredDetailSlugs = [
  'tsukuyomi', 'aiment', 'board-game-ai', 'ai-paper-trader', 'site-blocker', 'ai-secretary',
  'fairy-assistant',
]

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

async function checkDetailCover(page, name, slug) {
  const expectedSrc = expectedCoverImages[slug]
  if (!expectedSrc) return
  const coverImage = page.locator('.work-cover')
  await coverImage.waitFor({ state: 'visible' })
  await coverImage.evaluate((image) => image.complete || new Promise((resolve) => image.addEventListener('load', resolve, { once: true })))
  const cover = await coverImage.evaluate((image) => {
    const imageRect = image.getBoundingClientRect()
    const parentRect = image.closest('.work-hero')?.getBoundingClientRect()
    return {
      tag: image.tagName,
      src: image.getAttribute('src'),
      loaded: image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
      objectFit: getComputedStyle(image).objectFit,
      overflow: parentRect ? {
        top: Math.max(0, parentRect.top - imageRect.top),
        right: Math.max(0, imageRect.right - parentRect.right),
        bottom: Math.max(0, imageRect.bottom - parentRect.bottom),
        left: Math.max(0, parentRect.left - imageRect.left),
      } : null,
    }
  })
  if (cover.tag !== 'IMG' || !cover.loaded || !cover.src?.endsWith(expectedSrc) || cover.objectFit !== 'contain') {
    errors.push(`${name}: invalid cover ${JSON.stringify(cover)}`)
  }
  if (slug === 'fairy-assistant' && (!cover.overflow || Object.values(cover.overflow).some((value) => value > 0.5))) {
    errors.push(`${name}: fairy cover escapes hero ${JSON.stringify(cover.overflow)}`)
  }
  results.push({ [`${name}-cover`]: cover })
}

async function checkDetailContent(page, name, slug) {
  if (slug === 'aiment') {
    const links = await page.locator('.work-links a').evaluateAll((anchors) => anchors.map((anchor) => ({
      label: anchor.textContent?.replace(/\s*↗\s*$/, '').trim(),
      href: anchor.getAttribute('href'),
    })))
    if (JSON.stringify(links) !== JSON.stringify([{ label: 'aiment.jp/lp', href: 'https://aiment.jp/lp' }])) {
      errors.push(`${name}: invalid Aiment links ${JSON.stringify(links)}`)
    }
    results.push({ [`${name}-links`]: links })
  }
  if (slug === 'cooking-ai-league') {
    const title = await page.locator('.work-hero__title h1').textContent()
    if (title?.trim() !== 'はじめてのおつかい' || !((await page.title()).startsWith('はじめてのおつかい —'))) {
      errors.push(`${name}: title not updated (${JSON.stringify({ heading: title, documentTitle: await page.title() })})`)
    }
  }
}

async function checkAllWorkPreviews(context, viewportName) {
  const page = await context.newPage()
  await page.goto(`${baseURL}/works`, { waitUntil: 'networkidle' })
  const previewChecks = []
  const rows = page.locator('.work-row')
  if (await rows.count() !== allSlugs.length) errors.push(`${viewportName}-previews: expected ${allSlugs.length} rows`)

  for (let index = 0; index < allSlugs.length; index += 1) {
    const slug = allSlugs[index]
    const row = rows.nth(index)
    await row.focus()
    await page.waitForTimeout(170)
    const media = page.locator('.preview-media-swap > div:last-child > *')
    await media.waitFor({ state: 'visible' })
    if (await media.evaluate((element) => element.tagName === 'IMG')) {
      await media.evaluate((image) => image.complete || new Promise((resolve) => image.addEventListener('load', resolve, { once: true })))
    }
    const state = await media.evaluate((element) => {
      const mediaRect = element.getBoundingClientRect()
      const frameRect = element.closest('.preview-media-swap')?.getBoundingClientRect()
      return {
        tag: element.tagName,
        src: element.getAttribute('src'),
        loaded: element.tagName !== 'IMG' || (element.complete && element.naturalWidth > 0 && element.naturalHeight > 0),
        objectFit: getComputedStyle(element).objectFit,
        horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        frameOverflow: frameRect ? {
          top: Math.max(0, frameRect.top - mediaRect.top),
          right: Math.max(0, mediaRect.right - frameRect.right),
          bottom: Math.max(0, mediaRect.bottom - frameRect.bottom),
          left: Math.max(0, frameRect.left - mediaRect.left),
        } : null,
      }
    })
    const expectedSrc = expectedCoverImages[slug]
    if (state.horizontalOverflow > 1) errors.push(`${viewportName}-preview-${slug}: horizontal overflow ${state.horizontalOverflow}px`)
    if (expectedSrc && (state.tag !== 'IMG' || !state.loaded || !state.src?.endsWith(expectedSrc) || state.objectFit !== 'contain')) {
      errors.push(`${viewportName}-preview-${slug}: invalid cover ${JSON.stringify(state)}`)
    }
    if (!expectedSrc && state.tag !== 'DIV') errors.push(`${viewportName}-preview-${slug}: missing work plate`)
    if (slug === 'fairy-assistant' && (!state.frameOverflow || Object.values(state.frameOverflow).some((value) => value > 0.5))) {
      errors.push(`${viewportName}-preview-${slug}: fairy cover escapes frame ${JSON.stringify(state.frameOverflow)}`)
    }
    previewChecks.push({ slug, ...state })
  }

  results.push({ [`${viewportName}AllPreviews`]: previewChecks })
  await page.close()
}

const cookingPrerender = await readFile(path.join(dist, 'works/cooking-ai-league/index.html'), 'utf8')
const cookingPrerenderTitle = cookingPrerender.match(/<title>(.*?)<\/title>/)?.[1]
if (cookingPrerenderTitle !== 'はじめてのおつかい — 早雲楓人') {
  errors.push(`prerender cooking-ai-league: wrong title ${JSON.stringify(cookingPrerenderTitle)}`)
}
results.push({ cookingPrerenderTitle })

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

for (const slug of allSlugs) {
  const page = await capture(desktop, `desktop-detail-${slug}`, `/works/${slug}`, false)
  await checkDetailCover(page, `desktop-detail-${slug}`, slug)
  await checkDetailContent(page, `desktop-detail-${slug}`, slug)
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
  'すべて': allSlugs,
  'AI・学習': ['tsukuyomi', 'quoridor-ai', 'preference-fractal', 'tsubooji', 'board-game-ai', 'evolving-car', 'cooking-ai-league', 'fruit-merge-rl'],
  'プロダクト・ツール': ['aiment', 'linegraphify', 'ai-secretary', 'ai-paper-trader', 'site-blocker'],
  '表現・身体': ['bird-tracking', 'tetris-explosion', 'vowel-viz', 'tracking-cat', 'fairy-assistant'],
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
await checkAllWorkPreviews(desktop, 'desktop')

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
const mobileDetailSlugs = [...new Set(['linegraphify', 'cooking-ai-league', ...requiredDetailSlugs])]
const mobileRoutes = [
  ['mobile-home', '/'],
  ['mobile-works', '/works'],
  ...mobileDetailSlugs.map((slug) => [`mobile-detail-${slug}`, `/works/${slug}`]),
  ['mobile-about', '/about'],
  ['mobile-contact', '/contact'],
  ['mobile-404', '/missing-page'],
]
for (const [name, route] of mobileRoutes) {
  const page = await capture(mobile, name, route, true)
  const detailSlug = route.startsWith('/works/') ? route.split('/').pop() : null
  if (detailSlug) {
    await checkDetailCover(page, name, detailSlug)
    await checkDetailContent(page, name, detailSlug)
  }
  if (detailSlug === 'linegraphify') {
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
await checkAllWorkPreviews(mobile, 'mobile')
await mobile.close()
await browser.close()

console.log(JSON.stringify({ results, errors }, null, 2))
if (errors.length) process.exitCode = 1
