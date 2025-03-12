const express = require('express')
const Blog = require('../models/blog')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

    const { title, url } = request.body

    if (!title) {
        return response.status(400).json({ error: "Title is required" })
    }

    if (!url) {
        return response.status(400).json({ error: "URL is required" })
    }

    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

module.exports = blogRouter
