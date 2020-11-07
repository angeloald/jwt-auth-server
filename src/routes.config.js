const router = require('express').Router()

router.post('/login', (req, res) => {
  res.send(
    'this endpoint authenticates the user and returns access and refresh tokens'
  )
})

router.post('/register', (req, res) => {
  res.send(
    'this endpoint creates a user record in the database and returns access and refresh tokens'
  )
})

router.post('/token', (req, res) => {
  res.send(
    'this endpoint generates a new access token from the user if they supply a valid refresh token'
  )
})

router.post('/logout', (req, res) => {
  res.send(
    'this endpoint destroys the refresh token session of the user in the cache'
  )
})

module.exports = router
