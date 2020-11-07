/* eslint-disable func-names */

const mongoose = require('mongoose')
const argon2 = require('argon2')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email required'],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password required'],
    minlength: [6, 'password must be at least 6 characters long'],
  },
})

UserSchema.pre('save', async function (next) {
  this.password = await argon2.hash(this.password)
  return next()
})

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const isUser = await argon2.verify(user.password, password)
    if (isUser) return user
  }
  throw Error('incorrect email or password')
}

module.exports = mongoose.model('User', UserSchema)
