'use strict';

var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks'),
  User = mongoose.model('User');

exports.list_all_tasks = function(req, res) {
  Task.find({ createdBy: req.session.user._id }, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.createdBy = req.session.userId;
  new_task.save(function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.find({_id: req.params.taskId, createdBy: req.session.userId}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({
    _id: req.params.taskId, 
    createdBy: req.session.userId
  }, req.body, {new: true}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.delete_a_task = function(req, res) {
  Task.remove({
    _id: req.params.taskId,
    createdBy: req.session.userId
  }, function(err, task) {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Task successfully deleted' });
  });
};