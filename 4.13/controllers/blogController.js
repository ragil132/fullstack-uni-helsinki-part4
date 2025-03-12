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

blogRouter.delete('/:id', async (request, response) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

        if (!deletedBlog) {
            return response.status(404).json({ error: "Blog not found" })
        }

        response.status(204).end()
    } catch (error) {
        response.status(400).json({ error: "Invalid ID format" })
    }
})

module.exports = blogRouter
