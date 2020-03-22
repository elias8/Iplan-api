'use strict';

const Joi = require('@hapi/joi');

const validator = {};

validator.validate = (value, schema) => {
    const result = Joi.validate(value, schema);

    if (result.error) {
        validator.message = result.error.details[0].message;
    }

    validator.hasError = result.error;
    return result;
};

exports.validator = validator;
exports.Joi = Joi;
