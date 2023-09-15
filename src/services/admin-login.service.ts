import { AdminModel, IAdmin } from "../models/admin.model"
import { generateHash, generateToken } from "../utils/encrypt.utils"
import AdminLoginModel from "../models/admin-login.model"

class AdminLoginService {
  async create(admin: IAdmin) {
    let token = generateToken()
    let hash = generateHash(token)
    let login = await AdminModel.create({
      adminId: admin._id,
      token: hash
    })
    return {...login, token}
  }

  findByToken(token:string) {
    return AdminLoginModel.findOne({token})
  }
}

export default new AdminLoginService()