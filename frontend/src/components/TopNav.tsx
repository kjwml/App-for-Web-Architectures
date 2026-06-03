import { NavLink, useNavigate } from 'react-router-dom'

const TopNav = () => {
  const navigate = useNavigate()

  return (
    <header className="page-card" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Community Challenges</h1>
        <span style={{ color: '#6e72a5' }}>Create, discover, track.</span>
      </div>
      <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <button className="small-button secondary" onClick={() => navigate('/create')}>Create Challenge</button>
      </nav>
    </header>
  )
}

export default TopNav
