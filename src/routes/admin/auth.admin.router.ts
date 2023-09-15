import express from 'express'
import loginAdminController from "../../controllers/admin/login.admin.controller"
import { checkAdmin } from "../../middlewares/check-admin"
import { Validator } from "../../middlewares/Validator"
import { LoginAdminSchema } from "../../schemas/admin/login-admin.schema"
import { isAdmin } from "../../middlewares/admin-auth"

const router = express.Router()

router.post('/', Validator.body(LoginAdminSchema), checkAdmin, loginAdminController.login)
router.get('/', isAdmin, loginAdminController.findAdmin)

export default router