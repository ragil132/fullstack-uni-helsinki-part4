const { test, before, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

before(async () => {
    console.log("Clearing user database...")
    await User.deleteMany({})
})

test('successfully creates a new user with valid data', async () => {
    const newUser = {
        username: 'test user',
        name: 'test name',
        password: 'test pass'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    console.log("New User Created:", response.body)

    const usersAfter = await User.find({})
    if (usersAfter.length !== 1) {
        throw new Error(`Expected 1 user, but got ${usersAfter.length}`)
    }
})

test('fails when username is missing', async () => {
    const newUser = {
        name: 'Missing Username',
        password: 'password'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    console.log("Expected failure:", response.body.error)
})

test('fails when password is missing', async () => {
    const newUser = {
        username: 'nopassword',
        name: 'No Password'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    console.log("Expected failure:", response.body.error)
})

test('fails when username is too short', async () => {
    const newUser = {
        username: 'ab',
        name: 'Too Short Username',
        password: 'password123'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    console.log("Expected failure:", response.body.error)
})

test('fails when password is too short', async () => {
    const newUser = {
        username: 'validusername',
        name: 'Valid Name',
        password: 'ab'
    }

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    console.log("Expected failure:", response.body.error)
})

test('fails when username is already taken', async () => {
    const newUser = {
        username: 'duplicate',
        name: 'First User',
        password: 'password123'
    }

    await api.post('/api/users').send(newUser).expect(201)

    const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    console.log("Expected failure:", response.body.error)
})

after(async () => {
    await mongoose.connection.close()
})
