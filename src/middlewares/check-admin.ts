import {Request,Response,NextFunction} from "express"
import adminService from "../services/admin.service"

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
  let admin = await adminService.findByEmail(process.env.ADMIN_EMAIL!)
  if (!admin) {
    await adminService.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    })
  }
  next()
}