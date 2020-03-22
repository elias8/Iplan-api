const log = require('../config/logger');

const ResponseType = {
    DATA: Symbol('DATA'),
    ERROR: Symbol('ERROR'),
    CUSTOM: Symbol('CUSTOM'),
    MESSAGE: Symbol('MESSAGE'),
    UNAUTHORIZED_ACCESS: Symbol('UNAUTHORIZED_ACCESS'),
    INVALID_ACCESS_TOKEN: Symbol('INVALID_ACCESS_TOKEN'),
    INTERNAL_SERVER_ERROR: Symbol('INTERNAL_SERVER_ERROR')
};

const sender = (res, {type, customData, data, message, status = 200}) => {
    switch (type) {
        case ResponseType.ERROR:
            sendError(status, message, res);
            break;
        case ResponseType.CUSTOM:
            sendCustomType(status, customData, res);
            break;
        case ResponseType.MESSAGE:
            sendMessage(status, message, res);
            break;
        case ResponseType.UNAUTHORIZED_ACCESS:
            sendUnAuthorizedAccess(res);
            break;
        case ResponseType.INVALID_ACCESS_TOKEN:
            sendInvalidAccessToken(res);
            break;
        case ResponseType.INTERNAL_SERVER_ERROR:
            sendInternalServerError(res);
            break;
        default:
        case ResponseType.DATA:
            sendData(status, data, res);
            break;
    }
};

const sendData = (statusCode, data, res) => {
    let payload = {
        success: true,
        statusCode: statusCode,
        data: data
    };

    send(statusCode, payload, res);
};

const sendMessage = (statusCode, message, res) => {
    let payload = {
        success: true,
        statusCode: statusCode,
        message: message
    };

    send(statusCode, payload, res);
};

const sendError = (statusCode, message, res) => {
    const payload = {
        success: false,
        statusCode: statusCode,
        message: message
    };

    send(statusCode, payload, res);
    log.e(payload);
};

const sendCustomType = (statusCode, payload, res) => {
    send(statusCode, payload, res);
};

const send = (statusCode, payload, res) => {
    res.status(statusCode).json(payload);
};

const sendUnAuthorizedAccess = (res) => {
    sender(res, {type: ResponseType.ERROR, status: 401, message: 'UnAuthorized Access'});
};

const sendInvalidAccessToken = (res) => {
    sender(res, {type: ResponseType.ERROR, status: 403, message: 'Invalid Access Provided'});
};

const sendInternalServerError = (res) => {
    sender(res, {type: ResponseType.ERROR, status: 500, message: 'Internal Server Error'});
};

exports.send = sender;

exports.type = ResponseType;
