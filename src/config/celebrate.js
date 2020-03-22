const {isCelebrate} = require('celebrate');

const {send, type} = require('../util/sender');

exports.errorHandler = (error, req, res, next) => {
    if (!isCelebrate(error)) next(error);

    const {joi} = error;
    const message = joi.details.length > 0 ? joi.details[0].message : joi.message;
    send(res, {type: type.ERROR, message: message, status: 404});
};
