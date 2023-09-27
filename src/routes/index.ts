import express from "express";
import cors from "cors"
import userRouter from "./user.router"
import productRouter from "./product.router";
import cartRouter from "./cart.router";

const router = express.Router()

router.use(cors({
    origin:'*'
}))

router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)

export default router