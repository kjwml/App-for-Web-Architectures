import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ChallengeCard from '../components/ChallengeCard'
import type { Challenge } from '../types'

const DiscoverPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    axios.get('/api/challenges').then((response) => setChallenges(response.data))
  }, [])

  const visibleChallenges = useMemo(() => {
    const lower = query.toLowerCase()
    return challenges.filter((challenge) =>
      challenge.approved &&
      !challenge.isPrivate &&
      [challenge.name, challenge.description, challenge.category, challenge.tags.join(' ')].some((value) => value.toLowerCase().includes(lower))
    )
  }, [challenges, query])

  return (
    <section>
      <div className="page-card">
        <div className="label-row">
          <div>
            <h2>Discover challenges and communities</h2>
            <p>Search by tags, challenge name, category or members.</p>
          </div>
        </div>
        <input
          className="input-field"
          placeholder="Search for tags, challenges or people..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {visibleChallenges.length === 0 ? (
        <div className="page-card">
          <p>No matching challenges found. Try another keyword or create a new challenge.</p>
        </div>
      ) : (
        visibleChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))
      )}
    </section>
  )
}

export default DiscoverPage
