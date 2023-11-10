import { SignUpBody } from '../../validations/auth.validation'

export const userOneFixture: SignUpBody = {
  loginType: 'credentials',
  loginProvider: 'credentials',
  email: 'userOne@user.co',
  name: 'User One',
  password: 'azerty',
}

export const userTwoFixture: SignUpBody = {
  loginType: 'credentials',
  loginProvider: 'credentials',
  email: 'userTwo@user.co',
  name: 'User Two',
  password: '12345',
}

export const userThreeFixture: SignUpBody = {
  loginType: 'credentials',
  loginProvider: 'credentials',
  email: 'userThree@user.co',
  name: 'User Three',
  password: 'abcd',
}
