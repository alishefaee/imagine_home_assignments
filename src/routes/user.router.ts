import express from 'express'
import user from '../controllers/user.controller'
import auth from '../middlewares/auth.middleware'
import { Validator } from "../middlewares/Validator"
import {CreateUserSchema} from "../schemas/users/create-user.schema"
import {LoginUserSchema} from "../schemas/users/login-user.schema"

const router = express.Router()

router.post('/signup',Validator.body(CreateUserSchema), user.signup)
router.delete('/logout', auth.isLoggedIn, user.logout)
router.post('/login', Validator.body(LoginUserSchema), user.login)

export default router
