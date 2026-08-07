import { profile } from '../data/profile'

const fields = ['神山まるごと高専', 'AI開発', '共同創業', 'ロボティクス', 'ダンス・表現']

export function AboutPage() {
  return (
    <main id="main" className="about-page" tabIndex={-1}>
      <header className="page-heading about-heading">
        <p className="eyebrow"><span>ABOUT</span> PERSON / PRACTICE</p>
        <div><h1 tabIndex={-1}>人物</h1><p>{profile.name}<br />{profile.school}</p></div>
      </header>

      <section className="profile-intro" aria-labelledby="profile-title">
        <div>
          <p className="section-kicker">PROFILE</p>
          <h2 id="profile-title">仕組みを考え、<br />現場で動く形まで持っていく。</h2>
          <p className="profile-bio">{profile.bio}</p>
        </div>
        <ul className="profile-fields">
          {fields.map((field, index) => <li key={field}><span>{String(index + 1).padStart(2, '0')}</span>{field}</li>)}
        </ul>
      </section>

      <section className="timeline-section" aria-labelledby="timeline-title">
        <header><p className="section-kicker">02 / TIMELINE</p><h2 id="timeline-title">活動・経歴</h2></header>
        <ol className="timeline">
          {profile.activities.map((activity, index) => (
            <li key={`${activity.year}-${activity.title}`}>
              <span className="timeline-dot" aria-hidden="true">{index + 1}</span>
              <time>{activity.year}</time>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-outro" aria-label="表現について">
        <p>EXPRESSION / ACROSS MEDIA</p>
        <h2>つくることも、踊ることも、<br />表現すること。</h2>
        <p>プログラミングもダンスも、考えていることを外に出して伝える手段です。手段が違っても、伝わる形まで持っていくことは変わりません。</p>
      </section>
    </main>
  )
}
