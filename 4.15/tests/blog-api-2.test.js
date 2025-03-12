const { test, after, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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
    const response = await api.get('/api/blogs')

    assert.ok(response.body.length > 0, 'No blogs found')
    response.body.forEach(blog => {
        assert.ok(blog.id, 'id property is missing')
        assert.strictEqual(blog._id, undefined, '_id should not exist')
    })
})

after(async () => {
    await mongoose.connection.close()
})
