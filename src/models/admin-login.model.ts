import mongoose, { ObjectId } from "mongoose";

const Schema = mongoose.Schema

const adminLoginSchema = new Schema<IAdminLogin>(
    {
        adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
        token: { type: String, required: true }
    },
    {
        timestamps: {}
    }
)

export interface IAdminLogin {
  _id: ObjectId,
  adminId: ObjectId,
  token: string,
  createdAt: Date,
  updatedAt: Date
}

export default mongoose.model<IAdminLogin>('AdminLogin', adminLoginSchema)
