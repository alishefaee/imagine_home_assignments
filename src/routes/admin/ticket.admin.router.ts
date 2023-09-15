import express from 'express'
import { Validator } from "../../middlewares/Validator"
import { isAdmin } from "../../middlewares/admin-auth"
import { uploadImageMiddleware } from "../../middlewares/upload-image"
import { AddMessageTicketSchema } from "../../schemas/ticket/add-message-ticket.schema"
import { IdSchema } from "../../schemas/id.schema"
import ticketAdmin from "../../controllers/admin/ticket.admin.controller"
import auth from "../../controllers/middlewares/auth.middleware"
import { PaginationSchema } from "../../schemas/pagination.schema"
import ticket from "../../controllers/ticket.controller"

const router = express.Router()

router.post(
  '/:id/message',
  isAdmin,
  uploadImageMiddleware.single("file"),
  Validator.body(AddMessageTicketSchema),
  Validator.params(IdSchema),
  ticketAdmin.addMessage
)

router.get('/', isAdmin,Validator.query(PaginationSchema), ticketAdmin.getAll)

export default router