import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      schema.parse(req.body)

      next()
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: 'Validation error', error: err })
    }
  }
