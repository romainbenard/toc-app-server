import { describe, it } from '@jest/globals'
import prisma from '../../lib/prisma'
import supertest from 'supertest'
import app from '../../app'
import { ocdFixtureOne, ocdFixtureTwo } from '../__fixtures__/ocdFixtures'
import createUserAndLogin from '../../utils/test/createUserAndLogin'

describe('src/routers/ocd.routes.ts', () => {
  beforeAll(async () => {
    await prisma.ocd.deleteMany()
    await prisma.user.deleteMany()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /ocd/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).get('/ocd/1')

      expect(res.status).toBe(401)
    })

    it('should 404 if no OCD found', async () => {
      const userId = 'ocdGET-1'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const res = await supertest(app)
        .get(`/ocd/1`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(404)
    })

    it('should return error if the user is not the owner of the OCD the list of all users', async () => {
      const userId = 'ocdGET-3'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const ocd = await prisma.ocd.create({
        data: {
          ...ocdFixtureOne,
          author: {
            connect: {
              id: 'ocdGET-1',
            },
          },
        },
      })

      const res = await supertest(app)
        .get(`/ocd/${ocd.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should return the expected OCD', async () => {
      const userId = 'ocdGET-6'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const ocd = await prisma.ocd.create({
        data: {
          ...ocdFixtureTwo,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      })

      const res = await supertest(app)
        .get(`/ocd/${ocd.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)

      expect(res.body.data).toMatchObject({
        authorId: 'ocdGET-6',
        category: 'CHECKING',
        intensity: 5,
        repetition: 6,
        timeLost: 30,
        location: 'HOME',
        description: null,
      })
    })
  })

  describe('POST /ocd/create', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).post('/ocd/create')

      expect(res.status).toBe(401)
    })

    it('should return error if body is not valid', async () => {
      const userId = 'ocdPOST-4'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const res = await supertest(app)
        .post(`/ocd/create`)
        .send({
          category: 'Test',
        })
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(400)
    })

    it('should return error if OCD creation failed', async () => {
      jest.spyOn(prisma.ocd, 'create').mockRejectedValueOnce(null)

      const userId = 'ocdPOST-5'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const res = await supertest(app)
        .post(`/ocd/create`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'CHECKING',
          intensity: 1,
          location: 'HOME',
          date: new Date().toISOString(),
          authorId: userId,
        })

      expect(res.status).toBe(500)
    })

    it('should create and return the new OCD', async () => {
      const userId = 'ocdPOST-6'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const res = await supertest(app)
        .post(`/ocd/create`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'ORGANISATION',
          intensity: 3,
          location: 'HOME',
          date: new Date().toISOString(),
          authorId: userId,
        })

      expect(res.status).toBe(200)
      expect(res.body.data).toMatchObject({
        category: 'ORGANISATION',
        intensity: 3,
        location: 'HOME',
        authorId: 'ocdPOST-6',
      })
    })
  })

  describe('PUT /ocd/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).put('/ocd/1')

      expect(res.status).toBe(401)
    })
    it('should return error if body is not valid', async () => {
      const userId = 'ocdPUT-1'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const res = await supertest(app)
        .put(`/ocd/1`)
        .send({
          intensity: '5',
        })
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(400)
    })

    it('should return error if user is not the OCD owner', async () => {
      const userId = 'ocdPUT-3'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const ocd = await prisma.ocd.create({
        data: {
          ...ocdFixtureOne,
          author: {
            connect: {
              id: 'ocdPUT-1',
            },
          },
        },
      })

      const res = await supertest(app)
        .put(`/ocd/${ocd.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should return the update OCD', async () => {
      const userId = 'ocdPUT-4'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const ocd = await prisma.ocd.create({
        data: {
          ...ocdFixtureTwo,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      })

      const res = await supertest(app)
        .put(`/ocd/${ocd.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          intensity: 4,
          timeLost: 45,
        })

      expect(res.status).toBe(200)

      expect(res.body.data).toMatchObject({
        intensity: 4,
        timeLost: 45,
      })
    })
  })

  describe('DELETE /ocd/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).delete('/ocd/1')

      expect(res.status).toBe(401)
    })

    it('should return error if user is not the OCD owner', async () => {
      const userId = 'ocdDELETE-1'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const userTest = await prisma.user.create({
        data: {
          email: 'ocdTest-1@user.co',
          name: 'Bob',
          password: 'azerty',
        },
      })

      const ocd = await prisma.ocd.create({
        data: {
          ...ocdFixtureOne,
          author: {
            connect: {
              id: userTest.id,
            },
          },
        },
      })

      const res = await supertest(app)
        .delete(`/ocd/${ocd.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should delete and return the deleted OCD', async () => {
      const userId = 'ocdDELETE-2'

      const token = await createUserAndLogin({
        id: userId,
        email: `${userId}@ocd.co`,
      })

      const ocd = await prisma.ocd.create({
        data: {
          ...ocdFixtureOne,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      })

      const res = await supertest(app)
        .delete(`/ocd/${ocd.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
    })
  })
})
