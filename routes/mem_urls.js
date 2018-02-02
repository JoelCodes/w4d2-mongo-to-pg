
// Database for urls
const urlDatabase = {
  b2xVn2: {
    userID: 'userRandomID',
    longURL: 'http://www.lighthouselabs.ca',
    shortURL: 'b2xVn2',
  },
  '9sm5xK': {
    userID: 'user2RandomID',
    longURL: 'http://www.google.com',
    shortURL: '9sm5xK',
  },
  '45g7wU': {
    userID: 'user2RandomID',
    longURL: 'http://www.cbc.ca',
    shortURL: '45g7wU',
  },
};

// Checks database to see if short url is valid
function checkShortURLValid(shortURL) {
  for (const x in urlDatabase) {
    if (x === shortURL) {
      return true;
    }
  }
  return false;
}

// Checks if user has that specific shortURL
function userSpecificURL(userId) {
  const result = {};
  for (const shortURL in urlDatabase) {
    const url = urlDatabase[shortURL];
    if (userId === url.userID) {
      result[shortURL] = url;
    }
  }
  return result;
}

// Generates random string for shortURL and randomID
function generateRandomString() {
  let shortURL = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i += 1) {
    shortURL += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return shortURL;
}
const express = require('express');

const urlRouter = express.Router();

urlRouter.use('/urls', (req, res, next) => {
  if (res.locals.user === undefined) {
    res.redirect('/login');
  } else {
    next();
  }
});

urlRouter.get('/urls', (req, res) => {
  const { user } = res.locals;
  const urls = userSpecificURL(user.id);
  res.render('mem_urls_index', { urls });
});

urlRouter.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

urlRouter.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

urlRouter.get('/urls/:id', (req, res) => {
  const userId = req.session.user_id;
  const result = checkShortURLValid(req.params.id);
  if (result) {
      // Makes sure that the url belongs to the user
    if (userId === urlDatabase[req.params.id].userID) {
      const templateVars = urlDatabase[req.params.id];
      res.render('urls_shows', templateVars);
      // If the url does not belong to the user
    } else {
      res.status(403).send("You are not allowed to access this page. Return to <a href='/urls'>TinyApp.</a>");
    }
    // If the url does not exist
  } else {
    res.status(404).send("Short URL does not exist. Return to <a href='/urls'>TinyApp.</a>");
  }
});

urlRouter.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.newLongURL;
  res.redirect('/urls');
});

urlRouter.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

urlRouter.get('/u/:shortURL', (req, res) => {
  const result = checkShortURLValid(req.params.shortURL);
  // If url is valid, redirect to longURL
  if (result) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  // If url is not valid, send error message
  } else {
    res.status(404).send("Invalid URL. Return to <a href='/urls'>TinyApp.</a>");
  }
});


module.exports = urlRouter;
