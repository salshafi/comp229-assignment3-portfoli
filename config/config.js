import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

// Fail fast: no silent default secret
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing in .env')
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing in .env')

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGODB_URI,
}
export default config
