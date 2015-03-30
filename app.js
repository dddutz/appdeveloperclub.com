/* Module dependencies */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib = require('nib');

// Database
var mongo = require('mongoskin');
var db = mongo.db(process.env.MONGOLAB_URI, {native_parser:true});

var routes = require('./routes/index.js');
var users = require('./routes/users.js');
var teams = require('./routes/teams.js');

var app = express();

function compile(str, path) {
	return stylus(str).set('filename', path).use(nib());
}

// port setup
app.set('port', (process.env.PORT || 5000));

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(stylus.middleware( { src: __dirname + '/public', compile: compile }));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// Tells express to serve static objects from the /public directory, but make
// them seem like they're coming from the top level.
app.use(express.static(__dirname + '/public'));

// Makes db accessible to router.
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/teams', teams);

/// Catches 404 and forwards to error handler.
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// Error Handlers

// Development error handler
// Prints stacktrace.
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// Prevents stacktraces from being leaked to user.
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

module.exports = app;
