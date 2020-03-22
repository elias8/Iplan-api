'use strict';

const logger = require('./logger');
const mongoose = require('mongoose');
const {mongo, env} = require('./variables');
const mongooseHidden = require('mongoose-hidden');

mongoose.Promise = Promise;

if (env === 'development') {
    mongoose.set('debug', true);
}

mongoose.set('useCreateIndex', true);

mongoose.plugin(mongooseHidden({
    defaultHidden: {'_id': false, password: true, pin: true, '__v': true}
}));

mongoose.connection.on('connected', () => {
    logger.i('Database Connected.');
});

mongoose.connection.on('error', err => {
    logger.e(`Database Connection Failed. ${err}`);
});

exports.connect = async () => {
    await mongoose.connect(mongo.uri, {
        keepAlive: 1,
        useNewUrlParser: true,
    });
    return mongoose.connection;
};
