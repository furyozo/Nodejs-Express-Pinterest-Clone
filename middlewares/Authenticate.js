var session = require('express-session')

var Pen = require('../models/Pen.js');

module.exports = class Authenticator {

  // check if user is logged in
  static isAuthenticated(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      return next();
    }
  }

  // check if user is editing his own pen
  static penAuthentication(req, res, next) {
    Pen.findById(req.params.id, function(err, pen) {
      if (req.session.user._id != pen.user_id) {
        res.redirect('/login');
      } else {
        return next();
      }
    })
  }

}
