import { Routes, Route, Navigate } from 'react-router-dom'
import TopNav from './components/TopNav'
import DiscoverPage from './pages/DiscoverPage'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import ChallengePage from './pages/ChallengePage'
import CreateChallengePage from './pages/CreateChallengePage'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/profile/:id?" element={<ProfilePage />} />
          <Route path="/challenge/:id" element={<ChallengePage />} />
          <Route path="/create" element={<CreateChallengePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
