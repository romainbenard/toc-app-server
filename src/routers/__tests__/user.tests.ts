import { describe, expect, it } from '@jest/globals'
import app from '../../app'
import supertest from 'supertest'
import prisma from '../../lib/prisma'
import {
  userOneFixture,
  userThreeFixture,
  userTwoFixture,
} from '../__fixtures__/userFixtures'
import createUserAndLogin from '../../utils/test/createUserAndLogin'

describe('src/routers/user.routes.ts', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /users', () => {
    it('should return an error status if request failed', async () => {
      jest.spyOn(prisma.user, 'findMany').mockRejectedValueOnce(null)

      const res = await supertest(app).get('/users')

      expect(res.status).toBe(500)
      expect(res.body).toHaveProperty('message', 'Get users failed')
    })

    it('should return an empty array if no users exist', async () => {
      const res = await supertest(app).get('/users')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        success: true,
        data: [],
      })
    })

    it('should return the list of all users', async () => {
      await prisma.user.createMany({
        data: [userOneFixture, userTwoFixture, userThreeFixture],
      })

      const res = await supertest(app).get('/users')

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        success: true,
        data: [
          { email: 'userOne@user.co', name: 'User One', password: 'azerty' },
          { email: 'userTwo@user.co', name: 'User Two', password: '12345' },
          { email: 'userThree@user.co', name: 'User Three', password: 'abcd' },
        ],
      })
    })
  })

  describe('GET /users/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).get('/users/testId')

      expect(res.status).toBe(401)
    })

    it('should not allowed access if other user try to access data of other user', async () => {
      await prisma.user.createMany({
        data: [
          { email: 'user-bob@user.co', name: 'Bob', password: 'azerty' },
          { email: 'user-alice@user.co', name: 'Alice', password: '12345' },
        ],
      })

      const id = '111'
      const token = await createUserAndLogin({
        id,
        email: 'user-john@user.co',
      })

      const res = await supertest(app)
        .get(`/users/1`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should return the expected user', async () => {
      const id = '222'
      const token = await createUserAndLogin({
        id,
        email: 'user-patrick@user.co',
        name: 'Patrick',
      })

      const res = await supertest(app)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)

      expect(res.body).toHaveProperty('success', true)
      expect(res.body.data).toHaveProperty('id', '222')
      expect(res.body.data).toHaveProperty('email', 'user-patrick@user.co')
      expect(res.body.data).toHaveProperty('name', 'Patrick')
    })
  })

  describe('PUT /users/:id', () => {
    it('should return 400 if body is not valid', async () => {
      const id = 'update-1'

      const res = await supertest(app)
        .put(`/users/${id}`)
        .send({ email: 'test' })

      expect(res.status).toBe(400)
    })

    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).put('/users/testId')

      expect(res.status).toBe(401)
    })

    it('should return 403 if user has no right to update the expected user', async () => {
      const id = 'update-1'

      await prisma.user.create({
        data: {
          id,
          email: 'update-1@user.co',
          name: 'Bob',
          password: 'azerty',
        },
      })

      const token = await createUserAndLogin({ email: 'update-2@user.co' })

      const res = await supertest(app)
        .put(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Andrew' })

      expect(res.status).toBe(403)
    })

    it('should return the update user', async () => {
      const id = 'update-3'
      const token = await createUserAndLogin({
        id,
        email: 'update-3@user.co',
        name: 'Patrick',
      })

      const res = await supertest(app)
        .put(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Andrew' })

      expect(res.status).toBe(200)

      expect(res.body).toHaveProperty('success', true)
      expect(res.body.data).toHaveProperty('name', 'Andrew')
    })
  })

  describe('DELETE /users/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).delete('/users/testId')

      expect(res.status).toBe(401)
    })

    it('should return 403 if user has no right to delete the expected user', async () => {
      const id = 'delete-1'

      await prisma.user.create({
        data: {
          id,
          email: 'delete-1@user.co',
          name: 'Bob',
          password: 'azerty',
        },
      })

      const token = await createUserAndLogin({ email: 'delete-2@user.co' })

      const res = await supertest(app)
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should delete the user', async () => {
      const id = 'delete-3'

      const token = await createUserAndLogin({ email: 'delete-3@user.co', id })

      const res = await supertest(app)
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)

      const user = await prisma.user.findFirst({ where: { id } })

      expect(res.status).toBe(200)
      expect(user).toBe(null)
    })
  })
})
