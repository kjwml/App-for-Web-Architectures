import { useEffect, useState } from 'react'
import authFetch from '../utils/authFetch'
import type { Challenge } from '../types'

const CalendarPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    const load = async () => {
      const response = await authFetch('/api/challenges')
      if (response.ok) {
        setChallenges(await response.json())
      }
    }
    load()
  }, [])

  const dueChallenges = challenges.filter((challenge) => challenge.dueToday && challenge.approved)

  return (
    <section>
      <div className="page-card">
        <h2>Today’s challenge checklist</h2>
        <p>Alle Herausforderungen, bei denen du heute noch etwas posten musst.</p>
      </div>

      {dueChallenges.length === 0 ? (
        <div className="page-card">
          <p>Keine aktuellen Aufgaben für heute. Gute Arbeit!</p>
        </div>
      ) : (
        dueChallenges.map((challenge) => (
          <div className="page-card" key={challenge.id}>
            <div className="label-row">
              <div>
                <h3 style={{ margin: 0 }}>{challenge.name}</h3>
                <p style={{ margin: '6px 0 0', color: '#5e6393' }}>{challenge.category} • {challenge.duration}</p>
              </div>
              <span style={{ color: '#ec6f62' }}>Heute fällig</span>
            </div>
            <p>{challenge.description}</p>
          </div>
        ))
      )}
    </section>
  )
}

export default CalendarPage
