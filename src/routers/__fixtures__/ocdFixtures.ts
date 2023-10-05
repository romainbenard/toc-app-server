import { Ocd } from '@prisma/client'

type OcdFixture = Omit<Ocd, 'author' | 'authorId' | 'createdAt' | 'updatedAt'>

export const ocdFixtureOne: OcdFixture = {
  id: '1',
  category: 'CONTAMINATION',
  description: '',
  intensity: 3,
  repetition: 2,
  timeLost: 10,
  location: 'HOME',
  date: new Date(),
}

export const ocdFixtureTwo: OcdFixture = {
  id: '2',
  category: 'CHECKING',
  description: '',
  intensity: 5,
  repetition: 6,
  timeLost: 30,
  location: 'HOME',
  date: new Date(),
}

export const ocdFixtureThree: OcdFixture = {
  id: '3',
  category: 'CONTAMINATION',
  description: '',
  intensity: 2,
  repetition: 1,
  timeLost: 10,
  location: 'WORK',
  date: new Date(),
}

export const ocdFixtureFour: OcdFixture = {
  id: '4',
  category: 'INTRUSIVE_THOUGHT',
  description: '',
  intensity: 2,
  repetition: 1,
  timeLost: 10,
  location: 'PUBLIC_TRANSPORT',
  date: new Date(),
}

export const ocdUserOneFixture = {
  id: 'ocdTest-1',
  email: 'ocdTest-1@user.co',
  name: 'Bob',
  password: 'azerty',
}

export const ocdUserTwoFixture = {
  id: 'ocdTest-2',
  email: 'ocdTest-2@user.co',
  name: 'Alice',
  password: '12345',
}
