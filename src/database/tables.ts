import { Table } from '../logic/entities';
import db from './index';

export const addTable = (id: number) => {
  const query = {
    name: "add-table",
    text: "INSERT INTO tables (id) VALUES ($1);",
    values: [id]
  };

  db.query(query).catch((err: Error) => {
    if (err) {
      console.log(err);
    }
  });
};

export const getAllTable = async (): Promise<Table[]> => {
  const query = {
    name: "get-all-table",
    text: "SELECT * FROM tables;",
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