const OauthServer = require('oauth2-server');
const model = require('./models/model');

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
      res.json(response.body);
    }).catch(err => next(err));
};

module.exports.authorize = (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  const options = {
    authenticateHandler: {
      handle(req, res) {
        return model.getUserFromRequest(req, res).then(user => {
          return user;
        });
      }
    }
  };

  oauth.authorize(request, response, options).then((authorizationCode) => {
    // TODO: Here i get a redirect response
    
    console.log("%%%%%%%%%%%%%%%%%%%%");
    console.log(authorizationCode);
    console.log("%%%%%%%%%%%%%%%%%%%%");
    console.log(response.headers);
    console.log("%%%%%%%%%%%%%%%%%%%%");


    res.status(response.status).set(response.headers).end();
  }).catch(err => next(err));
};

module.exports.authenticate = (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);

  oauth.authenticate(request, response)
    .then((token) => {
      console.log('token data', token)
      // Request is authorized.
      Object.assign(req, { user: token });
      next();
    })
    .catch(err => next(err));
};