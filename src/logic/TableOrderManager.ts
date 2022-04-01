import { getAllTable } from "../database/tables";
import { Customer, Item, Order, SushiError, Table } from "./entities";

// eslint-disable-next-line no-unused-vars
enum TableStatus {
  // eslint-disable-next-line no-unused-vars
  VACANT, OCCUPIED
}

class TableStats {
  private _table;
  status: TableStatus;

  constructor(table: Table) {
    this._table = table;
    this.status = TableStatus.VACANT;
  }

  public get table() {
    return this._table;
  }
}

export class TalliedOrder {
  orderInfo: Order;
  total: number;

  private constructor(order: Order, total: number) {
    this.orderInfo = order;
    this.total = total;
  }

  public static tallyCustomerOrder(order: Order, custId: number): TalliedOrder {
    let total = 0;
    const newOrder: Order = Order.cloneOrder(order);
    newOrder.customers = newOrder.customers.filter(c => c.custId === custId);
    newOrder.customers.forEach(c => c.orderItems.forEach(i => {
      console.log(i.product.price as number)
      console.log(i.product.price, i.product)
      total += i.product.price * i.qty
    }));
    return new TalliedOrder(newOrder, total);
  }

  public static tallyOrder(order: Order): TalliedOrder {
    const allItems = Array.from(order.globOrderItems);
    const customers = order.customers;
    let total = 0;
    customers.forEach(c => {
      c.orderItems.forEach(i => {
        allItems.push(i);
      })
    });
    allItems.forEach(i => total += i.product.price * i.qty)
    return new TalliedOrder(order, total);
  }
}

export class TableOrderManager {

  private static _tables: Array<TableStats> = [];
  private static orders: Map<number, Order> = new Map();

  private constructor() {}
  
  static async populateVars() {
    const tables = await getAllTable();
    tables.forEach(t => TableOrderManager._tables.push(new TableStats(t)));
    console.log("POPULATED TABLE ORDER MANAGER....");
  }

  public static get tables(): Array<TableStats> {
    return TableOrderManager._tables;
  }

  private static set tables(tables: Array<TableStats>) {
    TableOrderManager._tables = tables;
  }

  /**
   * [Utility]
   * Get a table's information by tableId to see if table is occupied or vacant
   * @param tableId 
   * @returns A table's information.
   */
  private static getTableStat(tableId: number): TableStats {
    const tableStat = TableOrderManager._tables.filter(t => t.table.id == tableId)[0];
    if(!tableStat) throw new SushiError(404, "Table Not Found");
    return tableStat;
  }

  /**
   * [Utility]
   * Get a table's order information by tableId;
   * @param tableId 
   * @returns A table's order information.
   */
  private static getTableOrder(tableId: number): Order {
    const tableOrder = TableOrderManager.orders.get(tableId);
    if (!tableOrder) throw new SushiError(404, "Order Not Found.");
    return tableOrder;
  }

  /**
   * [Utility]
   * Get the specific customer in the table order.
   * @param tableId 
   * @param custId 
   * @returns 
   */
  private static getOrderCustomer(tableId: number, custId: number): Customer {
    const tableOrder = TableOrderManager.getTableOrder(tableId);
    const customer = tableOrder.customers.filter(c => c.custId == custId)[0];
    if (!customer) throw new SushiError(404, 'Customer Not Found');
    return customer;
  }

  /**
   * [Utility]
   * remove the customer of custId.
   * @param tableId 
   * @param custId 
   */
  private static removeOrderCustomer(tableId: number, custId: number) {
    const tableOrder = TableOrderManager.getTableOrder(tableId);
    const custCheck = TableOrderManager.getOrderCustomer(tableId, custId);
    tableOrder.customers = tableOrder.customers.filter(c => c.custId !== custCheck.custId);
    console.log("======================DEBUG==========================");
    console.log("CustomerID to eliminate: " + custId);
    console.log("Customers: ", tableOrder.customers);
    //TableOrderManager.orders.set(tableId, tableOrder);
    console.log(TableOrderManager.orders);
  }

  /**
   * [Utility Method]
   * Free up table. Frees up only if the current order is empty (when order fees are payed)
   * @param tableId 
   */
  private static freeTable(tableId: number) {
    const order = TableOrderManager.getTableOrder(tableId);
    if (!order.isEmpty()) throw new SushiError(500, "Table Bills Hasn't Been Payed Yet.");
    TableOrderManager.orders.delete(tableId);
    this.getTableStat(tableId).status = TableStatus.VACANT;
    console.log(this._tables, this.orders);
  }

