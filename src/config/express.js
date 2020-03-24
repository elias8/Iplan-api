'use strict';

const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const compression = require('compression');
const bearerToken = require('express-bearer-token');

const router = require('../routes');
const log = require('../config/logger');
const {errorHandler} = require('./celebrate');
const baseUrl = process.env.BASE_URL;

const app = express();

log(app);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(baseUrl, router);

app.use(errorHandler);

module.exports = app;
