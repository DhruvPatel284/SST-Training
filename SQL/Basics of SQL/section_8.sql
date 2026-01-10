/* SELECTING DATABASE */
USE classicmodels;
/* --- CREATING DATABASE --- */
CREATE DATABASE IF NOT EXISTS testdb;
/* In MySQL, the schema is the synonym for the database. Therefore, you can use them interchangeably */
CREATE SCHEMA IF NOT EXISTS testdb;

/* --- DROPPING DATABASE --- */
DROP DATABASE IF EXISTS testdb;