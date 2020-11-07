const mongoose = require('mongoose')
const logger = require('../utils/logger')

const initDb = async () => {
  mongoose.connection
    .on('error', () => {
      logger.error(
        `Auth server database connection error encountered. Retrying in 5 seconds!`
      )
      setTimeout(initDb, 5000)
    })
    .once('open', () =>
      logger.info('Connected to Auth Server MongoDB database!')
    )
  await mongoose.connect(process.env.MONGO_SRV, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
}

module.exports = initDb
