use classicmodels ;

/* --- GROUP BY --- */
SELECT status FROM orders GROUP BY status;
SELECT status, COUNT(*) FROM orders GROUP BY status;
SELECT 
  status, 
  SUM(quantityOrdered * priceEach) AS amount 
FROM 
  orders 
  INNER JOIN orderdetails USING (orderNumber) 
GROUP BY 
  status;

SELECT 
  orderNumber, 
  SUM(quantityOrdered * priceEach) AS total 
FROM 
  orderdetails 
GROUP BY 
  orderNumber;


SELECT 
  YEAR(orderDate) AS year, 
  SUM(quantityOrdered * priceEach) AS total 
FROM 
  orders 
  INNER JOIN orderdetails USING (orderNumber) 
WHERE 
  status = 'Shipped' 
GROUP BY 
  YEAR(orderDate);

SELECT 
  YEAR(orderDate) AS year, 
  SUM(quantityOrdered * priceEach) AS total 
FROM 
  orders 
  INNER JOIN orderdetails USING (orderNumber) 
WHERE 
  status = 'Shipped' 
GROUP BY 
  year 
HAVING 
  year > 2003;

SELECT 
  YEAR(orderDate) AS year, 
  status, 
  SUM(quantityOrdered * priceEach) AS total 
FROM 
  orders 
  INNER JOIN orderdetails USING (orderNumber) 
GROUP BY 
  year, 
  status 
ORDER BY 
  year;

/* The SQL standard does not allow you to use an alias in the GROUP BY clause whereas MySQL supports this. */
/* Notice that MySQL 8.0 or later removed the implicit sorting for the GROUP BY clause. 
Therefore, if you are using earlier versions, you will find that the result set with the GROUP BY clause is sorted. */

/* --- HAVING --- */
SELECT orderNumber , SUM(quantityOrdered) items, SUM(priceEach*quantityOrdered) total FROM orderDetails GROUP BY orderNumber HAVING total > 1000 AND items > 600;

SELECT 
    a.ordernumber, 
    status, 
    SUM(priceeach*quantityOrdered) total
FROM
    orderdetails a
INNER JOIN orders b 
    ON b.ordernumber = a.ordernumber
GROUP BY  
    ordernumber, 
    status
HAVING 
    status = 'Shipped' AND 
    total > 1500;

/* --- HAVING COUNT --- */
CREATE TABLE sales (
    id INT AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    sale_amount DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY(id)
);
INSERT INTO sales (product_name, sale_amount)
VALUES
    ('Product A', 100.50),
    ('Product B', 75.25),
    ('Product A', 120.75),
    ('Product C', 50.00),
    ('Product B', 90.80);

SELECT product_name, COUNT(id) FROM sales GROUP BY product_name;
SELECT 
  product_name, 
  COUNT(id) 
FROM 
  sales 
GROUP BY 
  product_name 
HAVING 
  COUNT(id) = 1;

SELECT 
  customerName, 
  COUNT(*) order_count 
FROM 
  orders 
  INNER JOIN customers using (customerNumber) 
GROUP BY 
  customerName 
HAVING 
  COUNT(*) > 4 
ORDER BY 
  order_count;

/* --- ROLL UP --- */
CREATE TABLE sales1
SELECT
    productLine,
    YEAR(orderDate) orderYear,
    SUM(quantityOrdered * priceEach) orderValue
FROM
    orderDetails
        INNER JOIN
    orders USING (orderNumber)
        INNER JOIN
    products USING (productCode)
GROUP BY
    productLine ,
    YEAR(orderDate);

SELECT * FROM sales1;

SELECT 
    productline, 
    SUM(orderValue) totalOrderValue
FROM
    sales1
GROUP BY 
    productline;

SELECT 
    SUM(orderValue) totalOrderValue
FROM
    sales1;

SELECT 
    productline, 
    SUM(orderValue) totalOrderValue
FROM
    sales1
GROUP BY 
    productline 
UNION ALL
SELECT 
    NULL, 
    SUM(orderValue) totalOrderValue
FROM
    sales1;


SELECT 
    productLine, 
    SUM(orderValue) totalOrderValue
FROM
    sales1
GROUP BY 
    productline WITH ROLLUP;

/* If you have more than one column specified in the GROUP BY clause, the ROLLUP clause assumes a hierarchy among the input columns.

For example:

GROUP BY c1, c2, c3 WITH ROLLUP

The ROLLUP assumes that there is the following hierarchy:

c1 > c2 > c3

It generates the following grouping sets:

(c1, c2, c3)
(c1, c2)
(c1)
()

*/

SELECT 
    productLine, 
    orderYear,
    SUM(orderValue) totalOrderValue
FROM
    sales1
GROUP BY 
    productline, 
    orderYear 
WITH ROLLUP;

/*
The GROUPING() function
To check whether NULL in the result set represents the subtotals or grand totals, you use the GROUPING() function.

The GROUPING() function returns 1 when NULL occurs in a supper-aggregate row, otherwise, it returns 0.

The GROUPING() function can be used in the select list, HAVING clause, and (as of MySQL 8.0.12 ) ORDER BY clause
*/

SELECT 
    orderYear,
    productLine, 
    SUM(orderValue) totalOrderValue,
    GROUPING(orderYear),
    GROUPING(productLine)
FROM
    sales1
GROUP BY 
    orderYear,
    productline
WITH ROLLUP;

SELECT 
    IF(GROUPING(orderYear),
        'All Years',
        orderYear) orderYear,
    IF(GROUPING(productLine),
        'All Product Lines',
        productLine) productLine,
    SUM(orderValue) totalOrderValue
FROM
    sales1
GROUP BY 
    orderYear , 
    productline 
WITH ROLLUP;
