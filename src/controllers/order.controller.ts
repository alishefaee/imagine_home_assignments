import { response, setCodeResponse } from "../utils/functions";
import { Code, OrderStatus, PaymentStatus, ProductType } from '../utils/consts.utils'
import { logger } from '../utils/logger.util'
import {Request, Response,NextFunction} from "express";
import httpContext from "express-http-context";

class Order {

    requestWallpaper = async (req:Request, res:Response, next:NextFunction) => {
        let wallpaper = await wallpaperService.findOne(req.body.productId)
        if (!wallpaper) {
            setCodeResponse(Code.DATA_NOT_FOUND)
            return response(res, {}, {})
        }

        let order = await OrderService.create(req.user._id, wallpaper, ProductType.WALLPAPER)

        if (order.finalPrice < 500) {
            setCodeResponse(Code.INPUT_DATA_INVALID)
            response(res, {}, { message: 'قیمت محصول باید بیشتر از ۵۰۰ تومان باشد' })
        }

        const zarinpal = ZarinPalCheckout.create(
          process.env.MERCHANT_ID!
        )

        let jwtData = jwt.sign({ email: req.user.email, orderId: order._id }, process.env.SECRET!, {
            expiresIn: '14d'
        })
        /**
         * PaymentRequest [module]
         * @return {String} URL [Payement Authority]
         */
        zarinpal
            .PaymentRequest({
                Amount: wallpaper.price, // In Tomans
                CallbackURL: process.env.VERIFY_CALLBACK + '?token=' + jwtData,
                Description: wallpaper.title,
                Email: req.user.email
            })
            .then(async (resp:any) => {
                if (resp.status === 100) {
                    // res.status('302').redirect(response.url)
                    await OrderService.updatePaymentStatus(order._id, {
                        paymentStatus: PaymentStatus.PENDING,
                        authority: resp.authority
                    })
                    response(res, { url: resp.url })
                } else {
                    setCodeResponse(Code.ZARIN_REQ_INVALID)
                    await OrderService.updatePaymentStatus(order._id, {
                        refId:JSON.stringify(resp)
                    })
                    next(new Error(JSON.stringify(resp)))
                }
            })
    }

    checkUnverified = async (req:Request, res:Response, next:NextFunction) => {
        let jwtData:any = jwt.verify(req.params.token, process.env.SECRET!)
        if (!jwtData) {
            next(new Error('jwt not valid'))
        }
        let { orderId } = jwtData
        let order = await OrderService.findOneById(orderId,undefined,undefined)

        const zarinpal = ZarinPalCheckout.create(
          process.env.MERCHANT_ID!
        )

        let response = await zarinpal.UnverifiedTransactions()

        if (response.status !== 100) {
            setCodeResponse(Code.ZARIN_REQ_INVALID)
            next(new Error(JSON.stringify(response)))
        }
        let unverified = response.authorities.find(async (transaction:any) => {
            return transaction.authority === order.authority
        })
        if (!unverified) {
            setCodeResponse(Code.DATA_NOT_FOUND)
            return response(res)
        }

            let vResponse = await zarinpal.PaymentVerification({
                Amount: order.finalPrice, // In Tomans
                Authority: order.authority
            })

            // status = 100 success
            // status 101 it is verified before
            if (vResponse.status !== 100 && vResponse.status !== 101) {
                await OrderService.updatePaymentStatus(order._id, {
                    paymentStatus: PaymentStatus.FAILED,
                    refId: vResponse.status
                })
                setCodeResponse(Code.ZARIN_REQ_INVALID)
                logger.error({ req, err: new Error(JSON.stringify({ vResponse })) })
            } else {
                await OrderService.updatePaymentStatus(order._id, {
                    paymentStatus: PaymentStatus.SUCCESSFUL,
                    orderStatus: OrderStatus.ACTIVE,
                    refId: vResponse.RefID
                })
            }

        response(res)
    }

    getOneSubscription = async (req:Request, res:Response) => {
        await this.#getOne(req, res, ProductType.SUBSCRIPTION)
    }

    getOneWallpaper = async (req:Request, res:Response) => {
        await this.#getOne(req, res, ProductType.WALLPAPER)
    }

    #getOne = async (req:Request, res:Response, productType:any) => {
        let order = await OrderService.findOneById(req.params.id, req.user, productType)
        if (!order) {
            setCodeResponse(Code.DATA_NOT_FOUND)
            return response(res, {})
        }

