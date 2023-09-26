import { Request, Response } from "express"
import CartService from "../services/cart.service"
import { Schema } from "mongoose"
import { response } from "../utils/functions"

class Cart {
  async addProduct(req: Request, res: Response) {
    const {productId} = req.params
    const cart = await CartService.findCurrentCart()
    cart.products.push(new Schema.Types.ObjectId(productId))
    cart.save()
    return response(res)
  }

  async deleteProduct(req: Request, res: Response) {
    const {productId} = req.params
    const cart = await CartService.findCurrentCart()
    const index = cart.products.findIndex(pId=>pId.toString() == productId)
    cart.products.splice(index,1)
    cart.save()
    return response(res)
  }
}

export default new Cart()