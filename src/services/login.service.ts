import { generateHash, generateToken } from "../utils/encrypt.utils"
import Login, { IUserLogin } from "../models/user-login.model"
import { Schema } from "mongoose"

class LoginService {
  create = async (user: any) => {
    const token = generateToken()
    const data = {
      token: generateHash(token),
      userId: user._id
    }
    const login = await Login.create(data)

    return { ...login._doc, token }
  }

  update = async (_id: string | Schema.Types.ObjectId, oldAToken: string) => {
    let token = generateToken()
    let update = {
      token: generateHash(token)
    }

    // TODO: login possibly null
    let login = await Login.findByIdAndUpdate(_id, update)

    login!.token = token
    return login
  }

  deleteSession = async (_id: string | Schema.Types.ObjectId) => {
    await Login.findByIdAndDelete(_id)
    return
  }

  findByAccessToken = (token: string) => {
    return Login.findOne({ token })
  }

}

export default new LoginService()