        let cleanedData = {
            title: order.title,
            refId: order.refId,
            product: {
                ...order.product,
                id: order.product._id,
                _id: undefined,
                __v: undefined
            },
            productType: order.productType,
            user: {
                ...order.user,
                id: order.user._id,
                _id: undefined,
                __v: undefined
            },
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            initialPrice: order.initialPrice,
            finalPrice: order.finalPrice,
            updatedAt: order.updatedAt,
            createdAt: order.createdAt
        }

        return response(res, cleanedData)
    }

    getAll = async (req:Request, res:Response) => {
        let order = await OrderService.findAll(req.query, req.user)
        if (!order) {
            setCodeResponse(Code.DATA_NOT_FOUND)
            return response(res, {})
        }

        order.aggregate.forEach((elem:any,i:number,arr:any[])=>{
            arr[i].id = elem._id
            arr[i]._id = undefined
            arr[i].products=[]
            if(arr[i].subscriptions.length)
                arr[i].products.push({
                    ...arr[i].subscriptions[0],
                    id: arr[i].subscriptions[0]._id,
                    _id: undefined
                })
            if(arr[i].wallpapers.length)
                arr[i].products.push({
                    ...arr[i].wallpapers[0],
                    id: arr[i].wallpapers[0]._id,
                    _id: undefined
                })
            arr[i].subscriptions = undefined
            arr[i].wallpapers = undefined

        })

        return response(res, order)
    }

    verify = async (req:Request, res:Response, next:NextFunction) => {
        try {
            let { token, Authority: authority } = req.query
            if (!token) {
                httpContext.set("status", Code.INPUT_DATA_INVALID);
                return response(res, {});
            }
            let jwtData:any = jwt.verify(token.toString(), process.env.SECRET!)
            if (!jwtData) {
                next(new Error(JSON.stringify({ authority })))
            }
            let { email, orderId } = jwtData

            let order = await OrderService.findOneById(orderId,undefined,undefined)

            if (order.paymentStatus === PaymentStatus.SUCCESSFUL) {
                return res.render('success', { code: order.refId })
            } else if (order.paymentStatus === PaymentStatus.FAILED) {
                return res.render('errorZarinpal' , { message: 'تراکنش تکراری', code: 0 })
            } else if (order.paymentStatus === PaymentStatus.PENDING) {
                const zarinpal = ZarinPalCheckout.create(
                  process.env.MERCHANT_ID!
                )
                zarinpal.PaymentVerification({
                        Amount: order.finalPrice, // In Tomans
                        Authority: authority
                    })
                    .then(async (response:any) => {
                        // status = 100 success
                        // status 101 it is verified before
                        if (response.status !== 100 && response.status !== 101) {
                            await OrderService.updatePaymentStatus(order._id, {
                                paymentStatus: PaymentStatus.FAILED,
                                refId: response.status
                            })
                            logger.error({
                                req,
                                err: new Error(JSON.stringify({ response }))
                            })
                            return res.render('errorZarinpal', {
                                message: 'خرید ناموفق',
                                code: response.RefID
                            })
                        } else {
                            await OrderService.updatePaymentStatus(order._id, {
                                paymentStatus: PaymentStatus.SUCCESSFUL,
                                orderStatus: OrderStatus.ACTIVE,
                                refId: response.RefID
                            })
                            res.render('success', { code: response.RefID })
                            const mail = new Email({
                                from: process.env.EMAIL_FROM_ORDER,
                                pass: process.env.EMAIL_PASS_ORDER,
                                to: email,
                                subject: 'یومی - خرید',
                                text: `${response.RefID} شناسه ارجاع: `,
                                templateFile: 'email-order',
                                data: {refId: response.RefID}
                            })
                            await mail.send()
                        }
                    })
            } else {
                setCodeResponse(Code.ZARINPAL_VERIFY_UNKOWN_ORDER)
                logger.error({ req, err: new Error(JSON.stringify({ authority, jwtData })) })
                return res.end()
            }
        } catch (err) {
            setCodeResponse(Code.SERVER_ERROR)
            logger.error({ req, err })
            res.render('errorZarinpal', {
                message: 'خطایی رخ داد',
                code: 0
            })
        }
    }
}

export default new Order()
