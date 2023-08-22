import { Router } from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.middleware'
import UsersController from '../controllers/users.controller'
import { updateUserValidation } from '../validations/users.validation'
import { validateBody } from '../middlewares/validate.middleware'

const usersRouter = Router()
const { getUsers, getUserById, updateUser, deleteUser } = new UsersController()

usersRouter.get('/', getUsers)

usersRouter.get('/:id', isAuthenticated, getUserById)

usersRouter.put(
  '/:id',
  validateBody(updateUserValidation),
  isAuthenticated,
  updateUser
)

usersRouter.delete('/:id', isAuthenticated, deleteUser)

export default usersRouter
