import Contact from '../models/contact.model.js'

const create = async (req, res) => {
  try {
    const contact = await new Contact(req.body).save()
    return res.status(201).json(contact)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

const list = async (req, res) => {
  try {
    return res.json(await Contact.find())
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id)
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    req.contact = contact
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve contact' })
  }
}

const read = (req, res) => res.json(req.contact)

const update = async (req, res) => {
  try {
    Object.assign(req.contact, req.body)
    await req.contact.save()
    return res.json(req.contact)
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await req.contact.deleteOne()
    return res.json({ message: 'Contact deleted' })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

const removeAll = async (req, res) => {
  try {
    await Contact.deleteMany({})
    return res.json({ message: 'All contacts deleted' })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
}

export default { create, list, contactByID, read, update, remove, removeAll }