
// Generates random string for shortURL and randomID

const express = require('express');
const rando = require('../rando');

const makeUrlRouter = (mongoDBcoll) => {
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
    mongoDBcoll
      .find({ userID: user.id })
      .toArray((err, urls) => {
        res.render('mongo_urls_index', { urls });
      });
  });

  urlRouter.post('/urls', (req, res) => {
    const shortURL = rando();
    const newURLObject = {
      shortURL,
      longURL: req.body.longURL,
      userID: req.session.user_id,
    };
    mongoDBcoll.insertOne(newURLObject, () => {
      res.redirect(`/urls/${shortURL}`);
    });
  });

  urlRouter.get('/urls/new', (req, res) => {
    res.render('urls_new');
  });

  urlRouter.use('/urls/:id', (req, res, next) => {
    const userId = req.session.user_id;
    mongoDBcoll.findOne({ shortURL: req.params.id }, (err, url) => {
      if (url) {
        if (url.userID === userId) {
          res.locals.url = url;
          next();
        } else {
          res.status(403).send("You are not allowed to access this page. Return to <a href='/urls'>TinyApp.</a>");
        }
      } else {
        res.status(404).send("Short URL does not exist. Return to <a href='/urls'>TinyApp.</a>");
      }
    });
  });

  urlRouter.get('/urls/:id', (req, res) => {
    res.render('urls_shows');
  });

  urlRouter.post('/urls/:id', (req, res) => {
    mongoDBcoll
      .updateOne({ shortURL: req.params.id }, {
        $set: { longURL: req.body.newLongURL },
      }, () => {
        res.redirect('/urls');
      });
  });

  urlRouter.post('/urls/:id/delete', (req, res) => {
    mongoDBcoll.deleteOne({ shortURL: req.params.id }, () => {
      res.redirect('/urls');
    });
  });

  urlRouter.get('/u/:shortURL', (req, res) => {
    mongoDBcoll.findOne({ shortURL: req.params.shortURL }, (err, url) => {
      if (url) {
        res.redirect(url.longURL);
      } else {
        res.status(404).send("Invalid URL. Return to <a href='/'>TinyApp.</a>");
      }
    });
  });
  return urlRouter;
};

module.exports = makeUrlRouter;
