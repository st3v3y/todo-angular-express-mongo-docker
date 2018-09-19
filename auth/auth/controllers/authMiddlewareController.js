'use strict';

const OauthServer = require('oauth2-server');
const model = require('../models/model');
const userController = require('../controllers/userController');
const config = require('../../config');

const oauth = new OauthServer({ model });
const Request = OauthServer.Request;
const Response = OauthServer.Response; 

module.exports.token = (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth.token(request, response)
    .then((token) => {
      console.log('generated token data', token);
      res.set(response.headers);

      // Set user data to token
      response.body.user = {
        username : token.user.username, 
        email : token.user.email
      };

      res.json(response.body);
    }).catch(err => next(err));
};

module.exports.authorize = (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  const options = {
    authenticateHandler: {
      handle(req, res) {
        return userController.verifyToken(req, res).then(user => {
          return userController.getUserById(req, res);
        });
      }
    }
  };

  oauth.authorize(request, response, options)
    .then((authorizationCode) => {
      if(!config.IS_SILENT_AUTH){
        // Here i get a redirect response
        res.status(response.status).set(response.headers).end();
      } else {
        res.status(200).send({ code: authorizationCode });
      }
    })
    .catch(err => next(err));
};

module.exports.authenticate = (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth.authenticate(request, response)
    .then((token) => { 
      console.log('token data', token);

      // Request is authorized.
      Object.assign(req, { user: token });
      next();
    })
    .catch(err => next(err));
};

module.exports.authenticateExt = (req, res) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth.authenticate(request, response)
    .then((token) => { 
      delete token.user.password;
      res.set(200).send({ user: token });
    })
    .catch(err => res.set(err.statusCode).send(err));
};