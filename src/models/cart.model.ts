import mongoose, { ObjectId } from "mongoose"
import { IMongooseDocs } from "../interfaces/mongoose.interface"
import { OrderStatusEnum } from "../enums/order-status.enum"
import { IProduct } from "./product.model"

const Schema = mongoose.Schema

const cartSchema = new Schema<ICart>(
  {
    status: {type: String, enum: Object.values(OrderStatusEnum), default: OrderStatusEnum.UNPAID},
    totalPrice: { type: Number, default: 0 },
    products: [{ type: Schema.Types.ObjectId, default: [], ref: 'Product' }]
  },
  {
    timestamps: {}
  }
)

export interface ICart extends IMongooseDocs<ICart> {
  _id: ObjectId,
  status: OrderStatusEnum,
  totalPrice: number,
  products: ObjectId[]
}

export const CartModel = mongoose.model<ICart>("Cart", cartSchema)
