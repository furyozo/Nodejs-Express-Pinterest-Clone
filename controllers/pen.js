var session = require('express-session')
var express = require('express');
var router = express.Router();
const isImage = require('is-image');

var Authenticator = require('../middlewares/Authenticate.js');

var Pen = require('../models/Pen.js');
var User = require('../models/User.js')

/* get user private are */
router.post('/add', Authenticator.isAuthenticated, function(req, res, next) {
  Pen.find({}).where('user_id').equals(req.session.user._id).exec(function(err, pens) {
    Pen.find({pins: req.session.user._id}, function(err, pinned_pens) {
      if (!req.body.name || !req.body.link)
      res.render('home', {user: req.session.user, pens: pens, pinned_pens: pinned_pens, err: "some pen data is missing"});
      else {
        Pen.create(req, function() {
          res.redirect('/home');
        })
      }
    })
  })
})

/* remove existing pen */
router.get('/:id/remove', Authenticator.isAuthenticated, Authenticator.penAuthentication, function(req, res, next) {
  Pen.remove({_id: req.params.id}, function(err) {
    res.redirect('/home');
  })
})

/* remove existing pen */
router.get('/:user_id/:id', function(req, res, next) {
  Pen.findById(req.params.id, function(err, pen) {
    User.findById(req.params.user_id, function(err, user) {
      return res.render('pen', {user: req.session.user, pen: pen, author: user});
    })
  })
})

/* search pens */
router.post('/search', function(req, res, next) {
  Pen.find({name: req.body.text}, function(err, pens) {
    res.render('index', {user: req.session.user, pens: pens});
  })
})

/* like pen */
router.get('/:id/like', function(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  Pen.like(req, function(pen) {
    res.render('pen', {user: req.session.user, pen: pen});
  })
})

/* pin pen */
router.get('/:id/pin', function(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  Pen.pin(req, function(pen) {
    res.render('pen', {user: req.session.user, pen: pen});
  })
})

module.exports = router;
