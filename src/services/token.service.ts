import httpContext from 'express-http-context'
import { Code } from '../utils/consts.utils'
import Token from '../models/token.model'
import { Schema, Types } from "mongoose";

class TokenService {

    create = async ( userId:Schema.Types.ObjectId, token:string) => {
        return Token.create({ userId, token })
    }

    find = async ( hash:string) => {
        return Token.findOne({ token: hash })
    }

    delete = async ( userId:Schema.Types.ObjectId) => {
        return Token.deleteMany({ userId })
    }

}

export default new TokenService()
