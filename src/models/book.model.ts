import mongoose, { ObjectId } from "mongoose"
import { IMongooseDocs } from "../interfaces/mongoose.interface"

const Schema = mongoose.Schema

const bookSchema = new Schema<IBook>(
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

export interface IBook extends IMongooseDocs<IBook> {
  _id: ObjectId,
  author: string,
  genre: string,
  price: number,
  quantity: number
}

export default mongoose.model<IBook>("Book", bookSchema)
