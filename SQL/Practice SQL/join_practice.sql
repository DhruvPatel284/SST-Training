
create database joins_practice;
use joins_practice;
CREATE TABLE users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL
);
CREATE TABLE orders (
    orderid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_users
        FOREIGN KEY (userid) REFERENCES users(userid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO users (username) VALUES
('Dhruv'),
('Amit'),
('Rahul'),
('Neha');
INSERT INTO orders (userid) VALUES
(1),(1),(1),(1),(1),(1),
(2),(2),(2),(2),
(3),(3),(3),(3),(3),
(4);

insert into users (username) values ('karan'),('meet');
SELECT u.userid, u.username, COUNT(o.orderid) AS total_orders
FROM orders AS o
RIGHT JOIN users AS u ON u.userid = o.userid
GROUP BY u.userid, u.username
HAVING total_orders >= 5;

SELECT * from users ;

