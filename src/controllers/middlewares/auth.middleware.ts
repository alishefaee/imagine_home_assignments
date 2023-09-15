import { response, setCodeResponse } from "../../utils/functions";
import Login from "../../services/login.service";
import User from "../../services/user.service";
import { generateHash } from "../../utils/encrypt.utils";
import { Code, UserType } from "../../utils/consts.utils";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../../models/user.model";
import { Schema } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      loginId: string|Schema.Types.ObjectId
      // login: LoginModel;
    }
  }
}

class Auth {

  isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    let user = await Auth.#findLoggedIn(req, res);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res);
    }
    if (user.role != UserType.ADMIN) {
      setCodeResponse(Code.USER_NOT_ADMIN);
      return response(res);
    }
    req.user = user;
    next();
  }
  isUser = async (req: Request, res: Response, next: NextFunction) => {
    let user = await Auth.#findLoggedIn(req, res);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res);
    }
    if (user.role !== UserType.USER) {
      setCodeResponse(Code.USER_NOT_ADMIN);
      return response(res);
    }
    req.user = user;
    next();
  }
  isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    let user = await Auth.#findLoggedIn(req, res);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res);
    }

    req.user = user;
    next();
  }
  checkLoginStatus = async (req: Request, res: Response, next: NextFunction) => {
    let user = await Auth.#findLoggedIn(req, res);
    if (!user) {
      setCodeResponse(null, true);
      return next();
    }
    req.user = user;
    next();
  };

  static #checkRefreshToken(req:Request, loginRHash:string) {
    let rToken = req.get("rToken");
    if (!rToken) {
      setCodeResponse(Code.REFRESH_TOKEN_NOT_SET);
      return null;
    }
    let rHash = generateHash(rToken);
    return loginRHash === rHash;
  }

  static #setHeaderResponse(res:Response, loggedIn:any, aToken:string|undefined = undefined, rToken :string|undefined = undefined) {
    if (aToken) res.header("aToken", aToken);
    if (rToken) res.header("rToken", rToken);

    res.header("sessionIsUpdated", loggedIn);
  }

  static async #findAccessToken(req:Request) {
    let aToken = req.get("aToken");
    if (!aToken) {
      setCodeResponse(Code.ACCESS_TOKEN_NOT_SET);
      return null;
    }
    let aHash = generateHash(aToken);
    let login = await Login.findByAccessToken(aHash);
    if (!login) {
      setCodeResponse(Code.ACCESS_TOKEN_INVALID);
      return null;
    }
    return login;
  }

  static async #findLoggedIn(req: Request, res: Response) {
    let login = await Auth.#findAccessToken(req);
    if (!login) {
      setCodeResponse(Code.ACCESS_TOKEN_NOT_SET);
      return null;
    }
    let timeDistance = login.updatedAt.getTime() + Number(process.env.A_TOKEN_TTL) - Date.now();

    if (login.aToken && timeDistance > 0) {
      Auth.#setHeaderResponse(res, true);
      req.loginId = login._id;
      return User.findById(login.userId);
    } else {
      if (login.oldAToken === login.aToken && timeDistance > 0 && timeDistance < 10000) {
        req.loginId = login._id;
        return User.findById(login.userId);
      }

      let isRTokenValid = Auth.#checkRefreshToken(req, login.rToken);
      if (!isRTokenValid) {
        await Login.updateValidation(login._id);
        setCodeResponse(Code.REFRESH_TOKEN_INVALID);
        Auth.#setHeaderResponse(res, false);
        return null;
      }

      let timeDiff = login.updatedAt.getTime() + Number(process.env.R_TOKEN_TTL) - Date.now();
      if (timeDiff > 0) {
        await Login.updateValidation(login._id);
        let updatedLogin = await Login.update(login._id, login.aToken);
        Auth.#setHeaderResponse(res, false, updatedLogin?.aToken, updatedLogin?.rToken);
        req.loginId = login._id;
        return User.findById(login.userId);
      } else {
        Auth.#setHeaderResponse(res, false);
        setCodeResponse(Code.REFRESH_TOKEN_EXPIRED);
        return null;
      }
    }
  }
}

export default new Auth();
