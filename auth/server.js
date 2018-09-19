var express = require('express'),
    config = require('./config'),
    OAuthServer = require('oauth2-server'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bluebird = require('bluebird'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    model = require('./auth/models/model')
    clientController = require('./auth/controllers/clientController'),
    authMiddlewareController = require('./auth/controllers/authMiddlewareController'),
    userController = require('./auth/controllers/userController');

const app = express();

global.Promise = bluebird;

mongoose.connect(config.DATABASE, { useNewUrlParser: true });

var corsOptions = {
  origin: function(origin, callback){
    callback(null, (config.CORS_WHITELIST.indexOf(origin) !== -1));
  },
  credentials:true
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.oauth = new OAuthServer({
	debug: true,
	model: model,
	grants: ['authorization_code']
});

app.all('/oauth/token', authMiddlewareController.token);
app.get('/oauth/authorize', authMiddlewareController.authorize);
app.post('/oauth/authorize', authMiddlewareController.authorize);
app.post('/oauth/authenticate', authMiddlewareController.authenticateExt);

app.post('/clients', clientController.createClient);

app.post('/user/register', userController.registerUser);
app.post('/user/login', userController.login);
 

app.get('/secure', authMiddlewareController.authenticate, (req, res) => {
	res.json({ message: 'Secure data' });
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(config.PORT, err => (err ? console.log('Error happened', err) : console.log('Server is up')));