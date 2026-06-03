import { Router } from 'express'
import { challenges, posts } from '../data.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(challenges)
})

router.get('/:id', (req, res) => {
  const challenge = challenges.find((item) => item.id === req.params.id)
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' })
  }
  res.json(challenge)
})

router.get('/:id/posts', (req, res) => {
  const challengePosts = posts.filter((post) => post.challengeId === req.params.id)
  res.json(challengePosts)
})

router.post('/', (req, res) => {
  const data = req.body
  const id = `c${challenges.length + 1}`
  const newChallenge = {
    id,
    name: data.name,
    description: data.description,
    duration: data.duration,
    category: data.category,
    penalties: data.penalties,
    strikeLostIf: data.strikeLostIf,
    tags: data.tags || [],
    isPrivate: Boolean(data.isPrivate),
    approved: false,
    members: ['current'],
    dueToday: false
  }
  challenges.push(newChallenge)
  res.status(201).json(newChallenge)
})

router.post('/:id/posts', (req, res) => {
  const challenge = challenges.find((item) => item.id === req.params.id)
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' })
  }
  const newPost = {
    id: `p${posts.length + 1}`,
    challengeId: challenge.id,
    authorId: 'current',
    type: req.body.type || 'note',
    message: req.body.message || '',
    createdAt: new Date().toISOString()
  }
  posts.push(newPost)
  res.status(201).json(newPost)
})

export default router
