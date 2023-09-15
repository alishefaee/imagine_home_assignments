import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { logger } from "./logger.util"

export const passwordHash = async (pass:string) => {
    const saltRounds = 10
    return await bcrypt.hash(pass, saltRounds)
}

export const passwordVerify = (pass:string, hash:string) => {
    logger.info(`${pass}`)
    return new Promise(async (resolve, reject) => {
        hash = hash.replace('$2y$', '$2a$')
        logger.info(`hash ${hash}`)

        const match = await bcrypt.compare(pass, hash)
        if (match) resolve(true)
        else {
            resolve(false)
        }
    })
}

export const generateToken = () => {
    return crypto.randomBytes(64).toString('hex')
}

export const generateHash = (token:string) => {
    return crypto.createHmac('sha256', process.env.SECRET!).update(token.toString()).digest('base64')
}