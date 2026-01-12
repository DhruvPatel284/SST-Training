/* --- INSERT --- */
DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY, 
  title VARCHAR(255) NOT NULL, 
  start_date DATE, 
  due_date DATE, 
  priority TINYINT NOT NULL DEFAULT 3, 
  description TEXT
);

INSERT INTO tasks(title, priority) 
VALUES('Learn MySQL INSERT Statement', 1);

SELECT * FROM tasks;

INSERT INTO tasks(title, start_date, due_date) 
VALUES 
  (
    'Use current date for the task', 
    CURRENT_DATE(), 
    CURRENT_DATE()
  );


/* --- INSERT INTO SELECT --- */
use classicmodels;
CREATE TABLE suppliers (
    supplierNumber INT AUTO_INCREMENT,
    supplierName VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    addressLine1 VARCHAR(50),
    addressLine2 VARCHAR(50),
    city VARCHAR(50),
    state VARCHAR(50),
    postalCode VARCHAR(50),
    country VARCHAR(50),
    customerNumber INT,
    PRIMARY KEY (supplierNumber)
);
INSERT INTO suppliers (
    supplierName, 
    phone, 
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    customerNumber
)
SELECT 
    customerName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state ,
    postalCode,
    country,
    customerNumber
FROM 
    customers
WHERE 
    country = 'USA' AND 
    state = 'CA';

SELECT * FROM suppliers;

CREATE TABLE stats (
    totalProduct INT,
    totalCustomer INT,
    totalOrder INT
);

INSERT INTO stats(totalProduct, totalCustomer, totalOrder)
VALUES(
	(SELECT COUNT(*) FROM products),
	(SELECT COUNT(*) FROM customers),
	(SELECT COUNT(*) FROM orders)
);

SELECT * FROM stats;

/* --- INSERT IGNORE --- */
CREATE TABLE subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(130) NOT NULL UNIQUE
);
INSERT INTO subscribers(email)
VALUES('john.doe@gmail.com');

INSERT INTO subscribers(email)
VALUES('john.doe@gmail.com'), 
      ('jane.smith@ibm.com');

INSERT IGNORE INTO subscribers(email)
VALUES('john.doe@gmail.com'), 
      ('jane.smith@ibm.com');

CREATE TABLE tokens (
    s VARCHAR(6)
);

INSERT INTO tokens VALUES('abcdefg');

INSERT IGNORE INTO tokens VALUES('abcdefg');

select * from tokens;   

/* --- INSERT DATETIME --- */
CREATE TABLE events(
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_time DATETIME NOT NULL
);
/* 'YYYY-MM-DD HH:MM:SS' */
INSERT INTO events(event_name, event_time)
VALUES('MySQL tutorial livestream', '2023-10-28 19:30:35');

/* --- INSERT DATE --- */

CREATE TABLE events(
   id INT AUTO_INCREMENT PRIMARY KEY,
   event_name VARCHAR(255) NOT NULL,
   event_date DATE NOT NULL
);
INSERT INTO events(event_name, event_date)
VALUES('MySQL Conference','2023-10-29');

SELECT * FROM events;

/* --- UPDATE --- */
use classicmodels ;
UPDATE employees 
SET 
    email = 'mary.patterson@classicmodelcars.com'
WHERE
    employeeNumber = 1056;

UPDATE employees 
SET 
    lastname = 'Hill',
    email = 'mary.hill@classicmodelcars.com'
WHERE
    employeeNumber = 1056;

UPDATE employees
SET email = REPLACE(email,'@classicmodelcars.com','@mysqltutorial.org')
WHERE
   jobTitle = 'Sales Rep' AND
   officeCode = 6;

UPDATE customers 
SET 
    salesRepEmployeeNumber = (SELECT 
            employeeNumber
        FROM
            employees
        WHERE
            jobtitle = 'Sales Rep'
        ORDER BY RAND()
        LIMIT 1)
WHERE
    salesRepEmployeeNumber IS NULL;

/* --- UPDATE JOINS --- */
CREATE DATABASE IF NOT EXISTS hr1;

USE hr1;

CREATE TABLE merits (
  performance INT PRIMARY KEY, 
  percentage DEC(11, 2) NOT NULL
);

CREATE TABLE employees (
  emp_id INT AUTO_INCREMENT PRIMARY KEY, 
  emp_name VARCHAR(255) NOT NULL, 
  performance INT DEFAULT NULL, 
  salary DEC(11, 2) DEFAULT NULL, 
  FOREIGN KEY (performance) REFERENCES merits (performance)
);

INSERT INTO merits(performance, percentage) 
VALUES 
  (1, 0), 
  (2, 0.01), 
  (3, 0.03), 
  (4, 0.05), 
  (5, 0.08);

INSERT INTO employees(emp_name, performance, salary) 
VALUES 
  ('Mary Doe', 1, 50000), 
  ('Cindy Smith', 3, 65000), 
  ('Sue Greenspan', 4, 75000), 
  ('Grace Dell', 5, 125000), 
  ('Nancy Johnson', 3, 85000), 
  ('John Doe', 2, 45000), 
  ('Lily Bush', 3, 55000);

UPDATE 
  employees 
  INNER JOIN merits ON employees.performance = merits.performance 
SET 
  salary = salary + salary * percentage;

TRUNCATE TABLE employees;

