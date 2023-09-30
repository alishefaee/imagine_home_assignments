import mongoose, { ObjectId } from "mongoose"
import { IMongooseDocs } from "../interfaces/mongoose.interface"

const Schema = mongoose.Schema

const userLoginSchema = new Schema<IUserLogin>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true }
  },
  {
    timestamps: {},
    versionKey: false
  }
)

export interface IUserLogin extends IMongooseDocs<IUserLogin> {
  _id: ObjectId,
  userId: ObjectId,
  token: string,
  createdAt: Date,
  updatedAt: Date
}

export default mongoose.model<IUserLogin>("UserLogin", userLoginSchema)
