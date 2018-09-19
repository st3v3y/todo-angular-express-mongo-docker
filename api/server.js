
var express = require('express'),
  app = express(),
  config = require('./config'),
  mongoose = require('mongoose'),
  Task = require('./api/models/todoListModel'), //created model loading here
  bodyParser = require('body-parser'),
  cors = require('cors'),
  cookieParser = require('cookie-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, { useNewUrlParser: true }); 

var corsOptions = {
  origin: function(origin, callback){
    callback(null, (config.CORS_WHITELIST.indexOf(origin) !== -1));
  },
  credentials:true,
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var todoRoutes = require('./api/routes/todoListRoutes');
var userRoutes = require('./api/routes/userRoutes');
var authRoutes = require('./api/routes/authRoutes');

todoRoutes(app);
userRoutes(app);
authRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
  next(err);
});

app.listen(config.PORT);

console.log('todo list RESTful API server started on: ' + config.PORT);
