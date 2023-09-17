import { response, setCodeResponse } from "../utils/functions";
import { Code } from "../utils/consts.utils";
import { passwordVerify } from "../utils/encrypt.utils"
import httpContext from "express-http-context";
import UserService from "../services/user.service";
import LoginService from "../services/login.service";
import { Request, Response } from "express";

class User {

  signup = async (req: Request, res: Response) => {
    let user = await UserService.findByEmail(req.body.email)
    if (user) {
      setCodeResponse(Code.EMAIL_EXIST);
      return response(res);
    }

    user = await UserService.create({
      email: req.body.email,
      password: req.body.password
    });

    let login = await LoginService.create(user);

    response(res, {user, login});
  }

  login = async (req: Request, res: Response) => {
    let user = await UserService.findByEmail(req.body.email);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res, {});
    }
    let passwordValid = await passwordVerify(req.body.password, user!.password);
    if (!passwordValid) {
      httpContext.set('status', Code.AUTHENTICATION_FAILED)
      return response(res)
    }
    let login = await LoginService.create(user);

    return response(res, {user, login});
  };

  logout = async (req: Request, res: Response) => {
    await LoginService.deleteSession(req.loginId);
    return response(res, {});
  };
}

export default new User()