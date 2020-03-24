'use strict';

const {Joi, celebrate} = require('celebrate');

const statusMessage = 'Task status should only be one of this [ Completed, Incomplete, InProgress ].';

exports.validateTask = celebrate({
    body: Joi.object({
        title: Joi.string().required(),
        status: Joi.string()
            .regex(/^(Completed|Incomplete|InProgress)$/)
            .required()
            .error(() => statusMessage),
        note: Joi.string(),
    }),
});

exports.validateTaskUpdates = celebrate({
    body: Joi.object({
        note: Joi.string(),
        title: Joi.string(),
        status: Joi.string()
            .regex(/^(Completed|Incomplete|InProgress)$/)
            .error(() => statusMessage),
    }),
});

exports.validateTaskId = celebrate({
    params: {
        id: Joi.string()
            .regex(new RegExp('^[0-9a-fA-F]{24}'))
            .error(() => `Invalid task id`)
    }
});
