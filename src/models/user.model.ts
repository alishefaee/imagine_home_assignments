import mongoose, { ObjectId, model } from "mongoose";
import { passwordHash } from '../utils/encrypt.utils'
import { IMongooseDocs } from "../interfaces/mongoose.interface"

const Schema = mongoose.Schema

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
    },
    {
        timestamps: {},
      versionKey: false
    }
)

export interface IUser extends IMongooseDocs<IUser> {
  _id: ObjectId,
  email:string,
  password: string,
  createdAt: Date,
  updatedAt: Date
}

userSchema.pre('save', async function (next) {
    let user = this

    if (!user.isModified('password')) {
        return next()
    }

    user.password = await passwordHash(user.password)

    return next()
})

export const UserModel = model<IUser>('User', userSchema)
