import express from 'express'
import loginAdminController from "../controllers/admin/login.admin.controller"
import { checkAdmin } from "../middlewares/check-admin"
import { Validator } from "../middlewares/Validator"
import { LoginAdminSchema } from "../schemas/admin/login-admin.schema"
import { isAdmin } from "../middlewares/admin-auth"
import { uploadImageMiddleware } from "../middlewares/upload-image"
import { AddMessageTicketSchema } from "../schemas/ticket/add-message-ticket.schema"
import { IdSchema } from "../schemas/id.schema"
import ticketAdmin from "../controllers/admin/ticket.admin.controller"
import authAdminRouter from "./admin/auth.admin.router"
import ticketAdminRouter from "./admin/ticket.admin.router"
import adAdminRouter from "./admin/ad.admin.router"

const router = express.Router()

// auth
router.use('/auth', authAdminRouter)
router.use('/tickets',ticketAdminRouter)
router.use('/ads',adAdminRouter)

// ticket
router.post(
  '/:id/message',
  isAdmin,
  uploadImageMiddleware.single("file"),
  Validator.body(AddMessageTicketSchema),
  Validator.params(IdSchema),
  ticketAdmin.addMessage
)

// ad



export default router