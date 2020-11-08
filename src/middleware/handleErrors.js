const logger = require('../utils/logger')

const handleErrors = (err, req, res, next) => {
  const errorJSON = {
    status: 'error',
    message: 'internal server error',
  }
  const errCode = err.code
  if (errCode === 11000) {
    errorJSON.message = 'resource already exists'
    return res.status(409).json(errorJSON)
  }
  if (errCode !== 500 && errCode !== undefined) {
    errorJSON.message = err.message
    return res.status(errCode).json(errorJSON)
  }
  logger.error(err)
  return res.status(500).json(errorJSON)
}

module.exports = handleErrors
