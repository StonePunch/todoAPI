import express from 'express'
import baseController from '../controllers/baseController'

const router = express.Router()

const BASEROUTE = '/api/todo'

router.get(BASEROUTE, baseController.get)

router.post(BASEROUTE, baseController.post)

router.get(`${BASEROUTE}/:id`, baseController.get)

router.delete(`${BASEROUTE}/:id`, baseController.delete)

router.put(`${BASEROUTE}/:id`, baseController.put)

router.patch(`${BASEROUTE}/:id`, baseController.patch)

export default router
