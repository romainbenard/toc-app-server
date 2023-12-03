import { Router } from 'express'
import OcdController from '../controllers/ocd.controller'
import isAuthenticated from '../middlewares/isAuthenticated.middleware'
import { validateBody } from '../middlewares/validate.middleware'
import {
  createOcdValidation,
  updateOcdValidation,
} from '../validations/ocd.validation'

const ocdsRouter = Router()
const ocdController = new OcdController()

ocdsRouter.get('/', isAuthenticated, ocdController.getMany)

ocdsRouter.post(
  '/create',
  isAuthenticated,
  validateBody(createOcdValidation),
  ocdController.create
)

ocdsRouter.get('/:id', isAuthenticated, ocdController.get)

ocdsRouter.put(
  '/:id',
  isAuthenticated,
  validateBody(updateOcdValidation),
  ocdController.update
)

ocdsRouter.delete('/:id', isAuthenticated, ocdController.delete)

export default ocdsRouter
