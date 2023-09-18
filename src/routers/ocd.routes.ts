import { Router } from 'express'
import OcdController from '../controllers/ocd.controller'

const ocdsRouter = Router()
const controller = new OcdController()

ocdsRouter.post('/create', controller.createOcd)

ocdsRouter.get('/:id', controller.getOcd)

ocdsRouter.put('/:id', controller.updateOcd)

ocdsRouter.delete('/:id', controller.deleteOcd)

export default ocdsRouter
