import { User } from '@prisma/client'
import prisma from '../lib/prisma'
import HttpError from '../utils/httpError'
import { formatUserForClient } from '../utils/formatters'

class UsersService {
  public getUsers = async () => {
    try {
      const users = await prisma.user.findMany()

      return users.map(user => formatUserForClient(user))
    } catch (e) {
      throw new HttpError(500, 'Get users failed')
    }
  }

  public getUserById = async (id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) return null

      return formatUserForClient(user)
    } catch (e) {
      throw new HttpError(500, 'Get user failed')
    }
  }

  public getUserByEmail = async (email: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) return null

      return formatUserForClient(user)
    } catch (e) {
      throw new HttpError(500, 'Get user failed')
    }
  }

  public updateUser = async (id: string, data: Partial<User>) => {
    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data,
      })

      return formatUserForClient(user)
    } catch (e) {
      throw new HttpError(500, 'User update failed')
    }
  }

  public deleteUser = async (id: string): Promise<User> => {
    try {
      return prisma.user.delete({
        where: {
          id,
        },
      })
    } catch (e) {
      throw new HttpError(500, 'User deletion failed')
    }
  }
}

export default UsersService
