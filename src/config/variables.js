'use strict';

require('dotenv').config();

const env = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    baseUrl: process.env.BASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    mongo: {
        uri: process.env.NODE_ENV === 'test'
            ? process.env.MONGO_URI_TESTS
            : process.env.MONGO_URI,
    }
};

module.exports = env;
