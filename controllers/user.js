var express = require('express');
var router = express.Router();
var session = require('express-session')

var Pen = require('../models/Pen.js')
var User = require('../models/User.js')

var Authenticate = require('../middlewares/Authenticate.js')

/* login a user */
router.post('/login', function(req, res, next) {
  User.login(req, function(err, user) {
    if (err) res.render('auth/login', err);
    else res.redirect('/home');
  });
});

/* register a new user */
router.post('/register', function(req, res, next) {
  User.register(req, function(err, user) {
    if (err) res.render('auth/register', err);
    else res.redirect('/home');
  });
});

/* GET /logout */
router.get('/logout', function(req, res, next) {
  User.logout(req);
  res.redirect('/');
});

/* get existing user */
router.get('/:name', function(req, res, next) {
  User.findOne({name: req.params.name}, function(err, user) {
    Pen.find({user_id: user._id}, function(err, pens) {
      if (err) res.render('auth/register', err);
      else res.render('user', {user: req.session.user, author: user, pens: pens});
    })
  })
})

module.exports = router;
