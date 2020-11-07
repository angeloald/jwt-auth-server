const pino = require('pino')

const logger = pino({
  prettyPrint: { colorize: true, ignore: 'pid,hostname' },
})

module.exports = logger
