import { Schema } from "mongoose";

class ProductService {

    findAll = async ( reqBody:any) => {
        let query = {}
        let pagination:any = {}
        let sort:any = {}
        if (reqBody.page) pagination.page = reqBody.page
        if (reqBody.limit) pagination.limit = reqBody.limit
        if (reqBody.order) sort[reqBody.order] = reqBody.sort || -1
        else sort = { createdAt: -1 }

        return
    }

    findOne = async ( _id:Schema.Types.ObjectId) => {
        return
    }
}

export default new ProductService()
