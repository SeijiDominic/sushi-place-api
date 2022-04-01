import { randomUUID } from "crypto";

/**
 * My custom error object that holds status to 
 * be sent as a response status.
 * 
 * I forgot to move this to errors.ts file...
 */
export class SushiError extends Error {
  status: number;
  
  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}

/*
  All classes and interfaces from here are 
  object representation of database entities.
*/
export interface Category {
  catId: number;
  cat_name: string;
}

export interface Table {
  id: number;
  capacity: number;
}

export interface Product {
  id: string;
  prodName: string;
  price: number;
  imgPath: string;
  categories: Array<Category>;
}

export class Item {
  private _itemId: string;
  private _product: Product;
  private _qty: number;

  constructor(id: string, product: Product, qty: number) {
    this._itemId = id;
    this._product = product;
    this._qty = qty;
  }

  public get itemId(): string {
    return this._itemId;
  }

  public get product(): Product {
    return this._product;
  }

  public get qty(): number {
    return this._qty;
  }
  
}

export class Customer {
  private _custId: number;
  private _name: string;
  private _orderItems: Array<Item>;

  constructor(id: number, name: string, items: Array<Item>) {
    this._custId = id;
    this._name = name;
    this._orderItems = items;
  }

  public get custId(): number {
    return this._custId;
  }

  public set custId(value: number) {
    this._custId = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get orderItems(): Array<Item> {
    return this._orderItems;
  }

  public set orderItems(value: Array<Item>) {
    this._orderItems = value;
  }
  

  public getOrderItems(): Array<Item> {
    return this.orderItems;
  }

  public setOrderItems(orderItem: Array<Item>) {
    if (!orderItem) return;
    this.orderItems = orderItem;
  }

}

export class Order {
  private _id: string;
  private _table: Table;
  private _customers: Array<Customer>;
  private _globOrderItems: Array<Item>;

  constructor(table: Table) {
    this._id = randomUUID();
    this._table = table;
    this._customers = new Array();
    this._globOrderItems = [];
  }

  public static cloneOrder(order: Order): Order {
    const newOrder: Order = new Order(order.table);
    const {id, customers, globOrderItems} = order;
    newOrder.id = id;
    newOrder.customers = customers;
    newOrder.globOrderItems = globOrderItems;
    return newOrder;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }
  
  public get table(): Table {
    return this._table;
  }

  public set table(value: Table) {
    this._table = value;
  }
  
  public get customers(): Array<Customer> {
    return this._customers;
  }

  public set customers(value: Array<Customer>) {
    this._customers = value;
  }
  
  public get globOrderItems(): Array<Item> {
    return this._globOrderItems;
  }

  public set globOrderItems(value: Array<Item>) {
    this._globOrderItems = value;
  }

  public isEmpty(): boolean {
    return this._customers.length == 0 && this.globOrderItems.length == 0;
  }
  

  public subscribeUser(customer: Customer) {
    const customers = this.customers;
    customers.push(customer);
    this.customers = customers;
  }

  public getOrderItems(): Array<Item> {
    const items: Array<Item> = this.globOrderItems;
    this.customers.forEach(c => c.getOrderItems().forEach(i => items.push(i)));
    return items;
  }

  private getCustomer(custId: number): Customer {
    const cust: Customer = (this.customers.filter(c => c.custId == custId))[0];
    if (!cust) throw new SushiError(404, "Customer Not Found");
    return (this.customers.filter(c => c.custId == custId))[0];
  }

  public getOrderItemsByCust(custId: number): Array<Item> {
    const cust: Customer = this.getCustomer(custId);
    return cust.getOrderItems();
  }

  public placeOrder(item: Item) {
    const temp = this.globOrderItems;
    temp.push(item);
    this.globOrderItems = temp; 
  }

  public placeOrders(items: Array<Item>) {
    const temp = this.globOrderItems;
    items.forEach(i => temp.push(i));
    this.globOrderItems = temp; 
  }

  public placeCustOrder(custId: number, item: Item) {
    const customer = this.getCustomer(custId)
    const newOrderItems = customer.getOrderItems();
    newOrderItems.push(item);
    customer.setOrderItems(newOrderItems);
  }

  public placeCustOrders(custId: number, items: Array<Item>) {
    const customer = this.getCustomer(custId)
    const newOrderItems = customer.getOrderItems();
    items.forEach(i => newOrderItems.push(i));
    customer.setOrderItems(newOrderItems);
  }
}