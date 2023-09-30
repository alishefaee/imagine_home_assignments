import { CartModel } from "../models/cart.model"
import { OrderStatusEnum } from "../enums/order-status.enum"

class CartService {
  findCurrentCart = async () => {
    let cart = await CartModel.findOne({ status: OrderStatusEnum.UNPAID })
    if (!cart) {
      cart = await CartModel.create({})
    }
    return cart
  }

  findAll = () => {
    return CartModel.find({})
  }

}

export default new CartService()