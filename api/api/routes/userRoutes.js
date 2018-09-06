'use strict';
module.exports = function(app) {
  var user = require('../controllers/userController');

  // user Routes 
  app.route('/user/loggedin')
    .get(user.user_logged_in);

  app.route('/user/register')
    .post(user.register_user);

  app.route('/user/login')
    .post(user.login);

  app.route('/user/logout')
    .get(user.logout);
};
