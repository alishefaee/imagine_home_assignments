import { FilterQuery, Schema } from "mongoose"
import { ProductModel, IProduct } from "../models/product.model"

class ProductService {
    private productModel = ProductModel

    async findALl({offset,limit,search}: { offset: number, limit: number, search?:string } = {offset: 0, limit: 10}) {
        let totalDocs = await this.productModel.countDocuments()
        let query: FilterQuery<IProduct> = {}
        if (search) {
            const $regex = new RegExp(".*" + search + ".*");
            query = {
                ...query,
                title: {$regex}
            }
        }
        let products: IProduct[] = await this.productModel.find(query)
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
