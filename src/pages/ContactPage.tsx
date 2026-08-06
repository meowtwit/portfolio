import { profile } from '../data/profile'

export function ContactPage() {
  const contacts = profile.links.filter((link) => link.kind === 'contact')
  const socials = profile.links.filter((link) => link.kind === 'social')

  return (
    <main id="main" className="contact-page" tabIndex={-1}>
      <header className="page-heading contact-heading">
        <p className="eyebrow"><span>CONTACT</span> START A CONVERSATION</p>
        <div><h1 tabIndex={-1}>連絡</h1><p>制作、開発、研究について。<br />目的に近い入口を一つ選んでください。</p></div>
      </header>

      <section className="contact-methods" aria-label="連絡方法">
        {contacts.map((link, index) => (
          <a key={link.label} href={link.href} className="contact-method">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><h2>{link.label}</h2><p>{link.note}</p></div>
            <b aria-hidden="true">→</b>
          </a>
        ))}
      </section>

      <section className="contact-note" aria-labelledby="message-title">
        <span className="contact-note__mark" aria-hidden="true"><i /><i /></span>
        <div><p>MESSAGE</p><h2 id="message-title">まだ要件が固まっていなくても大丈夫です。</h2></div>
        <p>作りたいもの、困っていること、話してみたいテーマを短く送ってください。内容を確認して返信します。</p>
      </section>

      <nav className="social-links" aria-label="外部リンク">
        <span>EXTERNAL / SNS</span>
        <div>{socials.map((link) => <a href={link.href} key={link.label}>{link.label}<b aria-hidden="true">↗</b></a>)}</div>
      </nav>
    </main>
  )
}
