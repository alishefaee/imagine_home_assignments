import { Request, Response } from "express"
import CartService from "../services/cart.service"
import { Types, ObjectId } from "mongoose"
import { response } from "../utils/functions"

class Cart {

  async findAll(req: Request, res:Response) {
    const carts = await CartService.findAll()
    return response(res, carts)
  }

  async findCurrent(req: Request, res:Response) {
    const cart = await CartService.findCurrentCart()
    return response(res,cart)
  }


  async addProduct(req: Request, res: Response) {
    const {productId} = req.params
    const cart = await CartService.findCurrentCart()
    let objId = new Types.ObjectId(productId)
    cart.products.push(objId)
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