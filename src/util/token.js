'use strict';
const moment = require('moment');
const jwt = require('jsonwebtoken');
const tokenSecret = process.env.JWT_SECRET;
// const tokenDuration = process.env.TOKEN_DURATION_IN_DAYS;

exports.generateToken = (user) => {
    const data = {id: user._id, createdAt: user.createdAt};
    return jwt.sign(data, tokenSecret);
};

exports.isTokenExpired = (token) => {
    return moment(Date.now()).isSameOrBefore(moment(token.createdAt));
};
