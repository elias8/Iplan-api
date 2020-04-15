class Result {
    fold({onSuccess, onFailure}) {
        if (this.isSuccess()) {
            return handleSuccess(this);
        } else if (this.isFailure()) {
            return handleFailure();
        } else {
            return null;
        }

        function handleSuccess(successResult) {
            if (typeof onSuccess === 'function') {
                return onSuccess(successResult.getData(), successResult);
            } else {
                throw Error(`Error: expected function instead got ${typeof onSuccess}`);
            }
        }

        function handleFailure(failureResult) {
            if (typeof onFailure === 'function') {
                return onFailure(failureResult);
            } else {
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

    getMessage() {
        return this.message;
    }
}

class Success extends Result {
    constructor(data = null, {message} = {}) {
        super();
        this.data = data;
        this.message = message;
    }

    getData() {
        return this.data;
    }
}

class Failure extends Result {
    constructor(message = null) {
        super();
        this.message = message;
    }
}

module.exports = {Success, Failure};


