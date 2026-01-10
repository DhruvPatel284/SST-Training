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

/* --- DATETIME --- */
use classicmodels;
CREATE TABLE events(
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events(event_name)
VALUES('Connected to MySQL Server');

SELECT * FROM events;

SET time_zone = '+00:00';
CREATE TABLE timestamp_n_datetime (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ts TIMESTAMP,
    dt DATETIME
);

INSERT INTO timestamp_n_datetime(ts,dt)
VALUES(NOW(),NOW());
SELECT ts, dt FROM timestamp_n_datetime;
SET time_zone = '+03:00';

SELECT * FROM timestamp_n_datetime WHERE DATE(dt) = '2026-01-09';
SELECT 
    HOUR(@dt),
    MINUTE(@dt),
    SECOND(@dt),
    DAY(@dt),
    WEEK(@dt),
    MONTH(@dt),
    QUARTER(@dt),
    YEAR(@dt);

SELECT DATE_FORMAT(@dt, '%H:%i:%s - %W %M %Y');

SELECT @dt start, 
       DATE_SUB(@dt, INTERVAL 1 SECOND) '1 second before',
       DATE_SUB(@dt, INTERVAL 1 MINUTE) '1 minute before',
       DATE_SUB(@dt, INTERVAL 1 HOUR) '1 hour before',
       DATE_SUB(@dt, INTERVAL 1 DAY) '1 day before',
       DATE_SUB(@dt, INTERVAL 1 WEEK) '1 week before',
       DATE_SUB(@dt, INTERVAL 1 MONTH) '1 month before',
       DATE_SUB(@dt, INTERVAL 1 YEAR) '1 year before';

CREATE TABLE datediff_test (
    dt DATETIME
);
INSERT INTO datediff_test(dt)
VALUES('2010-04-30 07:27:39'),
	('2010-05-17 22:52:21'),
	('2010-05-18 01:19:10'),
	('2010-05-22 14:17:16'),
	('2010-05-26 03:26:56'),
	('2010-06-10 04:44:38'),
	('2010-06-13 13:55:53');

SELECT dt,DATEDIFF(NOW(), dt) FROM datediff_test;

/* --- TIMESTAMP --- */
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO categories(name) 
VALUES ('A');
SELECT * FROM categories;
ALTER TABLE categories
ADD COLUMN updated_at 
  TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
  ON UPDATE CURRENT_TIMESTAMP;

INSERT INTO categories(name)
VALUES('B');

SELECT * FROM categories;
UPDATE categories 
SET name = 'B+'
WHERE id = 2;

SELECT * FROM categories WHERE id = 2;


/* --- DATE --- */
/*MySQL stores the year of the date value using four digits. In case you use two-digit year values, MySQL still accepts them with the following rules:

Year values in the range 00-69 are converted to 2000-2069.
Year values in the range 70-99 are converted to 1970 – 1999. */

SELECT NOW();
SELECT DATE(NOW());
SELECT CURDATE();

SELECT DATE_FORMAT(CURDATE(), '%d/%m/%Y') today;
SELECT DATEDIFF('2015-11-04','2014-11-04') days;

SELECT 
    '2015-01-01' start,
    DATE_ADD('2015-01-01', INTERVAL 1 DAY) 'one day later',
    DATE_ADD('2015-01-01', INTERVAL 1 WEEK) 'one week later',
    DATE_ADD('2015-01-01', INTERVAL 1 MONTH) 'one month later',
    DATE_ADD('2015-01-01', INTERVAL 1 YEAR) 'one year later';

SELECT 
    '2015-01-01' start,
    DATE_SUB('2015-01-01', INTERVAL 1 DAY) 'one day before',
    DATE_SUB('2015-01-01', INTERVAL 1 WEEK) 'one week before',
    DATE_SUB('2015-01-01', INTERVAL 1 MONTH) 'one month before',
    DATE_SUB('2015-01-01', INTERVAL 1 YEAR) 'one year before';

SELECT DAY('2000-12-31') day, 
       MONTH('2000-12-31') month, 
       QUARTER('2000-12-31') quarter, 
       YEAR('2000-12-31') year;

SELECT 
    WEEKDAY('2000-12-31') weekday,
    WEEK('2000-12-31') week,
    WEEKOFYEAR('2000-12-31') weekofyear;

SELECT 
    WEEKDAY('2000-12-31') weekday,
    WEEK('2000-12-31',1) week,
    WEEKOFYEAR('2000-12-31') weekofyear;

/* --- TIME --- */
SELECT 
    CURRENT_TIME() AS string_now,
    CURRENT_TIME() + 0 AS numeric_now;
SELECT 
    CURRENT_TIME(),
    ADDTIME(CURRENT_TIME(), 023000),	
    SUBTIME(CURRENT_TIME(), 023000);


/* --- BINARY --- */
CREATE TABLE binary_demo(
    id INT AUTO_INCREMENT PRIMARY KEY,
    data BINARY(32) -- 32 bytes for SHA-256
);
INSERT INTO binary_demo(data) 
VALUES (UNHEX(SHA2('Hello', 256)));
SELECT HEX(data) 
FROM binary_demo WHERE id = 1;

/* --- VARBINARY --- */
CREATE TABLE varbinary_demo(
   id INT AUTO_INCREMENT PRIMARY KEY,
   data VARBINARY(256)
);
INSERT INTO varbinary_demo(data) 
VALUES('Hello');
SELECT * FROM varbinary_demo;

/* --- BLOB --- */
/* TINYBLOB: Maximum length of 255 bytes.
BLOB: Maximum length of 65,535 bytes.
MEDIUMBLOB: Maximum length of 16,777,215 bytes.
LONGBLOB: Maximum length of 4,294,967,295 bytes. */
CREATE TABLE images (
   id INT PRIMARY KEY AUTO_INCREMENT,
   title VARCHAR(255) NOT NULL,
   image_data LONGBLOB NOT NULL
);
SELECT @@secure_file_priv;
INSERT INTO images (title,image_data) 
VALUES ('MySQL tutorial', LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/download.png'));
SELECT * FROM images;

/* --- ENUM --- */
CREATE TABLE tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High') NOT NULL
);
INSERT INTO tickets(title, priority)
VALUES('Scan virus for computer A', 'High');
INSERT INTO tickets(title, priority)
VALUES('Upgrade Windows OS for all computers', 1);
INSERT INTO tickets(title)
VALUES('Refresh the computer of Ms. Lily');

SELECT * FROM tickets WHERE priority = 'High';

SELECT title, priority FROM tickets ORDER BY priority DESC;

/* --- JSON --- */

CREATE TABLE products1(
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   price DECIMAL(10,2) NOT NULL,
   properties JSON
);

INSERT INTO products1(name, price, properties)
VALUES('T-Shirt', 25.99, '{"sizes":["S","M","L","XL"], "colors": ["white","black"]}');
SELECT name, properties FROM products1;
SELECT JSON_PRETTY(properties) FROM products1;
SELECT JSON_KEYS(properties) FROM products1;
SELECT JSON_EXTRACT(properties, "$.colors[0]") FROM products1;

/* --- UUID Vs. INT for PRIMARY KEY --- */
CREATE TABLE customers1 (
    id BINARY(16) PRIMARY KEY,
    name VARCHAR(255)
);
/* other way is default :
CREATE TABLE customers1 (
    id BINARY(16) PRIMARY KEY DEFAULT(UUID_TO_BIN(UUID())),
    name VARCHAR(255)
);
*/
INSERT INTO customers1(id, name)
VALUES(UUID_TO_BIN(UUID()),'John Doe'),
      (UUID_TO_BIN(UUID()),'Will Smith'),
      (UUID_TO_BIN(UUID()),'Mary Jane');
SELECT BIN_TO_UUID(id) id, name FROM customers1;   