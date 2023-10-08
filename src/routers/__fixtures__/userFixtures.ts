import { userCreateBody } from '../../validations/users.validation'

export const userOneFixture: userCreateBody = {
  email: 'userOne@user.co',
  name: 'User One',
  password: 'azerty',
}

export const userTwoFixture: userCreateBody = {
  email: 'userTwo@user.co',
  name: 'User Two',
  password: '12345',
}

export const userThreeFixture: userCreateBody = {
  email: 'userThree@user.co',
  name: 'User Three',
  password: 'abcd',
}
