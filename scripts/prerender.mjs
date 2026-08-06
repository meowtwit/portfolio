import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const siteUrl = (process.env.SITE_URL || 'https://portfolio.example.com').replace(/\/+$/, '')
const ogImage = `${siteUrl}/og-frame.svg`
const siteName = '早雲楓人 — Portfolio'

async function loadTypeScriptModule(relativePath) {
  const source = await readFile(path.join(projectRoot, relativePath), 'utf8')
  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: relativePath,
  })
  const encoded = Buffer.from(result.outputText).toString('base64')
  return import(`data:text/javascript;base64,${encoded}`)
}

const [{ works }, { profile }] = await Promise.all([
  loadTypeScriptModule('src/data/works.ts'),
  loadTypeScriptModule('src/data/profile.ts'),
])
const template = await readFile(path.join(distDir, 'index.html'), 'utf8')

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const absoluteUrl = (pathname) => `${siteUrl}${pathname === '/' ? '/' : pathname}`
const jsonLd = (value) => JSON.stringify(value).replaceAll('</script', '<\\/script')

function staticShell(body) {
  return `
    <div class="prerender-content" data-prerender-content>
      <header class="prerender-header">
        <a href="/">早雲楓人</a>
        <nav aria-label="主要ナビゲーション">
          <a href="/works">作品</a><a href="/about">人物</a><a href="/contact">連絡</a>
        </nav>
      </header>
      <main class="prerender-main">${body}</main>
      <footer class="prerender-footer"><span>早雲楓人 — PORTFOLIO</span><span>AI / SOFTWARE / PHYSICAL SYSTEMS</span></footer>
    </div>`
}

function workList() {
  return `<ol class="prerender-work-list">${works.map((work) => `
    <li><a href="/works/${escapeHtml(work.slug)}"><span>${escapeHtml(work.id)}</span><strong>${escapeHtml(work.title)}</strong><span>${escapeHtml(work.category)} / ${work.year}</span></a></li>`).join('')}
  </ol>`
}

