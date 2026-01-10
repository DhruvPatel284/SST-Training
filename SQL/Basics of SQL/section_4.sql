use classicmodels ;

/* --- Aliasing --- */
SELECT CONCAT_WS(', ', lastName, firstname) `Full name`FROM employees ORDER BY`Full name`;
SELECT orderNumber `Order no.`, SUM(priceEach * quantityOrdered) Total FROM orderdetails GROUP BY `Order no.` HAVING total > 60000;
SELECT customerName,COUNT(o.orderNumber) total FROM customers c INNER JOIN orders o ON c.customerNumber = o.customerNumber GROUP BY customerName ORDER BY total DESC;
SELECT customers.customerName, COUNT(orders.orderNumber) total FROM customers INNER JOIN orders ON customers.customerNumber = orders.customerNumber GROUP BY customerName ORDER BY total DESC ;

/* --- Joins --- */

SELECT m.member_id, m.name AS member, c.committee_id, c.name AS committee FROM members m INNER JOIN committees c ON c.name = m.name;
SELECT m.member_id, m.name AS member, c.committee_id, c.name AS committee FROM members m LEFT JOIN committees c USING(name);

SELECT m.member_id, m.name AS member, c.committee_id, c.name AS committee FROM members m RIGHT JOIN committees c on c.name = m.name;
SELECT m.member_id, m.name AS member, c.committee_id, c.name AS committee FROM members m CROSS JOIN committees c;

/* --- INNER JOIN --- */
SELECT productCode, productName, textDescription FROM products t1 INNER JOIN productlines t2 ON t1.productline = t2.productline;
SELECT t1.orderNumber,t1.status,SUM(quantityOrdered * priceEach) as total FROM orders t1 INNER JOIN orderdetails t2 ON t1.orderNumber = t2.orderNumber GROUP BY t1.orderNumber;
SELECT 
    orderNumber,
    orderDate,
    orderLineNumber,
    productName,
    quantityOrdered,
    priceEach
FROM
    orders
INNER JOIN
    orderdetails USING (orderNumber)
INNER JOIN
    products USING (productCode)
ORDER BY 
    orderNumber, 
    orderLineNumber;

SELECT 
    orderNumber,
    orderDate,
    customerName,
    orderLineNumber,
    productName,
    quantityOrdered,
    priceEach
FROM
    orders
INNER JOIN orderdetails 
    USING (orderNumber)
INNER JOIN products 
    USING (productCode)
INNER JOIN customers 
    USING (customerNumber)
ORDER BY 
    orderNumber, 
    orderLineNumber;

SELECT 
    orderNumber, 
    productName, 
    msrp, 
    priceEach
FROM
    products p
INNER JOIN orderdetails o 
   ON p.productcode = o.productcode
      AND p.msrp > o.priceEach
WHERE
    p.productcode = 'S10_1678';

/* --- LEFT JOIN --- */
SELECT c.customerNumber, customerName, orderNumber, status
FROM customers c LEFT JOIN orders o ON  c.customerNumber = o.customerNumber;

SELECT 
    lastName, 
    firstName, 
    customerName, 
    checkNumber, 
    amount
FROM
    employees
LEFT JOIN customers ON 
    employeeNumber = salesRepEmployeeNumber
LEFT JOIN payments ON 
    payments.customerNumber = customers.customerNumber
ORDER BY 
    customerName, 
    checkNumber;

SELECT 
    o.orderNumber, 
    customerNumber, 
    productCode
FROM
    orders o
LEFT JOIN orderDetails d 
    ON o.orderNumber = d.orderNumber 
WHERE 
    o.orderNumber = 10123;
    


/* --- RIGHT JOIN --- */
SELECT 
    employeeNumber, 
    customerNumber
FROM
    customers
RIGHT JOIN employees 
    ON salesRepEmployeeNumber = employeeNumber
ORDER BY 
	employeeNumber;
SELECT 
    employeeNumber, 
    customerNumber
FROM
    customers
RIGHT JOIN employees ON 
	salesRepEmployeeNumber = employeeNumber
WHERE customerNumber is NULL
ORDER BY employeeNumber;

/* --- SELF JOIN --- */
SELECT 
    CONCAT(m.lastName, ', ', m.firstName) AS Manager,
    CONCAT(e.lastName, ', ', e.firstName) AS 'Direct report'
FROM
    employees e
INNER JOIN employees m ON 
    m.employeeNumber = e.reportsTo
ORDER BY 
    Manager;

SELECT 
    IFNULL(CONCAT(m.lastname, ', ', m.firstname),
            'Top Manager') AS 'Manager',
    CONCAT(e.lastname, ', ', e.firstname) AS 'Direct report'
FROM
    employees e
LEFT JOIN employees m ON 
    m.employeeNumber = e.reportsto
ORDER BY 
    manager DESC;

SELECT 
    c1.city, 
    c1.customerName, 
    c2.customerName
FROM
    customers c1
INNER JOIN customers c2 ON 
    c1.city = c2.city
    AND c1.customername > c2.customerName
ORDER BY 
    c1.city;





