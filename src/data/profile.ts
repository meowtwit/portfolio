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

export const profile: Profile = {
  name: '早雲 楓人',
  school: '神山まるごと高専',
  bio: 'AIを考えるだけで終わらせず、使えるソフトウェアや身体とつながる仕組みまで実装します。共同創業や寮の自治運営を通して、技術を現場へ置くところまで担当してきました。ダンスと表現も、身体から仕組みを考える大切な制作領域です。',
  activities: [
    { year: '2024—', title: '神山まるごと高専', description: 'ソフトウェアとデザイン、起業を横断して学ぶ。寮の自治運営にも参加。' },
    { year: '2025', title: 'AI開発とゲームAI', description: '探索・強化学習・選好学習を、動くプロトタイプとして制作。' },
    { year: '2025—', title: 'Aiment 共同創業', description: '双方向ライブ配信プロダクトを企画し、設計・実装・運用を横断。' },
    { year: '2025', title: 'フィリピン現地調査', description: '現地での観察と対話から、技術を置く文脈そのものを調査。' },
    { year: '2025—', title: 'ロボティクス', description: '羽ばたきトラッキングなど、身体入力と実世界をつなぐ制作。' },
    { year: 'ONGOING', title: 'ダンス・表現', description: '身体のリズム、間、見せ方を、技術とは別の言葉で探る。' },
  ],
  links: [
    { label: 'メール', href: 'mailto:hello@example.com', kind: 'contact', note: '制作・開発の相談' },
    { label: 'DM', href: '#', kind: 'contact', note: '短い質問や連絡' },
    { label: '面談・相談', href: '#', kind: 'contact', note: '30分のオンライン面談' },
    { label: 'GitHub', href: '#', kind: 'social' },
    { label: 'X', href: '#', kind: 'social' },
    { label: 'LinkedIn', href: '#', kind: 'social' },
    { label: 'YouTube', href: '#', kind: 'social' },
  ],
}
