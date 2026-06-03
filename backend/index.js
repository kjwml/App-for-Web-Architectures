import express from 'express'
import cors from 'cors'
import challengesRouter from './routes/challenges.js'
import usersRouter from './routes/users.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/challenges', challengesRouter)
app.use('/api/users', usersRouter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
