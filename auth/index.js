const bodyParser = require('body-parser');
const express = require('express');
const OAuthServer = require('oauth2-server');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bluebird = require('bluebird');
const mongoose = require('mongoose');
const uristring = 'mongodb://localhost:27017/oathtest';
const oauthMiddlewares = require('./oauthServerMiddlewares');

global.Promise = bluebird;

var model = require('./models/model');

mongoose.connect(uristring, { useNewUrlParser: true }, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.oauth = new OAuthServer({
	debug: true,
	model: model,
	grants: ['authorization_code']
});


app.all('/oauth/token', oauthMiddlewares.token);
app.get('/oauth/authorize', oauthMiddlewares.authorize);
app.post('/oauth/authorize', oauthMiddlewares.authorize);
app.get('/secure', oauthMiddlewares.authenticate, (req, res) => {
	res.json({ message: 'Secure data' });
});

app.post('/clients', model.createClient);
app.get('/clients', model.getClient);


app.post('/user/register', model.registerUser);
app.post('/user/login', model.login);

 
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

app.listen(3033, err => (err ? console.log('Error happened', err) : console.log('Server is up')));