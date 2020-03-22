const {sender, type} = require('../util/sender');

exports.errorHandler = (res, error) => {
    sender.send(res, {type: type.ERROR, message: error.message, status: error.statusCode});
};
