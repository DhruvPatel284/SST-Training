use classicmodels;

/* --- select and select from --- */
select customerName from customers;
select * from customers;
select 1 + 1;
select concat("Dhruv"," ","Patel");
select customerName as cn from customers; /* as is optional */

/* --- ORDER BY --- */
SELECT contactLastname, contactFirstname FROM customers ORDER BY contactLastname;
SELECT contactLastname, contactFirstname FROM customers ORDER BY contactLastname DESC, contactFirstname ASC;
SELECT orderNumber, orderlinenumber, quantityOrdered * priceEach FROM orderdetails ORDER BY quantityOrdered * priceEach DESC;

SELECT FIELD('B', 'A','B','C');
SELECT orderNumber, status FROM orders 
ORDER BY 
  FIELD(
    status, 
    'In Process', 
    'On Hold', 
    'Cancelled', 
    'Resolved', 
    'Disputed', 
    'Shipped'
  );
  /* In MySQL, NULL comes before non-NULL values. Therefore, when you the ORDER BY clause with the ASC option, NULLs appear first in the result set. */




