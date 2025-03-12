const { test, after, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let token = ''

const api = supertest(app)

before(async () => {
    await Blog.deleteMany({})

    const initialBlog = new Blog({
        title: "Test Blog 1",
        author: "Michael",
        url: "http://xyz.com",
        likes: 11
    })
    await initialBlog.save()
})

test('blog posts have id property instead of _id', async () => {

    const userForToken = {
        username: 'ragil',
        id: '67d1ae775b8c17aa559061a7',
    }

    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

    assert.ok(response.body.length > 0, 'No blogs found')
    response.body.forEach(blog => {
        assert.ok(blog.id, 'id property is missing')
        assert.strictEqual(blog._id, undefined, '_id should not exist')
    })
})

after(async () => {
    await mongoose.connection.close()
})
