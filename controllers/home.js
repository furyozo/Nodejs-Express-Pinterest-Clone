var session = require('express-session')
var express = require('express');
var router = express.Router();

var Authenticator = require('../middlewares/Authenticate.js');

var Pen = require('../models/Pen.js');
var User = require('../models/User.js')

/* get user private are */
router.get('/', Authenticator.isAuthenticated, function(req, res, next) {
  Pen.find({}).where('user_id').equals(req.session.user._id).exec(function(err, pens) {
    res.render('home', {user: req.session.user, pens: pens});
  })
})

module.exports = router;
