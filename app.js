var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var ratings = require('./routes/ratings');
var comments = require('./routes/comments');
var downloads = require('./routes/downloads');
var documents = require('./routes/documents');
var contact = require('./routes/contact');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//Add a phony directory for client downloads. Can adjust this path in the
//future
app.use('/', routes);
app.use('/tmp/downloads', express.static(path.join(__dirname, 'docs')));
app.use('/api/v1/', routes);
app.use('/api/v1/users', users);
app.use('/api/v1/comments', comments);
app.use('/api/v1/ratings', ratings);
app.use('/api/v1/documents', documents);
app.use('/api/v1/downloads', downloads);
app.use('/api/v1/contact', contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'test') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({statusCode: (err.status || 500), message: err.message})
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
