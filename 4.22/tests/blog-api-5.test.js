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

test('blog without title is forbidden (400)', async () => {
    const newBlog = {
        author: "Mr. Y",
        url: "http://localhost",
        likes: 7
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    assert.strictEqual(response.body.error, "Title is required", "Error message does not match")
})

test('blog without url is forbidden (400)', async () => {
    const newBlog = {
        title: "Lorem ipsum",
        author: "Mr. U",
        likes: 9
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    assert.strictEqual(response.body.error, "URL is required", "Error message does not match")
})

after(async () => {
    await mongoose.connection.close()
})
