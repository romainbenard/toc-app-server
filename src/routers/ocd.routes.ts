import { Router } from 'express'
import OcdController from '../controllers/ocd.controller'
import isAuthenticated from '../middlewares/isAuthenticated.middleware'
import { validateBody } from '../middlewares/validate.middleware'
import {
  createOcdValidation,
  updateOcdValidation,
} from '../validations/ocd.validation'

const ocdsRouter = Router()
const controller = new OcdController()

ocdsRouter.post(
  '/create',
  isAuthenticated,
  validateBody(createOcdValidation),
  controller.createOcd
)

ocdsRouter.get('/:id', isAuthenticated, controller.getOcd)

ocdsRouter.put(
  '/:id',
  isAuthenticated,
  validateBody(updateOcdValidation),
  controller.updateOcd
)

ocdsRouter.delete('/:id', isAuthenticated, controller.deleteOcd)

export default ocdsRouter
