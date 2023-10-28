import AuthController from '../controllers/auth.controller'

import { Router } from 'express'
import { validateBody } from '../middlewares/validate.middleware'
import isAuthenticated from '../middlewares/isAuthenticated.middleware'
import {
  signUpValidation,
  logInValidation,
} from '../validations/auth.validation'

const authRouter = Router()
const authController = new AuthController()

authRouter.post(
  '/signup',
  validateBody(signUpValidation),
  authController.signUp
)

authRouter.post('/login', validateBody(logInValidation), authController.logIn)

authRouter.post('/logout', isAuthenticated, authController.logOut)

export default authRouter
