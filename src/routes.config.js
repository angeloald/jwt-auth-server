const router = require('express').Router()
const authController = require('./controller')
const validateUserBody = require('./middleware/validateUserBody')
const handleErrors = require('./middleware/handleErrors')

router.post('/login', [validateUserBody, authController.login])
router.post('/register', [validateUserBody, authController.register])
router.post('/token', authController.generateToken)
router.post('/logout', authController.logout)

router.use('/', handleErrors)

module.exports = router
