/* --- UNION --- */
/*
MySQL UNION operator allows you to combine two or more result sets of queries into a single result set. 
The following illustrates the syntax of the UNION operator.

To combine result set of two or more queries using the UNION operator, these are the basic rules that you must follow:

- First, the number and the orders of columns that appear in all SELECT statements must be the same.
- Second, the data types of columns must be the same or compatible.

By default, the UNION operator removes duplicate rows even if you don’t specify the DISTINCT operator explicitly.
*/

DROP TABLE IF EXISTS t1;
DROP TABLE IF EXISTS t2;

CREATE TABLE t1 (
    id INT PRIMARY KEY
);

CREATE TABLE t2 (
    id INT PRIMARY KEY
);

INSERT INTO t1 VALUES (1),(2),(3);
INSERT INTO t2 VALUES (2),(3),(4);

SELECT id
FROM t1
UNION
SELECT id
FROM t2;

/*
If you use the UNION ALL explicitly, the duplicate rows, if available, remain in the result. 
Because UNION ALL does not need to handle duplicates, it performs faster than UNION DISTINCT
*/
SELECT id
FROM t1
UNION ALL
SELECT id
FROM t2;

/* A JOIN combines result sets horizontally, a UNION appends result set vertically. */
SELECT firstName, lastName FROM employees 
UNION 
SELECT contactFirstName, contactLastName FROM customers;

SELECT CONCAT(firstName,' ',lastName) fullname FROM employees 
UNION 
SELECT CONCAT(contactFirstName,' ',contactLastName) FROM customers;

SELECT concat(firstName,' ',lastName) fullname FROM employees 
UNION 
SELECT concat(contactFirstName,' ',contactLastName) FROM customers 
ORDER BY fullname;

SELECT CONCAT(firstName, ' ', lastName) fullname, 'Employee' as contactType FROM employees 
UNION 
SELECT CONCAT(contactFirstName, ' ', contactLastName),'Customer' as contactType FROM customers
ORDER BY fullname;

/* --- EXCEPT --- */
/*
the EXCEPT will compare the result of query1 with the result set of query2 and return the rows of 
the result set of query1 that do not appear in the result set of query2.

By default, the EXCEPT operator uses the DISTINCT option if you omit it.
The EXCEPT DISTINCT removes duplicate rows in the result set.

If you want to retain the duplicate rows, you need to specify the ALL option explicitly.

To use the EXCEPT operator, the query1 and query2 need to follow these rules:
1.The order and the number of columns in the select list of the queries must be the same.
2.The data types of the corresponding columns must be compatible.

*/

SELECT id FROM t1
EXCEPT
SELECT id FROM t2;

SELECT firstName FROM employees
EXCEPT
SELECT contactFirstName FROM customers;

/* --- INTERSECT --- */
/*
The INTERSECT operator compares the result sets of two queries and returns the common rows.

To use the INTERSECT operator for the queries, follow these rules:
1.The order and the number of columns in the select list of the queries must be the same.
2.The data types of the corresponding columns must be compatible.

The INTERSECT operator uses the DISTINCT by default. This means that the DISTINCT removes duplicates from either side of the intersection. 
If you want to retain duplicates, you explicitly specify the ALL option.
*/

SELECT id FROM t1
INTERSECT
SELECT id FROM t2;

SELECT firstName FROM employees 
INTERSECT
SELECT contactFirstname FROM customers;