  /**
   * Set table state to OCCUPIED. Throws SushiError if tried to occupy multiple times.
   * @param tableId 
   */
  public static occupyTable(tableId: number) {
    const tableStat = TableOrderManager.getTableStat(tableId);
    if (tableStat.status == TableStatus.OCCUPIED) throw new SushiError(500, "Table Occupied");

    //get index then occupy
    const index = TableOrderManager.tables.indexOf(tableStat);
    tableStat.status = TableStatus.OCCUPIED;
    TableOrderManager.tables[index] = tableStat;

    //make order
    TableOrderManager.orders.set(tableStat.table.id, new Order(tableStat.table));
  }

  /**
   * Adds a customer in the table's order. 
   * A Customer can...
   *  - See list of order items.
   *  - Pay own order items separately.
   * @param tableId 
   * @param customer 
   */
  public static subscribe(tableId: number, customer: Customer) {
    const tableStat = TableOrderManager.getTableStat(tableId);
    if (tableStat.status == TableStatus.VACANT || !this.orders.has(tableId)) TableOrderManager.occupyTable(tableId);

    // Order cant be undefined. I checked.
    const order = TableOrderManager.getTableOrder(tableId);
    if (order!.customers.some(c => c.custId == customer.custId)) 
      throw new SushiError(500, "Customer Already Subscribed");
    order!.customers.push(customer);
    console.log(order);
    TableOrderManager.orders.set(tableId, order!);
  }

  // TODO: Implement jwt to authenticate later.
  /**
   * Order items goes to the order's own order items list. 
   * Order(globalOrderItems, customers::customer::orderItems);
   * @param tableId 
   * @param item 
   */
  public static placeOrder(tableId: number, item: Item | Array<Item>) {
    const tableOrder: Order = TableOrderManager.getTableOrder(tableId)!;
    const orderItems: Array<Item> = tableOrder.globOrderItems;
    if (Array.isArray(item)) item.forEach(i => orderItems.push(i));
    else orderItems.push(item);
    TableOrderManager.orders.set(tableId, tableOrder);
  }

  /**
   * Place customer specific order item. 
   * @param tableId 
   * @param custId 
   * @param item 
   */
  public static placeCustomerOrder(tableId: number, custId: number, item: Item | Array<Item>) {
    const tableOrder: Order = TableOrderManager.getTableOrder(tableId)!;
    const orderItems: Array<Item> = TableOrderManager.getOrderCustomer(tableId, custId).orderItems;
    if (Array.isArray(item)) item.forEach(i => orderItems.push(i));
    else orderItems.push(item);
    TableOrderManager.orders.set(tableId, tableOrder);
  }

  /**
   * Calculate total order ammount.
   * @param tableId 
   * @returns TalliedOrder object containing Order information and total ammount
   */
  public static tallyOrder(tableId: number): TalliedOrder {
    return TalliedOrder.tallyOrder(Order.cloneOrder(TableOrderManager.getTableOrder(tableId)));
  }

  /**
   * Calculate only the customer's order items' total ammount
   * @param tableId 
   * @param custId 
   * @returns TalliedOrder containing Order containing only Customer information and total ammount.
   */
  public static tallyCustomerOrder(tableId: number, custId: number): TalliedOrder {
    return TalliedOrder.tallyCustomerOrder(TableOrderManager.getTableOrder(tableId), custId);
  }

  /**
   * Simulate paying the bills in the end.
   * @param tableId 
   */
  public static payBills(tableId: number) {
    // The order info in this var is a clone...
    const talliedOrder = this.tallyOrder(tableId);
    const order = this.getTableOrder(tableId);
    order.globOrderItems = [];
    order.customers = [];
    //TableOrderManager.orders.set(tableId, order);
    try {
      TableOrderManager.freeTable(tableId);
    } catch (err) {
      console.log("its ok fam");
    }
    return talliedOrder;
  }

  /**
   * Simulate paying the bills in the end.
   * @param tableId 
   */
  public static payCustomerBills(tableId: number, custId: number) {
    const tallied: TalliedOrder = TalliedOrder.tallyCustomerOrder(TableOrderManager.getTableOrder(tableId), custId);
    TableOrderManager.removeOrderCustomer(tableId, custId);
    try {
      TableOrderManager.freeTable(tableId);
    } catch (err) {
      console.log("its ok fam");
    }
    return tallied!;
  }  
}

  // maybe pull all products from db to memory to be used during runtime???? 
  // Got you my past self xoxo.

  /*
    occupyTable() //init order
    subscribe(tbl, usr) if tbl.status == vacant occupyTable();

    makeOrder(tabNum, item) //goes to globOrderItem
    makeCustomerOrder(tabNum, custId, item);

    tallyOrder(tableId) {
      tally globOrderItems + allCustomerItems
    }

    tallyCustomerOrder(tableId, custId) {
      //calculate 
      //remove user from orderlist
    }

    // called after transaction is finished.
    endTransaction() //tablestatus.vacant
  */