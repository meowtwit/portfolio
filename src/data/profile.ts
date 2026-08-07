export interface ProfileActivity {
  year: string
  title: string
  description: string
}

export interface ProfileLink {
  label: string
  href: string
  kind: 'contact' | 'social'
  note?: string
}

export interface Profile {
  name: string
  school: string
  bio: string
  activities: readonly ProfileActivity[]
  links: readonly ProfileLink[]
}

export const CONTACT_FORM_EMAIL = 'mitsu@giroro.keroro.com'

export const profile: Profile = {
  name: '早雲 楓人',
  school: '神山まるごと高専',
  bio: 'AIを考えるだけで終わらせず、使えるソフトウェアや身体とつながる仕組みまで実装します。共同創業や寮の自治運営を通して、技術を現場へ置くところまで担当してきました。ダンス・表現活動も並行して続けています。',
  activities: [
    { year: '2024—', title: '神山まるごと高専', description: 'ソフトウェアとデザイン、起業を横断して学ぶ。寮の自治運営にも参加。' },
    { year: '2025', title: 'AI開発とゲームAI', description: '探索・強化学習・選好学習を、動くプロトタイプとして制作。' },
    { year: '2025—', title: 'Aiment 共同創業', description: '双方向ライブ配信プロダクトを企画し、設計・実装・運用を横断。' },
    { year: '2025', title: 'フィリピン現地調査', description: '現地での観察と対話から、技術を置く文脈そのものを調査。' },
    { year: '2025—', title: 'ロボティクス', description: '羽ばたきトラッキングなど、身体入力と実世界をつなぐ制作。' },
    { year: '2024—', title: 'ダンス・表現', description: 'プログラミングと並行し、身体のリズムや間を使った表現活動を続ける。' },
    { year: 'ONGOING', title: 'Tetris AI「月詠」/ Aiment', description: '月詠の開発を継続。フィリピンで創業した Aiment の運営を続けつつ、インドネシア展開を開始。幅広く AI 関連の制作に取り組む。' },
  ],
  links: [
    { label: 'メール', href: `mailto:${CONTACT_FORM_EMAIL}`, kind: 'contact', note: 'DM・相談はこちらへ' },
    { label: 'GitHub', href: 'https://github.com/meowtwit', kind: 'contact', note: 'コードと活動履歴' },
  ],
}
