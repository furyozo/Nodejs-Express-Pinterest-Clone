var session = require('express-session')
var express = require('express');
var router = express.Router();

var Authenticator = require('../middlewares/Authenticate.js');

var Pen = require('../models/Pen.js');
var User = require('../models/User.js')

/* get user private are */
router.post('/add', Authenticator.isAuthenticated, function(req, res, next) {
  Pen.find({}).where('user_id').equals(req.session.user._id).exec(function(err, pens) {
    if (!req.body.name || !req.body.link)
      res.render('home', {user: req.session.user, pens: pens, err: "some pen data is missing"});
    else {
      Pen.create(req, function() {
        res.redirect('/home');
      })
    }
  })
})

/* remove existing pen */
router.get('/:id/remove', Authenticator.isAuthenticated, Authenticator.penAuthentication, function(req, res, next) {
  Pen.remove({_id: req.params.id}, function(err) {
    res.redirect('/home');
  })
})

/* remove existing pen */
router.get('/:id', function(req, res, next) {
  Pen.findById(req.params.id, function(err, pen) {
    User.findById('pen.user_id', function(err, user) {
      res.render('pen', {user: req.session.user, pen: pen, author: user});
    })
  })
})

/* search pens */
router.post('/search', function(req, res, next) {
  Pen.find({name: req.body.text}, function(err, pens) {
    res.render('index', {user: req.session.user, pens: pens});
  })
})

module.exports = router;
