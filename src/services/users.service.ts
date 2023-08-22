import { User } from '@prisma/client'
import prisma from '../lib/prisma'
import HttpError from '../utils/httpError'

class UsersService {
  public getUsers = async (): Promise<User[]> => {
    try {
      return await prisma.user.findMany()
    } catch (e) {
      throw new HttpError(500, 'Get users failed')
    }
  }

  public getUserById = async (id: string): Promise<User | null> => {
    try {
      return await prisma.user.findUnique({
        where: {
          id,
        },
      })
    } catch (e) {
      throw new HttpError(500, 'Get user failed')
    }
  }

  public updateUser = async (
    id: string,
    data: Partial<User>
  ): Promise<User> => {
    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data,
      })
    } catch (e) {
      throw new HttpError(500, 'User update failed')
    }
  }

  public deleteUser = async (id: string): Promise<User> => {
    try {
      return await prisma.user.delete({
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
