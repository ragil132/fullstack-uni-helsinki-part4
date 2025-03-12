const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

    const { title, author, url, likes } = request.body

    if (!request.user) {
        return response.status(401).json({ error: 'user authentication failed' })
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: request.user._id
    })

    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)

})

blogRouter.delete('/:id', async (request, response) => {
    if (!request.user) {
        return response.status(401).json({ error: 'user authentication failed' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== request.user._id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.patch('/:id', async (request, response) => {
    try {
        const { likes } = request.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            { likes },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return response.status(404).json({ error: 'Blog not found' });
        }

        response.json(updatedBlog);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});


module.exports = blogRouter
