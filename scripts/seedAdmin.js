// Run once:  node scripts/seedAdmin.js
// Reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from .env (never hard-code them).
import 'dotenv/config'
import mongoose from 'mongoose'
import dns from 'dns'
import config from '../config/config.js'
import User from '../server/models/user.model.js'

dns.setServers(['8.8.8.8'])

const { ADMIN_NAME = 'Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first')
  process.exit(1)
}

await mongoose.connect(config.mongoUri)
let user = await User.findOne({ email: ADMIN_EMAIL })
if (user) {
  user.role = 'admin'
  await user.save()
  console.log('Existing user promoted to admin')
} else {
  await new User({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' }).save()
  console.log('Admin user created')
}
await mongoose.disconnect()
