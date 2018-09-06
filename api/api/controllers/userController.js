'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.user_logged_in = function(req, res) {
    if (User.isloggedin(req)) {
        res.send(true);
    } else {
        console.log(req.session.user + ' is not logged in!');
        res.send(false);
    }
}

exports.register_user = function(req, res) {
    var new_user = new User(req.body);

    if (new_user.password !== new_user.passwordConf) {
        res.status(400).send("passwords don't match");
        return false;
    }
    new_user.save(function(err, task) {
        if (err) {
            res.send(err);
        }
        res.json(task);
    });
};

exports.login = function(req, res) {
    console.log(req.body);
    var login_user = new User(req.body);
    User.authenticate(login_user.email, login_user.password, function (error, user) {
        if (error || !user) {
            console.log(error);
            res.status(error.status).send(error);
        } else {
            console.log(user + ' should be logged in now!');
            req.session.user = user;
            res.send(true);
        }
    });
};

exports.logout = function(req, res) {
    if (req.session) {
        console.log(req.session.user + ' should be logged OUT now!');
        req.session.destroy(function (err) {
            if (err) {
                res.status(err.status).send(err);
                return false;
            } else {
                res.send(true);
                return true;
            }
        });
    }
};