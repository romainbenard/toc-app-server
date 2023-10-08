import AuthController from '../controllers/auth.controller'

import { Router } from 'express'
import {
  createUserValidation,
  loginValidation,
} from '../validations/users.validation'
import { validateBody } from '../middlewares/validate.middleware'
import isAuthenticated from '../middlewares/isAuthenticated.middleware'

const authRouter = Router()
const authController = new AuthController()

authRouter.post(
  '/signup',
  validateBody(createUserValidation),
  authController.signUp
)

authRouter.post('/login', validateBody(loginValidation), authController.logIn)

authRouter.post('/logout', isAuthenticated, authController.logOut)

export default authRouter
