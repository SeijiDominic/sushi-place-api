/* eslint-disable no-undef */
import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { Customer, Item, SushiError } from './logic/entities';
import { TableOrderManager, TalliedOrder } from './logic/TableOrderManager';
import { OrderUtils } from './logic/OrderUtils';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 8080;

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*'); //for this project only :P
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.post('/subscribe', (req: Request, res: Response) => {
  try {
    const {tableId, customer} = req.body;
    const {custId, name} = customer;
    const customerobj = new Customer(custId as number, name as string, new Array<Item>());
    
    TableOrderManager.subscribe(tableId as number, customerobj);
    res.status(200).send(customerobj);
  } catch(err: unknown) {
    const error = err as SushiError;
    res.status(error.status).send(error.message);
  }
});

app.post('/placeCustOrder', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const {tableId, custId, items} = req.body;
    const orderItems = items.map((i: {pid: string, qty: number}) => OrderUtils.createItem(i.pid, i.qty));
    TableOrderManager.placeCustomerOrder(tableId as number, custId as number, orderItems);
    res.status(200).send(body.item);
  } catch(err: unknown) {
    const error = err as SushiError;
    res.status(error.status).send(error.message);
  }
});

app.post('/checkout', (req: Request, res: Response) => {
  try {
    const {tableId} = req.body;
    const tallied: TalliedOrder = TableOrderManager.payBills(tableId);
    res.status(200).send(tallied!);
  } catch(err: unknown) {
    const error = err as SushiError;
    res.status(error.status).send(error.message);
  }
});

app.post('/checkout-customer', (req: Request, res: Response) => {
  try {
    const {tableId, custId} = req.body;
    const tallied: TalliedOrder = TableOrderManager.payCustomerBills(tableId, custId);
    res.status(200).send(tallied!);
  } catch(err: unknown) {
    const error = err as SushiError;
    res.status(error.status).send(error.message);
  }
});



app.listen(PORT, () => {
  TableOrderManager.populateVars();
  OrderUtils.populateVars();
});
