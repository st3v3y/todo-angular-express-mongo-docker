'use strict';

const mongoose = require('mongoose');
const OAuthClient = mongoose.model('OAuthClient');
// const OAuthScope = mongoose.model('OAuthScope');
const crypto = require('crypto');

module.exports.createClient = (req, res) => {
    console.log(req.body);

    const client = new OAuthClient(req.body);

    client.clientId = crypto.createHash('md5').update(crypto.randomBytes(16)).digest('hex'); // 32 chars
    client.clientSecret = crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('hex'); // 64 chars

    client.save()
        .then(() => res.json({ id: client }));
};
