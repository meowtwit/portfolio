export type WorkSectionKey =
  | 'overview'
  | 'role'
  | 'background'
  | 'implementation'
  | 'result'
  | 'next'

export interface WorkSection {
  key: WorkSectionKey
  title: string
  lead: string
  body: readonly string[]
  facts?: readonly string[]
}

export interface WorkLink {
  label: string
  href: string
}

export interface Work {
  id: string
  slug: string
  title: string
  year: number
  category: string
  shortDescription: string
  role: string
  tech: readonly string[]
  coverImage?: string
  previewVideo?: string
  sections: readonly WorkSection[]
  links: readonly WorkLink[]
}

const chapter = (
  key: WorkSectionKey,
  title: string,
  lead: string,
  body: readonly string[],
  facts?: readonly string[],
): WorkSection => ({ key, title, lead, body, facts })

export const works: readonly Work[] = [
  {
    id: '01',
    slug: 'tsukuyomi',
    title: '月詠',
    year: 2026,
    category: 'Tetris AI',
    shortDescription: '対戦状況に応じて思考を変え、市販ゲームを実際に操作して人間と戦うTetris AI。',
    role: '探索設計 / C++実装 / 計測・評価',
    tech: ['C++23', 'Beam Search', 'Virtual Gamepad'],
    sections: [
      chapter('overview', '概要', '盤面を読み、20手先を考え、一手をゲームへ返す。', [
        '10×40の盤面から候補手を生成し、対戦中の一フレーム内で探索から入力までを完結させる対人Tetris AIです。市販ゲームを仮想ゲームパッドで操作し、人間との実戦を評価の中心に置きました。',
      ], ['29,676 LOC', 'DEPTH 20', 'BOARD 10×40']),
      chapter('role', '自分の担当', '探索器の設計から入力経路、測定までを一貫して担当。', [
        'ビームサーチの候補生成・評価・枝刈りを実装し、盤面認識後の意思決定と仮想ゲームパッドへの入力を接続しました。速度の履歴を残し、後退した変更も含めて比較しました。',
      ]),
      chapter('background', '背景・課題', '速いだけでは、対戦相手の意図に応答できない。', [
        '盤面を深く読むほど候補数は急増します。一方、対人戦では固定した評価だけでなく、火力・安全性・相手盤面の状態を限られた時間で切り替える必要がありました。',
      ]),
      chapter('implementation', '実装・工夫', '深さごとに探索幅を変える、段付きの木。', [
        '深さ1〜5は幅250、6〜9は1800、10〜15は1800から2000、16〜18は3000、19〜20は4500。等差ではない探索幅で、必要な局面だけ候補を厚く残しました。',
      ], ['WIDTH 250 → 4,500', 'node/ms 1,856 @ depth 18']),
      chapter('result', '結果・到達点', '探索性能は1121から2121 node/msへ。谷も消さずに残す。', [
        '最終値は約1.89倍になりました。途中で1091から686へ37%低下し、1064まで戻した履歴も記録しています。改善だけを並べず、どの判断が遅さを生んだかまで追える状態にしました。',
      ], ['1,121 → 2,121 node/ms', '1,091 → 686 (-37%) → 1,064']),
      chapter('next', '現在の課題', '強さの平均ではなく、相手ごとの崩れ方を捉える。', [
        '相手の積み方や攻撃周期に応じた評価の切り替えと、実戦ログからの自動調整が次の課題です。探索速度を保ったまま、対人特有の揺らぎを扱います。',
      ]),
    ],
    links: [{ label: 'Repository', href: '#' }],
  },
  {
    id: '02',
    slug: 'aiment',
    title: 'Aiment',
    year: 2026,
    category: 'AI Product',
    shortDescription: '視聴者が配信に介入できる、VTuberのための双方向ライブ配信基盤。',
    role: '共同創業 / プロダクト設計 / フルスタック開発',
    tech: ['TypeScript', 'Next.js', 'WebRTC', 'Cloudflare R2'],
    sections: [
      chapter('overview', '概要', '配信を見る人を、配信に参加する人へ変える。', [
        'リアルタイム・配信・保存の3層と、20系統のAPIを持つ双方向ライブ配信プロダクトです。企画から運用まで、実際の公開URLを持つサービスとして構築しました。',
      ], ['27,762 TS/TSX LOC', '20 API FAMILIES']),
      chapter('role', '自分の担当', '共同創業者として、仕様と実装の境界をつなぐ。', [
        'プロダクト要件の整理、pnpmワークスペースの設計、フロントエンド、API、リアルタイム通信、ストレージ移行を横断して担当しました。323コミット、マージPR 118本の開発履歴があります。',
      ], ['323 COMMITS', '118 MERGED PRS']),
      chapter('background', '背景・課題', '双方向性を増やすほど、配信基盤は複雑になる。', [
        'リアルタイムな反応と安定した配信、アーカイブを同じ体験にまとめる必要がありました。初期実装では4MB画像をbase64化し、約5.3MBの文字列としてDBのthumbnail TEXTへ保存していました。',
      ]),
      chapter('implementation', '実装・工夫', '責務を3層と4パッケージに分ける。', [
        'app / api / realtime / shared の4パッケージに分離。画像はDBからR2へ移し、保存先と配信経路を整理しました。データの所有場所を変えることで、画面側の体験を変えずに転送量を抑えました。',
      ], ['REALTIME / DELIVERY / STORAGE', 'app / api / realtime / shared']),
      chapter('result', '結果・到達点', 'egressを75GBから0.2GBへ削減。', [
        '画像の保存方式を見直した結果、egressは99.7%減少しました。機能追加だけでなく、運用コストが継続可能な水準かを実測で判断できるようになりました。',
      ], ['75GB → 0.2GB', '-99.7% EGRESS']),
      chapter('next', '現在の課題', '実験速度と、配信サービスとしての信頼性を両立する。', [
        '参加型機能の検証を速く回しながら、障害時の切り分けと配信品質の観測をさらに細かくすることが課題です。',
      ]),
    ],
    links: [{ label: 'aiment.jp', href: '#' }],
  },
  {
    id: '03', slug: 'quoridor-ai', title: 'コリドールAI', year: 2026, category: 'Game AI',
    shortDescription: '複数の思考エンジンを差し替え、経路と壁の一手を比較するボードゲームAI。',
    role: 'アルゴリズム設計 / C++実装 / 対戦評価', tech: ['C++20', 'MCTS', 'Beam Search'],
    sections: [
      chapter('overview', '概要', '壁を置いても道が残る。その条件の中で最善手を探す。', ['9×9盤面のマスと、その隙間に置かれる壁を別の構造として扱うコリドールAIです。複数の思考方式を同じ対戦基盤で比較できます。'], ['BOARD 9×9', 'WALLS 10 / PLAYER']),
      chapter('role', '自分の担当', 'ルール実装から探索器、評価基盤まで。', ['合法手生成、経路存在判定、最短経路、ビームサーチとMCTSの実装を担当しました。']),
      chapter('background', '背景・課題', '良い壁は、相手だけでなく自分の距離も変える。', ['すべての壁候補で経路が残ることを保証しつつ、置いた直後に双方の最短距離を引き直す必要があります。']),
      chapter('implementation', '実装・工夫', 'マスではなく、隙間を第一級のデータにする。', ['beam_top_k=20、beam_random_k=5、beam_depth=4。MCTSは2,000反復、探索定数c=1.41421356で比較しました。'], ['MCTS 2,000 ITERATIONS', 'C = 1.41421356']),
      chapter('result', '結果・到達点', '5つの頭脳を同じ場所で戦わせる。', ['評価関数や探索方式を差し替えて対戦でき、手法ごとの壁の使い方と経路選択の差を観察できました。'], ['BEAM TOP 20 + RANDOM 5', 'MCTS 2,000 ITERATIONS']),
      chapter('next', '現在の課題', '局面ごとの探索予算を動的に配る。', ['壁候補が多い序盤と経路が絞られる終盤で、同じ計算量を使わない設計へ進めます。']),
    ], links: [{ label: 'Repository', href: '#' }],
  },
  {
    id: '04', slug: 'linegraphify', title: 'LineGraphify', year: 2025, category: 'Visualization',
    shortDescription: '画像の輪郭と塗りを抽出し、数万本の数式へ翻訳する変換システム。',
    role: '画像処理設計 / Python実装 / 可視化', tech: ['Python', 'OpenCV', 'Douglas–Peucker'],
    sections: [
      chapter('overview', '概要', '画像を、描画可能な数式の集合へ変える。', ['1200×800の画像から輪郭と塗り領域を抽出し、式数の上限内で再構成します。'], ['497 CONTOURS', '41,385 SEGMENTS']),
      chapter('role', '自分の担当', '変換パイプラインと配分ロジックを設計。', ['輪郭抽出、単純化、領域分類、数式への変換と出力までを実装しました。']),
      chapter('background', '背景・課題', '細部を残すほど、数式は際限なく増える。', ['最大輪郭は長さ11,265px・4,647セグメント。全体の式数上限と見た目の忠実度を両立する必要がありました。']),
      chapter('implementation', '実装・工夫', '輪郭を再帰的に折り、重要度で予算を配る。', ['Douglas–Peuckerのεで点を減らし、最大剰余法で輪郭ごとの式数を配分しました。'], ['ε 1.17px: 39 POINTS', 'ε 23.50px: 8 POINTS']),
      chapter('result', '結果・到達点', '最大100万式を、意味のある場所へ配分。', ['輪郭497本、セグメント41,385個、塗り潰し領域815個を一つの変換パイプラインで扱えるようにしました。'], ['497 CONTOURS / 41,385 SEGMENTS', '815 FILLED REGIONS']),
      chapter('next', '現在の課題', '画像の意味に応じて、残す線を選ぶ。', ['幾何学的な誤差だけでなく、顔や文字など知覚上重要な領域を優先する配分が課題です。']),
    ], links: [{ label: 'Repository', href: '#' }],
  },
  {
    id: '05', slug: 'preference-fractal', title: '選好学習フラクタル', year: 2026, category: 'Research',
    shortDescription: '二択を繰り返すだけで、生成結果が使う人の好みへ近づく選好学習実験。',
    role: '研究設計 / PyTorch実装 / 実験', tech: ['PyTorch', 'Bradley–Terry', 'Generative Art'],
    sections: [
      chapter('overview', '概要', '言葉にしにくい好みを、左右の選択から学ぶ。', ['2枚から好みを選ぶ行為を学習信号にし、5種のフラクタル生成パラメータへ反映します。']),
      chapter('role', '自分の担当', '生成・比較・学習のループを一人で設計。', ['UI、データ保存、Bradley–Terry型の選好モデル、生成器との接続を実装しました。']),
      chapter('background', '背景・課題', '評価語を決めると、まだ言葉にならない好みを落としてしまう。', ['数値スライダーや形容詞ではなく、直感的な二択だけで方向を作れるかを検証しました。']),
      chapter('implementation', '実装・工夫', '少量の選択を繰り返し学習へ戻す。', ['LR=2e-4、buffer最大1,200、1選択あたり10 train steps、batch 18。新規性の記憶は600件です。'], ['NOISE 0 / 5 / 25 / 35 / 50 / 63 / 75 / 100%', 'RENDER 512×512']),
      chapter('result', '結果・到達点', '42KBの選択履歴から、生成の傾向が変化。', ['タコのような線画から抽象的な形まで、ノイズ8段階を比較できる実験系を構築しました。'], ['PREFERENCES 42KB', '8 NOISE LEVELS']),
      chapter('next', '現在の課題', '好みの変化と、単なる飽きを分ける。', ['時間とともに変わる選択傾向を、固定した一つのモデルへ閉じ込めない方法を探ります。']),
    ], links: [{ label: 'Research notes', href: '#' }],
  },
  {
    id: '06', slug: 'tsubooji', title: '壺の強化学習', year: 2026, category: 'RL',
    shortDescription: 'ハンマー一本で登る挙動を、物理環境と報酬設計から学ばせる強化学習。',
    role: '環境構築 / 報酬設計 / PPO学習', tech: ['Python', 'PPO', 'Physics Simulation'],
    sections: [
      chapter('overview', '概要', '壺とハンマーの10次元を観測し、3つの行動で登る。', ['何もしない・左回転・右回転を選び、100万stepの学習で高さを伸ばすエージェントです。'], ['OBSERVATION 10D', 'ACTION 3']),
      chapter('role', '自分の担当', 'ゲーム物理、Gym環境、報酬と学習を構築。', ['壺とハンマーの状態取得、終了条件、学習ログ、チェックポイント保存まで実装しました。']),
      chapter('background', '背景・課題', '局所的に上がる動きと、先へ進む動きは同じではない。', ['高さ差だけを報酬にすると、安定して登る前に偶然の跳ねへ偏る可能性があります。']),
      chapter('implementation', '実装・工夫', '高さ差を連続報酬にし、成功と失敗を明確に区切る。', ['報酬は(現在高さ−前回高さ)×0.1。高さ2700超で+1000、高さ30未満で-100、10,000stepで打ち切ります。'], ['GRAVITY (0, -981)', '302 CHECKPOINTS']),
      chapter('result', '結果・到達点', '学習を再現可能な測定系まで整備。', ['ランダムエージェントの最大高さ738.6 / 610.6 / 691.5を基準として保存しました。'], ['RANDOM MAX 738.6 / 610.6 / 691.5', '302 CHECKPOINTS']),
      chapter('next', '現在の課題', '報酬の抜け道を塞ぎ、移動の質を評価する。', ['高さだけでなく、安定性や接触の使い方を含む評価へ拡張します。']),
    ], links: [{ label: 'Training log', href: '#' }],
  },
  {
    id: '07', slug: 'todokede', title: '外出届自動化', year: 2026, category: 'Automation',
    shortDescription: '寮のカレンダーを読み、安全な日付だけ外出・外泊届へ変換する内製システム。',
    role: '要件整理 / Workers実装 / 運用', tech: ['Cloudflare Workers', 'D1', 'Cron'],
    sections: [
      chapter('overview', '概要', '予定へ印を付けると、必要な届出が自動で送られる。', ['毎時のCronで対象日を確認し、JST基準の+2日・+3日だけを送信します。']),
      chapter('role', '自分の担当', '寮運用を調べ、失敗しにくい自動化へ落とす。', ['提出ルールの整理、データモデル、送信処理、重複防止を担当しました。']),
      chapter('background', '背景・課題', '便利さより先に、誤送信しない構造が必要。', ['前日・当日・過去日は手動でも送れない安全弁を置きました。']),
      chapter('implementation', '実装・工夫', '時刻と重複を、画面ではなくデータで制約する。', ['Cronは0 * * * *。15:00 UTCをJST 00:00として扱い、主キー(mode, date_jst)で重複送信を防止します。'], ['DAY TRIP 08:30–16:30', 'OVERNIGHT 09:30–08:00']),
      chapter('result', '結果・到達点', '繰り返し作業を、確認可能な定時処理へ。', ['対象日、禁止日、送信済みを毎時判定し、土日は全日分を保存せず設定上の標準有効として計算するスパースなモデルにしました。'], ['ELIGIBLE JST +2 / +3 DAYS', 'PRIMARY KEY (mode, date_jst)']),
      chapter('next', '現在の課題', '例外日を増やしても、規則を読める状態に保つ。', ['学校行事や長期休暇の例外を、条件分岐の積み重ねにしない設計を進めます。']),
    ], links: [{ label: 'System notes', href: '#' }],
  },
  {
    id: '08', slug: 'bird-tracking', title: '羽ばたきトラッキング', year: 2025, category: 'Robotics',
    shortDescription: '腕の上下を6点の骨格から読み、画面の鳥の羽ばたきへ変換する体験。',
    role: '体験設計 / 姿勢推定 / フロントエンド', tech: ['TypeScript', 'MediaPipe', 'Canvas'],
    sections: [
      chapter('overview', '概要', '腕を振ると、画面の中の鳥が上がる。', ['左右の肩・肘・手首の6点を結び、手首の高さが閾値を横切るたびに一羽ばたきとして数えます。'], ['LANDMARKS 11–16', 'MODEL 5.78MB']),
      chapter('role', '自分の担当', '身体入力と画面応答の設計・実装。', ['Pose Landmarkerの組み込み、判定、描画、カメラ権限まわりを担当しました。']),
      chapter('background', '背景・課題', '人とカメラの距離が変わっても、同じ動きとして読む。', ['ピクセル値では、立ち位置によって同じ羽ばたきが違う大きさになります。']),
      chapter('implementation', '実装・工夫', '肩幅で正規化し、入力座標は反転しない。', ['表示時だけCanvasを左右反転。内部座標は原座標のまま保ち、requestVideoFrameCallbackを優先します。']),
      chapter('result', '結果・到達点', 'カメラ映像を外へ出さず、身体を直接入力に。', ['非対応ブラウザではrequestAnimationFrameへフォールバックします。映像は端末外へ送信せず、6点の姿勢だけを操作へ変換できました。'], ['6 LANDMARKS', 'ON-DEVICE MODEL 5.78MB']),
      chapter('next', '現在の課題', '体格と動き方の個人差を初期調整なしで吸収する。', ['短い準備動作から閾値を自動決定し、誰でもすぐ始められる設計を目指します。']),
    ], links: [{ label: 'Demo', href: '#' }],
  },
  {
    id: '09', slug: 'irotoiro', title: 'イロトイロ', year: 2025, category: 'Game AI',
    shortDescription: 'ルールから設計した5×5のボードゲームに、探索AIを実装した研究制作。',
    role: 'ゲーム設計 / AI実装 / WebAssembly移植', tech: ['C++', 'Expectimax', 'WebAssembly'],
    sections: [
      chapter('overview', '概要', '自分で作ったルールに、自分でAIを住まわせる。', ['5×5盤面、おはじき24個、タイル24枚を使うボードゲームと、その対戦AIです。']),
      chapter('role', '自分の担当', 'ルール・実装・AI・検証を一貫して担当。', ['序盤最大75合法手を扱い、C++版とJS版を2万局でビット単位照合しました。']),
      chapter('background', '背景・課題', 'ゲームを作ることと、AIが読める状態を作ること。', ['人には直感的なルールでも、探索には状態・手・勝敗の厳密な定義が必要です。']),
      chapter('implementation', '実装・工夫', '25bitの盤面と48本の勝ち筋を使う。', ['横15・縦15・斜め9+9、計48本の3連windowを列挙。Expectimaxの確率ノードと選択ノードを分けました。'], ['48 WINDOWS', '20,000 VERIFICATION GAMES']),
      chapter('result', '結果・到達点', '紙のルールを、検証可能な対戦環境へ。', ['C++の探索器をWebAssemblyへ移し、ブラウザ上でも同じ判定を再現しました。'], ['20,000 BIT-EXACT GAMES', '48 WIN WINDOWS']),
      chapter('next', '現在の課題', '人にとって面白いAIの強さを調整する。', ['最善手だけでなく、遊び手の理解と成長に合う手を選ぶ難易度設計が課題です。']),
    ], links: [{ label: 'Play', href: '#' }],
  },
  {
    id: '10', slug: 'evolving-car', title: '進化する自動運転', year: 2025, category: 'ML',
    shortDescription: '5本のレイだけを頼りに、世代を重ねてコース到達率を伸ばす自動運転。',
    role: 'シミュレーション / 遺伝的学習 / 比較実験', tech: ['Python', 'Genetic Algorithm', 'Neural Network'],
    sections: [
      chapter('overview', '概要', '前方5方向の距離から、次のステアリングを決める。', ['-60° / -25° / 0° / +25° / +60°の5レイ、長さ150pxを入力にします。']),
      chapter('role', '自分の担当', '車両モデル、学習、計測を実装。', ['1層NNと2層NNを同じ条件で走らせ、世代ブロックごとの到達率を比較しました。']),
      chapter('background', '背景・課題', '複雑な入力なしで、コース形状をどこまで学べるか。', ['中心線35点・半幅68pxのコースを、局所的な距離だけで走破させます。']),
      chapter('implementation', '実装・工夫', '100試行ごとに、二つの構造を競わせる。', ['1層H1=8、2層H1=10/H2=6。速度112.5px/s、最大操舵160°で固定しました。']),
      chapter('result', '結果・到達点', '2層は早く立ち上がり、到達率0.20へ。', ['1層は世代41–50で0.19、2層は世代21–30で0.18まで到達。構造による学習速度の差を確認しました。'], ['ONE LAYER PEAK 0.19', 'TWO LAYERS PEAK 0.20']),
      chapter('next', '現在の課題', '別のコースでも残る能力かを確かめる。', ['一つの形状への適応と、運転方策の汎化を分けて評価します。']),
    ], links: [{ label: 'Experiment', href: '#' }],
  },
  {
    id: '11', slug: 'cafeteria-roulette', title: '学食ルーレット', year: 2025, category: 'Web App',
    shortDescription: '希望と在庫を集め、4段階の配分で今日の献立を決める投票・抽選アプリ。',
    role: '要件定義 / React実装 / Firebase設計', tech: ['React', 'Firebase', 'Fisher–Yates'],
    sections: [
      chapter('overview', '概要', 'みんなで選び、最後は運に委ねる。', ['A / B / EITHER / SKIPの4入力を在庫に合わせて3つの結果へ配分します。']),
      chapter('role', '自分の担当', '投票と管理、抽選ロジックを実装。', ['認証ロールによって投票画面と集計ダッシュボードを自動分岐しました。']),
      chapter('background', '背景・課題', '希望者が在庫を超えたときも、納得できる順序が必要。', ['欠食、強い希望、どちらでもよい人を同じ抽選に混ぜず、段階的に扱います。']),
      chapter('implementation', '実装・工夫', '4段階のフォールバックで配る。', ['欠食除外→A希望→B希望→EITHERとoverflowの順に配分し、各段でFisher–Yatesシャッフルを使います。'], ['POLLING 3 sec', '5 RESULT STATES']),
      chapter('result', '結果・到達点', '抽選の過程を説明できるデータ構造へ。', ['PENDING / WON_A / WON_B / SKIPPED / LOSTの5状態で、配分後の理由を追えるようにしました。'], ['4 INPUTS → 5 STATES', 'POLLING 3 sec']),
      chapter('next', '現在の課題', '公平さを、利用者に短く伝える。', ['正しい処理だけでなく、なぜこの結果になったかを画面上で理解できる表現を改善します。']),
    ], links: [{ label: 'App', href: '#' }],
  },
  {
    id: '12', slug: 'tetris-explosion', title: 'Tetris Explosion', year: 2025, category: 'Motion Graphics',
    shortDescription: 'Tetris Effectの爆発を観察し、再利用できる時間関数として組み直した映像制作ツール。',
    role: '映像分析 / モーション実装 / 検証', tech: ['Remotion', 'WebGL', 'TypeScript'],
    sections: [
      chapter('overview', '概要', '映像ではなく、映像を作る道具のほうを作る。', ['10×20のグリッドが一点から飛散する動きを、8秒・60fpsの映像として生成します。'], ['1920×1080', '60 FPS / 8 sec']),
      chapter('role', '自分の担当', '参照分析、運動モデル、レンダリングを担当。', ['実ゲーム録画と自作レンダを9コマずつ、同じ時間軸で並べて差を検証しました。']),
      chapter('background', '背景・課題', 'ばらばらな動きを、個別調整なしで再現する。', ['多数のキューブが違うタイミングに見える原因を、時間差ではなく方向と振幅の差として捉え直しました。']),
      chapter('implementation', '実装・工夫', '全キューブが一つの時間曲線を読む。', ['HOLD 0–1.10s、DISSOLVE 1.10–1.44s、BURST 1.44s、DRIFT 1.44–4.6s。位置はhome + offset × E(τ)で求めます。'], ['SNAP τ=1.47–1.60', 'DECELERATE 1.60–2.60', 'ACCELERATE 2.60–3.25']),
      chapter('result', '結果・到達点', '方向と距離だけで、まとまりとばらつきを両立。', ['30fps・132フレームの比較レンダを約75秒で生成し、時間軸をそろえた検証ができました。'], ['132 FRAMES / ~75 sec', 'GAME 9 FRAMES ↔ RENDER 9 FRAMES']),
      chapter('next', '現在の課題', '別の形にも使える運動文法へ広げる。', ['盤面だけでなく文字や任意形状でも、同じ曲線の性質が保たれるかを検証します。']),
    ], links: [{ label: 'Video', href: '#' }],
  },
] as const

export function findWork(idOrSlug: string): Work | undefined {
  return works.find((work) => work.id === idOrSlug || work.slug === idOrSlug)
}
