import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import HttpError from '../utils/httpError'
import config from '../config'
import { DataStoredInToken } from '../types/auth'
import prisma from '../lib/prisma'

const isAuthenticated = async (
  req: Request,
  _: Response<ApiResponse>,
  next: NextFunction
) => {
  const { secretKey } = config

  try {
    const Authorization =
      req.cookies['Authorization'] ||
      req.header('Authorization')?.split('Bearer ')[1] ||
      null

    if (!Authorization) {
      const error = new HttpError(401, 'Not allowed')

      return next(error)
    }

    const { id: userId } = verify(Authorization, secretKey) as DataStoredInToken
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      const error = new HttpError(401, 'Wrong authentication token')

      return next(error)
    }

    const { id, email, name } = user
    req.currentUser = { id, email, name }

    next()
  } catch (err) {
    return next(err)
  }
}

export default isAuthenticated
