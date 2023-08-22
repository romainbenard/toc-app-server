import { NextFunction, Request, Response } from 'express'
import HttpError from '../utils/httpError'
import { logger } from '../lib/logger'

export const errorMiddleware = (
  err: HttpError,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction
) => {
  const defaultErr = {
    success: false as const,
    status: err.status || 500,
    message: err.message || 'Something went wrong.',
    error: err.error || 'Express caught unknown error',
  }
  const errorObj = Object.assign({}, defaultErr, err)

  const { success, message } = errorObj

  logger.error(errorObj)
  return res.status(errorObj.status).json({ success, message })
}

export default errorMiddleware
