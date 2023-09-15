import express from 'express'
import httpContext from 'express-http-context'
import rateLimit from 'express-rate-limit'
import { response } from '../utils/functions'
import user from '../controllers/user.controller'
import deleteAccount from '../controllers/delete-account.controller'
import auth from '../controllers/middlewares/auth.middleware'
import { Code } from '../utils/consts.utils'
import { Validator } from "../middlewares/Validator"
import {CreateUserSchema} from "../schemas/users/create-user.schema"
import {LoginGoogleSchema} from "../schemas/users/login-google.schema";
import {EmailSchema} from "../schemas/email.schema"
import {UpdateUserSchema} from "../schemas/users/update-user.schema"
import {LoginUserSchema} from "../schemas/users/login-user.schema"

// Limit requests from same API
const userLimiter = rateLimit({
  max: 30,
  windowMs: 15 * 60 * 1000,
  handler: function (req, res) {
    httpContext.set('status', Code.TOO_MANY_REQUEST)
    return response(res, {}, 'حداکثر ۳۰ درخواست مجاز')
  }
})

const router = express.Router()
router.use(userLimiter)

router.post('/signup',Validator.body(CreateUserSchema), user.signup)
// router.post('/login-or-register', user.loginOrRegister)
router.get('/request-edit', auth.isLoggedIn, user.requestEdit)
router.get('/logout', auth.isLoggedIn, user.logout)
router.patch('/', Validator.body(UpdateUserSchema), auth.isLoggedIn, user.edit)
router.post('/login', Validator.body(LoginUserSchema), user.login)
router.post('/google',Validator.body(LoginGoogleSchema), user.google)
router.post('/check-exist',user.checkExist)

// delete account
router.post('/request-delete', Validator.body(EmailSchema), deleteAccount.request)
router.post('/delete-account', deleteAccount.delete)

export default router
