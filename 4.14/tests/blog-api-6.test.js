const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

let initialBlogId = '67c9b8ea344e0d53e2d5f837'

test('successfully deletes a blog', async () => {
    await api
        .delete(`/api/blogs/${initialBlogId}`)
        .expect(204)

    const blog = await Blog.findById(initialBlogId)
    assert.strictEqual(blog, null, "Blog was not deleted")
})

after(async () => {
    await mongoose.connection.close()
})
