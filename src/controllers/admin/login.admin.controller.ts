import { Request, Response } from "express/index"
import UserService from "../../services/user.service"
import LoginService from "../../services/login.service"
import { response, setCodeResponse } from "../../utils/functions"
import AdminService from "../../services/admin.service"
import AdminLoginService from "../../services/admin-login.service"
import { Code } from "../../utils/consts.utils"
import { passwordVerify } from "../../utils/encrypt.utils"
import { LoginAdminSchema } from "../../schemas/admin/login-admin.schema"
import adminService from "../../services/admin.service"

class Admin {
  login = async (req: Request, res: Response) => {
    const {email,password}:LoginAdminSchema = req.body

    let admin = await AdminService.findByEmail(email)
    if (!admin){
      setCodeResponse(Code.USER_NOT_FOUND)
      return response(res)
    }

    await passwordVerify(password, admin.password)

    let login = await AdminLoginService.create(admin!)

    const cleanedData = {
      login: {
        _id: login._id,
        createdAt: login.createdAt,
        token: login.token,
      },
      user: {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt
      }
    };
    return response(res, cleanedData, {});
  }

  findAdmin(req: Request, res: Response) {
    return response(res,{...req.admin, password: undefined})
  }
}

export default new Admin()