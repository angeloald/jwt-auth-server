const Redis = require('ioredis')

const redis = new Redis()

const setRefreshToken = (token) => {
  return redis.set(token, 1)
}

const checkRefreshToken = (token) => {
  return redis.exists(token)
}

const deleteRefreshToken = (token) => {
  return redis.del(token)
}

module.exports = {
  setRefreshToken,
  checkRefreshToken,
  deleteRefreshToken,
}
