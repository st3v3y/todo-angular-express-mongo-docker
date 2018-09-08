/**
 * Module dependencies.
 */
const _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); // TODO only use one crypt tool
const jwt = require('jsonwebtoken');
const config = {
  secret: 'supersecret',
  tokenExpiresIn: 86400 // expires in 24 hours
}; // TODO Centralize!

/**
 * Schema definitions.
 */

mongoose.model('OAuthAccessToken', new Schema({
  accessToken: String,
  accessTokenExpiresAt: Date,
  scope: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' }
}));

mongoose.model('OAuthAuthorizationCode', new Schema({
  code: String,
  expiresAt: Date,
  redirectUri: String,
  scope: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' }
}));

mongoose.model('OAuthClient', new Schema({
  name: String,
  clientId: String,
  clientSecret: String,
  redirectUris: {
    type: [String]
  },
  grants: {
    type: [String],
    default: ['authorization_code']//, 'password', 'refresh_token', 'client_credentials']
  },
  scope: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}));

mongoose.model('OAuthRefreshToken', new Schema({
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  scope: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
}));

mongoose.model('OAuthScope', new Schema({
  scope: String,
  is_default: Boolean
}));

mongoose.model('User', new Schema({
  username: String,
  email: String,
  password: String,
  scope: String
}));

var OAuthAccessToken = mongoose.model('OAuthAccessToken');
var OAuthAuthorizationCode = mongoose.model('OAuthAuthorizationCode');
var OAuthClient = mongoose.model('OAuthClient');
var OAuthRefreshToken = mongoose.model('OAuthRefreshToken');
var OAuthScope = mongoose.model('OAuthScope');
var User = mongoose.model('User');



/**
 * User functions
 */

function hashValue (value) {
  return bcrypt.hashSync(value, 8);
}

function getDecodedToken(req, res) {
  return new Promise(function(resolve, reject) {
    var token = req.headers['x-access-token'];
    if (!token) {
      console.log("No token provided.");
      return reject({ status:401, message: 'No token provided.' });
    }
  
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        console.log("Failed to authenticate token.");
        return reject({ status:500, message: 'Failed to authenticate token.' });
      }
      resolve(decoded); 
    });
  });
}

module.exports.getUserFromRequest = function(req, res) {
  return getDecodedToken(req, res).then(
    (decoded) => {
      return User
        .findById(decoded.id, {password:0})
        .lean()
        .then(user => user)
        .catch((err) => {
          console.log('authenticateHandler - Err: ', err);
        });
    },
    (err) => console.log(err)
  );
}

/**
 * Client functions
 */
module.exports.createClient = (req, res) => {
  console.log(req.body);

  const client = new OAuthClient(req.body);

  client.clientId = crypto.createHash('md5').update(crypto.randomBytes(16)).digest('hex'); // 32 chars
  client.clientSecret = crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('hex'); // 64 chars

  client.save()
    .then(() => res.json({ id: client }));
};

module.exports.registerUser = function (req, res, next) {

  console.log(req.body);
  var hashedPassword = hashValue(req.body.password);
  
  //TODO: do some validation!
  // - If user exists
  // - If password === password confirm
  // - ...

  User.create({
    username : req.body.username,
    email : req.body.email,
    scope : req.body.scope, // TODO maybe not good to receive this from the registration, but good for testing
    password : hashedPassword
  }, function (err, user) {
    if (err) {
      return res.status(500).send("There was a problem registering the user.");
    }

    // TODO: token not necessary, or!?
    // create a token
    var token = jwt.sign({ id: user._id, scope: user.scope }, config.secret, {
      expiresIn: config.tokenExpiresIn
    });

    res.json({ auth: true, token: token }); 
  });
}

module.exports.login = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(500).send('Error on the server.');
    }
    if (!user) {
      return res.status(404).send('No user found.');
    } 

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: config.tokenExpiresIn
    });
    res.status(200).send({ auth: true, token: token });
  });
}

module.exports.getUser = function (username, password) {
  const hashedPassword = hashValue(password);
  return User
    .findOne({ username: username, password: hashedPassword })
    .lean()
    .then(user => user)
    .catch((err) => {
      console.log('getUser - Err: ', err);
    });
}

/**
 * OAuth functions
 */
module.exports.getAccessToken = function (accessToken) {
  console.log('getAccessToken', accessToken);
  return OAuthAccessToken
    .findOne({ accessToken })
    .populate('user')
    .populate('client')
    .lean()
    .then(dbToken => dbToken)
    .catch((err) => {
      console.log('getAccessToken - Err: ', err);
    });
}

