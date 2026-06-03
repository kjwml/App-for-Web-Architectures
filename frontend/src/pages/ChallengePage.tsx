import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import type { Challenge, Post } from '../types'

const ChallengePage = () => {
  const { id } = useParams()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!id) return
    axios.get(`/api/challenges/${id}`).then((response) => setChallenge(response.data))
    axios.get(`/api/challenges/${id}/posts`).then((response) => setPosts(response.data))
  }, [id])

  const handlePost = async () => {
    if (!id || !message.trim()) return
    await axios.post(`/api/challenges/${id}/posts`, {
      type: 'note',
      message: message.trim()
    })
    setMessage('')
    const response = await axios.get(`/api/challenges/${id}/posts`)
    setPosts(response.data)
  }

  if (!challenge) {
    return <div className="page-card">Loading challenge…</div>
  }

  return (
    <section>
      <div className="page-card">
        <div className="label-row">
          <div>
            <h2>{challenge.name}</h2>
            <p>{challenge.category} • {challenge.duration} • {challenge.isPrivate ? 'Private' : 'Public'}</p>
          </div>
          <span>{challenge.approved ? 'Approved' : 'Awaiting approval'}</span>
        </div>
        <p>{challenge.description}</p>
        <p style={{ marginTop: 14, color: '#5e6393' }}>
          Strafen: {challenge.penalties} • Strike lost if {challenge.strikeLostIf}
        </p>
      </div>

      <div className="page-card">
        <h3>Posts in this challenge</h3>
        {posts.length === 0 ? (
          <p>No posts yet. Share your proof photos, notes or files to keep your streak alive.</p>
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
          <button className="small-button" onClick={handlePost} style={{ marginTop: 10 }}>Post proof</button>
        </div>
      </div>
    </section>
  )
}

export default ChallengePage
