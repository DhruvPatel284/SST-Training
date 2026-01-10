/* --- BIT --- */
CREATE TABLE working_calendars(
    year INT,
    week INT,
    days BIT(7),
    PRIMARY KEY(year,week)
);
INSERT INTO working_calendars(year,week,days)
VALUES(2017,1,B'1111100');
INSERT INTO working_calendars(year,week,days)
VALUES(2017,2,B'111100');
SELECT year, week, days FROM working_calendars;
SELECT year, week, bin(days) FROM working_calendars;  
SELECT year, week , bin(days) FROM working_calendars;   
SELECT year, week, lpad(bin(days),7,'0') FROM working_calendars;

/* --- INT --- */
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_text VARCHAR(255)
);
INSERT INTO items(item_text) VALUES ('laptop'), ('mouse'),('headphone');
SELECT * FROM items;
INSERT INTO items(item_id,item_text)
VALUES(10,'Server');
INSERT INTO items(item_text)
VALUES('Router');

CREATE TABLE classes (
    class_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    total_member INT UNSIGNED,
    PRIMARY KEY (class_id)
);
INSERT INTO classes(name, total_member)
VALUES('Weekend',100);

INSERT INTO classes(name, total_member)
VALUES('Fly',-50);


/* --- BOOLEAN --- */
SELECT true, false, TRUE, FALSE, True, False;
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN
);
DESCRIBE tasks;
INSERT INTO tasks(title, completed) 
VALUES 
  ('Master MySQL Boolean type', true), 
  ('Design database table', false);
SELECT id, title, completed FROM tasks;
INSERT INTO tasks(title, completed) 
VALUES 
  ('Test Boolean with a number', 2);

SELECT id, title, completed FROMtasks WHERE completed = TRUE; 
/* not use '=' operator Instead use IS operator */

SELECT id, title, completed FROM tasks WHERE completed IS TRUE;

/* --- DECIMAL --- */
CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    cost DECIMAL(19,4) NOT NULL
);
INSERT INTO materials(description, cost) 
VALUES 
  ('Bicycle', 500.34), 
  ('Seat', 10.23), 
  ('Break', 5.21);

SELECT * FROM materials;


/* --- CHAR --- */
/* Note that MySQL will not remove the trailing spaces if you enable the PAD_CHAR_TO_FULL_LENGTH SQL mode. */
CREATE TABLE mysql_char_test (
    status CHAR(3)
);
INSERT INTO mysql_char_test(status)
VALUES('Yes'),('No');

SELECT status, LENGTH(status) FROM mysql_char_test;
INSERT INTO mysql_char_test(status)
VALUES(' Y ');
SELECT 
    status, 
    LENGTH(status)
FROM
    mysql_char_test;
/* If the CHAR column has a UNIQUE index and you insert a value that is different from an existing value in a number of trailing spaces, MySQL will reject the changes because of duplicate-key error. */

/* --- VARCHAR --- */
CREATE TABLE items1 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(3)
);

INSERT INTO items1(title)
VALUES('ABCD');
INSERT INTO items1(title)
VALUES('AB ');
INSERT INTO items1(title)
VALUES('ABC ');
SELECT id, title, length(title) FROM items1;
/*We will create a new table that has two columns s1 and s2 with the length of 32765(+2 for length prefix) and 32766 (+2). Note that 32765+2+32766+2=65535, which is the maximum row size */


/* --- TEXT --- */
/*MySQL provides four TEXT types:

TINYTEXT - 255 bytes
TEXT - 65,535 bytes (64kb)
MEDIUMTEXT - 16,777,215 bytes (16mb)
LONGTEXT - 4,294,967,295 bytes (4gb)
*/
