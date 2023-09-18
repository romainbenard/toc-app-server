import { Ocd } from '@prisma/client'
import prisma from '../lib/prisma'
import HttpError from '../utils/httpError'

class OcdService {
  public create = async (data: Ocd): Promise<Ocd> => {
    try {
      return await prisma.ocd.create({ data })
    } catch (e) {
      throw new HttpError(500, 'Create ocd failed')
    }
  }

  public get = async (id: string): Promise<Ocd | null> => {
    try {
      return await prisma.ocd.findUnique({ where: { id } })
    } catch (e) {
      throw new HttpError(500, 'Get Ocd failed')
    }
  }

  public update = async (id: string, data: Partial<Ocd>) => {
    try {
      return await prisma.ocd.update({ where: { id }, data })
    } catch (e) {
      throw new HttpError(500, 'Update Ocd failed')
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
      throw new HttpError(500, 'Ocd deletion failed')
    }
  }
}

export default OcdService
