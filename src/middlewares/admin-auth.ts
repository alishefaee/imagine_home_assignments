import { NextFunction, Request, Response } from "express";
import { Schema } from "mongoose";
import { IAdmin } from "../models/admin.model"
import { response, setCodeResponse } from "../utils/functions"
import { Code } from "../utils/consts.utils"
import { generateHash } from "../utils/encrypt.utils"
import AdminLoginService from "../services/admin-login.service"

declare global {
  namespace Express {
    interface Request {
      admin: IAdmin;
      loginId: string|Schema.Types.ObjectId
    }
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  let token = req.get("token");
  if (!token) {
    setCodeResponse(Code.ACCESS_TOKEN_NOT_SET);
    return response(res);
  }
  let hash = generateHash(token);
  let adminLogin = await AdminLoginService.findByToken(hash)
  if (!adminLogin){
    setCodeResponse(Code.ACCESS_TOKEN_INVALID)
    return response(res)
  }
  next()
}