/**
 * AI使用の開示（神山まるごと高専 AIガイドライン準拠）
 *
 * 本リポジトリの実装コードの雛形と大部分は、Codex CLI（gpt-5.6-sol）と
 * Claude Code（Claude Fable 5）で生成し、本人がレビュー・指示・検証のうえ手動で修正した。
 * 生成期間: 2026-08-06〜2026-08-07。
 * プロンプト概要: 本人作成の絵コンテ5枚・口頭の修正指示・課題ルーブリックを仕様として、
 * 段階的なブリーフ（構造→データ→遷移演出→修正→作品追加）に分割して指示。
 * 作品説明文は本人プロジェクトの実測値をもとにAIが下書きし、本人が事実確認・修正した。
 * 詳細は SUBMISSION.md「AI使用の開示」を参照。
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

document.documentElement.classList.add('js')
document.querySelector<HTMLElement>('[data-prerender-content]')?.setAttribute('aria-hidden', 'true')

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)
