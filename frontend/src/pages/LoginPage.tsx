import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login'
      const body = isSignup
        ? { username, password, name }
        : { username, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Auth failed')
      }

      localStorage.setItem('authToken', data.token)
      navigate('/discover')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auth fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="page-card">
        <h2>{isSignup ? 'Registrieren' : 'Login'}</h2>
        <p>{isSignup ? 'Erstelle einen neuen Account' : 'Melde dich mit deinen Zugangsdaten an'}</p>
      </div>

      <form className="page-card" onSubmit={handleSubmit}>
        <label className="label-row">
          <span>Username</span>
          <input
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="z.B. user1"
            required
          />
        </label>

        <label className="label-row">
          <span>Passwort</span>
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sicheres Passwort"
            required
          />
        </label>

        {isSignup && (
          <label className="label-row">
            <span>Dein Name (optional)</span>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Max"
            />
          </label>
        )}

        {error && <p style={{ color: '#ec6f62', marginTop: 12 }}>{error}</p>}

        <button type="submit" className="small-button" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Wird geladen...' : isSignup ? 'Registrieren' : 'Login'}
        </button>

        <p style={{ marginTop: 16, textAlign: 'center', color: '#5e6393' }}>
          {isSignup ? 'Hast du schon einen Account? ' : 'Du hast noch keinen Account? '}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup)
              setError('')
            }}
            style={{ background: 'none', border: 'none', color: '#3346ff', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignup ? 'Login' : 'Registrieren'}
          </button>
        </p>
      </form>

      <div className="page-card" style={{ backgroundColor: '#f9fbff', borderLeft: '4px solid #3346ff' }}>
        <h4 style={{ margin: '0 0 8px', color: '#3346ff' }}>Demo-Zugangsdaten</h4>
        <p style={{ margin: '0 0 8px', fontSize: '0.9em' }}>
          <strong>Username:</strong> user1<br />
          <strong>Passwort:</strong> password
        </p>
        <p style={{ margin: '0 0 8px', fontSize: '0.9em' }}>
          <strong>Username:</strong> user2<br />
          <strong>Passwort:</strong> password
        </p>
        <p style={{ fontSize: '0.9em', color: '#5e6393' }}>Oder registriere einen neuen Account!</p>
      </div>
    </section>
  )
}

export default LoginPage
