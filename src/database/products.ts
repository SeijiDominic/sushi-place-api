import { Product } from '../logic/entities';
import db from './index';

// const query = {
//   name: '',
//   text: '',
//   values: []
// }

function addProduct (id: string, name: string, price: number, imgPath: string) {
  const query = {
    name: 'add-product',
    text: 'INSERT INTO products (id, pname, price, img_path) ' + 
      'VALUES ($1, $2, $3, $4);',
    values: [id, name, price, imgPath]
  }

  db.query(query)
  .catch((err: Error) => {
    if(err) {
      console.log(err);
    }
  });
}

export const getAllProducts = async (): Promise<Product[]> => {
  const query = {
    name: 'get-all-product',
    text: 'SELECT id, pname, price, img_path FROM products;',
    values: []
  }
  
  return db.query(query)
  .then((res: { rows: any; }) => res.rows)
  .catch((err: Error) => {
    if (err) {
      console.log(err);
    }
  });
}

//

export {
  addProduct
}