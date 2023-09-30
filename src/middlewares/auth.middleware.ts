import { response, setCodeResponse } from "../utils/functions";
import Login from "../services/login.service";
import { generateHash } from "../utils/encrypt.utils";
import { Code } from "../utils/consts.utils";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
import { Schema } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      loginId: string|Schema.Types.ObjectId
    }
  }
}

class Auth {

  isLoggedIn = async (req: any, res: Response, next: NextFunction) => {
    let user = await Auth.#findAccessToken(req);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res);
    }

    req.user = user;
    next();
  }

  checkLoginStatus = async (req: any, res: Response, next: NextFunction) => {
    let user = await Auth.#findAccessToken(req);
    if (!user) {
      setCodeResponse(null, true);
      return next();
    }
    req.user = user;
    next();
  }

  static async #findAccessToken(req:Request) {
    let token = req.get("token");
    if (!token) {
      setCodeResponse(Code.ACCESS_TOKEN_NOT_SET);
      return null;
    }
    console.log('token', token)
    let aHash = generateHash(token);
    console.log('ahash', aHash)
    let login = await Login.findByAccessToken(aHash);
    if (!login) {
      setCodeResponse(Code.ACCESS_TOKEN_INVALID);
      return null;
    }
    return login;
  }
}

export default new Auth();
