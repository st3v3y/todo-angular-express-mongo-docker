'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs'); // TODO: only use one crypt tool
const jwt = require('jsonwebtoken');
const config = require('./../../config');

function hashValue (value) {
    return bcrypt.hashSync(value, 8);
}

module.exports.registerUser = function (req, res, next) {
    var hashedPassword = hashValue(req.body.password);
    
    // TODO: do some validation!
    // - If user exists
    // - If password === password confirm
    // - ...
  
    User.create({
      username : req.body.username,
      email : req.body.email,
      scope : 'admin',
      password : hashedPassword
    }, function (err, user) {
      if (err) {
        return res.status(500).send("There was a problem registering the user.");
      }

      res.status(200).json({ message:"The user was registered successfully" });
    });
}
  
module.exports.login = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) { // TODO: find by email OR username?
    if (err) {
      return res.status(500).send('Error on the server.');
    }
    if (!user) {
      return res.status(422).send('No user found.');
    } 

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(422).send('No user found.');
    }

    var token = createUserToken(user);

    res.status(200).send({ auth: true, token: token });
  });
}

function createUserToken (user) {
  return jwt.sign({ id: user._id, username: user.username, email: user.email }, config.JWT_SECRET, {
    expiresIn: config.TOKEN_EXPIRES_IN
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

module.exports.getUserFromClient = function (client) {
  console.log('getUserFromClient', client);
  return User.findById(client.user)
    .lean()
    .then(dbUser => dbUser)
    .catch((err) => {
        console.log('getUserFromClient - Err: ', err);
    });
}

module.exports.verifyToken = function (req, res) {
  return new Promise(function(resolve, reject) {
    var token = req.headers['x-access-token'];
    if (!token) {
      console.log("No token provided.");
      return reject({ status:401, message: 'No token provided.' });
    }
  
    jwt.verify(token, config.JWT_SECRET, function(err, decoded) {
      if (err) {
        console.log("Failed to authenticate token.");
        return reject({ status:500, message: 'Failed to authenticate token.' });
      }
      req.userid = decoded.id;
      resolve(decoded); 
    });
  });
}

module.exports.getUserById = function(req, res) {
  return User
    .findById(req.userid, { password:0 })
    .lean()
    .then(user => user)
    .catch((err) => {
        console.log('authenticateHandler - Err: ', err);
    });
}