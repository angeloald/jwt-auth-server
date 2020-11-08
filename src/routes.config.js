const router = require('express').Router()
const User = require('./models/user')
const validateUserBody = require('./middleware/validateUserBody')
const token = require('./utils/token')
const store = require('./utils/store')
const handleErrors = require('./middleware/handleErrors')
const clientErrors = require('./utils/clientErrors')

const isSecure = process.env.NODE_ENV === 'production'

router.post('/login', validateUserBody, async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.login(email, password)
    const accessToken = token.createAccessToken(user.id)
    const refreshToken = token.createRefreshToken(user.id)
    res.cookie('accessToken', accessToken, { secure: isSecure, httpOnly: true })
    res.cookie('refreshToken', refreshToken, {
      secure: isSecure,
      httpOnly: true,
    })
    await store.setRefreshToken(refreshToken)
    return res.json(user)
  } catch (err) {
    return next(err)
  }
})

router.post('/register', validateUserBody, async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const accessToken = token.createAccessToken(user.id)
    const refreshToken = token.createRefreshToken(user.id)
    res.cookie('accessToken', accessToken, { secure: isSecure, httpOnly: true })
    res.cookie('refreshToken', refreshToken, {
      secure: isSecure,
      httpOnly: true,
    })
    await store.setRefreshToken(refreshToken)
    return res.status(201).json(user)
  } catch (err) {
    return next(err)
  }
})

router.post('/token', async (req, res, next) => {
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
})

router.post('/logout', async (req, res, next) => {
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
})

router.use('/', handleErrors)

module.exports = router
