'use strict';

var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks');

exports.list_all_tasks = function(req, res) {
  const userId = getUserId(req);

  Task.find({ createdBy: userId }, function(err, task) {
    if (err) {
      res.json(err);
    }
    res.json(task);
  });
};

exports.create_a_task = function(req, res) {
  const userId = getUserId(req);

  var new_task = new Task(req.body);
  new_task.createdBy = userId;
  new_task.save(function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

function getUserId(req){
  return req.user._id;
}

exports.read_a_task = function(req, res) {
  const userId = getUserId(req);

  Task.find({_id: req.params.taskId, createdBy: userId}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.update_a_task = function(req, res) {
  const userId = getUserId(req);

  Task.findOneAndUpdate({
    _id: req.params.taskId, 
    createdBy: userId
  }, req.body, {new: true}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.delete_a_task = function(req, res) {
  const userId = getUserId(req);

  Task.remove({
    _id: req.params.taskId,
    createdBy: userId
  }, function(err, task) {
    if (err){
      res.send(err);
    }
    res.json({ message: 'Task successfully deleted' });
  });
};