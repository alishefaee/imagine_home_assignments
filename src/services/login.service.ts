import { generateHash, generateToken } from "../utils/encrypt.utils"
import Login, { IUserLogin } from "../models/user-login.model"
import { Schema } from "mongoose"

class LoginService {
  create = async (user: any) => {

    let token = generateToken()
    let login = {
      token: generateHash(token),
      userId: user._id
    }
    login = await Login.create(login)

    return { ...login, token }
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

  findByAccessToken = (aToken: string) => {
    return Login.findOne({
      $or: [{ aToken }, { oldAToken: aToken }],
      valid: true
    })
  }

}

export default new LoginService()
