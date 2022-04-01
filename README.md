# sushi-place-api
A simple sushi restaurant api that can keep track of restaruant table, its order information, and products on runtime.

Main Flow: 
  - Occupy Table
  - Customer subscribes and adds customer info and order items in table order.
  - Customer place order.
  - Checkout (can be payed per customer or all at once.)

** Please refer to &PROJECT_ROOT/test.rest to test my api.

Goals:
  - Familiarize myself with technologies such as TypeScript, eslint, PostgreSQL and ExpressJS.
  - Brush up my knowledge of OOP (Bad idea with TS).
  - Find new ways to implement error handling.

Result:
  - Got pretty confident with the basics of TypeScript and especially ExpressJS.
  - TS does not support some OOP features such as constructor overloading so I don't think I will be using ts and js for OOP.
  - I recently just learned about Rust's ownership rules and confused myself and forgot that JS uses object references. I'm good now.

Failed: 
  - Store Order information in DB.
  - Use JWT to send tableId and custId but it's already 1st of April and I still have a lot of things I want to do other than this (Rust).

Message to future self??
  Reorganize classes. Reject high coupling, embrace high cohesion. Stop overusing static methods.
