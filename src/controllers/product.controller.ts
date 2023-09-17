import { response, setCodeResponse } from "../utils/functions";
import { Code } from '../utils/consts.utils'
import httpContext from 'express-http-context'
import ProductService from '../services/product.service'
import {Request,Response} from "express";

class Product {

    findOne = async (req:Request, res:Response) => {
        let product = await ProductService.findById(req.params.id)
        if (!product) {
            httpContext.set('status',Code.DATA_NOT_FOUND)
            return response(res)
        }

        return response(res, product)
    }

    findAll = async (req:any, res:Response) => {
        let products = await ProductService.findALl(req.query)
        return response(res, products)
    }

}

export default new Product()
