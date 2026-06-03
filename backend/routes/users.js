import { Router } from 'express'
import { posts, users } from '../data.js'

const router = Router()

const resolveUserId = (req) => {
  if (req.params.id === 'current') {
    return req.user?.id || req.user?.userId
  }
  return req.params.id
}

router.get('/', (req, res) => {
  res.json(users)
})

router.get('/:id', (req, res) => {
  const userId = resolveUserId(req)
  const user = users.find((item) => item.id === userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(user)
})

router.post('/:id/friends', (req, res) => {
  const userId = resolveUserId(req)
  const user = users.find((item) => item.id === userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  const friendId = req.body.friendId
  if (friendId && !user.friends.includes(friendId)) {
    user.friends.push(friendId)
  }
  res.json(user)
})

router.get('/:id/posts', (req, res) => {
  const userId = resolveUserId(req)
  const userPosts = posts.filter((post) => post.authorId === userId && post.publishedToProfile)
  res.json(userPosts)
})

export default router
