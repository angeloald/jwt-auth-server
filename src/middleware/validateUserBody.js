const Joi = require('joi')

const validateUserBody = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    const { details } = error
    return res
      .status(422)
      .json({ error: details.map((err) => err.message).join(',') })
  }
  return next()
}

module.exports = validateUserBody
