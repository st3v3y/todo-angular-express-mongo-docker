
var express = require('express'),
  app = express(),
  config = require('./config'),
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
mongoose.connect(config.DATABASE, { useNewUrlParser: true }); 
var database = mongoose.connection;

var originsWhitelist = [ 
  'http://localhost:4200',      //angular local development
  'http://web:3200'
];
var corsOptions = {
  origin: function(origin, callback){
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials:true
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'happy day',
  resave: true,
  saveUninitialized: false, 
  store: new MongoStore({
    mongooseConnection: database
  }),
  cookie: {  maxAge: 60000 }
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
  next(err);
});

app.listen(config.PORT);

console.log('todo list RESTful API server started on: ' + config.PORT);
