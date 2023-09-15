import mongoose, { ObjectId } from "mongoose";

const Schema = mongoose.Schema

const userLoginSchema = new Schema<IUserLogin>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        token: { type: String, required: true }
    },
    {
        timestamps: {}
    }
)

export interface IUserLogin {
  _id: ObjectId,
  userId: ObjectId,
  token: string,
  createdAt: Date,
  updatedAt: Date
}

export default mongoose.model<IUserLogin>('UserLogin', userLoginSchema)
