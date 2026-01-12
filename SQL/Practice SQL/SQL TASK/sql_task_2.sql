/* Task 2 (Use Joins, Group By, Aggregates) */
use sql_task;
--1) Get all orders with user name and email.
 select u.name , u.email , o.id 
 from users u
 inner join orders o on u.id = o.user_id;


--2) Find total number of orders per user.
 select u.id , u.name , count(o.id) 
 from users u
 inner join orders o on u.id = o.user_id
 group by u.id;

--3) Find total amount spent by each user.
 select u.id , u.name , sum(o.total_amount)
 from users u
 inner join orders o on u.id = o.user_id
 group by u.id;
 
--4) Get all products that were ordered at least once.
 select p.id , p.name 
 from products p
 inner join order_items o on p.id = o.product_id;

--5) Find total quantity sold for each product.
 select product_id , sum(quantity)
 from order_items 
 group by product_id;
 --or
 select p.id , p.name , sum(o.quantity)
 from products p
 inner join order_items o on p.id = o.product_id
 group by product_id;
 
--6) Get users who have never placed an order.
 select u.id , u.name 
 from users u
 left join orders o on u.id = o.user_id
 where o.id is NULL;

--7) Find top 5 most expensive products.
 select * from products order by price desc limit 5;

--8) Show category-wise product count.
 select category , count(*) from products group by category ;

--9) Find total sales per day.
  select date(order_date)as day_wise, sum(total_amount)
  from orders
  group by day_wise;
 
--10) Get order details (order_id, product_name, quantity, price).
 select o.order_id , p.name , o.quantity , o.price
 from products p
 inner join order_items o on p.id = o.product_id;
 