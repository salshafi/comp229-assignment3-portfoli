import 'dotenv/config'
import config from './config/config.js'
import app from './server/express.js'
import router from './server/assets-router.js'
import mongoose from 'mongoose'
import dns from 'dns'

dns.setServers(['8.8.8.8'])

mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to the database!'))
  .catch((err) => console.error('Database connection failed:', err.message))

app.use('/src', router)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to User application.' })
})

app.listen(config.port, (err) => {
  if (err) console.log(err)
  console.info('Server started on port %s.', config.port)
})