'use strict';
module.exports = function(app) {
  var auth = require('../controllers/authController');

  app.route('/auth/login')
    .post(auth.login);

  app.route('/auth/logout')
    .get(auth.logout);
};
