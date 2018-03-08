# Memory to Mongo Demo

This project takes the Tiny App of a student ([alexandrasia](https://github.com/alexandrasia)) and switches from the in memory db to mongo, PostGres, and PostGres with knex.

## Instructions

For all versions:

1. Clone this repo
1. Install NPM dependencies by navigating to the project's root folder and running `npm install`.

### In-Memory

1. Run `node express_server.js`.
1. Navigate to `localhost:8080` in your browser.

### Mongo

1. Make sure that you have [MongoDB](https://www.mongodb.com/) installed and running.
1. Run `node mongo_express_server.js`.
1. Navigate to `localhost:8080` in your browser.

### PostGres

1. Make sure that you have [Postgres](https://www.postgresql.org/) installed and running. (For Mac, I recommend [Postgres.app](https://postgresapp.com/)).
1. Create the database and schema by running the `pg_create_database.sql` script. (You can run the file directly with `psql -f pg_create_db.sql`).
1. Run `node pg_express_server.js`.
1. Navigate to `localhost:8080` in your browser.

## PostGres + Knex

1. As above, make sure that you have [Postgres](https://www.postgresql.org/) installed and running. (For Mac, I recommend [Postgres.app](https://postgresapp.com/)).
1. In psql, create the `tiny_app_knex` database (`CREATE DATABASE tiny_app_knex`);
1. Launch the migration with `npm run migrate`.
1. Run `node knex_express_server.js`.
1. Navigate to `localhost:8080` in your browser.

