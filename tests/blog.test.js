const mongoose = require('mongoose')
const {app} = require('../app')
const supertest = require('supertest')


const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},100000)

afterAll(() => {
  mongoose.connection.close()
})