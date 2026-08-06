import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

document.documentElement.classList.add('js')
document.querySelector<HTMLElement>('[data-prerender-content]')?.setAttribute('aria-hidden', 'true')

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)
