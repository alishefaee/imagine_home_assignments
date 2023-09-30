import ProductService from '../services/product.service'
import dummy_books from '../../books.json'

export async function initDB() {
  let products = await ProductService.findALl()
  if (products.totalDocs == 0) {
    await ProductService.create(dummy_books)
  }
}