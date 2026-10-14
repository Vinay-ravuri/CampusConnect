import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CinematicHero from '../components/CinematicHero'

export default function CinematicExperience() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        background: '#05070B',
        color: '#FFFFFF',
        minHeight: '100vh',
        overflowX: 'clip',
        fontFamily: 'var(--font-heading)',
      }}
    >
      <Navbar isDark={true} />
      <CinematicHero onExploreClick={() => navigate('/welcome#home-hub')} />
    </div>
  )
}
