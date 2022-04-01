DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;


--Just so I can track the tables properly.
--I can add more features later on but for the mean time...
CREATE TABLE tables (
  id INTEGER PRIMARY KEY,
  capacity INTEGER NOT NULL DEFAULT(0)
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  cat_name VARCHAR(30) NOT NULL DEFAULT('')
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  pname VARCHAR(50) NOT NULL DEFAULT('Product Name'),
  price DOUBLE PRECISION NOT NULL DEFAULT(0.00),
  img_path VARCHAR NOT NULL DEFAULT('')
);

CREATE TABLE product_categories (
  pid UUID REFERENCES products(id) ON DELETE CASCADE,
  cat_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE items (
  id UUID PRIMARY KEY,
  pid UUID REFERENCES products(id) ON DELETE CASCADE,
  qty INTEGER NOT NULL DEFAULT(0)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  table_id BIGINT NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL DEFAULT(CURRENT_DATE),
  start_time TIME NOT NULL DEFAULT(LOCALTIME),
  end_time TIME
);

CREATE TABLE order_items (
  oid UUID REFERENCES orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE
);


INSERT INTO tables (id, capacity) VALUES (1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4), (8, 4); 
INSERT INTO categories (id, cat_name) VALUES (1, 'Nigiri'), (2, 'Maki'), (3, 'Gunkan'), (4, 'Beverages'), (5, 'Desert');
INSERT INTO products (id, pname, price) VALUES 
('dabfe07b-d54c-470b-8db2-35a8b2c56b73', 'Gunkan1', 1.00), 
('4fb41e53-dc78-4b77-9f5d-eb603f623017', 'Gunkan2', 1.00), 
('fec25f35-9e13-4146-a6d7-00983e5555a3', 'Gunkan3', 1.00),  
('ba3985f2-abb8-4ccd-818a-16da69918074', 'Nigiri1', 1.00),  
('10086acb-a71d-4828-bb62-c50ea1525741', 'Nigiri2', 1.00),  
('1c0e90db-0fb3-4639-8598-20f94aa768ef', 'Nigiri3', 1.00),  
('5f350a2b-6335-4ca0-860e-c3201c54c1dd', 'Maki1', 1.00),  
('0a311ef4-2bf8-4bd4-b497-56cd2fe5d900', 'Maki2', 1.00),  
('04a4dc30-b0a9-41be-be43-038202681f3a', 'Maki3', 1.00),  
('2f0e0ca5-9cc3-495d-b7f8-80a411e675b7', 'Beverage1', 1.00),  
('a1a1f853-ff29-4356-b9a8-47742c054460', 'Beverage2', 1.00),  
('e597cc20-6c6f-4028-9bf8-a26ab64e47ca', 'Beverage3', 1.00);

INSERT INTO product_categories (pid, cat_id) VALUES 
('dabfe07b-d54c-470b-8db2-35a8b2c56b73', 3), 
('4fb41e53-dc78-4b77-9f5d-eb603f623017', 3), 
('fec25f35-9e13-4146-a6d7-00983e5555a3', 3),  
('ba3985f2-abb8-4ccd-818a-16da69918074', 1),  
('10086acb-a71d-4828-bb62-c50ea1525741', 1),  
('1c0e90db-0fb3-4639-8598-20f94aa768ef', 1),  
('5f350a2b-6335-4ca0-860e-c3201c54c1dd', 2),  
('0a311ef4-2bf8-4bd4-b497-56cd2fe5d900', 2),  
('04a4dc30-b0a9-41be-be43-038202681f3a', 2),  
('2f0e0ca5-9cc3-495d-b7f8-80a411e675b7', 4),  
('a1a1f853-ff29-4356-b9a8-47742c054460', 4),  
('e597cc20-6c6f-4028-9bf8-a26ab64e47ca', 4);