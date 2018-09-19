'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/todoListController');
  var authController = require('../controllers/authController');

  // todoList Routes
  app.route('/tasks/')
    .get(authController.authenticate, todoList.list_all_tasks)
    .post(authController.authenticate, todoList.create_a_task);

  app.route('/tasks/:taskId')
    .get(authController.authenticate, todoList.read_a_task)
    .put(authController.authenticate, todoList.update_a_task)
    .delete(authController.authenticate, todoList.delete_a_task);
};