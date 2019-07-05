import express from 'express'
import baseController from '../controllers/baseController'

const router = express.Router()

const BASEROUTE = '/api'

router.get(`${BASEROUTE}/todo`, baseController.get)

router.post(`${BASEROUTE}/todo`, baseController.post)

router.get(`${BASEROUTE}/todo/:id`, baseController.get)

router.delete(`${BASEROUTE}/todo/:id`, baseController.delete)

router.put(`${BASEROUTE}/todo/:id`, baseController.put)

router.patch(`${BASEROUTE}/todo/:id`, baseController.patch)

// Test case
router.get(`${BASEROUTE}/test`, baseController.get)

export default router
