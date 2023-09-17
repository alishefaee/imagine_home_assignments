import mongoose, { ObjectId } from "mongoose"
import { IMongooseDocs } from "../interfaces/mongoose.interface"

const Schema = mongoose.Schema

const productSchema = new Schema<IProduct>(
  {
    price: { type: Number },
    quantity: { type: Number },
    author: { type: String },
    genre: { type: String }
  },
  {
    timestamps: {}
  }
)

export interface IProduct extends IMongooseDocs<IProduct> {
  _id: ObjectId,
  author: string,
  genre: string,
  price: number,
  quantity: number
}

export const ProductModel = mongoose.model<IProduct>("Product", productSchema)
