const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'development'],
  maxAge: 24 * 60 * 60 * 1000,
}));

const url = 'mongodb://localhost:27017/tinyapp';
const userRoutes = require('./routes/users');
const urlRoutes = require('./routes/urls');

app.use(userRoutes);

MongoClient.connect(url, (err, db) => {
  // I can't start any of this until I have a connection.

  app.use(urlRoutes(db));

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });
});
