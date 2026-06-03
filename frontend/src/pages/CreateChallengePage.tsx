import { useState } from 'react'
import authFetch from '../utils/authFetch'

const CreateChallengePage = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    duration: '4 weeks',
    category: 'Fitness',
    penalties: 'Strike each missed day',
    strikeLostIf: 'A member misses a required post',
    tags: '',
    isPrivate: true
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const response = await authFetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      })
    })

    if (response.ok) {
      setSaved(true)
    }
  }

  return (
    <section>
      <div className="page-card">
        <h2>Create a new community challenge</h2>
        <p>Fülle die Kriterien aus: Name, Ziel, Dauer, Kategorie, Penalties und Tags.</p>
      </div>
      <form className="page-card" onSubmit={handleSubmit}>
        <label className="label-row">
          <span>Name</span>
          <input
            className="input-field"
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Challenge name"
            required
          />
        </label>
        <label className="label-row">
          <span>Goal / Description</span>
          <textarea
            className="textarea-field"
            rows={4}
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
            required
          />
        </label>
        <div className="label-row" style={{ gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label>Duration</label>
            <input
              className="input-field"
              value={form.duration}
              onChange={(event) => handleChange('duration', event.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Category</label>
            <select
              className="select-field"
              value={form.category}
              onChange={(event) => handleChange('category', event.target.value)}
            >
              <option>Fitness</option>
              <option>Study</option>
              <option>Wellness</option>
              <option>Productivity</option>
            </select>
          </div>
        </div>
        <label className="label-row">
          <span>Penalties</span>
          <input
            className="input-field"
            value={form.penalties}
            onChange={(event) => handleChange('penalties', event.target.value)}
          />
        </label>
        <label className="label-row">
          <span>Strike lost if</span>
          <input
            className="input-field"
            value={form.strikeLostIf}
            onChange={(event) => handleChange('strikeLostIf', event.target.value)}
          />
        </label>
        <label className="label-row">
          <span>Tags</span>
          <input
            className="input-field"
            value={form.tags}
            onChange={(event) => handleChange('tags', event.target.value)}
            placeholder="gym, weekly, accountability"
          />
        </label>
        <label className="label-row" style={{ justifyContent: 'space-between' }}>
          <span>Private challenge (others must request to join)</span>
          <input
            type="checkbox"
            checked={form.isPrivate}
            onChange={(event) => handleChange('isPrivate', event.target.checked)}
          />
        </label>
        <button type="submit" className="small-button">Create challenge</button>
        {saved && <p style={{ marginTop: 12, color: '#3c7bff' }}>Challenge erfolgreich erstellt und ist sofort aktiv.</p>}
      </form>
    </section>
  )
}

export default CreateChallengePage
