import { useState, type FormEvent } from 'react'
import { CONTACT_FORM_EMAIL, profile } from '../data/profile'

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

const formAction = `https://formsubmit.co/${CONTACT_FORM_EMAIL}`
const ajaxEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_FORM_EMAIL)}`

export function ContactPage() {
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const contacts = profile.links.filter((link) => link.kind === 'contact')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('submitting')

    try {
      const payload = Object.fromEntries(new FormData(form).entries())
      const response = await fetch(ajaxEndpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })
      const result = await response.json().catch(() => null) as { success?: boolean } | null
      if (!response.ok || result?.success === false) throw new Error(`FormSubmit returned ${response.status}`)
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

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

      <section className="contact-form-section" aria-labelledby="contact-form-title">
        <header className="contact-form-intro">
          <p>FORM / EMAIL FORWARD</p>
          <h2 id="contact-form-title">問い合わせを送る</h2>
          <p>3項目を入力してください。送信内容はFormSubmitを経由し、指定したメールアドレスへ転送されます。</p>
        </header>

        <form
          className="contact-form"
          action={formAction}
          method="POST"
          onSubmit={submit}
          onInput={() => {
            if (status === 'success' || status === 'error') setStatus('idle')
          }}
          aria-describedby="contact-form-status"
        >
          <input type="hidden" name="_subject" value="ポートフォリオサイトからの問い合わせ" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />

          <div className="contact-field">
            <label htmlFor="contact-name"><span>01</span>名前</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required disabled={status === 'submitting'} />
          </div>
          <div className="contact-field">
            <label htmlFor="contact-email"><span>02</span>メールアドレス</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required disabled={status === 'submitting'} />
          </div>
          <div className="contact-field contact-field--message">
            <label htmlFor="contact-message"><span>03</span>問い合わせ内容</label>
            <textarea id="contact-message" name="message" rows={8} required disabled={status === 'submitting'} />
          </div>

          <div className="contact-form__actions">
            <button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? '送信中…' : '問い合わせを送信'}
              <span aria-hidden="true">→</span>
            </button>
            <p>フォームが使えない場合は <a href={`mailto:${CONTACT_FORM_EMAIL}`}>メールアプリから送る</a></p>
          </div>

          <div id="contact-form-status" className={`contact-form-status is-${status}`} aria-live="polite">
            {status === 'submitting' && <p role="status">送信しています。画面を閉じずにお待ちください。</p>}
            {status === 'success' && <p role="status">送信しました。内容を確認して返信します。</p>}
            {status === 'error' && <p role="alert">送信できませんでした。時間を置いて再試行するか、メールリンクをご利用ください。</p>}
          </div>
        </form>
      </section>

      <section className="contact-note" aria-labelledby="message-title">
        <div><p>MESSAGE</p><h2 id="message-title">まだ要件が固まっていなくても大丈夫です。</h2></div>
        <p>作りたいもの、困っていること、話してみたいテーマを短く送ってください。内容を確認して返信します。</p>
      </section>
    </main>
  )
}
