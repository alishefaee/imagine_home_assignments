import httpContext from 'express-http-context'
import { Code } from '../utils/consts.utils'
import { generateHash, generateToken } from '../utils/encrypt.utils'
import Login, { ILogin } from "../models/login.model";
import { Schema, Types } from "mongoose";

class LoginService {
    create = async (user:any, app:any) => {

        let aToken = generateToken()
        let rToken = generateToken()
        let login = {
            ...app,
            aToken: generateHash(aToken),
            rToken: generateHash(rToken),
            userId: user._id
        }
        login = await Login.create(login)

       return { ...login, aToken, rToken }
    }

    update = async (_id:string|Schema.Types.ObjectId, oldAToken:string) => {
        let aToken = generateToken()
        let rToken = generateToken()
        let update = {
            aToken: generateHash(aToken),
            rToken: generateHash(rToken),
            oldAToken
        }

        // TODO: login possibly null
        let login = await Login.findByIdAndUpdate(_id, update)
        login!.aToken = aToken
        login!.rToken = rToken
        return login
    }

    updateValidation = async (_id:string|Schema.Types.ObjectId) => {
        await Login.findByIdAndUpdate(_id, { valid: false })
        return
    }

    delete = async ( userId:Schema.Types.ObjectId) => {
        await Login.updateMany({ userId }, { valid: false })
        return
    }

    deleteOtherSessions = async ( userId:string|Schema.Types.ObjectId, _id:string|Schema.Types.ObjectId) => {
        await Login.updateMany({ userId, _id: { $ne: _id } }, { valid: false })
        return
    }

    deleteSession = async ( _id:string|Schema.Types.ObjectId) => {
        await Login.findByIdAndDelete(_id)
        return
    }

    findByAccessToken = async ( aToken:string) => {
        let token = await Login.findOne({
            $or: [{ aToken }, { oldAToken: aToken }],
            valid: true
        })
        return token
    }

}

export default new LoginService()
