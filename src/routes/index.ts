import express from "express";
import cors from "cors"
import userRouter from "./user.router"
import productRouter from "./product.router";
import cartRouter from "./cart.router";
import { response } from "../utils/functions"
import { Code } from "../utils/consts.utils"
import httpContext from "express-http-context"

const router = express.Router()

router.use(cors({
    origin:'*'
}))

router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)

router.use('/*', (req:any,res:any)=>{
    console.log('not found:', req.protocol + '://' + req.get('host') + req.originalUrl)
    httpContext.set('status', Code.ROUTE_NOT_FOUND)
    return response(res,{} )
})

export default router