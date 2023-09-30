import express from 'express'
import product from '../controllers/product.controller'

const router = express.Router()

router.get('/:id', product.findOne)
router.get('/', product.findAll)

export default router
