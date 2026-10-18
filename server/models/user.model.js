import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name:     { type: String, trim: true, required: 'Name is required' },
  email:    { type: String, trim: true, unique: true, required: 'Email is required',
              match: [/.+@.+\..+/, 'Please fill a valid email address'] },
  password: { type: String, required: 'Password is required',
              minlength: [6, 'Password must be at least 6 characters'] },
  created:  { type: Date, default: Date.now },
  updated:  { type: Date },
})

UserSchema.pre('save', async function () {
  this.updated = Date.now()
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

UserSchema.methods.authenticate = function (plain) {
  return bcrypt.compare(plain, this.password)
}

UserSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', UserSchema)