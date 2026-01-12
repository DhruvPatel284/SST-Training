use org;
select * from worker ;
select * from bonus;
select * from title;

/* --- SUBQUERIES --- */
SELECT first_name,salary from worker where salary = (SELECT max(salary) from worker);

select first_name , last_name from worker where department = (SELECT department from worker where first_name = 'Monika');

select * from worker where salary > (select avg(salary) from worker);

select w.worker_id,w.first_name from worker w inner join bonus b on w.worker_id = b.WORKER_REF_ID ;

select * from worker where worker_id in (select worker_ref_id from bonus); 

select max(salary) from worker where salary < (select max(salary) from worker);

select * from worker where worker_id in (select worker_ref_id from title where worker_title = 'Manager') ; 

select * from worker where worker_id not in (select worker_ref_id from bonus); 

select department,max(department_salary) from (select department , sum(salary) as department_salary from worker group by department) salary group by department;