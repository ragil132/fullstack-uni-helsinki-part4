const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
    try {
        const authorization = request.get('Authorization')

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const token = authorization.replace('Bearer ', '')
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'invalid token' })
        }

        const user = await User.findById(decodedToken.id)

        if (!user) {
            return response.status(401).json({ error: 'user not found' })
        }

        request.user = user
        next()
    } catch (error) {
        response.status(400).json({ error: 'token processing failed' })
    }
}

module.exports = userExtractor
