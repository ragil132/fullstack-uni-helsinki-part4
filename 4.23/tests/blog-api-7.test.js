const { test, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);
let blogId = "67d03d54c15955b56b85642d";

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let token = ''

test('updates the likes of a blog successfully', async () => {
    if (!blogId) {
        throw new Error("blogId is null. Test cannot proceed.");
    }

    const userForToken = {
        username: 'ragil',
        id: '67d1ae775b8c17aa559061a7',
    }

    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })



    const newLikes = 25;
    const response = await api
        .patch(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likes: newLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/);

    if (response.body.likes !== newLikes) {
        throw new Error(`Expected likes to be ${newLikes}, but got ${response.body.likes}`);
    }
});

after(async () => {
    await mongoose.connection.close();
});
