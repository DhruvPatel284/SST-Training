/* --- SubQueries --- */
/* When executing the query, MySQL evaluates the subquery first and uses the result of the subquery for the outer query. */
use classicmodels;
SELECT 
    customerNumber, 
    checkNumber, 
    amount
FROM
    payments
WHERE
    amount = (SELECT MAX(amount) FROM payments);

SELECT 
    customerNumber, 
    checkNumber, 
    amount
FROM
    payments
WHERE
    amount > (SELECT 
            AVG(amount)
        FROM
            payments);

SELECT 
    customerName
FROM
    customers
WHERE
    customerNumber NOT IN (SELECT DISTINCT
            customerNumber
        FROM
            orders);

/*
When you use a subquery in the FROM clause, the result set returned from a subquery is used as a temporary table. 
This table is referred to as a derived table or materialized subquery.
*/

SELECT 
    MAX(items), 
    MIN(items), 
    FLOOR(AVG(items))
FROM
    (SELECT 
        orderNumber, COUNT(orderNumber) AS items
    FROM
        orderdetails
    GROUP BY orderNumber) AS lineitems;


/*
Unlike a standalone subquery, a correlated subquery is a subquery that uses the data from the outer query. 
In other words, a correlated subquery depends on the outer query. 
A correlated subquery is evaluated once for each row in the outer query.
*/
SELECT 
    productname, 
    buyprice
FROM
    products p1
WHERE
    buyprice > (SELECT 
            AVG(buyprice)
        FROM
            products
        WHERE
            productline = p1.productline);


SELECT 
    customerNumber, 
    customerName
FROM
    customers
WHERE
    EXISTS( SELECT 
            orderNumber, SUM(priceEach * quantityOrdered)
        FROM
            orderdetails
                INNER JOIN
            orders USING (orderNumber)
        WHERE
            customerNumber = customers.customerNumber
        GROUP BY orderNumber
        HAVING SUM(priceEach * quantityOrdered) > 60000);

/* --- Derived Data Types --- */

/* Unlike a subquery, a derived table must have an alias so that you can reference its name later in the query. If a derived table does not have an alias, MySQL will issue the following error:

Every derived table must have its own alias. */

SELECT 
    productCode, 
    ROUND(SUM(quantityOrdered * priceEach)) sales
FROM
    orderdetails
        INNER JOIN
    orders USING (orderNumber)
WHERE
    YEAR(shippedDate) = 2003
GROUP BY productCode
ORDER BY sales DESC
LIMIT 5;

SELECT 
    productName, sales
FROM
    (SELECT 
        productCode, 
        ROUND(SUM(quantityOrdered * priceEach)) sales
    FROM
        orderdetails
    INNER JOIN orders USING (orderNumber)
    WHERE
        YEAR(shippedDate) = 2003
    GROUP BY productCode
    ORDER BY sales DESC
    LIMIT 5) top5products2003
INNER JOIN
    products USING (productCode);

/*
A more complex MySQL Derived Table example :

Suppose you have to classify the customers who bought products in 2003 into 3 groups: platinum, gold, and silver. 
And you need to know the number of customers in each group with the following conditions:

- Platinum customers who have orders with a volume greater than 100K.
- Gold customers who have orders with a volume between 10K and 100K.
- Silver customers who have orders with a volume of less than 10K.

To form this query, you first need to put each customer into the respective group using CASE expression and GROUP BY clause as follows:
*/

SELECT 
    customerNumber,
    ROUND(SUM(quantityOrdered * priceEach)) sales,
    (CASE
        WHEN SUM(quantityOrdered * priceEach) < 10000 THEN 'Silver'
        WHEN SUM(quantityOrdered * priceEach) BETWEEN 10000 AND 100000 THEN 'Gold'
        WHEN SUM(quantityOrdered * priceEach) > 100000 THEN 'Platinum'
    END) customerGroup
FROM
    orderdetails
        INNER JOIN
    orders USING (orderNumber)
WHERE
    YEAR(shippedDate) = 2003
GROUP BY customerNumber;

SELECT 
    customerGroup, 
    COUNT(cg.customerGroup) AS groupCount
FROM
    (SELECT 
        customerNumber,
            ROUND(SUM(quantityOrdered * priceEach)) sales,
            (CASE
                WHEN SUM(quantityOrdered * priceEach) < 10000 THEN 'Silver'
                WHEN SUM(quantityOrdered * priceEach) BETWEEN 10000 AND 100000 THEN 'Gold'
                WHEN SUM(quantityOrdered * priceEach) > 100000 THEN 'Platinum'
            END) customerGroup
    FROM
        orderdetails
    INNER JOIN orders USING (orderNumber)
    WHERE
        YEAR(shippedDate) = 2003
    GROUP BY customerNumber) cg
GROUP BY cg.customerGroup;    

