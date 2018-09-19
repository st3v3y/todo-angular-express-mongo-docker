'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('OAuthAccessToken', new Schema({
  accessToken: String,
  accessTokenExpiresAt: Date,
  scope: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' }
}));

module.exports = mongoose.model('OAuthAuthorizationCode', new Schema({
  code: String,
  expiresAt: Date,
  redirectUri: String,
  scope: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' }
}));

module.exports = mongoose.model('OAuthClient', new Schema({
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

module.exports = mongoose.model('OAuthRefreshToken', new Schema({
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  scope: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
}));

module.exports = mongoose.model('OAuthScope', new Schema({
  scope: String,
  is_default: Boolean
}));

module.exports = mongoose.model('User', new Schema({
  username: String,
  email: String,
  password: String,
  scope: String
}));


const OAuthAccessToken = mongoose.model('OAuthAccessToken');
const OAuthAuthorizationCode = mongoose.model('OAuthAuthorizationCode');
const OAuthRefreshToken = mongoose.model('OAuthRefreshToken');
const OAuthClient = mongoose.model('OAuthClient');

const _ = require('lodash');

/**
 * Model functions required by Oauth server
 */

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
    .then(() => ({ 
      authorizationCode: code.authorizationCode,
      authorization_code: code.authorizationCode,
      expires_in: Math.floor((code.expiresAt - new Date()) / 1000)
    }))
    .catch((err) => {
      console.log('saveAuthorizationCode - Err: ', err);
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
  console.log('validateScope', user.scope, client.scope, scope);

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



