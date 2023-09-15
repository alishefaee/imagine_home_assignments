import express from 'express'
import subscription from '../controllers/subscription.controller'
import wallpaper from '../controllers/wallpaper.controller'
import auth from '../controllers/middlewares/auth.middleware'
import card from '../controllers/card.controller'
import { Validator } from "../middlewares/Validator";
import { PaginationSchema } from "../schemas/pagination.schema";
import { GetCardSchema } from "../schemas/cards/get-card.schema";

const router = express.Router()

router.get('/subscriptions', subscription.getOne)
router.get('/wallpapers/:id/download', auth.checkLoginStatus, wallpaper.download)
router.get('/wallpapers/:id', wallpaper.getOne)
router.get('/wallpapers',Validator.query(PaginationSchema), wallpaper.getAll)
router.get('/cards/:slug', card.findOne)
router.get('/cards', Validator.query(GetCardSchema), card.findAll)

export default router
