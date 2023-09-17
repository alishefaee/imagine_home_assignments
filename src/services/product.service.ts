import { Schema } from "mongoose";
import { ProductModel, IProduct } from "../models/product.model"

class ProductService {
    private productModel = ProductModel

    async findALl({offset,limit}: { offset: number, limit: number } = {offset: 0, limit: 10}) {
        let totalDocs = await this.productModel.countDocuments()
        let products: IProduct[] = await this.productModel.find({})
          .sort({createdAt: -1})
          .skip(offset)
          .limit(limit)

        return {
            products,
            offset,
            limit,
            totalDocs
        }
    }


    findById = async ( _id:Schema.Types.ObjectId|string) => {
        return this.productModel.findById(_id)
    }
}

export default new ProductService()
