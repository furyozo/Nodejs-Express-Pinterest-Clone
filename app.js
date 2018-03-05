var express = require('express');
var session = require('express-session')
var fileupload = require('express-fileupload');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var TwitterStrategy = require("passport-twitter").Strategy;

var home = require('./controllers/home');
var index = require('./controllers/index');
var pen = require('./controllers/pen');
var user = require('./controllers/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'public'}));
app.set('view engine', 'handlebars');

//use sessions for tracking logins
app.use(session({
  secret: 'freeSecretForGithubHaxors',
  resave: true,
  saveUninitialized: false,
  key: 'sid'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// fileupload options
app.use(fileupload());

// twitter api authentication
var User = require('./models/User.js')
passport.use(new TwitterStrategy({
    consumerKey: '8mnCnTfxhuO66opjf0k9fg3bK',
    consumerSecret: 'u1cFohJhgQQNND5kZQpwAYLZ9dncNvNMaHen2ViA4xAM5tYLOL',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOrCreate(profile, function (err, user) {
      return cb(err, user);
    });
  }
));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use('/', index);
app.use('/home', home);
app.use('/pen', pen);
app.use('/user', user);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  req.session.user = req.user;
  res.redirect('/home');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
