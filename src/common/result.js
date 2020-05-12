class Result {
    fold({onSuccess, onFailure}) {
        if (this.isSuccess()) {
            return handleSuccess(this);
        }
        else if (this.isFailure()) {
            return handleFailure(this);
        }
        else {
            return null;
        }

        function handleSuccess(successResult) {
            if (typeof onSuccess === 'function') {
                return onSuccess(successResult.getData(), successResult);
            }
            else {
                throw Error(`Error: expected function instead got ${typeof onSuccess}`);
            }
        }

        function handleFailure(failureResult) {
            if (typeof onFailure === 'function') {
                return onFailure(failureResult);
            }
            else {
                throw Error(`Error: expected function instead got ${typeof onFailure}`);
            }
        }
    }

    isSuccess() {
        return this instanceof Success;
    }

    isFailure() {
        return this instanceof Failure;
    }

    withMessage(message) {
        this.message = message;
        return this;
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }

    getType() {
        return this.type;
    }

    setCode(code) {
        if (isNaN(code)) {
            throw Error(`Error: code must be a number. But found ${typeof code} code`);
        }

        this.code = code;
        return this;
    }

    setType(type) {
        this.type = type;
        return this;
    }
}

class Success extends Result {
    constructor(data = null, {status, message, type} = {}) {
        super();
        this.type    = type;
        this.data    = data;
        this.status  = status;
        this.message = message;
    }

    getData() {
        return this.data;
    }
}

class Failure extends Result {
    constructor({status, message} = {}) {
        super();
        this.status  = status;
        this.message = message;
    }
}

module.exports = {Success, Failure};


