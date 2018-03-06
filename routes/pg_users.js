const bcrypt = require('bcrypt');

function usersRouterMaker(client) {
  const usersRouter = require('express').Router();

  function findUserById(id, cb) {
    client.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [Number(id) || 0], (err, result) => {
      if (err) {
        cb(err);
      } else {
        cb(null, result.rows[0]);
      }
    });
  }

  function findUserByEmail(email, cb) {
    client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email], (err, result) => {
      if (err) {
        cb(err);
      } else {
        cb(null, result.rows[0]);
      }
    });
  }

  function createUser(email, password, cb) {
    const passwordHash = bcrypt.hashSync(password, 10);
    client.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, passwordHash], (err, result) => {
      if (err) {
        cb(err);
      } else {
        cb(null, result.rows[0]);
      }
    });
  }
// Sets user as a global variable
  usersRouter.use((req, res, next) => {
    findUserById(req.session.user_id, (err, user) => {
      console.log('User Found', user);
      res.locals.user = user;
      next();
    });
  });

  usersRouter.get('/register', (req, res) => {
    const userid = req.session.user_id;
  // If user is logged in, redirect to main urls page
    if (userid) {
      res.redirect('/urls');
  // If user is not logged in, go to register page
    } else {
      res.render('register');
    }
  });

  usersRouter.post('/register', (req, res) => {
  // If user does not enter both an email and a password
    if (!req.body.email || !req.body.password) {
      res.status(400);
      res.send("Please enter both an email and a password. Return to <a href='/register'>registration</a> page.");
      return;
    }
    findUserByEmail(req.body.email, (err, user) => {
      if (user) {
        res.status(400).send("That email is already registered, please <a href='/login'>login</a> or try registering <a href='/register'>again</a>");
      } else {
        createUser(req.body.email, req.body.password, (err, newUser) => {
          req.session.user_id = newUser.id;
          res.redirect('urls');
        });
      }
    });
  });

  usersRouter.get('/login', (req, res) => {
    const userid = req.session.user_id;
  // If user is logged in, go to urls
    if (userid) {
      res.redirect('/urls');
    // If user is not logged in, go to login
    } else {
      res.render('login');
    }
  });

  usersRouter.post('/login', (req, res) => {
  // If user does not enter both an email and a password
    if (!req.body.email || !req.body.password) {
      res.status(400).send("Please enter both an email and a password. Return to <a href='/login'>login</a> page.");
    } else {
      findUserByEmail(req.body.email, (err, foundUser) => {
        if (!foundUser && !bcrypt.compareSync(req.body.password, foundUser.password)) {
          res.status(403).send("Email & Password Not Found. Please try <a href='/login'>again</a>.");
        } else {
          req.session.user_id = foundUser.id;
          res.redirect('/urls');
        }
      });
    }
  });

  usersRouter.post('/logout', (req, res) => {
    req.session = undefined;
    res.redirect('/login');
  });

  usersRouter.get('/', (req, res) => {
    if (res.locals.user) {
      res.redirect('/urls');
    } else {
      res.redirect('/login');
    }
  });
  return usersRouter;
}

module.exports = usersRouterMaker;
