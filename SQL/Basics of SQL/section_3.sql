use classicmodels ;
 /* Filtering Data */
 
/* --- WHERE --- */
SELECT lastname, firstname, jobtitle FROM employees WHERE jobtitle = 'Sales Rep';
SELECT lastname, firstname, jobtitle, officeCode FROM employees WHERE jobtitle = 'Sales Rep' AND officeCode = 1;
SELECT lastName, firstName, jobTitle, officeCode FROM employees WHERE jobtitle = 'Sales Rep' OR officeCode = 1 ORDER BY officeCode , jobTitle;
SELECT firstName, lastName, officeCode FROM employees WHERE officeCode BETWEEN 1 AND 3 ORDER BY officeCode;
SELECT firstName, lastName FROM employees WHERE lastName LIKE 'son%' ORDER BY firstName;
SELECT firstName, lastName, officeCode FROM employees WHERE officeCode IN (1 , 2, 3) ORDER BY officeCode;
SELECT lastName, firstName, reportsTo FROM employees WHERE reportsTo IS NULL;
SELECT lastname, firstname, jobtitle FROM employees WHERE jobtitle <> 'Sales Rep';
SELECT lastname, firstname, officeCode FROM employees WHERE officecode > 5;

/* --- SELECT DISTINCT --- */
SELECT DISTINCT lastname FROM employees ORDER BY lastname;
/* When you specify a column that has NULL values in the DISTINCT clause, the DISTINCT clause will keep only one NULL value because it considers all NULL values are the same. */
SELECT DISTINCT state FROM customers;
SELECT DISTINCT state, city FROM customers WHERE state IS NOT NULL ORDER BY state, city;

/* --- AND --- */
SELECT 1 AND 1;
SELECT 1 AND 0, 0 AND 1, 0 AND 0, 0 AND NULL;
SELECT 1 AND NULL, NULL AND NULL;
SELECT customername, country, state FROM customers WHERE country = 'USA' AND state = 'CA';
SELECT customername, country, state, creditlimit FROM customers WHERE country = 'USA' AND state = 'CA' AND creditlimit > 100000;

/* --- OR --- */
SELECT 0 OR 0;
SELECT 1 OR 1, 1 OR 0, 0 OR 1;
SELECT 1 OR NULL, 0 OR NULL, NULL or NULL;
SELECT customername, country FROM customers WHERE country = 'USA' OR country = 'France';
SELECT customername, country, creditLimit FROM  customers WHERE(country = 'USA' OR country = 'France') AND creditlimit > 100000;
SELECT customername, country, creditLimit FROM customers WHERE country = 'USA' OR country = 'France'AND creditlimit > 100000;
/*When an expression contains both AND and OR operators, MySQL uses the operator precedence to determine the order of evaluation of the operators. MySQL evaluates the operator with higher precedence first.
Since the AND operator has higher precedence than the OR operator, MySQL evaluates the AND operator before the OR operator */

/* --- IN --- */
SELECT NULL IN (1,2,3);
SELECT 0 IN (1 , 2, 3, NULL);
SELECT NULL IN (1 , 2, 3, NULL);
SELECT officeCode, city, phone, country FROM offices WHERE country IN ('USA' , 'France');
SELECT officeCode, city, phone, country FROM offices WHERE country = 'USA' OR country ='France' ;


/* --- NOT IN --- */
SELECT 1 NOT IN (1,2,3);
SELECT 0 NOT IN (1,2,3);
SELECT NULL NOT IN (1,2,3);
SELECT officeCode, city, phone FROM offices WHERE country NOT IN ('USA' , 'France') ORDER BY city;

/* --- BETWEEN --- */
SELECT 15 BETWEEN 10 AND 20;
SELECT 15 BETWEEN 20 AND 30;
SELECT 15 NOT BETWEEN 10 AND 20;
SELECT productCode, productName, buyPrice FROM products WHERE buyPrice BETWEEN 90 AND 100;
SELECT productCode, productName, buyPrice FROM products WHERE buyPrice NOT BETWEEN 20 AND 100;
SELECT orderNumber, requiredDate, status FROM orders WHERE requireddate BETWEEN CAST('2003-01-01' AS DATE) AND CAST('2003-01-31' AS DATE);

/* --- LIKE --- */
SELECT employeeNumber, lastName, firstName FROM employees WHERE firstName LIKE 'a%' LIMIT 1;
/* Note that the pattern is not case-sensitive. Therefore, the b% and B% patterns return the same result. */
SELECT productCode, productName FROM products WHERE productCode LIKE '%\_20%';
SELECT productCode, productName FROM products WHERE productCode LIKE '%$_20%' ESCAPE '$';

/* --- LIMIT --- */
SELECT customerNumber, customerName, creditLimit FROM customers ORDER BY creditLimit DESC LIMIT 5;
SELECT customerNumber, customerName, creditLimit FROM customers ORDER BY creditLimit LIMIT 5;
SELECT COUNT(*) FROM customers;
SELECT customerName, creditLimit FROM customers ORDER BY creditLimit DESC LIMIT 0,1;
/* If you use the LIMIT clause with the DISTINCT clause, MySQL immediately stops searching when it finds the number of unique rows specified in the LIMIT clause. */




