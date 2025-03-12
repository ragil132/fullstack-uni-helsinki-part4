const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

    const { title, author, url, likes } = request.body

    if (!title) {
        return response.status(400).json({ error: "Title is required" })
    }

    if (!url) {
        return response.status(400).json({ error: "URL is required" })
    }

    const user = await User.findOne()
    if (!user) {
        return response.status(400).json({ error: 'No users found in the database' })
    }

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

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
