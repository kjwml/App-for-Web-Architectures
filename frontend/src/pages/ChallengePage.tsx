import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import authFetch from '../utils/authFetch'
import type { Challenge, Post } from '../types'

const currentUserId = 'current'

const ChallengePage = () => {
  const { id } = useParams()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoaded, setPostsLoaded] = useState(false)
  const [message, setMessage] = useState('')
  const [publishToProfile, setPublishToProfile] = useState(false)
  const [joinMessage, setJoinMessage] = useState('')

  useEffect(() => {
    if (!id) return
    setPostsLoaded(false)

    const load = async () => {
      const challengeResponse = await authFetch(`/api/challenges/${id}`)
      if (challengeResponse.ok) {
        setChallenge(await challengeResponse.json())
      }

      const postsResponse = await authFetch(`/api/challenges/${id}/posts`)
      if (postsResponse.ok) {
        setPosts(await postsResponse.json())
      }
      setPostsLoaded(true)
    }

    load()
  }, [id])

  const handlePost = async () => {
    if (!id || !message.trim()) return

    const response = await authFetch(`/api/challenges/${id}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'note',
        message: message.trim(),
        publishedToProfile: publishToProfile
      })
    })

    if (response.ok) {
      setMessage('')
      setPublishToProfile(false)
      const postsResponse = await authFetch(`/api/challenges/${id}/posts`)
      if (postsResponse.ok) {
        setPosts(await postsResponse.json())
      }
    }
  }

  const handleJoin = async () => {
    if (!id) return
    try {
      const response = await authFetch(`/api/challenges/${id}/join`, { method: 'POST' })
      const result = await response.json()
      setJoinMessage(result.message)
      if (response.status === 200) {
        const challengeResponse = await authFetch(`/api/challenges/${id}`)
        if (challengeResponse.ok) {
          setChallenge(await challengeResponse.json())
        }
      }
    } catch (error) {
      setJoinMessage('Unable to process join request')
    }
  }

  const isMember = challenge?.members?.includes(currentUserId)

  return (
    <section>
      <div className="page-card">
        <div className="label-row">
          <div>
            <h2>{challenge?.name ?? 'Challenge details werden geladen...'}</h2>
            <p>
              {challenge ? `${challenge.category} • ${challenge.duration} • ${challenge.isPrivate ? 'Private' : 'Public'}` : 'Kategorie • Dauer • Sichtbarkeit'}
            </p>
          </div>
          <span>{challenge ? (challenge.approved ? 'Approved' : 'Awaiting approval') : 'Status wird geladen...'}</span>
        </div>
        <p>{challenge?.description ?? 'Hier erscheinen die Ziele und Regeln der Challenge...'}</p>
        <p style={{ marginTop: 14, color: '#5e6393' }}>
          {challenge
            ? `Strafen: ${challenge.penalties} • Strike lost if ${challenge.strikeLostIf}`
            : 'Strafen und Bedingungen werden geladen...'}
        </p>
        {challenge && !isMember && (
          <div style={{ marginTop: 16 }}>
            <button className="small-button secondary" onClick={handleJoin}>
              {challenge.isPrivate ? 'Request to join' : 'Join challenge'}
            </button>
            {joinMessage && <p style={{ marginTop: 12, color: '#3c7bff' }}>{joinMessage}</p>}
          </div>
        )}
      </div>

      <div className="page-card">
        <h3>Posts in this challenge</h3>
        {posts.length === 0 ? (
          postsLoaded ? (
            <p>No posts yet. Share your proof photos, notes or files to keep your streak alive.</p>
          ) : (
            <p>Alle schon hochgeladenen Beiträge werden direkt angezeigt, sobald die Seite fertig geladen ist.</p>
          )
        ) : (
          posts.map((post) => (
            <div key={post.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #ebeffc' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{post.type}</p>
              <p style={{ margin: '8px 0 0' }}>{post.message}</p>
              <small style={{ color: '#6e72a5' }}>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}

        <div style={{ marginTop: 18 }}>
          <textarea
            className="textarea-field"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a note or paste a link to a proof photo / file"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={publishToProfile}
                onChange={(event) => setPublishToProfile(event.target.checked)}
              />
              Auf meinem Profil veröffentlichen, damit Freunde es sehen können
            </label>
          </div>
          <button className="small-button" onClick={handlePost} style={{ marginTop: 10 }}>Post proof</button>
        </div>
      </div>
    </section>
  )
}

export default ChallengePage