INSERT INTO employees(emp_name, performance, salary) 
VALUES 
  ('Mary Doe', 1, 50000), 
  ('Cindy Smith', 3, 65000), 
  ('Sue Greenspan', 4, 75000), 
  ('Grace Dell', 5, 125000), 
  ('Nancy Johnson', 3, 85000), 
  ('John Doe', 2, 45000), 
  ('Lily Bush', 3, 55000),
  ('Jack William', NULL, 43000), 
  ('Ricky Bond', NULL, 52000);

UPDATE 
  employees 
  LEFT JOIN merits ON employees.performance = merits.performance 
SET 
  salary = salary + salary * COALESCE(percentage, 0.015);


/* --- DELETE --- */
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20)
);

INSERT INTO contacts (first_name, last_name, email, phone)
VALUES
    ('John', 'Doe', 'john.doe@email.com', '123-456-7890'),
    ('Jane', 'Smith', 'jane.smith@email.com', '987-654-3210'),
    ('Alice', 'Doe', 'alice.doe@email.com', '555-123-4567'),
    ('Bob', 'Johnson', 'bob.johnson@email.com', '789-321-6540'),
    ('Eva', 'Doe', 'eva.doe@email.com', '111-222-3333'),
    ('Michael', 'Smith', 'michael.smith@email.com', '444-555-6666'),
    ('Sophia', 'Johnson', 'sophia.johnson@email.com', '777-888-9999'),
    ('Matthew', 'Doe', 'matthew.doe@email.com', '333-222-1111'),
    ('Olivia', 'Smith', 'olivia.smith@email.com', '999-888-7777'),
    ('Daniel', 'Johnson', 'daniel.johnson@email.com', '666-555-4444'),
    ('Emma', 'Doe', 'emma.doe@email.com', '222-333-4444'),
    ('William', 'Smith', 'william.smith@email.com', '888-999-0000'),
    ('Ava', 'Johnson', 'ava.johnson@email.com', '111-000-9999'),
    ('Liam', 'Doe', 'liam.doe@email.com', '444-777-3333'),
    ('Mia', 'Smith', 'mia.smith@email.com', '222-444-8888'),
    ('James', 'Johnson', 'james.johnson@email.com', '555-666-1111'),
    ('Grace', 'Doe', 'grace.doe@email.com', '777-222-8888'),
    ('Benjamin', 'Smith', 'benjamin.smith@email.com', '999-111-3333'),
    ('Chloe', 'Johnson', 'chloe.johnson@email.com', '111-444-7777'),
    ('Logan', 'Doe', 'logan.doe@email.com', '333-555-9999');

DELETE FROM contacts
WHERE id = 1;

DELETE FROM contacts
WHERE last_name = 'Smith';

DELETE FROM contacts
ORDER BY first_name
LIMIT 3;

DELETE FROM contacts;

/* --- ON DELETE CASCADE --- */
CREATE TABLE buildings (
    building_no INT PRIMARY KEY AUTO_INCREMENT,
    building_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE rooms (
    room_no INT PRIMARY KEY AUTO_INCREMENT,
    room_name VARCHAR(255) NOT NULL,
    building_no INT NOT NULL,
    FOREIGN KEY (building_no)
        REFERENCES buildings (building_no)
        ON DELETE CASCADE
);

INSERT INTO buildings(building_name,address)
VALUES('ACME Headquaters','3950 North 1st Street CA 95134'),
      ('ACME Sales','5000 North 1st Street CA 95134');

INSERT INTO rooms(room_name,building_no)
VALUES('Amazon',1),
      ('War Room',1),
      ('Office of CEO',1),
      ('Marketing',2),
      ('Showroom',2);

DELETE FROM buildings 
WHERE building_no = 2;

/* --- DELETE JOIN --- */
DROP TABLE IF EXISTS t1, t2;

CREATE TABLE t1 (
    id INT PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE t2 (
    id VARCHAR(20) PRIMARY KEY,
    ref INT NOT NULL
);

INSERT INTO t1 VALUES (1),(2),(3);

INSERT INTO t2(id,ref) VALUES('A',1),('B',2),('C',3);

DELETE t1,t2 FROM t1
        INNER JOIN
    t2 ON t2.ref = t1.id 
WHERE
    t1.id = 1;

DELETE T1 
FROM T1
        LEFT JOIN
    T2 ON T1.key = T2.key 
WHERE
    T2.key IS NULL;

use classicmodels;
DELETE customers 
FROM customers
        LEFT JOIN
    orders ON customers.customerNumber = orders.customerNumber 
WHERE
    orderNumber IS NULL;

SELECT 
    c.customerNumber, 
    c.customerName, 
    orderNumber
FROM
    customers c
        LEFT JOIN
    orders o ON c.customerNumber = o.customerNumber
WHERE
    orderNumber IS NULL;

/* --- REPLACE --- */
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    population INT NOT NULL
);
INSERT INTO cities(name,population)
VALUES('New York',8008278),
	  ('Los Angeles',3694825),
	  ('San Diego',1223405);

REPLACE INTO cities(id,population)
VALUES(2,3696820);
REPLACE INTO cities
SET id = 4,
    name = 'Phoenix',
    population = 1768980;

REPLACE INTO 
    cities(name,population)
SELECT 
    name,
    population 
FROM 
   cities 
WHERE id = 1;

SELECT * FROM cities;
