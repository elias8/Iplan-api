class ErrorResult {
    constructor({message, status}) {
        this.status = status;
        this.message = message;
    }
}

class SuccessResult {
    constructor({data, type, status, message}) {
        this.data = data;
        this.type = type;
        this.status = status;
        this.message = message;
    }
}

function fold({onSuccess, onError}) {
    if (this instanceof SuccessResult) {
        return onSuccess(this.data, this);
    } else if (this instanceof ErrorResult) {
        return onError(this);
    }
}

function isError() {
    return this instanceof ErrorResult;
}

function isSuccess() {
    return this instanceof SuccessResult;
}


function withMessage(message) {
    this.message = message;
    return this;
}

ErrorResult.prototype.fold = fold;
ErrorResult.prototype.isError = isError;
ErrorResult.prototype.isSuccess = isSuccess;
ErrorResult.prototype.withMessage = withMessage;

SuccessResult.prototype.fold = fold;
SuccessResult.prototype.isError = isError;
SuccessResult.prototype.isSuccess = isSuccess;
SuccessResult.prototype.withMessage = withMessage;


module.exports = {
    ErrorResult,
    SuccessResult
};


