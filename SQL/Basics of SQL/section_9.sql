
/* --- CREATE TABLE --- */
CREATE TABLE tasks (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    due_date DATE
);

CREATE TABLE checklists(
  id INT, 
  task_id INT, 
  title VARCHAR(255) NOT NULL, 
  is_completed BOOLEAN NOT NULL DEFAULT FALSE, 
  PRIMARY KEY (id, task_id), 
  FOREIGN KEY (task_id) 
      REFERENCES tasks (id) 
      ON UPDATE RESTRICT 
      ON DELETE CASCADE
);

/* --- AUTO INCREMENT --- */
CREATE TABLE subscribers(
   email VARCHAR(320) NOT NULL UNIQUE
);

ALTER TABLE subscribers
ADD id INT AUTO_INCREMENT PRIMARY KEY;

/* --- ALTER TABLE --- */
/* ADD */
/*
ALTER TABLE table_name
ADD 
    new_column_name column_definition
    [FIRST | AFTER column_name]
*/
CREATE TABLE vehicles (
    vehicleId INT,
    year INT NOT NULL,
    make VARCHAR(100) NOT NULL,
    PRIMARY KEY(vehicleId)
);
ALTER TABLE vehicles
ADD color VARCHAR(50),
ADD note VARCHAR(255);
DESCRIBE vehicles;

/* MODIFY */
ALTER TABLE vehicles 
MODIFY note VARCHAR(100) NOT NULL;

ALTER TABLE vehicles 
MODIFY year SMALLINT NOT NULL,
MODIFY color VARCHAR(20) NULL AFTER make;

/* CHANGE COLOUMN NAME */
ALTER TABLE vehicles 
CHANGE COLUMN note vehicleCondition VARCHAR(100) NOT NULL;

/* DROP COLOUMN */
ALTER TABLE vehicles
DROP COLUMN vehicleCondition;

/* --- RENAME TABLE --- */
ALTER TABLE vehicles 
RENAME TO cars; 

CREATE DATABASE IF NOT EXISTS hr;
use hr;
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id int AUTO_INCREMENT primary key,
    first_name VARCHAR(50) not null,
    last_name VARCHAR(50) not null,
    department_id INT not null,
    FOREIGN KEY (department_id)
        REFERENCES departments (department_id)
);

INSERT INTO departments(dept_name) 
VALUES 
  ('Sales'), 
  ('Markting'), 
  ('Finance'), 
  ('Accounting'), 
  ('Warehouses'), 
  ('Production');

INSERT INTO employees(
  first_name, last_name, department_id
) 
VALUES 
  ('John', 'Doe', 1), 
  ('Bush', 'Lily', 2), 
  ('David', 'Dave', 3), 
  ('Mary', 'Jane', 4), 
  ('Jonatha', 'Josh', 5), 
  ('Mateo', 'More', 1);


SELECT 
    department_id, dept_name
FROM
    departments;


/* --- DROP TABLE --- */
CREATE TABLE insurances (
    id INT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    effectiveDate DATE NOT NULL,
    duration INT NOT NULL,
    amount DEC(10 , 2 ) NOT NULL,
    PRIMARY KEY(id)
);
DROP TABLE insurances;

/* TEMOPRARY TABLE */
CREATE TEMPORARY TABLE credits(
  customerNumber INT PRIMARY KEY, 
  creditLimit DEC(10, 2)
);

INSERT INTO credits(customerNumber, creditLimit)
SELECT 
  customerNumber, 
  creditLimit 
FROM 
  customers 
WHERE 
  creditLimit > 0;

/* --- GENERATED COLOUMN --- */
DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    fullname varchar(101) GENERATED ALWAYS AS (CONCAT(first_name,' ',last_name)),
    email VARCHAR(100) NOT NULL
);

ALTER TABLE products
ADD COLUMN stockValue DEC(10,2)
GENERATED ALWAYS AS (buyprice*quantityinstock) STORED;

SELECT 
    productName, 
    ROUND(stockValue, 2) stock_value
FROM
    products;
