import { Link } from 'react-router-dom'
import type { Challenge } from '../types'

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  return (
    <article className="page-card">
      <div className="label-row">
        <div>
          <h2 style={{ margin: '0 0 6px' }}>{challenge.name}</h2>
          <p style={{ margin: 0, color: '#5e6393' }}>{challenge.category} • {challenge.duration}</p>
        </div>
        <span style={{ color: challenge.isPrivate ? '#a34bff' : '#3c7bff' }}>
          {challenge.isPrivate ? 'Private' : 'Public'}
        </span>
      </div>
      <p>{challenge.description}</p>
      <p style={{ marginTop: 12, color: '#6e72a5' }}>Tags: {challenge.tags.join(', ')}</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: 16 }}>
        <Link to={`/challenge/${challenge.id}`} className="small-button" style={{ textDecoration: 'none' }}>View challenge</Link>
      </div>
    </article>
  )
}

export default ChallengeCard
