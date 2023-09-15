import { response, setCodeResponse } from "../utils/functions";

import { Code, RegisterType, UserType } from "../utils/consts.utils";
import { generateHash, generateToken, passwordVerify } from "../utils/encrypt.utils"
import httpContext from "express-http-context";
import Email from "../utils/email.util";
import UserService from "../services/user.service";
import TokenService from "../services/token.service";
import LoginService from "../services/login.service";
import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";

class User {

  signup = async (req: Request, res: Response) => {
    let user = await UserService.findByEmail(req.body.user.email);
    if (user) {
      setCodeResponse(Code.EMAIL_EXIST);
      return response(res, {}, { user });
    }
    user = await UserService.create({
      ...req.body.user,
      role: UserType.USER,
      type: RegisterType.BUILTIN
    });
    let login = await LoginService.create(user, req.body.app);

    const cleanedData = {
      login: {
        id: login._id,
        createdDate: login.createdAt,
        aToken: login.aToken,
        rToken: login.rToken
      },
      user: {
        id: user._id,
        email: user.email,
        createdDate: user.createdAt
      }
    };

    response(res, cleanedData, {});
  };


  // loginOrRegister = async (req:Request, res:Response) => {
  //     //validation
  //     if (!req.body.user.type) {
  //         httpContext.set('status', Code.INPUT_DATA_INVALID)
  //         return this.response(res, { type: 'فیلد تایپ تعریف نشده است' })
  //     }
  //
  //     let userValidationPromise
  //     if (req.body.user.type === 1) {
  //
  //         userValidationPromise = validateUserByPass(req.body)
  //     }
  //     if (req.body.user.type === 2) {
  //         userValidationPromise = validateUserByGoogle(req.body)
  //     }
  //
  //     let appDataValidationPromise = validateApp(req.body)
  //     let [appDataValidation, userValidation] = await Promise.all([
  //         appDataValidationPromise,
  //         userValidationPromise
  //     ])
  //
  //     if (appDataValidation !== true || userValidation !== true) {
  //         httpContext.set('status', Code.INPUT_DATA_INVALID)
  //         return this.self.response(res, {}, { ...appDataValidation, ...userValidation })
  //     }
  //
  //     let login, user
  //
  //     if (req.body.user.type === 1) {
  //
  //         user = await UserService.find(req.body.user)
  //         login = await LoginService.create(user, req.body.app)
  //     }
  //
  //
  //
  //     const cleanedData = {
  //         login: {
  //             id: login._id,
  //             createdDate: login.createdAt,
  //             aToken: login.aToken,
  //             rToken: login.rToken
  //         },
  //         user: {
  //             id: user._id,
  //             email: user.email,
  //             createdDate: user.createdAt
  //         }
  //     }
  //     return this.response(res, cleanedData, {})
  // }

  login = async (req: Request, res: Response) => {
    let user = await UserService.find(req.body.user);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res, {}, {});
    }
    let passwordValid = await passwordVerify(req.body.user.password, user!.password);
    if (!passwordValid) {
      httpContext.set('status', Code.AUTHENTICATION_FAILED)
      return response(res)
    }
    let login = await LoginService.create(user, req.body.app);

    const cleanedData = {
      login: {
        id: login._id,
        createdDate: login.createdAt,
        aToken: login.aToken,
        rToken: login.rToken
      },
      user: {
        id: user._id,
        email: user.email,
        createdDate: user.createdAt
      }
    };
    return response(res, cleanedData, {});
  };

  google = async (req: Request, res: Response) => {
    const client = new OAuth2Client(process.env.CLIENT_ID);

    try {
      const ticket = await client.verifyIdToken({
        idToken: req.body.user.token,
        audience: process.env.CLIENT_ID
      });

      // if (!ticket || !ticket.getPayload()){
      //     setCodeResponse(Code.AUTHENTICATION_FAILED)
      //     return response(res, {})
      // }
      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error("Google auth failed. payload undefined");
      }

      if (payload.aud !== process.env.CLIENT_ID) {
        // Todo: auth failed
      }

      if (!payload.email) {
        throw new Error("Google auth failed. email is undefined");
      }

      let user = await UserService.findByEmail(payload.email);
      if (!user)
        user = await UserService.create({
          email: payload.email,
          password: payload.sub,
          role: UserType.USER,
          type: RegisterType.GOOGLE
        });
      let login = await LoginService.create(user, req.body.app);

      const cleanedData = {
        login: {
          id: login._id,
          createdDate: login.createdAt,
          aToken: login.aToken,
          rToken: login.rToken
        },
        user: {
          id: user._id,
          email: user.email,
          createdDate: user.createdAt
        }
      };
      return response(res, cleanedData, {});

    } catch (e) {
      setCodeResponse(Code.AUTHENTICATION_FAILED);
      return response(res, {}, { e });
    }


  };

  // generate code
  /*requestEdit = catchAsync(async (req, res) => {
      let user = req.user
      let code = generateCode()
      await TokenService.create(user._id, code)

      let emailResult = await Email.send({
          to: user.email,
          subject: 'یومی - فراموشی رمز عبور',
          data: { code },
          text: code.toString(),
          templateFile: 'email-reset-pass'
      })

      return this.response(res, {}, { emailResult })
  })*/

  requestEdit = async (req: Request, res: Response) => {
    let user = req.user;
    let token = generateToken();
    await TokenService.create(user._id, token);

    let url = `${process.env.FRONT_RESET_PASS_BASEURL}/${token}`;

    const email = new Email({
      from: process.env.EMAIL_FROM_FORGOT_PASS,
      pass: process.env.EMAIL_PASS_FORGOT_PASS,
      to: user.email,
      subject: "یومی - فراموشی رمز عبور",
      text: url,
      templateFile: "email-reset-pass",
      data: { url }
    });
    let emailResult = await email.send();

    return response(res, {}, { emailResult });
  };

  edit = async (req: Request, res: Response) => {

    let hash = generateHash(req.body.token);
    let token = await TokenService.find(hash);

    if (!token) {
      httpContext.set("status", Code.INPUT_DATA_INVALID);
      return response(res, {});
    }

    if (token.createdAt.getTime() + Number(process.env.OTP_TTL) < Date.now()) {
      setCodeResponse(Code.TOKEN_EXPIRED);
      return response(res, {}, {});
    }

    let data = {};
    if (req.body.email)
      data = { email: req.body.email };
    if (req.body.password)
      data = { ...data, password: req.body.password };

    let user = await UserService.updateEmailPass(token.userId, data);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res, {}, {});
    }

    await LoginService.deleteOtherSessions(user._id, req.loginId);
    await TokenService.delete(user._id);

    const cleanData = {
      user: {
        id: user._id,
        email: user.email,
        createdDate: user.createdAt
      }
    };
    return response(res, cleanData, {});
  };

  logout = async (req: Request, res: Response) => {
    await LoginService.deleteSession(req.loginId);
    return response(res, {}, {});
  };

  checkExist = async (req: Request, res: Response) => {
    let user = await UserService.findByEmail(req.body.email);
    if (!user) {
      setCodeResponse(Code.USER_NOT_FOUND);
      return response(res, {}, {});
    }

    return response(res, {...user._doc, password: undefined}, {});
  }
}

export default new User()