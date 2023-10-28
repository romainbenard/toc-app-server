import type { NextFunction, Request, Response } from 'express'
import AuthService from '../services/auth.service'
import {
  type SignUpBody,
  logInValidation,
} from '../validations/auth.validation'

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
    req: Request<any, any, SignUpBody>,
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const body = logInValidation.parse(req.body)

    try {
      const { authCookie, user } = await this.authService.logIn(body)
      const { email, id, name } = user

      res.setHeader('Set-Cookie', [authCookie])

      return res.status(200).json({
        success: true,
        message: 'Logged in',
        data: { email, id, name },
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
