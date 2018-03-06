
// Generates random string for shortURL and randomID

const express = require('express');
const rando = require('../rando');

const makeUrlRouter = (client) => {
  const urlRouter = express.Router();
  const collectionCallback = cb => (err, result) => {
    if (err) {
      cb(err);
    } else {
      cb(null, result.rows);
    }
  };

  const itemCallback = cb => (err, result) => {
    if (err) {
      cb(err);
    } else {
      cb(null, result.rows[0]);
    }
  };

  function getUrlsByUserId(id, cb) {
    client.query('SELECT * FROM urls WHERE user_id = $1', [id], collectionCallback(cb));
  }

  function createURL(userId, shortURL, longURL, cb) {
    client.query('INSERT INTO urls (user_id, short_url, long_url) VALUES ($1, $2, $3)', [userId, shortURL, longURL], itemCallback(cb));
  }

  function findByShortURL(shortURL, cb) {
    client.query('SELECT * FROM urls WHERE short_url = $1', [shortURL], itemCallback(cb));
  }

  function updateURL(shortUrl, longUrl, cb) {
    client.query('UPDATE urls SET long_url = $1 WHERE short_url = $2', [longUrl, shortUrl], cb);
  }

  function deleteURL(shortUrl, cb) {
    client.query('DELETE FROM urls WHERE short_url = $1', [shortUrl], cb);
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
    getUrlsByUserId(user.id, (err, urls) => {
      res.render('pg_urls_index', { urls });
    });
    // mongoDBcoll
    //   .find({ userID: user.id })
    //   .toArray((err, urls) => {
    //     res.render('mongo_urls_index', { urls });
    //   });
  });

  urlRouter.post('/urls', (req, res) => {
    const shortURL = rando();
    createURL(req.session.user_id, shortURL, req.body.longURL, () => {
      res.redirect(`/urls/${shortURL}`);
    });
  });

  urlRouter.get('/urls/new', (req, res) => {
    res.render('urls_new');
  });

  urlRouter.use('/urls/:id', (req, res, next) => {
    const userId = req.session.user_id;
    findByShortURL(req.params.id, (err, url) => {
      if (url) {
        if (url.user_id === userId) {
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
    res.render('pg_urls_shows');
  });

  urlRouter.post('/urls/:id', (req, res) => {
    updateURL(req.params.id, req.body.newLongURL, () => {
      res.redirect('/urls');
    });
  });

  urlRouter.post('/urls/:id/delete', (req, res) => {
    deleteURL(req.params.id, () => {
      res.redirect('/urls');
    });
  });

  urlRouter.get('/u/:shortURL', (req, res) => {
    findByShortURL(req.params.shortURL, (err, url) => {
      if (url) {
        res.redirect(url.long_url);
      } else {
        res.status(404).send("Invalid URL. Return to <a href='/'>TinyApp.</a>");
      }
    });
  });
  return urlRouter;
};

module.exports = makeUrlRouter;
