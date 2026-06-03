import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import type { Challenge, User } from '../types'

const ProfilePage = () => {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [friends, setFriends] = useState<User[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    const userId = id || 'current'
    axios.get(`/api/users/${userId}`).then((response) => setUser(response.data))
    axios.get('/api/users').then((response) => setFriends(response.data))
    axios.get('/api/challenges').then((response) => setChallenges(response.data))
  }, [id])

  const friendList = friends.filter((person) => person.id !== user?.id).slice(0, 5)
  const userChallenges = challenges.filter((challenge) => user?.challenges.includes(challenge.id))

  if (!user) {
    return <div className="page-card">Loading profile…</div>
  }

  return (
    <section>
      <div className="page-card">
        <div className="label-row">
          <div>
            <h2>{user.name}</h2>
            <p>{user.isCurrentUser ? 'Dein Profil' : 'Profil ansehen'}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {user.isCurrentUser ? (
              <>
                <button className="small-button">Sign out</button>
                <button className="small-button secondary">Copy URL</button>
              </>
            ) : (
              <>
                <button className="small-button">Add as friend</button>
                <button className="small-button secondary">Open chat</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="page-card">
        <h3>Friends</h3>
        {friendList.length === 0 ? (
          <p>No friends found yet.</p>
        ) : (
          <ul style={{ paddingLeft: '20px' }}>
            {friendList.map((friend) => (
              <li key={friend.id}>{friend.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="page-card">
        <h3>Challenges</h3>
        {userChallenges.length === 0 ? (
          <p>Keine Challenges aktiv.</p>
        ) : (
          <ul style={{ paddingLeft: '20px' }}>
            {userChallenges.map((challenge) => (
              <li key={challenge.id}>{challenge.name}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default ProfilePage
