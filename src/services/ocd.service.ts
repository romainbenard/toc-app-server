import { Ocd, Prisma } from '@prisma/client'
import prisma from '../lib/prisma'
import HttpError from '../utils/httpError'
import { logger } from '../lib/logger'

class OcdService {
  public create = async (data: Prisma.OcdCreateInput): Promise<Ocd> => {
    try {
      return await prisma.ocd.create({ data })
    } catch (e) {
      logger.error(e)
      throw new HttpError(500, 'CREATE ocd failed')
    }
  }

  public get = async (id: string): Promise<Ocd | null> => {
    try {
      return await prisma.ocd.findUnique({ where: { id } })
    } catch (e) {
      logger.error(e)
      throw new HttpError(500, 'GET ocd failed')
    }
  }

  public update = async (id: string, data: Partial<Ocd>) => {
    try {
      return await prisma.ocd.update({ where: { id }, data })
    } catch (e) {
      logger.error(e)
      throw new HttpError(500, 'UPDATE ocd failed')
    }
  }

  public delete = async (id: string): Promise<Ocd> => {
    try {
      return await prisma.ocd.delete({
        where: {
          id,
        },
      })
    } catch (e) {
      logger.error(e)
      throw new HttpError(500, 'DELETE ocd failed')
    }
  }
}

export default OcdService
