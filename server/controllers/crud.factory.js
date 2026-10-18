export default (Model) => ({
  create: async (req, res) => {
    try { return res.status(201).json(await new Model(req.body).save()) }
    catch (err) { return res.status(400).json({ error: err.message }) }
  },
  list: async (req, res) => {
    try { return res.json(await Model.find()) }
    catch (err) { return res.status(400).json({ error: err.message }) }
  },
  byID: async (req, res, next, id) => {
    try {
      const doc = await Model.findById(id)
      if (!doc) return res.status(404).json({ error: 'Not found' })
      req.doc = doc
      next()
    } catch (err) { return res.status(400).json({ error: 'Could not retrieve record' }) }
  },
  read: (req, res) => res.json(req.doc),
  update: async (req, res) => {
    try {
      Object.assign(req.doc, req.body)
      await req.doc.save()
      return res.json(req.doc)
    } catch (err) { return res.status(400).json({ error: err.message }) }
  },
  remove: async (req, res) => {
    try { await req.doc.deleteOne(); return res.json({ message: 'Deleted' }) }
    catch (err) { return res.status(400).json({ error: err.message }) }
  },
  removeAll: async (req, res) => {
    try { await Model.deleteMany({}); return res.json({ message: 'All deleted' }) }
    catch (err) { return res.status(400).json({ error: err.message }) }
  },
})