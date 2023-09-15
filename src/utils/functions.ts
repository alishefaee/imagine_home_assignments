import { Code } from "./consts.utils"
import httpContext from "express-http-context"
import { Response } from "express"


export const response = (res: Response, data = {}) => {
  let code = httpContext.get("status")

  let response: any = { code: code ? code.msgCode : Code.OK.msgCode }
  response.message = code ? code.mes : Code.OK.mes

  response.data = data
  res.header("serverTime", new Date().toISOString())

  return res.status(code ? code.status : Code.OK.status).json(response)

}

export const setCodeResponse = (code: any, override = false) => {
  let previousCode = httpContext.get("status")
  if (!previousCode || override) {
    console.log(code)
    httpContext.set("status", code)
  }
}
