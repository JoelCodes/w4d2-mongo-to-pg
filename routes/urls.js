
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

const urlRouterMaker = (db) => {
  // Since all of these routes have a dependency on db,
  // I'm going to wait till I have it.
  const urlsCollection = db.collection('urls');
  const urlRouter = express.Router();

  function getUrlsForUser(userId, cb) {
    urlsCollection
    .find({ userId: user.id })
    .toArray((err, urls) => {
      cb(urls);
    });
  }
  urlRouter.use('/urls', (req, res, next) => {
    if (res.locals.user === undefined) {
      res.redirect('/login');
    } else {
      next();
    }
  });

  urlRouter.get('/urls', (req, res) => {
    const { user } = res.locals;
    urlsCollection
      .find({ userId: user.id })
      .toArray((err, urls) => {
        res.render('urls_index', { urls });
      });
  });

  urlRouter.post('/urls', (req, res) => {
    const shortURL = generateRandomString();
    urlsCollection.insertOne({
      longURL: req.body.longURL,
      userId: req.session.user_id,
      shortURL,
    }, () => {
      res.redirect('/urls');
    });
  });

  urlRouter.get('/urls/new', (req, res) => {
    res.render('urls_new');
  });

  urlRouter.get('/urls/:id', (req, res) => {
    const userId = req.session.user_id;
    urlsCollection.findOne({ shortURL: req.params.id }, (err, result) => {
      if (result) {
        // Makes sure that the url belongs to the user
        if (userId === result.userId) {
          const templateVars = result;
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
  });

  urlRouter.post('/urls/:id', (req, res) => {
    urlsCollection.updateOne({
      shortURL: req.params.id,
    }, {
      $set: {
        longURL: req.body.newLongURL,
      },
    }, () => {
      res.redirect('/urls');
    });
  });

  urlRouter.post('/urls/:id/delete', (req, res) => {
    urlsCollection.deleteOne({ shortURL: req.params.id }, () => {
      res.redirect('/urls');
    });
  });

  urlRouter.get('/u/:shortURL', (req, res) => {
    urlsCollection.findOne({ shortURL: req.params.shortURL }, (err, result) => {
      // If url is valid, redirect to longURL
      if (result) {
        res.redirect(result.longURL);
  // If url is not valid, send error message
      } else {
        res.status(404).send("Invalid URL. Return to <a href='/urls'>TinyApp.</a>");
      }
    });
  });
  return urlRouter;
};

module.exports = urlRouterMaker;
