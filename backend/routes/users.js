import { Router } from 'express'
import { users } from '../data.js'

const router = Router()

router.get('/', (req, res) => {
  res.json(users)
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  const user = users.find((item) => item.id === id || (id === 'current' && item.id === 'current'))
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(user)
})

router.post('/:id/friends', (req, res) => {
  const user = users.find((item) => item.id === req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  const friendId = req.body.friendId
  if (friendId && !user.friends.includes(friendId)) {
    user.friends.push(friendId)
  }
  res.json(user)
})

export default router
