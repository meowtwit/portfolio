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
    links: [],
  },
  {
    id: '03', slug: 'quoridor-ai', title: 'コリドールAI', year: 2026, category: 'Game AI', group: 'AI・学習',
    shortDescription: '複数の思考エンジンを差し替え、経路と壁の一手を比較するボードゲームAI。',
    role: 'アルゴリズム設計 / C++実装 / 対戦評価', tech: ['C++20', 'MCTS', 'Beam Search'],
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
    coverImage: '/works/linegraphify-mickey.png',
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
    coverImage: '/works/fractal-octopus.png',
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
] as const

export function findWork(idOrSlug: string): Work | undefined {
  return works.find((work) => work.id === idOrSlug || work.slug === idOrSlug)
}
