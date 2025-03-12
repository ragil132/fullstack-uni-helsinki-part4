const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

let initialBlogId = '67c9b8ea344e0d53e2d5f837'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let token = ''

test('successfully deletes a blog', async () => {

    const userForToken = {
        username: 'ragil',
        id: '67d1ae775b8c17aa559061a7',
    }

    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })


    await api
        .delete(`/api/blogs/${initialBlogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blog = await Blog.findById(initialBlogId)
    assert.strictEqual(blog, null, "Blog was not deleted")
})

after(async () => {
    await mongoose.connection.close()
})
