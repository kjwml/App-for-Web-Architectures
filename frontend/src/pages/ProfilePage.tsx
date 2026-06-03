import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import authFetch from '../utils/authFetch'
import type { Challenge, Post, User } from '../types'

const ProfilePage = () => {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [friends, setFriends] = useState<User[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const userId = id || 'current'
    const load = async () => {
      const userResponse = await authFetch(`/api/users/${userId}`)
      if (userResponse.ok) {
        setUser(await userResponse.json())
      }

      const friendsResponse = await authFetch('/api/users')
      if (friendsResponse.ok) {
        setFriends(await friendsResponse.json())
      }

      const challengeResponse = await authFetch('/api/challenges')
      if (challengeResponse.ok) {
        setChallenges(await challengeResponse.json())
      }

      const postsResponse = await authFetch(`/api/users/${userId}/posts`)
      if (postsResponse.ok) {
        setPosts(await postsResponse.json())
      }
    }

    load()
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

      <div className="page-card">
        <h3>Published profile posts</h3>
        {posts.length === 0 ? (
          <p>No published posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #ebeffc' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{post.type}</p>
              <p style={{ margin: '8px 0 0' }}>{post.message}</p>
              <small style={{ color: '#6e72a5' }}>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default ProfilePage
