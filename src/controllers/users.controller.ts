import { NextFunction, Request, Response } from 'express'
import UsersService from '../services/users.service'
import HttpError from '../utils/httpError'
import { UserUpdateBody } from '../validations/users.validation'
import { UserClient } from '../types/client'

class UsersController {
  public usersService = new UsersService()

  public getUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.usersService.getUsers()

      res.status(200).json({ success: true, data: users })
    } catch (e) {
      return next(e)
    }
  }

  public getUserById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<UserClient | null>>,
    next: NextFunction
  ) => {
    const { id } = req.params

    if (req.currentUser?.id !== req.params.id) {
      return next(new HttpError(403, '#getUserById: Not allowed'))
    }

    try {
      const user = await this.usersService.getUserById(id)

      res.status(200).json({ success: true, data: user })
    } catch (e) {
      return next(e)
    }
  }

  public getUserByEmail = async (
    req: Request<any, any, { email: string }>,
    res: Response<ApiResponse<UserClient | null>>,
    next: NextFunction
  ) => {
    const { email } = req.body

    try {
      const user = await this.usersService.getUserByEmail(email)

      res.status(200).json({ success: true, data: user })
    } catch (e) {
      return next(e)
    }
  }

  public updateUser = async (
    req: Request<{ id: string }, any, UserUpdateBody>,
    res: Response<ApiResponse<UserClient>>,
    next: NextFunction
  ) => {
    const { body, params } = req

    if (req.currentUser?.id !== req.params.id) {
      return next(new HttpError(403, '#updateUser: Not allowed'))
    }

    try {
      const updatedUser = await this.usersService.updateUser(params.id, body)

      res.status(200).json({ success: true, data: updatedUser })
    } catch (e) {
      return next(e)
    }
  }

  public deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    if (req.currentUser?.id !== req.params.id) {
      return next(new HttpError(403, '#deleteUser: Not allowed'))
    }

    try {
      const { id } = req.params
      await this.usersService.deleteUser(id)

      res.status(200).json({ success: true })
    } catch (e) {
      return next(e)
    }
  }
}

export default UsersController
