
use sql_task;
/* Tasks 1 */

--1) Get all users.
 select * from users;

--2) Find all products with price greater than 1000 // 100.
 select* from products where price > 100;

--3) Show only name and email from users table.
 select name , email from users ;

--4) Get all products with stock less than 10 // 200.
 select * from products where stock < 200 ;
 
--5) Find users from a specific city (e.g., "Delhi").
 SELECT * FROM users WHERE BINARY city = 'delhi';

--6) Sort products by price (ascending).
 select * from products order by price ;

--7) Sort users by created_at (latest first).
 select * from users order by created_at DESC;

--8) Count total number of users.
 select count(*) from users ;

--9) Find minimum and maximum product price.
 select min(price), max(price) from products;

--10) Get distinct product categories.
 select distinct(category) from products;