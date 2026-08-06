import { chromium } from '/Users/huuto/data/projects/portfolio_mono/node_modules/playwright/index.mjs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const baseURL = 'http://portfolio.local'
const output = path.resolve('artifacts/screenshots')
const dist = path.resolve('dist')
await mkdir(output, { recursive: true })

const browser = await chromium.launch({ headless: true })
const errors = []

async function installStaticRoute(context) {
  await context.route('http://portfolio.local/**', async (route) => {
    const url = new URL(route.request().url())
    const file = url.pathname.startsWith('/assets/')
      ? path.join(dist, url.pathname.slice(1))
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
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
  if (!response?.ok()) errors.push(`${name}: HTTP ${response?.status()}`)
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage })
  const result = { name, route, title: await page.title(), url: page.url(), height: await page.evaluate(() => document.documentElement.scrollHeight) }
  await page.close()
  return result
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
await installStaticRoute(desktop)
const primaryRoutes = [
  ['desktop-home', '/'],
  ['desktop-works', '/works'],
  ['desktop-detail', '/works/tsukuyomi'],
  ['desktop-about', '/about'],
  ['desktop-contact', '/contact'],
  ['desktop-404', '/missing-page'],
]
const results = []
for (const [name, route] of primaryRoutes) results.push(await capture(desktop, name, route, true))

const slugs = ['aiment', 'quoridor-ai', 'linegraphify', 'preference-fractal', 'tsubooji', 'todokede', 'bird-tracking', 'irotoiro', 'evolving-car', 'cafeteria-roulette', 'tetris-explosion']
for (const slug of slugs) results.push(await capture(desktop, `desktop-detail-${slug}`, `/works/${slug}`, false))

const keyboardPage = await desktop.newPage()
await keyboardPage.goto(`${baseURL}/works`, { waitUntil: 'networkidle' })
await keyboardPage.locator('.work-row').first().focus()
const focusedBefore = await keyboardPage.evaluate(() => document.activeElement?.textContent?.trim())
await keyboardPage.keyboard.press('ArrowDown')
await keyboardPage.keyboard.press('ArrowDown')
await keyboardPage.keyboard.press('Enter')
await keyboardPage.waitForURL('**/works/quoridor-ai')
const detailURL = keyboardPage.url()
for (let index = 0; index < 3; index += 1) await keyboardPage.keyboard.press('Tab')
await keyboardPage.keyboard.press('Enter')
await keyboardPage.waitForURL('**/works')
const returnURL = keyboardPage.url()
results.push({ keyboard: { focusedBefore, detailURL, returnURL } })
await keyboardPage.close()
await desktop.close()

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
await installStaticRoute(mobile)
const mobileRoutes = [
  ['mobile-home', '/'],
  ['mobile-works', '/works'],
  ['mobile-detail', '/works/tsukuyomi'],
  ['mobile-about', '/about'],
  ['mobile-contact', '/contact'],
  ['mobile-404', '/missing-page'],
]
for (const [name, route] of mobileRoutes) results.push(await capture(mobile, name, route, true))
await mobile.close()
await browser.close()

console.log(JSON.stringify({ results, errors }, null, 2))
if (errors.length) process.exitCode = 1
