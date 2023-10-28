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
  async signUp(data: SignUpBody): Promise<User> {
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

    const { providerId, ...rest } = data

    return prisma.user.create({
      data: { ...rest, userId: providerId },
    })
  }

  async logIn(data: LogInBody): Promise<{ authCookie: string; user: User }> {
    const parse = logInValidation.safeParse(data)

    if (!parse.success) {
      throw new HttpError(400, 'Invalid body')
    }
    const { email, password } = parse.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password)
      throw new HttpError(404, 'Authentication failed')

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) throw new HttpError(401, 'Authentication failed')

    const tokenData = this.#createToken(user.id)
    const authCookie = this.#createCookie(tokenData)

    return { authCookie, user }
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
