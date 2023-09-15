import {validate} from "class-validator";
import {plainToClassFromExist} from "class-transformer";
import {NextFunction, Request, Response} from "express";
import {response} from "../utils/functions";
import httpContext from "express-http-context";
import { Code } from "../utils/consts.utils";

export class Validator {
  static body(Schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const body = plainToClassFromExist<any,any>(new Schema(), req.body);

      validate(body, { whitelist: true, forbidNonWhitelisted: true }).then(errors => {
        if (!errors.length) {
          req.body = body;
          return next();
        }

        httpContext.set('status', Code.INPUT_DATA_INVALID)
        return response(res,{},errors);
      });
    };
  }

  static query(Schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const query = plainToClassFromExist(new Schema(), req.query);

      validate(query, { whitelist: true, forbidNonWhitelisted: true }).then(errors => {
        if (!errors.length) {
          req.query = query;
          return next();
        }

        httpContext.set('status', Code.INPUT_DATA_INVALID)
        return response(res,{},errors);
      });
    };
  }

  static params(Schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const params = plainToClassFromExist(new Schema(), req.params);
      validate(params, { whitelist: true, forbidNonWhitelisted: true }).then(errors => {
        if (!errors.length) {
          req.params = params;
          return next();
        }

        httpContext.set('status', Code.INPUT_DATA_INVALID)
        return response(res,{},errors);
      });
    };
  }
}
