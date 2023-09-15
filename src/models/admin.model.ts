import mongoose, { ObjectId, model } from "mongoose";
import { passwordHash } from '../utils/encrypt.utils'
import { IMongooseDocs } from "../interfaces/mongoose.interface"

const Schema = mongoose.Schema

const adminSchema = new Schema<IAdmin>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String },
    },
    {
        timestamps: {},
      versionKey: false
    }
)

export interface IAdmin extends IMongooseDocs<IAdmin> {
  _id: ObjectId,
  email:string,
  password: string,
  createdAt: Date,
  updatedAt: Date
}

adminSchema.pre('save', async function (next) {
    let admin = this

    if (!admin.isModified('password')) {
        return next()
    }

    admin.password = await passwordHash(admin.password)

    return next()
})

export const AdminModel = model<IAdmin>('Admin', adminSchema)
