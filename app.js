var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user.routes');
var provinceRouter = require('./routes/province.routes');
var activiteRouter = require('./routes/activite.routes');
var lieuRouter = require('./routes/lieu.routes');

var app = express();

// setup environment variables
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

// setup database connection
const connectDB = require('./configuration/database-connector');
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/province', provinceRouter);
app.use('/api/v1/activite', activiteRouter);
app.use('/api/v1/lieu', lieuRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
