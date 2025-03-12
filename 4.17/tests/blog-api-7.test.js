const { test, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);
let blogId = "67d03d54c15955b56b85642d";

test('updates the likes of a blog successfully', async () => {
    if (!blogId) {
        throw new Error("blogId is null. Test cannot proceed.");
    }

    const newLikes = 25;
    const response = await api
        .patch(`/api/blogs/${blogId}`)
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
