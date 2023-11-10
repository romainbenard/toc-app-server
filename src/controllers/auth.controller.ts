import type { NextFunction, Request, Response } from 'express'
import AuthService from '../services/auth.service'
import {
  type SignUpBody,
  logInValidation,
  LogInBody,
} from '../validations/auth.validation'
import { TokenData } from '../types/auth'

class AuthController {
  public authService = new AuthService()

  public signUp = async (
    req: Request<any, any, SignUpBody>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    try {
      await this.authService.signUp(req.body)

      return res.status(200).json({ success: true })
    } catch (e) {
      return next(e)
    }
  }

  public logIn = async (
    req: Request<any, any, LogInBody>,
    res: Response<
      ApiResponse<{
        email: string
        id: string
        name: string
        token: TokenData
      }>
    >,
    next: NextFunction
  ) => {
    const body = logInValidation.parse(req.body)

    try {
      const { authCookie, user, token } = await this.authService.logIn(body)
      const { email, id, name } = user

      res.setHeader('Set-Cookie', [authCookie])

      return res.status(200).json({
        success: true,
        message: 'Logged in',
        data: { email, id, name, token },
      })
    } catch (e) {
      return next(e)
    }
  }

  public logOut = async (_: Request, res: Response<ApiResponse>) => {
    res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
    return res.status(200).json({ success: true, message: 'Logged out' })
  }
}

export default AuthController
