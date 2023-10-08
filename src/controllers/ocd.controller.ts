import { NextFunction, Request, Response } from 'express'
import OcdService from '../services/ocd.service'
import { Ocd } from '@prisma/client'
import HttpError from '../utils/httpError'

class OcdController {
  public ocdService = new OcdService()

  public create = async (
    req: Request<any, any, Ocd>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ocd = await this.ocdService.create(req.body)

      res.status(200).json({ success: true, data: ocd })
    } catch (e) {
      return next(e)
    }
  }

  public get = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ocd = await this.ocdService.get(req.params.id)

      if (!ocd) return next(new HttpError(404, 'Ressource not found'))

      if (req.currentUser?.id !== ocd?.authorId) {
        return next(new HttpError(403, '#getOcd: Not allowed'))
      }

      res.status(200).json({ success: true, data: ocd })
    } catch (e) {
      return next(e)
    }
  }

  public update = async (
    req: Request<{ id: string }, any, Partial<Ocd>>,
    res: Response,
    next: NextFunction
  ) => {
    const { params, body } = req
    try {
      const ocd = await this.ocdService.update(params.id, body)

      if (!ocd) return next(new HttpError(404, 'Ressource not found'))

      if (req.currentUser?.id !== ocd?.authorId) {
        return next(new HttpError(403, '#updateOcd: Not allowed'))
      }

      res.status(200).json({ success: true, data: ocd })
    } catch (e) {
      return next(e)
    }
  }

  public delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { params } = req
    try {
      const ocd = await this.ocdService.delete(params.id)

      if (!ocd) return next(new HttpError(404, 'Ressource not found'))

      if (req.currentUser?.id !== ocd?.authorId) {
        return next(new HttpError(403, '#deleteOcd: Not allowed'))
      }

      res.status(200).json({ success: true, data: ocd })
    } catch (e) {
      return next(e)
    }
  }
}

export default OcdController
