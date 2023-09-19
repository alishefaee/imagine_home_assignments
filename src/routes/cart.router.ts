import express from "express";

const router = express.Router();

router.post('/cart/products/:productId')
router.delete('/cart/products/:productId')

export default router;
