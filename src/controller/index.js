const User = require('../models/user')
const token = require('../utils/token')
const store = require('../utils/store')
const clientErrors = require('../utils/clientErrors')

const isSecure = process.env.NODE_ENV === 'production'

const setTokens = async (res, userId) => {
  const accessToken = token.createAccessToken(userId)
  const refreshToken = token.createRefreshToken(userId)
  res.cookie('accessToken', accessToken, { secure: isSecure, httpOnly: true })
  res.cookie('refreshToken', refreshToken, {
    secure: isSecure,
    httpOnly: true,
  })
  await store.setRefreshToken(refreshToken)
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.login(email, password)
    await setTokens(res, user.id)
    return res.json(user)
  } catch (err) {
    return next(err)
  }
}

const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    await setTokens(res, user.id)
    return res.status(201).json(user)
  } catch (err) {
    return next(err)
  }
}

const generateToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) throw clientErrors.Unauthorized('no refresh token')
    const found = await store.checkRefreshToken(refreshToken)
    if (found) {
      const tokenData = token.validateRefreshToken(refreshToken)
      const accessToken = token.createAccessToken(tokenData.id)
      res.cookie('accessToken', accessToken, {
        secure: isSecure,
        httpOnly: true,
      })
      return res.json(tokenData)
    }
    throw clientErrors.Forbidden('invalid refresh token')
  } catch (err) {
    return next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) throw clientErrors.Unauthorized('no refresh token')
    const found = await store.checkRefreshToken(refreshToken)
    if (found) {
      await store.deleteRefreshToken(refreshToken)
      return res.json({ user: 'logged out' })
    }
    throw clientErrors.Forbidden('invalid refresh token')
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  login,
  register,
  generateToken,
  logout,
}
