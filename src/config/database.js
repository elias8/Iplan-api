'use strict';

const log = require('./logger');
const database = require('mongoose');
const mongooseHidden = require('mongoose-hidden');

function makeDatabase() {
    return Object.freeze({connect});

    async function connect(url) {
        if (process.env.NODE_ENV === 'development') database.set('debug', true);
        const mongooseOptions = {keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true};
        const mongooseHiddenOption = {defaultHidden: {'_id': false, password: true, '__v': true}};
        const hiddenPlugin = mongooseHidden(mongooseHiddenOption);

        database.Promise = Promise;
        database.set('useCreateIndex', true);
        database.plugin(hiddenPlugin);
        database.connection.on('connected', () => log.i('Database Connected.'));

        try {
            await database.connect(url, mongooseOptions);
            return database.connection;
        } catch (e) {
            log.e('Unable to connect the database. Please check the database is up and running. Or the connection string.');
            return false;
        }
    }
}

module.exports = () => makeDatabase();
