import { SignUpBody } from '../../validations/auth.validation'

export const userOneFixture: SignUpBody = {
  email: 'userOne@user.co',
  name: 'User One',
  password: 'azerty',
}

export const userTwoFixture: SignUpBody = {
  email: 'userTwo@user.co',
  name: 'User Two',
  password: '12345',
}

export const userThreeFixture: SignUpBody = {
  email: 'userThree@user.co',
  name: 'User Three',
  password: 'abcd',
}
