import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET || 'default-secret'

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing' })
  }

  const token = authHeader.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authentication token' })
  }
}

export default authenticate
