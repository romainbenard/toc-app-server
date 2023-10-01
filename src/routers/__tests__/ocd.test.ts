import { describe, it } from '@jest/globals'
import prisma from '../../lib/prisma'
import supertest from 'supertest'
import app from '../../app'
import {
  ocdFixtureOne,
  ocdFixtureTwo,
  ocdUserOneFixture,
  ocdUserTwoFixture,
} from '../__fixtures__/ocdFixtures'
import createUserAndLogin from '../../utils/test/createUserAndLogin'

describe('src/routers/ocd.routes.ts', () => {
  beforeEach(async () => {
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
        id: 'ocdTest-4',
        email: 'ocdTest-4@user.co',
      })

      await prisma.ocd.create({
        data: {
          ...ocdFixtureTwo,
          author: {
            connect: {
              id: 'ocdTest-4',
            },
          },
        },
      })

      const res = await supertest(app)
        .get(`/ocd/2`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)

      expect(res.body.data).toMatchObject({
        authorId: 'ocdTest-4',
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
    it.todo('should return 401 if user is not authentified')

    it.todo('should return error if body is not valid')

    it.todo('should return error if OCD creation failed')

    it.todo('should create and return the new OCD')
  })

  describe('PUT /users/:id', () => {
    it.todo('should return 401 if user is not authentified')

    it.todo('should return error if body is not valid')

    it.todo('should return error if user is not the OCD owner')

    it.todo('should return the update OCD')
  })

  describe('DELETE /ocd/:id', () => {
    it.todo('should return 401 if user is not authentified')

    it.todo('should return error if user is not the OCD owner')

    it.todo('should delete and return the deleted OCD')
  })
})
