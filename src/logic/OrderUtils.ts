import { getAllProducts } from "../database/products";
import { Item, Product, SushiError } from "./entities";
import { randomUUID } from "crypto";

export class OrderUtils {
  static products: Array<Product>;

  private constructor() {}

  public static async populateVars() {
    const products: Array<Product> = await getAllProducts();
    OrderUtils.products = Array.from(products);
    console.log("POPULATED PRODUCTS LIST....");
  }

  public static getProductById(pid: string): Product {
    const product: Product = OrderUtils.products.filter(p => {
      return p.id === pid
    })[0];
    if (!product) throw new SushiError(404, "Product Not Found");
    return product;
  }

  public static createItem(pid: string, qty: number): Item {
    return new Item(randomUUID(), OrderUtils.getProductById(pid), qty);
  }
}