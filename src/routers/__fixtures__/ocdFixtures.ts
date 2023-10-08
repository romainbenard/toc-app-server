import { CreateOcdBody } from '../../validations/ocd.validation'

type OcdFixture = Omit<
  CreateOcdBody,
  'author' | 'authorId' | 'createdAt' | 'updatedAt'
>

export const ocdFixtureOne: OcdFixture = {
  category: 'CONTAMINATION',
  intensity: 3,
  repetition: 2,
  timeLost: 10,
  location: 'HOME',
  date: new Date().toISOString(),
}

export const ocdFixtureTwo: OcdFixture = {
  category: 'CHECKING',
  intensity: 5,
  repetition: 6,
  timeLost: 30,
  location: 'HOME',
  date: new Date().toISOString(),
}
