class ClientErrors extends Error {
  constructor(message, errCode) {
    super()
    this.message = message
    this.errCode = errCode
  }

  get code() {
    return this.errCode
  }

  set code(errCode) {
    this.errCode = errCode
  }
}

const BadRequest = (message) => new ClientErrors(message, 400)
const Unauthorized = (message) => new ClientErrors(message, 401)
const Forbidden = (message) => new ClientErrors(message, 403)
const Conflict = (message) => new ClientErrors(message, 409)
const UnprocessibleEntry = (message) => new ClientErrors(message, 422)
const TooManyRequests = (message) => new ClientErrors(message, 429)

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  Conflict,
  UnprocessibleEntry,
  TooManyRequests,
}
