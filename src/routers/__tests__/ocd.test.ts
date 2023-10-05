import { describe, it } from '@jest/globals'
import prisma from '../../lib/prisma'
import supertest from 'supertest'
import app from '../../app'
import {
  ocdFixtureOne,
  ocdFixtureTwo,
  ocdFixtureThree,
  ocdFixtureFour,
  ocdUserOneFixture,
  ocdUserTwoFixture,
} from '../__fixtures__/ocdFixtures'
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
      const token = await createUserAndLogin({
        id: 'ocdTest',
        email: 'ocdTest@user.co',
      })

      const res = await supertest(app)
        .get(`/ocd/1`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(404)
    })

    it('should return error if the user is not the owner of the OCD the list of all users', async () => {
      await prisma.user.createMany({
        data: [ocdUserOneFixture, ocdUserTwoFixture],
      })

      const token = await createUserAndLogin({
        id: 'ocdTest-3',
        email: 'ocdTest-3@user.co',
      })

      await prisma.ocd.create({
        data: {
          ...ocdFixtureOne,
          author: {
            connect: {
              id: 'ocdTest-1',
            },
          },
        },
      })

      const res = await supertest(app)
        .get(`/ocd/1`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should return the expected OCD', async () => {
      const token = await createUserAndLogin({
        id: 'ocdTest-61',
        email: 'ocdTest-61@user.co',
      })

      await prisma.ocd.create({
        data: {
          ...ocdFixtureTwo,
          author: {
            connect: {
              id: 'ocdTest-61',
            },
          },
        },
      })

      const res = await supertest(app)
        .get(`/ocd/2`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)

      expect(res.body.data).toMatchObject({
        authorId: 'ocdTest-61',
        category: 'CHECKING',
        description: '',
        intensity: 5,
        repetition: 6,
        timeLost: 30,
        location: 'HOME',
      })
    })
  })

  describe('POST /ocd/create', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).post('/ocd/create')

      expect(res.status).toBe(401)
    })

    it('should return error if body is not valid', async () => {
      const token = await createUserAndLogin({
        id: 'ocdTest-4',
        email: 'ocdTest-4@user.co',
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

      const token = await createUserAndLogin({
        id: 'ocdTest-5',
        email: 'ocdTest-5@user.co',
      })

      const res = await supertest(app)
        .post(`/ocd/create`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'CHECKING',
          intensity: 1,
          location: 'HOME',
          date: new Date().toISOString(),
          authorId: 'ocdTest-5',
        })

      expect(res.status).toBe(500)
    })

    it('should create and return the new OCD', async () => {
      const token = await createUserAndLogin({
        id: 'ocdTest-6',
        email: 'ocdTest-6@user.co',
      })

      const res = await supertest(app)
        .post(`/ocd/create`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'ORGANISATION',
          intensity: 3,
          location: 'HOME',
          date: new Date().toISOString(),
          authorId: 'ocdTest-6',
        })

      expect(res.status).toBe(200)
      expect(res.body.data).toMatchObject({
        category: 'ORGANISATION',
        intensity: 3,
        location: 'HOME',
        authorId: 'ocdTest-6',
      })
    })
  })

  describe('PUT /ocd/:id', () => {
    it('should return 401 if user is not authentified', async () => {
      const res = await supertest(app).put('/ocd/1')

      expect(res.status).toBe(401)
    })
    it('should return error if body is not valid', async () => {
      const token = await createUserAndLogin({
        id: 'ocdTest-put-1',
        email: 'ocdTest-put-1@user.co',
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
      const token = await createUserAndLogin({
        id: 'ocdTest-put-3',
        email: 'ocdTest-put-3@user.co',
      })

      await prisma.ocd.create({
        data: {
          ...ocdFixtureThree,
          author: {
            connect: {
              id: 'ocdTest-1',
            },
          },
        },
      })

      const res = await supertest(app)
        .put(`/ocd/3`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(403)
    })

    it('should return the update OCD', async () => {
      const token = await createUserAndLogin({
        id: 'ocdTest-put-4',
        email: 'ocdTest-put-4@user.co',
      })

      await prisma.ocd.create({
        data: {
          ...ocdFixtureFour,
          author: {
            connect: {
              id: 'ocdTest-put-4',
            },
          },
        },
      })

      const res = await supertest(app)
        .put(`/ocd/4`)
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
    it.todo('should return 401 if user is not authentified')

    it.todo('should return error if user is not the OCD owner')

    it.todo('should delete and return the deleted OCD')
  })
})
