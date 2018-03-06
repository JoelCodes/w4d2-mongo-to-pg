# Memory to Mongo Demo

This project takes the Tiny App of a student ([alexandrasia](https://github.com/alexandrasia)) and switches from the in memory db to mongo and PostGreSQL.

```sql
CREATE DATABASE tiny_app;

CREATE TABLE users (id SERIAL PRIMARY KEY,email TEXT NOT NULL,password TEXT NOT NULL);

CREATE TABLE urls (id SERIAL PRIMARY KEY,user_id INT REFERENCES users(id) NOT NULL,short_url CHAR(6) NOT NULL,long_url TEXT NOT NULL);
```