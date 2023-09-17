import express from 'express'
import product from '../controllers/product.controller'

const router = express.Router()

router.get('/products/:id', product.findOne)
router.get('/products', product.findAll)

export default router
