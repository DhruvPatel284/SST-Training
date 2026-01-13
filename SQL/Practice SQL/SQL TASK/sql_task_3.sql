/* Task 3 (Use Subqueries, Joins, Conditions) */
use sql_task;

--1) Find the user who spent the most money.
  select user_id , total_amount from orders order by total_amount desc limit 1;
  --or
  select name from users where id = (select user_id  from orders order by total_amount desc limit 1);
--todo
--2) Find the most sold product (by quantity).  
  SELECT p.name, p.id , SUM(oi.quantity) as total_quantity
  FROM order_items oi
  INNER JOIN products p ON p.id = oi.product_id
  GROUP BY p.id, p.name
  HAVING total_quantity = (
    SELECT MAX(total_qty)
    FROM (
      SELECT SUM(quantity) as total_qty
      FROM order_items
      GROUP BY product_id
    ) quantities
  );

--3) Find users who placed more than 3 orders.
  select u.id , u.name , count(o.id) as order_count 
  from users u
  inner join orders o on u.id = o.user_id
  group by u.id
  having order_count > 3;

--4) Get products that were never ordered.
  select p.id , p.name 
  from products p
  left join order_items o on p.id = o.product_id
  where o.product_id is NULL;

--5) Find the latest order for each user.
  SELECT u.name as username, o.id as order_id, o.user_id, o.order_date
  FROM orders o
  INNER JOIN users u ON o.user_id = u.id
  INNER JOIN (
    SELECT user_id, MAX(order_date) as latest_date
    FROM orders
    GROUP BY user_id
  ) latest ON o.user_id = latest.user_id 
  WHERE o.order_date = latest.latest_date;
  
  --todo
--6) Find users who ordered products worth more than 5000 in a single order // 800.
  select name from users where id in (select user_id from orders where total_amount > 800);
  --or
  select DISTINCT user_id from orders where total_amount > 800;
--7) Get category-wise total revenue.
  select p.category , sum(o.quantity*o.price) as total_revenue
  from products p 
  inner join order_items o on p.id = o.product_id
  group by category;

--8) Find users who ordered from more than 2 different categories.
    select u.id, u.name , count(DISTINCT(p.category)) as category_count 
    from users u
    inner join orders o on u.id = o.user_id
    inner join order_items oi on o.id = oi.order_id
    inner join products p on p.id = oi.product_id
    group by u.id
    having category_count > 2;
  

--9) Find the second highest priced product.
  select max(price)
  from products
  where price < (
    select max(price)
    from products
  );
--10) Find the day with the highest total sales.
    select date(order_date) as day_wise,sum(total_amount) as total_sales
    from orders
    group by day_wise
    order by total_sales desc
    limit 1;