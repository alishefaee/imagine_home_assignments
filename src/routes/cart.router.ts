import express from "express";
import auth from "../controllers/middlewares/auth.middleware";
import order from "../controllers/order.controller";
import { CreateOrderSchema } from "../schemas/orders/create-order.schema";
import { FindOneOrderSchema } from "../schemas/orders/find-one-order.schema";
import { FindAllOrderSchema } from "../schemas/orders/find-all-order.schema";
import { Validator } from "../middlewares/Validator";

const router = express.Router();

router.post("/subscriptions", Validator.body(CreateOrderSchema), auth.isLoggedIn, order.requestSubscription);
router.post("/wallpapers", Validator.body(CreateOrderSchema), auth.isLoggedIn, order.requestWallpaper);
router.get("/verify", order.verify);
router.get("/unverified/:token", auth.isLoggedIn, order.checkUnverified);
router.get("/",Validator.query(FindAllOrderSchema), auth.isLoggedIn, order.getAll);
router.get("/:id/subscriptions", Validator.params(FindOneOrderSchema), auth.isLoggedIn, order.getOneSubscription);
router.get("/:id/wallpapers", Validator.params(FindOneOrderSchema), auth.isLoggedIn, order.getOneWallpaper);

export default router;
