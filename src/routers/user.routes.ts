import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.middleware'
import UsersController from '../controllers/users.controller'
import { updateUserValidation } from '../validations/users.validation'
import { validateBody } from '../middlewares/validate.middleware'

const usersRouter = Router()
const userController = new UsersController()

usersRouter.get('/', userController.getUsers)

usersRouter.post('/email', userController.getUserByEmail)

usersRouter.get('/:id', isAuthenticated, userController.getUserById)

usersRouter.put(
  '/:id',
  validateBody(updateUserValidation),
  isAuthenticated,
  userController.updateUser
)

usersRouter.delete('/:id', isAuthenticated, userController.deleteUser)

export default usersRouter
