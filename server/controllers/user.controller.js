import User from '../models/user.model.js'
import crud from './crud.factory.js'

const base = crud(User)

// Signup: accept ONLY name, email, password. Never trust "role" from the client
// (mass assignment). Every public signup is a normal user.
const create = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const user = await new User({ name, email, password, role: 'user' }).save()
    return res.status(201).json(user)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

// Update: only an admin may change a role.
const update = async (req, res) => {
  try {
    const { role, ...changes } = req.body
    Object.assign(req.doc, changes)
    if (role && req.auth.role === 'admin') req.doc.role = role
    await req.doc.save()
    return res.json(req.doc)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export default { ...base, create, update }
