import httpContext from "express-http-context";
import { IUser, UserModel } from "../models/user.model";
import { Code } from "../utils/consts.utils";
import { passwordHash } from "../utils/encrypt.utils";
import { Schema } from "mongoose";

class UserService {
  create = async ( data: any) => {
    return UserModel.create(data);
  }


  find = ( data: any) => {
      return UserModel.findOne({ email: data.email });
  }

  findByEmail = async (email: string) => {
    return UserModel.findOne({ email });
  }

  findById = async ( _id: string | Schema.Types.ObjectId) => {
    return UserModel.findById(_id);
  }
  update = async ( _id: string | Schema.Types.ObjectId, password: string) => {
    if (password)
      password = await passwordHash(password);
    return UserModel.findByIdAndUpdate(_id, { $set: { password } });
  }

}

export default new UserService();
