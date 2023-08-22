import AuthController from '../controllers/auth.controller'

import { Router } from 'express'
import {
  createUserValidation,
  loginValidation,
} from '../validations/users.validation'
import { validateBody } from '../middlewares/validate.middleware'
import isAuthenticated from '../middlewares/isAuthenticated.middleware'

const authRouter = Router()
const { signUp, logIn, logOut } = new AuthController()

authRouter.post('/signup', validateBody(createUserValidation), signUp)

authRouter.post('/login', validateBody(loginValidation), logIn)

authRouter.post('/logout', isAuthenticated, logOut)

export default authRouter
