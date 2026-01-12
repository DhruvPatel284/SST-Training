CREATE DATABASE sql_task;
use sql_task;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  city VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price INT NOT NULL,
  stock INT NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_amount INT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price INT NOT NULL,

  FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,

  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (name, email, city) VALUES
('Rajesh Kumar', 'rajesh.kumar@gmail.com', 'Mumbai'),
('Priya Sharma', 'priya.sharma@yahoo.com', 'Delhi'),
('Amit Patel', 'amit.patel@gmail.com', 'Ahmedabad'),
('Sneha Reddy', 'sneha.reddy@outlook.com', 'Hyderabad'),
('Vikram Singh', 'vikram.singh@gmail.com', 'Jaipur'),
('Ananya Iyer', 'ananya.iyer@gmail.com', 'Chennai'),
('Arjun Mehta', 'arjun.mehta@yahoo.com', 'Pune'),
('Pooja Gupta', 'pooja.gupta@gmail.com', 'Kolkata'),
('Rahul Verma', 'rahul.verma@outlook.com', 'Bangalore'),
('Divya Nair', 'divya.nair@gmail.com', 'Kochi');

INSERT INTO products (name, category, price, stock) VALUES
('Basmati Rice 5kg', 'Groceries', 450, 150),
('Tata Tea Gold 1kg', 'Beverages', 420, 200),
('Amul Butter 500g', 'Dairy', 250, 180),
('Patanjali Atta 10kg', 'Groceries', 380, 120),
('Parle-G Biscuits', 'Snacks', 40, 500),
('Haldiram Namkeen', 'Snacks', 150, 300),
('Fortune Sunflower Oil 1L', 'Groceries', 180, 100),
('Nestlé Maggi Pack of 12', 'Instant Food', 144, 250),
('Red Label Tea 500g', 'Beverages', 220, 180),
('Britannia Bread', 'Bakery', 45, 400);

INSERT INTO orders (user_id, order_date, total_amount) VALUES
(1, '2025-01-01 10:30:00', 890),
(1, '2025-01-03 14:20:00', 620),
(1, '2025-01-08 16:45:00', 450),
(2, '2025-01-02 11:15:00', 1250),
(3, '2025-01-02 15:30:00', 680),
(3, '2025-01-06 09:45:00', 540),
(4, '2025-01-03 10:00:00', 1420),
(4, '2025-01-07 13:30:00', 760),
(4, '2025-01-10 17:00:00', 920),
(5, '2025-01-04 12:20:00', 580),
(6, '2025-01-04 14:50:00', 1100),
(6, '2025-01-09 11:30:00', 670),
(7, '2025-01-05 09:15:00', 890),
(7, '2025-01-06 16:40:00', 1340),
(7, '2025-01-08 10:25:00', 520),
(7, '2025-01-11 15:10:00', 980),
(8, '2025-01-05 13:45:00', 740),
(9, '2025-01-07 12:00:00', 1560),
(9, '2025-01-10 14:30:00', 830),
(10, '2025-01-09 16:20:00', 1290);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 450),
(1, 3, 1, 250),
(1, 9, 1, 220),
(2, 5, 10, 400),
(2, 10, 4, 180),
(3, 1, 1, 450),
(4, 2, 2, 840),
(4, 4, 1, 380),
(5, 7, 2, 360),
(5, 8, 2, 288),
(6, 6, 2, 300),
(6, 10, 4, 180),
(7, 1, 2, 900),
(7, 3, 2, 500),
(8, 9, 2, 440),
(8, 8, 2, 288),
(9, 4, 1, 380),
(9, 6, 3, 450),
(10, 2, 1, 420),
(10, 5, 4, 160);

SELECT * FROM users;
SELECT * FROM products;
SELECT * FROM orders ;
SELECT * FROM order_items ;
