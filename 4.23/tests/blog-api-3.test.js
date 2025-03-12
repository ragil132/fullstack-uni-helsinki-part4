const { test, before, after } = require('node:test')
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
})

test('add a new blog', async () => {
    const initialBlogs = await Blog.find({})
    const initialCount = initialBlogs.length

    const newBlog = {
        title: "Lorem",
        author: "Mr. X",
        url: "http://localhost",
        likes: 18
    }

    const userForToken = {
        username: 'ragil',
        id: '67d1ae775b8c17aa559061a7',
    }

    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const savedBlogs = await Blog.find({})
    const savedCount = savedBlogs.length

    assert.strictEqual(savedCount, initialCount + 1, "Blog count did not increase")

    const titles = savedBlogs.map(blog => blog.title)
    assert.ok(titles.includes(newBlog.title), "New blog title is missing in database")
})

after(async () => {
    await mongoose.connection.close()
})
