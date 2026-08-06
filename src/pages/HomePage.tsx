import { HeroCanvas } from '../components/HeroCanvas'
import { IntroScenes } from '../components/IntroScenes'

export function HomePage() {
  return <main id="main" tabIndex={-1}><HeroCanvas /><IntroScenes /></main>
}
