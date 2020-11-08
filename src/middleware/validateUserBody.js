const Joi = require('joi')
const { UnprocessibleEntry } = require('../utils/clientErrors')

const validateUserBody = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    const { details } = error
    throw UnprocessibleEntry(details.map((err) => err.message).join(','))
  }
  return next()
}

module.exports = validateUserBody
