'use strict';
var request = require('request');

exports.register_user = function(req, res) {
    //Redirect to auth server
    var url = 'http://auth:3099/user/register'; // TODO centralize
    request.post(url).form(req.body).on('error', function(err) {
        console.log(err);
    }).pipe(res);
};
