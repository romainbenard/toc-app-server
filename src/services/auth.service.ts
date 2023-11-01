import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { User } from '@prisma/client'
import prisma from '../lib/prisma'
import HttpError from '../utils/httpError'
import { DataStoredInToken, TokenData } from '../types/auth'
import config from '../config'
import {
  logInValidation,
  type SignUpBody,
  type LogInBody,
} from '../validations/auth.validation'

class AuthService {
  async signUp(data: SignUpBody) {
    const { email, loginType } = data

    const findUser = await prisma.user.findUnique({
      where: { email },
    })

    if (findUser) throw new HttpError(401, 'User already exists')

    if (loginType === 'credentials') {
      const hashedPassword = await hash(data.password, 10)

      return prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })
    }

    return prisma.user.create({ data })
  }

  async logIn(
    data: LogInBody
  ): Promise<{ authCookie: string; user: User; token: TokenData }> {
    const parse = logInValidation.safeParse(data)

    if (!parse.success) {
      throw new HttpError(400, 'Invalid body')
    }

    const { email, loginType } = parse.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) throw new HttpError(404, 'Authentication failed')

    if (
      loginType === 'credentials' &&
      user.loginType === 'credentials' &&
      user.password
    ) {
      const isPasswordValid = await compare(parse.data.password, user.password)

      if (!isPasswordValid) throw new HttpError(401, 'Authentication failed')
    }

    const token = this.#createToken(user.id)
    const authCookie = this.#createCookie(token)

    return { user, authCookie, token }
  }

  #createToken(userId: string): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: userId }
    const secretKey: string = config.secretKey
    const expiresIn: number = 60 * 60

    return {
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
      expiresIn,
    }
  }

  #createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
  }
}

export default AuthService
