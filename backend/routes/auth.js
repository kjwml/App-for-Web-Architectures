import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const router = Router()
const secret = process.env.JWT_SECRET || 'default-secret'

const users = [
  { id: 'user1', username: 'user1', passwordHash: '$2a$10$EFjzsBlBbILuo5Ohw/t/U..xTQVngbtozNcjDDCstZeb/iPxosBcO', name: 'Demo User 1' },
  { id: 'user2', username: 'user2', passwordHash: '$2a$10$EFjzsBlBbILuo5Ohw/t/U..xTQVngbtozNcjDDCstZeb/iPxosBcO', name: 'Demo User 2' }
]

router.post('/signup', async (req, res) => {
  const { username, password, name } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' })
  }

  if (users.some((u) => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists' })
  }

  const passwordHash = await bcryptjs.hash(password, 10)
  const id = `user${Date.now()}`

  const newUser = {
    id,
    username,
    passwordHash,
    name: name || username
  }

  users.push(newUser)

  const payload = { id, username, name: newUser.name }
  const token = jwt.sign(payload, secret, { expiresIn: '7d' })

  res.status(201).json({ token, user: payload })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' })
  }

  const user = users.find((u) => u.username === username)
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  const validPassword = await bcryptjs.compare(password, user.passwordHash)
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  const payload = { id: user.id, username: user.username, name: user.name }
  const token = jwt.sign(payload, secret, { expiresIn: '7d' })

  res.status(200).json({ token, user: payload })
})

export default router
