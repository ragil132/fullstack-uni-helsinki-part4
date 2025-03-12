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

test('check if likes property is missing, then defaults 0', async () => {
    const newBlog = {
        title: "Lorem Ipsum",
        author: "Mr. J",
        url: "http://localhost"
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

    const savedBlog = await Blog.findById(response.body.id)

    assert.strictEqual(savedBlog.likes, 0, "Likes did not default to 0")
})

after(async () => {
    await mongoose.connection.close()
})
