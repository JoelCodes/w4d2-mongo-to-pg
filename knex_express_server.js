const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const config = require('./knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(config);

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'development'],
  maxAge: 24 * 60 * 60 * 1000,
}));

// const url = 'mongodb://localhost:27017';
// MongoClient.connect(url, (err, client) => {
// const client = new Client({
//   database: 'tiny_app',
// });
// client.connect((err) => {
  // const tinyAppDB = client.db('tinyapp');
  // const urlsColl = tinyAppDB.collection('urls');
  // const userRoutes = require('./routes/users');
  // const urlRoutes = require('./routes/mongo_urls')(urlsColl);

const userRoutes = require('./routes/knex_users')(knex);
const urlRoutes = require('./routes/knex_urls')(knex);

app.use(userRoutes);
app.use(urlRoutes);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
// });
