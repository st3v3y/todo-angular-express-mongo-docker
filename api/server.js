
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Task = require('./api/models/todoListModel'), //created model loading here
  User = require('./api/models/userModel'), //created model loading here
  bodyParser = require('body-parser'),
  cors = require('cors'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  MongoStore = require('connect-mongo')(session);
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://db:27017/nodeTodo', { useNewUrlParser: true }); 
var database = mongoose.connection;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'KX5BhB9FRKqKVRvcs6aoBqpufhBSazu69SRmp6DmGPneLjZkQVA',
  resave: true,
  saveUninitialized: false, 
  store: new MongoStore({
    mongooseConnection: database
  })
}));

var todoRoutes = require('./api/routes/todoListRoutes');
var userRoutes = require('./api/routes/userRoutes');
todoRoutes(app);
userRoutes(app);

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
});


app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
