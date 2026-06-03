import express from 'express'
import cors from 'cors'
import challengesRouter from './routes/challenges.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import authenticate from './middleware/authenticate.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/challenges', authenticate, challengesRouter)
app.use('/api/challenge', authenticate, challengesRouter)
app.use('/api/users', authenticate, usersRouter)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running', api: '/api/health' })
})

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API root', availableRoutes: ['/api/challenges', '/api/challenge', '/api/users', '/api/health'] })
})

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
