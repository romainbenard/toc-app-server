import { describe, expect, it } from '@jest/globals'
import app from '../../app'
import supertest from 'supertest'
import prisma from '../../lib/prisma'
import * as bcrypt from 'bcrypt'

const { hash } = bcrypt

// https://github.com/aelbore/esbuild-jest/issues/26#issuecomment-968853688
jest.mock('bcrypt', () => ({
  __esModule: true,
  ...jest.requireActual('bcrypt'),
}))

describe('src/routers/auth.routes.ts', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  const spyBcryptHash = jest.spyOn(bcrypt, 'hash')

  describe('/signup', () => {
    it('should failed if a body request is not valid', async () => {
      const res = await supertest(app).post('/auth/signup').send({
        email: 'signup-1@test.co',
        name: 'userTest',
      })

      expect(res.status).toBe(400)
    })

    it('should failed if password is not strong enough', async () => {
      const res = await supertest(app).post('/auth/signup').send({
        email: 'signup-1@test.co',
        name: 'userTest',
        password: '1234',
      })

      expect(res.status).toBe(400)
    })

    it('should failed if a user already exist', async () => {
      await prisma.user.create({
        data: {
          email: 'signup-2@test.co',
          name: 'userTest',
          password: 'azerty',
        },
      })

      const res = await supertest(app).post('/auth/signup').send({
        email: 'signup-2@test.co',
        name: 'userTest',
        password: 'AzertY1234?',
      })

      expect(res.status).toBe(401)
    })

    it('should succeed when a new user create an account', async () => {
      const res = await supertest(app).post('/auth/signup').send({
        email: 'signup-3@test.co',
        name: 'userTest',
        password: 'AzertY1234?',
      })
      expect(spyBcryptHash).toHaveBeenCalledTimes(1)
      expect(res.status).toBe(200)
    })
  })

  describe('/login', () => {
    it('should failed if body request is not valid', async () => {
      const res = await supertest(app).post('/auth/login').send({
        email: 'login-1@test.co',
      })
      expect(res.status).toBe(400)
    })

    it('should failed if user not exist', async () => {
      const res = await supertest(app).post('/auth/login').send({
        email: 'login-2@test.co',
        password: '12345678',
      })

      expect(res.status).toBe(404)
    })

    it('should failed if password is not correct', async () => {
      const passwordFixture = await hash('azerty', 10)

      await prisma.user.create({
        data: {
          email: 'login-3@test.co',
          name: 'John',
          password: passwordFixture,
        },
      })

      const res = await supertest(app).post('/auth/login').send({
        email: 'login-3@test.co',
        password: '123456',
      })

      expect(res.status).toBe(401)
    })

    it('should create a Set-Cookie header and return user data after login', async () => {
      const passwordFixture = await hash('azerty', 10)
      await prisma.user.create({
        data: {
          email: 'login-4@test.co',
          name: 'John',
          password: passwordFixture,
        },
      })

      const res = await supertest(app).post('/auth/login').send({
        email: 'login-4@test.co',
        password: 'azerty',
      })

      expect(res.status).toBe(200)
      expect(res.headers).toHaveProperty('set-cookie')
      expect(res.body).toMatchObject({
        success: true,
        data: {
          email: 'login-4@test.co',
          name: 'John',
        },
      })
    })
  })

  describe('/logout', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).post('/auth/logout')

      expect(res.status).toBe(401)
    })

    it('should remove reset set-cookie header', async () => {
      const passwordFixture = await hash('azerty', 10)
      await prisma.user.create({
        data: {
          email: 'logout-1@test.co',
          name: 'John',
          password: passwordFixture,
        },
      })

      const login = await supertest(app).post('/auth/login').send({
        email: 'logout-1@test.co',
        password: 'azerty',
      })

      const token = login.headers['set-cookie'][0]
        .split(';')[0]
        .split('Authorization=')[1]

      const res = await supertest(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.headers).toMatchObject({
        'set-cookie': ['Authorization=; Max-age=0'],
      })
    })
  })
})
