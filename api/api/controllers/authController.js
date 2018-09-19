'use strict';

const request = require('request'),
    requestp = require('request-promise'),
    config = require('../../config');

module.exports.authenticate = function(req, res, next){
    var options = {
        method: 'POST',
        uri: 'http://auth:3099/oauth/authenticate',
        headers: {
            'Authorization' : req.headers['authorization']
        },
        json : true
    };

    return requestp(options).then((resp) => {
        req.user = resp.user.user;
        next();
    }).catch((error) => {
        console.log(error);
        res.send(403);
    });
};

exports.login = function(req, res) {
    requestp({
        method: 'POST',
        uri: 'http://auth:3099/user/login', // TODO: centralize
        body: req.body,
        json: true
    })
    .then(function (user) {
        if(!user || !user.token) {
            return;
        }

        var codePostOptions = {
            method: 'POST',
            uri: 'http://auth:3099/oauth/authorize', // TODO: centralize
            qs: {
                response_type:'code',
                client_id: config.CLIENT_ID,
                redirect_uri:'http://localhost:4200',
                scope: 'admin',
                state: 'auth'
            },
            headers: { 'x-access-token' : user.token },
            json: true
        };

        if(!config.IS_SILENT_AUTH){
            request(codePostOptions).on('error', function(err) {
                console.log(err);
            })
            .pipe(res);
        } else {
            requestAuthCode(req, res, codePostOptions);
        }
    })
    .catch(function (err) {
        console.log(err);
        res.status(422).send(err.message);
    });
};

function requestAuthCode(req, res, options){
    requestp(options)
        .then((authorizationCode) => {
            requestToken(req, res, authorizationCode);
        })
        .catch(function (err) {
            console.log(err);
            res.status(422).send(err);
        });
}

function requestToken(req, res, authorizationCode){
    var tokenPostOptions = { 
        url: 'http://auth:3099/oauth/token', // TODO: centralize
        form: {
            client_id: config.CLIENT_ID,
            client_secret: config.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: authorizationCode.code.authorizationCode, 
            redirect_uri: 'http://localhost:4200'
        },
    };

    request.post(tokenPostOptions).pipe(res);
}

exports.logout = function(req, res) {
    res.status(200).send({ auth: false, token: null });
};