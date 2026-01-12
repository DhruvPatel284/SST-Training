use org;
select * from worker ;
select * from bonus;
select * from title;

/* --- SUBQUERIES --- */
--Find the FIRST_NAME and SALARY of workers who have the maximum salary.--
SELECT first_name,salary from worker where salary = (SELECT max(salary) from worker);

--Find workers (FIRST_NAME, LAST_NAME) who work in the same DEPARTMENT as "Monika".--
select first_name , last_name from worker where department = (SELECT department from worker where first_name = 'Monika');

--Display all workers whose SALARY is greater than the average salary of all workers.--
select * from worker where salary > (select avg(salary) from worker);

--Show workers who received at least one bonus.--
select * from worker where worker_id in (select worker_ref_id from bonus); 

--Display the SECOND highest salary from Worker table.--
select max(salary) from worker where salary < (select max(salary) from worker);

--Find workers whose title is "Manager".--
select * from worker where worker_id in (select worker_ref_id from title where worker_title = 'Manager') ; 

--Find workers who never received any bonus.--
select * from worker where worker_id not in (select worker_ref_id from bonus); 

--Find the department(s) having the highest total salary.--
select department , sum(salary) from worker group by department 
having sum(salary) = (
    select max(total_sal) from 
    (select sum(salary)as total_sal from worker group by department)
    as dept_salary
    );

--Find workers who have a salary greater than the average salary of their own department.--
select worker_id , first_name , salary , department 
from worker w
where salary > (
select avg(salary) from worker where department = w.department
);

/* --- GROUP BY --- */
--Find total number of workers in each department.--
select department , count(worker_id) from worker group by department; 

--Find average salary of workers in each department.--
select department , avg(salary) from worker group by department;

--Find maximum salary in each department.--
select department , max(salary) from worker group by department;

--Find departments having more than 2 workers.--
select department , count(worker_id) cnt from worker group by department having cnt > 2 ; 

--Find total bonus amount received by each worker.--
select worker_ref_id , sum(BONUS_AMOUNT) from bonus group by worker_ref_id;

--Find count of workers for each title from Title table.--
select WORKER_TITLE , count(worker_ref_id) from title group by WORKER_TITLE;

--Find the department-wise total salary, but show only departments whose total salary is greater than 400000.--
select department , sum(salary) as sum_sal from worker group by department having sum_sal >  400000;

/* ---JOINS --- */

--Display worker’s FIRST_NAME, LAST_NAME along with their WORKER_TITLE.--
select w.first_name , w.last_name  , t.worker_title 
from worker w
inner join title t
on w.worker_id = t.worker_ref_id;

--Display worker’s FIRST_NAME, DEPARTMENT along with their BONUS_AMOUNT.--
select w.first_name , w.department  , b.bonus_amount 
from worker w
inner join bonus b
on w.worker_id = b.worker_ref_id;

--Find total bonus received by each worker and show--
select w.worker_id , w.first_name , sum(b.bonus_amount) 
from worker w
inner join bonus b
on w.worker_id = b.worker_ref_id
group by worker_id;

--Show worker details who never received any bonus--
select w.first_name , w.department  , b.bonus_amount 
from worker w
left join bonus b
on w.worker_id = b.worker_ref_id
where worker_ref_id is NULL;

--Show department-wise total salary and total bonus--
select department , sum(salary) as total_sal , sum(bonus_amount) as total_bonus
from worker w
left join bonus
on worker_id = worker_ref_id
group by department;

--Find workers whose salary is greater than the average salary of their department--
select w.worker_id , w.first_name , w.salary , w.department
from worker w
inner join (
    select department , avg(salary) as avg_s
    from worker
    GROUP BY department
)department_avg
on w.department = department_avg.department
where w.salary > department_avg.avg_s;