function detailBody(work) {
  return `<article>
    <p><a href="/works">作品一覧へ戻る</a></p>
    <h1>${escapeHtml(work.title)}</h1>
    <p>${escapeHtml(work.shortDescription)}</p>
    <dl><dt>担当範囲</dt><dd>${escapeHtml(work.role)}</dd><dt>使用技術</dt><dd>${work.tech.map(escapeHtml).join(' / ')}</dd><dt>制作年</dt><dd>${work.year}</dd></dl>
    <div class="prerender-sections">${work.sections.map((section) => `<section>
      <p>${escapeHtml(section.title)}</p><h2>${escapeHtml(section.lead)}</h2>
      ${section.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      ${section.facts ? `<ul>${section.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join('')}</ul>` : ''}
    </section>`).join('')}</div>
  </article>`
}

const personLd = {
  '@type': 'Person',
  name: profile.name,
  affiliation: { '@type': 'EducationalOrganization', name: profile.school },
  description: profile.bio,
  url: absoluteUrl('/about'),
}

const pages = [
  {
    pathname: '/',
    title: siteName,
    description: '早雲楓人のポートフォリオ。AI、ソフトウェア、フィジカルシステムを、現場で動く形まで実装した制作記録。',
    body: `<h1>考えた仕組みを、<br>動くところまでつくる。</h1><p>AI / SOFTWARE / PHYSICAL SYSTEMS</p><p><a href="/works">12件の作品を見る</a></p><h2>制作領域</h2><p>探索・学習・評価、プロダクト・運用、身体・環境・入力を横断して制作しています。</p>`,
    schema: { '@context': 'https://schema.org', '@type': 'WebSite', name: siteName, url: absoluteUrl('/'), author: personLd },
  },
  {
    pathname: '/works',
    title: '作品 — 早雲楓人',
    description: '早雲楓人の作品12件。AI、ソフトウェア、オートメーション、ロボティクスなどの設計・実装・検証を紹介します。',
    body: `<h1>作品</h1><p>見てほしい順に固定した12件の作品です。</p>${workList()}`,
    schema: {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: '作品 — 早雲楓人', url: absoluteUrl('/works'),
      hasPart: works.map((work) => ({ '@type': 'CreativeWork', name: work.title, url: absoluteUrl(`/works/${work.slug}`) })),
    },
  },
  ...works.map((work) => ({
    pathname: `/works/${work.slug}`,
    title: `${work.title} — 早雲楓人`,
    description: work.shortDescription,
    body: detailBody(work),
    ogType: 'article',
    schema: {
      '@context': 'https://schema.org', '@type': 'CreativeWork', name: work.title,
      description: work.shortDescription, dateCreated: String(work.year), genre: work.category,
      keywords: work.tech.join(', '), creator: personLd, url: absoluteUrl(`/works/${work.slug}`),
    },
  })),
  {
    pathname: '/about',
    title: '人物 — 早雲楓人',
    description: `${profile.school}で学ぶ${profile.name}のプロフィール、制作領域、活動・経歴。`,
    body: `<h1>人物</h1><p>${escapeHtml(profile.bio)}</p><h2>活動・経歴</h2><ol>${profile.activities.map((activity) => `<li><time>${escapeHtml(activity.year)}</time><h3>${escapeHtml(activity.title)}</h3><p>${escapeHtml(activity.description)}</p></li>`).join('')}</ol>`,
    schema: { '@context': 'https://schema.org', '@type': 'ProfilePage', name: '人物 — 早雲楓人', url: absoluteUrl('/about'), mainEntity: personLd },
  },
  {
    pathname: '/contact',
    title: '連絡 — 早雲楓人',
    description: '早雲楓人への制作、開発、研究に関する連絡先と外部リンク。',
    body: `<h1>連絡</h1><p>制作、開発、研究について。目的に近い入口を一つ選んでください。</p><ul>${profile.links.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>${link.note ? ` — ${escapeHtml(link.note)}` : ''}</li>`).join('')}</ul>`,
    schema: { '@context': 'https://schema.org', '@type': 'ContactPage', name: '連絡 — 早雲楓人', url: absoluteUrl('/contact'), about: personLd },
  },
  {
    pathname: '/404',
    title: '404 — 早雲楓人',
    description: '指定されたページは見つかりませんでした。早雲楓人のポートフォリオトップへ戻れます。',
    body: '<p>404 / PAGE NOT FOUND</p><h1>この場所には、まだ何もありません。</h1><p><a href="/">トップへ戻る</a></p>',
    noindex: true,
    schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: '404 — 早雲楓人', url: absoluteUrl('/404') },
  },
]

function renderPage(page) {
  const canonical = absoluteUrl(page.pathname)
  const head = `
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}">
    <meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow'}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:site_name" content="${escapeHtml(siteName)}">
    <meta property="og:type" content="${page.ogType || 'website'}">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${escapeHtml(page.description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="早雲楓人ポートフォリオのOG画像枠">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json" data-route-jsonld>${jsonLd(page.schema)}</script>`

  return template
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name=["']description["'][^>]*>/i, '')
    .replace('</head>', `${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"></div>${staticShell(page.body)}`)
}

for (const page of pages) {
  const html = renderPage(page)
  if (page.pathname === '/') {
    await writeFile(path.join(distDir, 'index.html'), html)
    continue
  }
  const routeDir = path.join(distDir, page.pathname.slice(1))
  await mkdir(routeDir, { recursive: true })
  await writeFile(path.join(routeDir, 'index.html'), html)
  if (page.pathname === '/404') await writeFile(path.join(distDir, '404.html'), html)
}

const sitemapPages = pages.filter((page) => !page.noindex)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((page) => `  <url><loc>${escapeHtml(absoluteUrl(page.pathname))}</loc></url>`).join('\n')}
</urlset>
`
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)
await writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)

console.log(`Prerendered ${pages.length} pages for ${siteUrl}`)
