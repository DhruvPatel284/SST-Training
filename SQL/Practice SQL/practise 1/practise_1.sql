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

