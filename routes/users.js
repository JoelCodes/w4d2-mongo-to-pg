const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};
function getUserById(id) {
  return users[id];
}

const usersRouter = require('express').Router();

// Sets user as a global variable
usersRouter.use((req, res, next) => {
  res.locals.user = getUserById(req.session.user_id);
  next();
});

// Generates random string for shortURL and randomID
function generateRandomString() {
  let shortURL = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i += 1) {
    shortURL += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return shortURL;
}


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
  // Checks to see if email is already registered
  for (const user in users) {
    if (users[user].email === req.body.email) {
      res.status(400).send("That email is already registered, please <a href='/login'>login</a> or try registering <a href='/register'>again</a>");
      return;
    }
  }
  // Creates randomID for new user then redirects to urls page
  const randomID = generateRandomString();
  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: req.body.password,
  };
  req.session.user_id = randomID;
  res.redirect('/urls');
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
    return;
  }
  // Checks if user exists in users database
  for (const user in users) {
    if (users[user].email === req.body.email) {
      if (req.body.password === users[user].password) {
        req.session.user_id = users[user].id;
        res.redirect('/urls');
        return;
        // If user uses incorrect password
      }
      res.status(403).send("Incorrect password. Please try <a href='/login'>again</a>.");
      return;
    }
  }
  // If user uses an email that does not exist
  res.status(403).send("Email does not exist. Please <a href='/register'>register</a>!");
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


module.exports = usersRouter;
