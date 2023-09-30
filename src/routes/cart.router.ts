import express from "express";
import cart from '../controllers/cart.controller'

const router = express.Router();

router.get('/', cart.findAll)
router.get('/current', cart.findCurrent)
router.post('/products/:productId', cart.addProduct)
router.delete('/products/:productId', cart.deleteProduct)

export default router;
