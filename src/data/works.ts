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
  group: string
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
    group: 'AI・学習',
    shortDescription: '盤面状況をCNNで読み、戦略と探索パラメータを動的に切り替えて対AI戦の最強を目指すTetris AI。',
    role: '探索設計 / C++実装 / 計測・評価',
    tech: ['C++23', 'Beam Search', 'CNN', 'Virtual Gamepad'],
    coverImage: '/works/tsukuyomi-versus.png',
    sections: [
      chapter('overview', '概要', '盤面を読み、数十手先を考え、一手をゲームへ返す。', [
        '10×40の盤面から候補手を生成し、対戦中の一フレーム内で探索から入力までを完結させるTetris AIです。主なターゲットはAIで、対AI戦で最強になることを目指しています。市販ゲームを仮想ゲームパッドで操作し、対人戦にも対応します。',
      ], ['29,676 LOC', 'DEPTH 20', 'BOARD 10×40']),
      chapter('role', '自分の担当', '探索器の設計から入力経路、測定までを一貫して担当。', [
        'ビームサーチの候補生成・評価・枝刈りを実装し、盤面認識後の意思決定と仮想ゲームパッドへの入力を接続しました。速度の履歴を残し、後退した変更も含めて比較しました。',
      ]),
      chapter('background', '背景・課題', '速いだけでは、強いAIの局面変化に応答できない。', [
        '盤面を深く読むほど候補数は急増します。一方、対AI戦で勝ち切るには、火力・安全性・相手盤面の状態に合わせ、限られた時間の中で探索の性格そのものを切り替える必要がありました。',
      ]),
      chapter('implementation', '実装・工夫', 'CNNで局面を分類し、戦略と探索パラメータを動的に切り替える。', [
        '畳み込みニューラルネットワーク（CNN）で盤面状況を読み、選ぶ戦略と探索パラメータを局面ごとに調整します。さらに深さ1〜5は幅250、6〜9は1800、10〜15は1800から2000、16〜18は3000、19〜20は4500と、必要な局面だけ候補を厚く残しました。',
      ], ['WIDTH 250 → 4,500', 'CNN STRATEGY SWITCHING']),
      chapter('result', '結果・到達点', '探索性能は1,121から2,500 node/msへ。谷も消さずに残す。', [
        '最新値は約2.2倍になりました。途中で1,091から686へ37%低下し、1,064まで戻した履歴も記録しています。改善だけを並べず、どの判断が遅さを生んだかまで追える状態にしました。',
      ], ['1,121 → 2,500 node/ms（約2.2倍）', '1,091 → 686 (-37%) → 1,064']),
      chapter('next', '現在の課題', '対戦AIごとの崩れ方を捉え、切り替えの精度を上げる。', [
        '相手AIの積み方や攻撃周期に応じた戦略選択を学習し、探索速度を保ったまま対AI戦の勝率を高めます。対人戦でも同じ仕組みを使えるよう、実戦ログの幅も広げます。',
      ]),
    ],
    links: [],
  },
  {
    id: '02',
    slug: 'aiment',
    title: 'Aiment',
    year: 2026,
    category: 'AI Product',
    group: 'プロダクト・ツール',
    shortDescription: '視聴者が配信に介入できる、VTuberのための双方向ライブ配信プロダクト。',
    role: '共同創業 / プロダクト設計 / フルスタック開発',
    tech: ['TypeScript', 'Next.js', 'WebRTC', 'Cloudflare'],
    coverImage: '/works/aiment-lp.png',
    sections: [
      chapter('overview', '概要', '配信を見る人を、配信に参加する人へ変える。', [
        '視聴者の反応や選択を配信へリアルタイムに返し、VTuberと視聴者が同じ場を作れる参加型ライブ配信プロダクトです。フィリピンで創業し、企画・実装・公開後の運用まで続けています。',
      ], ['27,762 TS/TSX LOC', 'PHILIPPINES → INDONESIA']),
      chapter('role', '自分の担当', '共同創業者として、企画から実装、運用までを横断する。', [
        '現地の利用者と向き合いながらプロダクト要件を整理し、体験設計、フロントエンド、配信機能、公開後の改善を担当しました。323コミット、マージPR 118本の開発履歴があります。',
      ], ['323 COMMITS', '118 MERGED PRS']),
      chapter('background', '背景・課題', '視聴者参加を、配信者の負担を増やさず成立させる。', [
        'コメントを読むだけではない参加体験を作る一方、配信者が進行に集中でき、視聴者も迷わず加われる設計が必要でした。市場ごとの配信文化や使い方の違いも、現地で確かめながら判断しました。',
      ]),
      chapter('implementation', '実装・工夫', '企画と利用現場を往復し、小さく公開して改善を重ねる。', [
        '視聴者が参加する導線、配信者が企画を進める操作、ライブ中の反応が一つの流れになるよう設計しました。開発だけに閉じず、利用者への説明、運用、フィードバックの反映まで同じチームで回しています。',
      ], ['PLAN / BUILD / OPERATE', 'VIEWER-PARTICIPATORY LIVE']),
      chapter('result', '結果・到達点', 'フィリピンで運用し、インドネシアで次の展開を始める。', [
        '公開後も配信者と視聴者の声をもとに改善を継続しています。フィリピンで得た運用知見を持ってインドネシア展開を開始し、地域ごとのコミュニティに合う参加体験を検証しています。',
      ], ['LAUNCHED IN THE PHILIPPINES', 'EXPANDING TO INDONESIA']),
      chapter('next', '現在の課題', '地域ごとの配信文化に合う参加体験を育てる。', [
        'インドネシアでの利用を通して、配信者が継続しやすく、視聴者が何度でも参加したくなる企画と運用の形を磨きます。',
      ]),
    ],
    links: [{ label: 'aiment.jp/lp', href: 'https://aiment.jp/lp' }],
  },
  {
    id: '03', slug: 'quoridor-ai', title: 'コリドールAI', year: 2026, category: 'Game AI', group: 'AI・学習',
    shortDescription: '複数の思考エンジンを差し替え、経路と壁の一手を比較するボードゲームAI。',
    role: 'アルゴリズム設計 / C++実装 / 対戦評価', tech: ['C++20', 'MCTS', 'Beam Search'],
    coverImage: '/works/quoridor-gui.png',
    sections: [
      chapter('overview', '概要', '壁を置いても道が残る。その条件の中で最善手を探す。', ['9×9盤面のマスと、その隙間に置かれる壁を別の構造として扱うコリドールAIです。複数の思考方式を同じ対戦基盤で比較できます。'], ['BOARD 9×9', 'WALLS 10 / PLAYER']),
      chapter('role', '自分の担当', 'ルール実装から探索器、評価基盤まで。', ['合法手生成、経路存在判定、最短経路、ビームサーチとMCTSの実装を担当しました。']),
      chapter('background', '背景・課題', '良い壁は、相手だけでなく自分の距離も変える。', ['すべての壁候補で経路が残ることを保証しつつ、置いた直後に双方の最短距離を引き直す必要があります。']),
      chapter('implementation', '実装・工夫', 'マスではなく、隙間を第一級のデータにする。', ['beam_top_k=20、beam_random_k=5、beam_depth=4。MCTSは2,000反復、探索定数c=1.41421356で比較しました。'], ['MCTS 2,000 ITERATIONS', 'C = 1.41421356']),
      chapter('result', '結果・到達点', '5つの頭脳を同じ場所で戦わせる。', ['評価関数や探索方式を差し替えて対戦でき、手法ごとの壁の使い方と経路選択の差を観察できました。'], ['BEAM TOP 20 + RANDOM 5', 'MCTS 2,000 ITERATIONS']),
      chapter('next', '現在の課題', '局面ごとの探索予算を動的に配る。', ['壁候補が多い序盤と経路が絞られる終盤で、同じ計算量を使わない設計へ進めます。']),
    ], links: [],
  },
  {
    id: '04', slug: 'linegraphify', title: 'LineGraphify', year: 2025, category: 'Visualization', group: 'プロダクト・ツール',
    shortDescription: '画像や動画の輪郭と塗りを抽出し、数万本の数式へ翻訳する変換システム。',
    role: '画像処理設計 / Python実装 / 可視化', tech: ['Python', 'OpenCV', 'FFmpeg', 'Douglas–Peucker'],
    coverImage: '/works/linegraphify-okinami.png',
    sections: [
      chapter('overview', '概要', '画像を、描画可能な数式の集合へ変える。', ['1200×800の画像から輪郭と塗り領域を抽出し、式数の上限内で再構成します。'], ['497 CONTOURS', '41,385 SEGMENTS']),
      chapter('role', '自分の担当', '変換パイプラインと配分ロジックを設計。', ['輪郭抽出、単純化、領域分類、数式への変換と出力までを実装しました。']),
      chapter('background', '背景・課題', '細部を残すほど、数式は際限なく増える。', ['最大輪郭は長さ11,265px・4,647セグメント。全体の式数上限と見た目の忠実度を両立する必要がありました。']),
      chapter('implementation', '実装・工夫', '輪郭を再帰的に折り、重要度で予算を配る。', ['Douglas–Peuckerのεで点を減らし、最大剰余法で輪郭ごとの式数を配分しました。動画はフレームごとに同じ変換を行い、ffmpegで連結して線画映像として出力します。'], ['ε 1.17px: 39 POINTS', 'ε 23.50px: 8 POINTS']),
      chapter('result', '結果・到達点', '最大100万式を、意味のある場所へ配分。', ['輪郭497本、セグメント41,385個、塗り潰し領域815個を一つの変換パイプラインで扱い、静止画と動画の両方を線画へ変換できるようにしました。'], ['497 CONTOURS / 41,385 SEGMENTS', '815 FILLED REGIONS']),
      chapter('next', '現在の課題', '画像の意味に応じて、残す線を選ぶ。', ['幾何学的な誤差だけでなく、顔や文字など知覚上重要な領域を優先する配分が課題です。']),
    ], links: [],
  },
  {
    id: '05', slug: 'preference-fractal', title: '選好学習フラクタル', year: 2026, category: 'Research', group: 'AI・学習',
    shortDescription: '二択を繰り返すだけで、生成結果が使う人の好みへ近づく選好学習実験。',
    role: '研究設計 / PyTorch実装 / 実験', tech: ['PyTorch', 'Bradley–Terry', 'Generative Art'],
    coverImage: '/works/fractal-phoenix.png',
    sections: [
      chapter('overview', '概要', '言葉にしにくい好みを、左右の選択から学ぶ。', ['2枚から好みを選ぶ行為を学習信号にし、5種のフラクタル生成パラメータへ反映します。']),
      chapter('role', '自分の担当', '生成・比較・学習のループを一人で設計。', ['UI、データ保存、Bradley–Terry型の選好モデル、生成器との接続を実装しました。']),
      chapter('background', '背景・課題', '評価語を決めると、まだ言葉にならない好みを落としてしまう。', ['数値スライダーや形容詞ではなく、直感的な二択だけで方向を作れるかを検証しました。']),
      chapter('implementation', '実装・工夫', '少量の選択を繰り返し学習へ戻す。', ['LR=2e-4、buffer最大1,200、1選択あたり10 train steps、batch 18。新規性の記憶は600件です。'], ['NOISE 0 / 5 / 25 / 35 / 50 / 63 / 75 / 100%', 'RENDER 512×512']),
      chapter('result', '結果・到達点', '42KBの選択履歴から、生成の傾向が変化。', ['タコのような線画から抽象的な形まで、ノイズ8段階を比較できる実験系を構築しました。'], ['PREFERENCES 42KB', '8 NOISE LEVELS']),
      chapter('next', '現在の課題', '好みの変化と、単なる飽きを分ける。', ['時間とともに変わる選択傾向を、固定した一つのモデルへ閉じ込めない方法を探ります。']),
    ], links: [],
  },
  {
    id: '06', slug: 'tsubooji', title: '壺の強化学習', year: 2026, category: 'RL', group: 'AI・学習',
    shortDescription: 'ハンマー一本で登る挙動を、物理環境と報酬設計から学ばせる強化学習。',
    role: '環境構築 / 報酬設計 / PPO学習', tech: ['Python', 'PPO', 'Physics Simulation'],
    coverImage: '/works/tsubooji.png',
    sections: [
      chapter('overview', '概要', '壺とハンマーの10次元を観測し、3つの行動で登る。', ['壺のおじさんがハンマー一本で登っていく、あの棒ゲーム風の自作環境で、何もしない・左回転・右回転を選び、100万stepの学習で高さを伸ばすエージェントです。'], ['OBSERVATION 10D', 'ACTION 3']),
      chapter('role', '自分の担当', 'ゲーム物理、Gym環境、報酬と学習を構築。', ['壺とハンマーの状態取得、終了条件、学習ログ、チェックポイント保存まで実装しました。']),
      chapter('background', '背景・課題', '局所的に上がる動きと、先へ進む動きは同じではない。', ['高さ差だけを報酬にすると、安定して登る前に偶然の跳ねへ偏る可能性があります。']),
      chapter('implementation', '実装・工夫', '高さ差を連続報酬にし、成功と失敗を明確に区切る。', ['報酬は(現在高さ−前回高さ)×0.1。高さ2700超で+1000、高さ30未満で-100、10,000stepで打ち切ります。'], ['GRAVITY (0, -981)', '302 CHECKPOINTS']),
      chapter('result', '結果・到達点', '学習を再現可能な測定系まで整備。', ['ランダムエージェントの最大高さ738.6 / 610.6 / 691.5を基準として保存しました。'], ['RANDOM MAX 738.6 / 610.6 / 691.5', '302 CHECKPOINTS']),
      chapter('next', '現在の課題', '報酬の抜け道を塞ぎ、移動の質を評価する。', ['高さだけでなく、安定性や接触の使い方を含む評価へ拡張します。']),
    ], links: [],
  },
  {
    id: '07', slug: 'bird-tracking', title: '羽ばたきトラッキング', year: 2025, category: 'Robotics', group: '表現・身体',
    shortDescription: '腕の上下を6点の骨格から読み、画面の鳥の羽ばたきへ変換する体験。',
    role: '体験設計 / 姿勢推定 / フロントエンド', tech: ['TypeScript', 'MediaPipe', 'Canvas'],
    coverImage: '/works/bird-tracking.png',
    sections: [
      chapter('overview', '概要', '腕を振ると、画面の中の鳥が上がる。', ['左右の肩・肘・手首の6点を結び、手首の高さが閾値を横切るたびに一羽ばたきとして数えます。'], ['LANDMARKS 11–16', 'MODEL 5.78MB']),
      chapter('role', '自分の担当', '身体入力と画面応答の設計・実装。', ['Pose Landmarkerの組み込み、判定、描画、カメラ権限まわりを担当しました。']),
      chapter('background', '背景・課題', '人とカメラの距離が変わっても、同じ動きとして読む。', ['ピクセル値では、立ち位置によって同じ羽ばたきが違う大きさになります。']),
      chapter('implementation', '実装・工夫', '肩幅で正規化し、入力座標は反転しない。', ['表示時だけCanvasを左右反転。内部座標は原座標のまま保ち、requestVideoFrameCallbackを優先します。']),
      chapter('result', '結果・到達点', 'カメラ映像を外へ出さず、身体を直接入力に。', ['非対応ブラウザではrequestAnimationFrameへフォールバックします。映像は端末外へ送信せず、6点の姿勢だけを操作へ変換できました。'], ['6 LANDMARKS', 'ON-DEVICE MODEL 5.78MB']),
      chapter('next', '現在の課題', '羽ばたきで鳥を操作するゲームへ発展させる。', ['腕の羽ばたきで鳥を上下させ、障害物を越えていくゲーム化を構想しています。判定の調整を進め、身体を使って遊べる体験として仕上げる予定です。']),
    ], links: [],
  },
  {
    id: '08', slug: 'board-game-ai', title: 'ボードゲームAI', year: 2025, category: 'Game AI', group: 'AI・学習',
    shortDescription: '友人が考案した5×5のボードゲームに、対戦AIとブラウザで遊べる環境を実装。',
    role: 'AI実装 / C++実装 / WebAssembly移植', tech: ['C++', 'Expectimax', 'WebAssembly'],
    coverImage: '/works/board-game-ai.png',
    sections: [
      chapter('overview', '概要', '友人が作ったゲームへ、対戦する頭脳を実装する。', ['友人が考案・制作した5×5のボードゲームに対し、対戦AIとWeb移植を制作しました。おはじき24個とタイル24枚からなる盤面を探索可能な状態へ落とし込みます。']),
      chapter('role', '自分の担当', 'AI実装と検証、WebAssembly移植を担当。', ['既存ルールを探索用の状態表現へ変換し、序盤最大75合法手を扱うAIを実装しました。C++版とJS版は2万局でビット単位照合しています。']),
      chapter('background', '背景・課題', '人が遊べるルールを、AIが厳密に読める状態へ変える。', ['友人が作ったゲームの意図を保ちながら、状態・合法手・勝敗を探索器が曖昧なく扱えるよう定義する必要がありました。']),
      chapter('implementation', '実装・工夫', '25bitの盤面と48本の勝ち筋を使う。', ['横15・縦15・斜め9+9、計48本の3連windowを列挙。Expectimaxの確率ノードと選択ノードを分けました。'], ['48 WINDOWS', '20,000 VERIFICATION GAMES']),
      chapter('result', '結果・到達点', '友人のボードゲームを、AIと対戦できるWeb体験へ。', ['C++の探索器をWebAssemblyへ移し、ブラウザ上でも同じ判定とAIの手を再現しました。'], ['20,000 BIT-EXACT GAMES', '48 WIN WINDOWS']),
      chapter('next', '現在の課題', '人にとって面白いAIの強さを調整する。', ['最善手だけでなく、遊び手の理解と成長に合う手を選ぶ難易度設計が課題です。']),
    ], links: [],
  },
  {
    id: '09', slug: 'evolving-car', title: '進化する自動運転', year: 2025, category: 'ML', group: 'AI・学習',
    shortDescription: '5本の距離レイを入力とするニューラルネットワークを進化させ、層構成ごとの走行方策を比較。',
    role: 'シミュレーション / 進化的学習 / 比較実験', tech: ['Python', 'Genetic Algorithm', 'Neural Network'],
    coverImage: '/works/evolving-car.png',
    sections: [
      chapter('overview', '概要', '5つの距離入力から、操舵方策の重みを進化させる。', ['車体前方の-60° / -25° / 0° / +25° / +60°へ長さ150pxのレイを飛ばし、壁までの正規化距離をニューラルネットワークへ入力します。左右の広い視野で急カーブを先読みし、中心寄りの3本で直近の進行方向を細かく捉える設計です。']),
      chapter('role', '自分の担当', '車両モデル、進化ループ、層構成の比較系を実装。', ['1層H1=8と、2層H1=10・H2=6のネットワークを同じ車両条件とコースで走らせ、世代ブロックごとの到達率を比較しました。']),
      chapter('background', '背景・課題', '低次元の局所観測だけで、曲率の変化へ適応できるか。', ['中心線35点・半幅68pxのコースに対し、画像や絶対座標を与えず、5レイの距離だけから走行方策を獲得させます。入力を絞ることで、層の深さと進化の差を直接比較できるようにしました。']),
      chapter('implementation', '実装・工夫', '上位方策の重みを継承し、突然変異で次世代を探索する。', ['各試行の走行距離と到達率を適応度として上位個体を選び、そのネットワーク重みを次世代へ継承しながら突然変異を加えます。1層は入力5→H1=8、2層は入力5→H1=10→H2=6。速度112.5px/s、最大操舵160°を固定し、構造以外の条件をそろえました。']),
      chapter('result', '結果・到達点', '2層は早く立ち上がり、到達率0.20へ。', ['1層は世代41–50で0.19、2層は世代21–30で0.18まで到達し、最終的に0.20を記録しました。表現力を増やした構造が、進化の初期段階で有効な方策へ到達する速さに差を生むことを確認しました。'], ['ONE LAYER PEAK 0.19', 'TWO LAYERS PEAK 0.20']),
      chapter('next', '現在の課題', 'コース固有の重みと、再利用できる走行表現を分ける。', ['未学習コースでの到達率、レイ角度を変えたときの感度、個体群の多様性を測り、一つの形状への過適応と方策の汎化を切り分けます。']),
    ], links: [],
  },
  {
    id: '10', slug: 'tetris-explosion', title: 'Tetris Explosion', year: 2025, category: 'Motion Graphics', group: '表現・身体',
    shortDescription: 'Tetris Effectの爆発を観察し、再利用できる時間関数として組み直した映像制作ツール。',
    role: '映像分析 / モーション実装 / 検証', tech: ['Remotion', 'WebGL', 'TypeScript'],
    coverImage: '/works/explosion-burst.jpg',
    sections: [
      chapter('overview', '概要', '映像ではなく、映像を作る道具のほうを作る。', ['10×20のグリッドが一点から飛散する動きを、8秒・60fpsの映像として生成します。'], ['1920×1080', '60 FPS / 8 sec']),
      chapter('role', '自分の担当', '参照分析、運動モデル、レンダリングを担当。', ['実ゲーム録画と自作レンダを9コマずつ、同じ時間軸で並べて差を検証しました。']),
      chapter('background', '背景・課題', 'ばらばらな動きを、個別調整なしで再現する。', ['多数のキューブが違うタイミングに見える原因を、時間差ではなく方向と振幅の差として捉え直しました。']),
      chapter('implementation', '実装・工夫', '全キューブが一つの時間曲線を読む。', ['HOLD 0–1.10s、DISSOLVE 1.10–1.44s、BURST 1.44s、DRIFT 1.44–4.6s。位置はhome + offset × E(τ)で求めます。'], ['SNAP τ=1.47–1.60', 'DECELERATE 1.60–2.60', 'ACCELERATE 2.60–3.25']),
      chapter('result', '結果・到達点', '方向と距離だけで、まとまりとばらつきを両立。', ['30fps・132フレームの比較レンダを約75秒で生成し、時間軸をそろえた検証ができました。'], ['132 FRAMES / ~75 sec', 'GAME 9 FRAMES ↔ RENDER 9 FRAMES']),
      chapter('next', '現在の課題', '別の形にも使える運動文法へ広げる。', ['盤面だけでなく文字や任意形状でも、同じ曲線の性質が保たれるかを検証します。']),
    ], links: [],
  },
  {
    id: '11', slug: 'cooking-ai-league', title: 'はじめてのおつかい', year: 2025, category: 'Digital Twin', group: 'AI・学習',
    shortDescription: '体育の授業で自作した競技をデジタルツイン化し、5種のAIでメタ戦法を探してルール調整へ還元。',
    role: '競技設計 / 環境設計 / 5種の学習器実装 / リーグ評価', tech: ['Python', 'CEM', 'GA', 'REINFORCE', 'Q-Learning'],
    sections: [
      chapter('overview', '概要', '体育の授業で作った競技を、AIが先に何度も試すデジタルツインへ。', ['「はじめてのおつかい」は、体育の授業で自作した、スーパーを模したフィールドで食材を取り合い、完成したレシピの得点を競う競技です。人間の大会前に支配的な戦法を見つけてルールを調整するため、競技をデジタルツイン化し、5種のAIが戦うリーグを構築しました。食材7種・行動8種・レシピ6種を使い、全レシピの組合せはDFSで厳密に全探索します。最高得点のレシピはスペシャルカレーの12点で、余った食材は1個につき-2点です。'], ['7 INGREDIENTS / 8 ACTIONS', '6 RECIPES / STOCK 56']),
      chapter('role', '自分の担当', '競技そのものの設計から、5種の学習器、評価と可視化までを担当。', ['体育の授業で行う競技の設計に加え、シミュレーション環境、CEM・GA・REINFORCE・Q学習・自己符号化NNの実装、学習済みモデルの保存、リーグ評価を担当しました。pygameでは1600×960の棚とレジ行列を描画でき、cooking_ai.pyは1,351行です。'], ['5 LEARNERS', 'PYGAME 1600×960', '1,351 LINES']),
      chapter('background', '背景・課題', '一つの強すぎる戦法が、人間の競技を始める前に壊してしまう。', ['特定の戦法だけで勝てる状態になると、選択肢が形骸化し、競技としての面白さが失われます。そこで人間の大会を開く前にAI同士で試合を重ね、支配的なメタ戦法を発見してルールを調整するシミュレーションが必要でした。比較条件をそろえるため、方策は全AIで共通の線形softmaxとし、29次元の特徴量から8行動を選ぶ232重みに統一しました。自己符号化NNだけは14→64→14の表現と512パラメータのヘッドを持ち、合計2,382パラメータです。'], ['FEATURES 29 × ACTIONS 8', '232 WEIGHTS', 'NN 2,382 PARAMETERS']),
      chapter('implementation', '実装・工夫', '行動時間とレジ待ちを進め、世代を跨いで自己対戦する。', ['次に手が空いたチームが行動するイベント駆動型とし、1サイクルの時間は切断正規分布N(30,5)秒に、3台のレジでuniform(5,10)秒のサービスを受ける待ち時間を加えました。学習済みモデルはJSON形式の.cookaiファイルで保存し、次の学習では17個のモデルファイルを対戦相手プールへ自動ロードします。適合度は平均スコア − 5.0×(平均順位−1)で、得点と順位の両方を評価します。'], ['N(30,5) sec + REGISTER QUEUE', '3 REGISTERS / uniform(5,10) sec', '17 .cookai MODELS']),
      chapter('result', '結果・到達点', '10,000戦で、REINFORCEが平均10.76点の首位になった。', ['CEMはpop300×100iter、GAはpop200×200iter、REINFORCEは60,000エピソード、Q学習は80,000エピソードを学習しました。リーグ戦ではREINFORCEが1位34.4%・2位47.3%で上位2着81.7%。平均得点はREINFORCE 10.76、CEM 9.14、NN 6.47、Q学習 6.07、GA 5.95でした。特定AIが突出する戦法の傾向を観察し、競技ルールを調整する材料にできます。'], ['LEAGUE 10,000 EPISODES', 'REINFORCE 10.76 / TOP-2 81.7%', 'CEM 9.14 / NN 6.47 / Q 6.07 / GA 5.95']),
      chapter('next', '現在の課題', '学習器を直し、発見したメタをルールへ還元するループを回す。', ['現在のQ学習は遷移を使わない簡略実装で、TD学習として成立していません。下位に留まった要因を切り分けるため、ステップ単位の学習ログを完成させ、Q学習を修正して再リーグ戦を行います。その結果から見つけたメタ戦法を競技ルールへ還元し、調整後のルールを再びAIリーグで検証するループへつなげます。']),
    ], links: [],
  },
  {
    id: '12', slug: 'fruit-merge-rl', title: 'スイカゲーム強化学習', year: 2025, category: 'RL', group: 'AI・学習',
    shortDescription: '合成パズルの物理環境と報酬を自作し、PPOと遺伝的アルゴリズムで方策を学習。',
    role: '物理環境の自作 / 報酬設計 / PPO・GA学習', tech: ['Python', 'pymunk', 'Gymnasium', 'Stable-Baselines3', 'PyTorch'],
    coverImage: '/works/fruit-merge.png',
    sections: [
      chapter('overview', '概要', '果物を落とし、衝突で育てる物理環境を一から作る。', ['スイカゲーム風の合成パズルをpymunkで実装し、Gymnasium環境として学習器へ接続しました。半径10pxから100pxまでの果物11種があり、同種同士の衝突を合成キューへ積み、物理ステップ後に新しい果物へ差し替えます。'], ['11 FRUITS', 'RADIUS 10 → 100px']),
      chapter('role', '自分の担当', '物理環境、観測と行動、報酬、2つの学習系を構築。', ['衝突と合成を含む環境、PPOの並列学習、チェックポイントと評価ログを実装しました。GA版では312→64→64→31のMLPを、pop50・エリート2・トーナメントk=3で進化させます。'], ['GA 26,207 PARAMETERS', 'POP 50 / ELITE 2 / TOURNAMENT k=3']),
      chapter('background', '背景・課題', '高速な物理計算と、先の合成を促す報酬を両立する。', ['観測は果物50個の6要素、次の果物のone-hot 11、終了フラグを合わせた312次元です。行動はX座標30分割と待つの31種。1行動を30フレーム、各フレームを10サブステップに分け、1行動あたり300回積分してトンネリングを防ぎました。'], ['OBSERVATION 312D', 'ACTION 31', '300 PHYSICS STEPS / ACTION']),
      chapter('implementation', '実装・工夫', '合成、生存、待機、盤面の詰まりを別々に評価する。', ['合成報酬は(ランク+1)²で、スイカ生成は121点。生存に+0.05/step、待つ行動に-0.1、同種が複数ある場合は(個数-1)²×0.1の罰、ゲームオーバーに-100を与えました。先行2ランは報酬設計の変更前に悪化したため打ち切り、3本目を本番の学習としました。'], ['WATERMELON +121', 'SURVIVAL +0.05 / WAIT -0.1', 'GAME OVER -100']),
      chapter('result', '結果・到達点', '平均報酬は418から1,015へ、約2.4倍になった。', ['PPOを4並列環境、M1 MacのCPUのみで3,006,464ステップ学習し、171〜194fpsで進みました。最高報酬は1,524。entropy lossは-3.26から-1.03へ変化し、方策はより決定的になりました。40,000ステップ刻みで75個のチェックポイントを保存しています。'], ['3,006,464 STEPS / 4 ENVS', '418 → 1,015 / BEST 1,524', '171–194 FPS / 75 CHECKPOINTS']),
      chapter('next', '現在の課題', '価値関数を機能させ、報酬の尺度をそろえる。', ['全学習を通じてexplained_varianceは0.0000のままで、価値関数が機能していません。報酬スケールの混在が原因とみて、報酬正規化を導入して再検証します。']),
    ], links: [],
  },
  {
    id: '13', slug: 'ai-secretary', title: 'AI秘書ワークスペース', year: 2026, category: 'AI Ops', group: 'プロダクト・ツール',
    shortDescription: 'Claude Codeを仮想組織として常駐運用し、情報整理と一日の段取りをスキルで自動化。',
    role: '運用設計 / スキル実装 / 3.5ヶ月の継続運用', tech: ['Claude Code', 'Skills', 'MCP', 'Python', 'Slack API'],
    coverImage: '/works/ai-secretary-claude.png',
    sections: [
      chapter('overview', '概要', 'すべての入力を秘書が受け、一日の仕事へ整理する。', ['Claude Codeを「秘書のいる仮想組織」として常駐運用する個人ワークスペースです。土台にはオープンソースのcc-companyプラグインを導入し、フォルダを部署とする構造の上に、自作スキル8本と運用ルールを構築しました。'], ['OPEN SOURCE cc-company BASE', '8 CUSTOM SKILLS']),
      chapter('role', '自分の担当', '日々使い続けられる情報経路と自動化スキルを設計。', ['プラグイン導入後の運用設計、自作スキルの実装、外部サービスとの接続、日々の改善を担当しました。入力は秘書が受け、inboxからtodos・notes・journalへ目的別に振り分けます。']),
      chapter('background', '背景・課題', '自動化しても、記録の所在と時間順を崩さない。', ['すべてのスキルで「同日1ファイル・追記のみ・上書き禁止・操作前にdate確認」を共通ルールにしました。過去ログは全日分を読まず、1行要約の_index.mdで日付を特定してから該当日だけを読み、トークン消費を抑えます。'], ['APPEND ONLY', '1-LINE _index.md']),
      chapter('implementation', '実装・工夫', '朝の判断と情報収集を、532行の定型ルーティンへ集約する。', ['inbox処理、カレンダーとClassroom、Gmail未読、前日のSlack、ニュース40件から本文を読んだTop7の選定、前日ジャーナルの締めを順に実行します。空き時間から45〜90分の作業ブロックを逆算してカレンダーへ登録し、日次サマリーをSlackへ送信します。会話はtalk-logスキルが日次ファイルへ要約追記し、ScheduleWakeupで自分を再起動してループを継続します。'], ['MORNING ROUTINE 532 LINES', 'NEWS 40 → TOP 7', 'WORK BLOCKS 45–90 min']),
      chapter('result', '結果・到達点', '3.5ヶ月の運用が、281ファイル・16,312行の記録になった。', ['2026-04〜08の運用で、journal 57、todos 70、Slackダイジェスト51、会話ログ32、notes 53を蓄積しました。毎日の入力と外部情報を、後から日付とトピックの両方で辿れる状態にしています。'], ['MARKDOWN 281 FILES / 16,312 LINES', 'JOURNAL 57 / TODOS 70', 'SLACK 51 / TALK 32 / NOTES 53']),
      chapter('next', '現在の課題', '分散したスキルをまとめ、別の環境でも再現できる構成にする。', ['運用開始から4ヶ月経っても、部署は秘書室1つのままです。スキルもユーザー領域とプロジェクト領域に分散し、リポジトリ単体では再現できません。構成を整理し、ワークスペースごと持ち運べる状態を目指します。']),
    ], links: [],
  },
  {
    id: '14', slug: 'ai-paper-trader', title: 'AI模擬トレーダー', year: 2026, category: 'Web App', group: 'プロダクト・ツール',
    shortDescription: 'AIによる日本株の模擬売買を、判断理由と資産推移から観察するWebアプリ。',
    role: 'フルスタック実装 / AI運用の観察設計', tech: ['FastAPI', 'SQLite', 'React', 'TypeScript', 'Recharts'],
    coverImage: '/works/ai-paper-trader.png',
    sections: [
      chapter('overview', '概要', 'AIの模擬売買を、理由と資産の変化から観察する。', ['仮想資金100万円の日本株ポートフォリオをClaudeが模擬売買し、判断理由つきの取引ログと資産推移を表示するWebアプリです。実際のお金は動かず、すべてシミュレーションとして運用します。'], ['VIRTUAL CAPITAL ¥1,000,000', 'PAPER TRADING ONLY']),
      chapter('role', '自分の担当', '取引APIから記録、ダッシュボードまでを一貫して実装。', ['FastAPIとSQLiteのバックエンド、Reactのフロントエンド、AIが状態を読み直す運用経路を実装しました。コード規模はPython 541行、TS/TSX 675行です。'], ['PYTHON 541 LINES', 'TS/TSX 675 LINES']),
      chapter('background', '背景・課題', '売買結果だけでなく、その時点の判断理由を残す。', ['意思決定はアプリの外でClaudeが行い、APIを叩く際の理由文をreasoningカラムへ保存します。60秒ごとにstatus.mdを書き出し、AIが次のセッションで現金と持ち高を読み直せる外部メモリにしました。'], ['STATUS.md EVERY 60 sec', 'REASONING 59–134 CHARACTERS']),
      chapter('implementation', '実装・工夫', '取引と資産記録を、一つのトランザクションで確定する。', ['SQLiteはportfolio・holdings・trades・snapshotsの4テーブル、APIは8エンドポイントです。取引時は現金、保有数、平均取得単価、履歴を1トランザクションで更新し、直後に資産スナップショットを自動保存します。株価はYahoo Finance chart APIを直接取得し、失敗時はStooq CSVへフォールバックします。'], ['4 TABLES / 8 ENDPOINTS', 'SNAPSHOT ON EVERY TRADE', 'YAHOO FINANCE → STOOQ']),
      chapter('result', '結果・到達点', '約1ヶ月で、資産は100万円から1,019,924円になった。', ['2026-04-14〜05-13に14件の取引を行い、買い9件・売り5件のすべてに理由を残しました。資産は途中で最低982,030円となり、最終的に+1.99%。7銘柄を扱い、最終保有は3銘柄と現金1,361円でした。自分で定めた-5%のストップロスには、-5.35%で実際に発動した記録があります。フロントはReact 19、Vite、Tailwind v4を使い、Rechartsの資産推移、lightweight-chartsのローソク足を60秒ごとに更新します。'], ['14 TRADES / BUY 9 / SELL 5', '¥1,000,000 → ¥1,019,924 (+1.99%)', 'LOW ¥982,030 / CASH ¥1,361']),
      chapter('next', '現在の課題', '損益記録を取引データへ組み込み、外部公開を完成させる。', ['実現損益カラムがなく、売却時のavg_cost更新もないため、損益は取引履歴から再計算しています。公開用トンネルとCORS・baseURLも噛み合っておらず、外部公開は未完です。']),
    ], links: [],
  },
  {
    id: '15', slug: 'vowel-viz', title: '母音の物理', year: 2025, category: 'Research', group: '表現・身体',
    shortDescription: '声道の形を動かし、断面積・フォルマント・合成音の関係を確かめる対話ツール。',
    role: '声道モデル設計 / DSP自前実装 / 可視化', tech: ['Python', 'NumPy', 'Matplotlib', 'DSP'],
    coverImage: '/works/voiceai-ui.png',
    sections: [
      chapter('overview', '概要', '喉の形を動かし、母音の物理を目と耳で確かめる。', ['歌唱時の喉の動きを理解するため、舌・顎・唇・喉頭の断面形状をスライダーで操作し、声道の断面積関数と推定フォルマントの変化を表示する対話ツールです。その母音は合成音として書き出せます。GUIフレームワークを使わず、matplotlibのwidgetsだけで構築しました。']),
      chapter('role', '自分の担当', '声道モデル、音響処理、操作と検証を一つにつなぐ。', ['調音パラメータ9自由度と筋肉7種の活動度を示す濃淡バー、断面積関数、フォルマント推定、母音合成、WAV出力とFFT検証を実装しました。顎・唇・舌3種・喉頭高・声門内転・輪状甲状筋・軟口蓋を操作でき、声帯の隙間は最大2mmです。'], ['ARTICULATION 9 DOF', '7 MUSCLES', 'GLOTTAL GAP MAX 2mm']),
      chapter('background', '背景・課題', '見えない声道を、単純な形と測れる音へ置き換える。', ['声道は長さ0.09mの1次元区間とし、口蓋を余弦ドーム、舌を単一ガウス山、床を顎開度で平行移動する3曲線で表しました。その隙間と奥行き0.02mから、200点の断面積関数を計算します。'], ['VOCAL TRACT 0.09m', 'DEPTH 0.02m / 200 SAMPLES']),
      chapter('implementation', '実装・工夫', '調波音源をフィルタへ通し、母音ごとの共鳴を作る。', ['f0=140Hzの40倍音を-12dB/octで減衰させ、母音別の3フォルマント帯域通過をバイキャッドで縦続し、唇放射の微分を加えました。44.1kHz・16bitで1.2秒の音を5母音分書き出します。Auto-fitは座標降下法を60イテレーション行い、5パラメータを動かして推定F1/F2を目標母音へ寄せます。'], ['f0 140Hz / 40 HARMONICS', '44.1kHz / 16bit / 1.2 sec × 5', 'AUTO-FIT 60 ITERATIONS / 5 PARAMETERS']),
      chapter('result', '結果・到達点', 'FFTで、狙ったフォルマント付近の倍音が強まることを確認した。', ['出力WAVでは、/a/が700・1120Hz、/i/が280・2239Hzにピークを持ちました。目標値の/a/ 730・1090Hz、/i/ 300・2200Hzに最も近い倍音が選択的に強調され、合成器が設計どおり動くことを実測で確認しました。'], ['/a/ 700 / 1120Hz', '/i/ 280 / 2239Hz', 'TARGET 730 / 1090, 300 / 2200Hz']),
      chapter('next', '現在の課題', '動かした形そのものから、鳴る音を計算する。', ['形状から推定するフォルマントと、合成音に使う標準フォルマント表が分離しています。断面積関数から伝達関数を直接計算し、動かした形の音が鳴る状態へ進めます。現在は定常母音のみで、ビブラートと母音間の遷移も未着手です。']),
    ], links: [],
  },
  {
    id: '16', slug: 'tracking-cat', title: 'デスクトップの猫', year: 2025, category: 'Desktop Mascot', group: '表現・身体',
    shortDescription: '作業を邪魔せず、すべてのデスクトップでマウスを追いかける透明な猫。',
    role: 'Electron実装 / ウィンドウ透過の設計', tech: ['Electron', 'JavaScript', 'CSS'],
    coverImage: '/works/tracking-cat2.gif',
    sections: [
      chapter('overview', '概要', 'クリックを通しながら、猫だけがマウスを追いかける。', ['デスクトップ全面を覆う透明なElectronウィンドウ上を、GIFの猫がマウスに追従して歩くマスコットです。全119行で、下のアプリをそのまま操作できます。'], ['119 LINES', 'TRANSPARENT / CLICK-THROUGH']),
      chapter('role', '自分の担当', '透明ウィンドウと、邪魔をしない追従挙動を実装。', ['Electronのウィンドウ設定、rendererの追従、向きの切り替え、作業領域への配置を担当しました。透過はframe:false・transparent:true・hasShadow:false、setBackgroundColor(\'#00000000\')、CSSのbackground:transparentという3層で通しています。'], ['3-LAYER TRANSPARENCY']),
      chapter('background', '背景・課題', '見えて追従しても、普段のクリックは奪わない。', ['setIgnoreMouseEvents(true, {forward:true})により、クリックは下のアプリへ通し、マウス移動だけをrendererへ届けます。作業を妨げずに、カーソル位置を追える構成にしました。']),
      chapter('implementation', '実装・工夫', '小さく追従し、50pxの余白で向きの振動を止める。', ['requestAnimationFrameのループでx += (target-x)×0.025と補間します。カーソルが真上にあるときに左右反転を繰り返さないよう、向きの判定へ50pxのデッドゾーンを追加しました。0.03から0.025、dx<0からdx<-50へ調整した履歴をgitに残しています。'], ['LERP 0.03 → 0.025', 'DIRECTION DEAD ZONE 50px']),
      chapter('result', '結果・到達点', 'デスクトップを切り替えても付き、フルスクリーンでは姿を消す。', ['setVisibleOnAllWorkspaces(true)で全Spaceに表示し、visibleOnFullScreen:falseで動画やプレゼンのフルスクリーンには表示しません。ウィンドウはworkAreaを基準にDockとメニューバーを避けます。スプライトは猫2種・鳥・お化けの4種です。'], ['ALL SPACES', '4 SPRITES']),
      chapter('next', '現在の課題', 'クリックに頼らない終了と切り替えの入口を作る。', ['クリックスルーのため終了UIがなく、現在はCmd+Q頼みです。トレイメニューとマスコット切り替えUIを追加します。']),
    ], links: [],
  },
  {
    id: '17', slug: 'fairy-assistant', title: 'デスクトップ妖精', year: 2025, category: 'Experiment', group: '表現・身体',
    shortDescription: '画面を読み、助言を返す妖精を目指した実験段階のデスクトップマスコット。',
    role: '構想 / renderer実装 / LLM接続検証', tech: ['Electron', 'Tesseract.js', 'LLM API'],
    coverImage: '/works/fairy.gif',
    sections: [
      chapter('overview', '概要', '画面を見て助言する妖精を、実験段階のまま記録する。', ['デスクトップの猫の発展形として、30秒ごとに画面をキャプチャし、OCRした内容からLLMが助言を生成して、妖精の頭上へ表示する構想です。現在は実験段階で、mainプロセスがLLM接続テストのスクリプトに置き換わったまま保存されており、ウィンドウは起動しません。'], ['EXPERIMENTAL', 'CURRENTLY NOT LAUNCHABLE']),
      chapter('role', '自分の担当', '追従と会話UIを作り、LLM接続の選択肢を検証。', ['renderer側のマウス追従、モード切り替え、吹き出しUIを実装しました。妖精のGIFは100フレームで、生成した助言は頭上に表示し、3秒でフェードアウトする設計です。'], ['GIF 100 FRAMES', 'BUBBLE 3 sec']),
      chapter('background', '背景・課題', 'ただ追いかける存在から、画面の状況へ反応する存在へ進める。', ['キャラクター表示だけでなく、見えている作業を読み取って短い助言を返すマスコットを目指しました。画面取得、文字認識、LLM、デスクトップUIを途切れない一本の流れにする必要があります。']),
      chapter('implementation', '実装・工夫', '自動と手動を分け、画面を見るタイミングを選べるようにする。', ['キャラクターのみ、Cキーで手動キャプチャ、30秒ごとの自動キャプチャという3モードを設計しました。自動モード中はマウス追従を停止します。LLMバックエンドはOpenAI・HuggingFace・Clarifaiの3系統で接続を検証しました。'], ['3 MODES', 'CAPTURE EVERY 30 sec', '3 LLM BACKENDS']),
      chapter('result', '結果・到達点', 'rendererは動いたが、本線のパイプラインは未完成。', ['追従、モード切り替え、吹き出しの表示までは実装済みです。一方で接続検証の途中状態を統合できておらず、キャプチャからOCR、助言までを通したデスクトップアプリとしては動作しません。']),
      chapter('next', '現在の課題', 'main側を組み直し、画面から助言までを一本につなぐ。', ['LLM接続テストへ置き換わったmainプロセスを戻し、キャプチャ→OCR→助言の本線パイプラインをElectronのウィンドウ起動と統合します。']),
    ], links: [],
  },
  {
    id: '18', slug: 'site-blocker', title: 'サイトブロッカー', year: 2025, category: 'Extension', group: 'プロダクト・ツール',
    shortDescription: 'YouTubeを見る自分を、タスク管理シートへ強制的に戻すChrome拡張。',
    role: '自分用ツールの即席実装', tech: ['Chrome Extension', 'Manifest V3'],
    coverImage: '/works/site-blocker-card.png',
    sections: [
      chapter('overview', '概要', '見すぎたサイトから、やるべきことの一覧へ強制的に戻す。', ['YouTube Shortsを見すぎる自分を止めるために作ったChrome拡張です。対象URLを開くと、ブロック専用ページではなく、自分のタスク管理スプレッドシートへタブごと移動させます。'], ['DEPENDENCIES 0']),
      chapter('role', '自分の担当', '必要な判定だけを、9分で使える道具にする。', ['service workerは35行、manifestは18行で、依存はありません。ファイル更新時刻では着手から完成まで9分でした。'], ['SERVICE WORKER 35 LINES', 'MANIFEST 18 LINES', '9 min']),
      chapter('background', '背景・課題', '作業用の音楽を残し、脱線する閲覧だけを止める。', ['名前はShortsブロッカーですが、実装ではMusicを除くYouTube全体を塞いでいます。目的を外れた閲覧を止めながら、作業BGMとして使うmusic.youtube.comは残しました。']),
      chapter('implementation', '実装・工夫', '許可を先に判定し、対象タブの行き先をその場で変える。', ['Manifest V3のservice workerでtabs.onUpdatedを監視し、URL確定時に4段階で判定します。music.youtube.comをendsWithで明示許可し、次にyoutube.com全体、tetr.ioをブロックし、それ以外を許可します。対象ならchrome.tabs.updateでタスク管理シートへ移動します。'], ['MANIFEST V3', '4-STAGE URL CHECK']),
      chapter('result', '結果・到達点', '注意画面ではなく、次の行動そのものを表示する。', ['設定や依存を増やさず、対象サイトを開いたタブにタスク管理シートを直接見せる自分用の仕組みとして完成しました。']),
      chapter('next', '現在の課題', '再生前に止め、対象サイトを画面から変更できるようにする。', ['tabs.onUpdatedのstatus completeを待つため、動画が数秒再生されてから移動します。declarativeNetRequestへ移行し、ブロック対象を変更できる設定画面を追加します。']),
    ], links: [],
  },
] as const

export function findWork(idOrSlug: string): Work | undefined {
  return works.find((work) => work.id === idOrSlug || work.slug === idOrSlug)
}
