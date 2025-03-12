const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogController')
const usersRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.mongoUrl)

mongoose.connect(config.mongoUrl)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app