module.exports.getClient = function (clientId, clientSecret) {
  console.log('getClient', clientId, clientSecret);
  const query = { clientId };
  if (clientSecret) {
    query.clientSecret = clientSecret;
  }

  return OAuthClient
    .findOne(query)
    .lean()
    .then(client => (client ? Object.assign(client, { id: clientId }) : null))
    .catch((err) => {
      console.log('getClient - Err: ', err);
    });
}

module.exports.revokeAuthorizationCode = function (code) {
  console.log('revokeAuthorizationCode', code);
  return OAuthAuthorizationCode.findOneAndRemove({ code: code.code })
    .then(removed => !!removed)
    .catch((err) => {
      console.log('revokeAuthorizationCode - Err: ', err);
    });
}

module.exports.revokeToken = function (token) {
  console.log('revokeToken', token);
  return OAuthRefreshToken.findOneAndRemove({ refreshToken: token.refreshToken })
    .then(removed => !!removed)
    .catch((err) => {
      console.log('revokeToken - Err: ', err);
    });
}

module.exports.saveToken = function (token, client, user) {
  console.log('saveToken', token, client, user);
  return Promise.all([
    OAuthAccessToken.create({
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      client: client._id,
      user: user._id,
      scope: token.scope
    }),
    token.refreshToken ? OAuthRefreshToken.create({ // no refresh token for client_credentials
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: client._id,
      user: user._id,
      scope: token.scope
    }) : Promise.resolve()
  ])
    .then(() => _.assign({ client, user }, token))
    .catch((err) => {
      console.log('revokeToken - Err: ', err);
    });
}

module.exports.getAuthorizationCode = function (code) {
  console.log('getAuthorizationCode', code);
  return OAuthAuthorizationCode
    .findOne({ code })
    .populate('user')
    .populate('client')
    .lean()
    .then((authCodeModel) => {
      if (!authCodeModel) {
        return false;
      }

      const extendedClient = Object.assign(authCodeModel.client, { id: authCodeModel.client.clientId });
      console.log({ client: extendedClient });
      return Object.assign(authCodeModel, { client: extendedClient });
    })
    .catch((err) => {
      console.log('getAuthorizationCode - Err: ', err);
    });
}

module.exports.saveAuthorizationCode = function (code, client, user) {
  console.log('saveAuthorizationCode', code, client, user);
  return OAuthAuthorizationCode
    .create({
      expiresAt: code.expiresAt,
      client: client._id,
      code: code.authorizationCode,
      user: user._id,
      scope: code.scope
    })
    .then(() => ({ // TODO: Consider changing expiresAt to expiresIn (seconds)
      authorizationCode: code.authorizationCode,
      authorization_code: code.authorizationCode,
      expires_in: Math.floor((code.expiresAt - new Date()) / 1000)
    }))
    .catch((err) => {
      console.log('saveAuthorizationCode - Err: ', err);
    });
}

module.exports.getUserFromClient = function (client) {
  console.log('getUserFromClient', client);
  return User.findById(client.user)
    .lean()
    .then(dbUser => dbUser)
    .catch((err) => {
      console.log('getUserFromClient - Err: ', err);
    });
}

module.exports.getRefreshToken = function (refreshToken) {
  console.log('getRefreshToken', refreshToken);
  return OAuthRefreshToken
    .findOne({ refreshToken })
    .populate('user')
    .populate('client')
    .lean()
    .then((dbToken) => {
      if (!dbToken) {
        return false;
      }

      const extendedClient = Object.assign(dbToken.client, { id: dbToken.client.clientId });
      return Object.assign(dbToken, { client: extendedClient });
    })
    .catch((err) => {
      console.log('getRefreshToken - Err: ', err);
    });
}

/**
In case there is a need to scopes for the user, uncomment the code.
It will also be required to provide scopes for both user and client
*/
// eslint-disable-next-line
module.exports.validateScope = function (user, client, scope) {
  console.log('validateScope', user, client, scope);
  return (user.scope === scope && client.scope === scope && scope !== null) ? scope: false;
}

/**
In case there is a need to scopes for the user, uncomment the code.
It will also be required to provide scopes for both user and client (They should also match)
*/
// eslint-disable-next-line
module.exports.verifyScope = function(token, scope) {
  console.log('verifyScope', token, scope);
  return token.scope === scope;
}
