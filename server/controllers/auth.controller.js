import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import config from '../../config/config.js'

const signin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.authenticate(password))) {
      return res.status(401).json({ error: 'Email and password do not match' })
    }
    // role travels inside the token so the server can check it on every request
    const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1d' })
    res.cookie('t', token, { httpOnly: true, maxAge: 86400000 })
    return res.json({ token, user })
  } catch (err) {
    return res.status(401).json({ error: 'Could not sign in' })
  }
}

const signout = (req, res) => {
  res.clearCookie('t')
  return res.json({ message: 'Signed out' })
}

// 401 = who are you? (no/invalid token)
const requireSignin = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.t
  if (!token) return res.status(401).json({ error: 'Not signed in' })
  try {
    req.auth = jwt.verify(token, config.jwtSecret)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// 403 = I know who you are, but you are not allowed
const isAdmin = (req, res, next) => {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// owner of the record OR admin
const hasAuthorization = (req, res, next) => {
  const isOwner = String(req.doc._id) === req.auth._id
  if (!isOwner && req.auth.role !== 'admin') {
    return res.status(403).json({ error: 'User is not authorized' })
  }
  next()
}

export default { signin, signout, requireSignin, isAdmin, hasAuthorization }
