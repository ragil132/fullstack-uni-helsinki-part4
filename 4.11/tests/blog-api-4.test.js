const { test, before, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const savedBlog = await Blog.findById(response.body.id)

    assert.strictEqual(savedBlog.likes, 0, "Likes did not default to 0")
})

after(async () => {
    await mongoose.connection.close()
})
