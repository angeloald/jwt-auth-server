const jwt = require('jsonwebtoken')

const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.NODE_ENV === 'production' ? 120 : 1000000,
  })
}

const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET)
}

const validateRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  validateRefreshToken,
}
