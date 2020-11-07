const express = require('express')
const cookieParser = require('cookie-parser')
const database = require('./src/config/database')
const authRoutes = require('./src/routes.config')
const logger = require('./src/utils/logger')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/', authRoutes)

app.listen(process.env.PORT, async () => {
  try {
    await database()
    logger.info(`Started app on port ${process.env.PORT}`)
  } catch (err) {
    logger.error(err)
  }
})
