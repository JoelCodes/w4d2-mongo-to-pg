const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'development'],
  maxAge: 24 * 60 * 60 * 1000,
}));

const userRoutes = require('./routes/users');
const urlRoutes = require('./routes/mem_urls');

app.use(userRoutes);
app.use(urlRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
