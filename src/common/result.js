class Result {
    fold({onSuccess, onFailure}) {
        if (this.isSuccess()) {
            if (typeof onSuccess === 'function') {
                return onSuccess(this.getData(), this);
            } else {
                throw Error(`Error: expected function instead got ${typeof onSuccess}`);
            }
        } else if (this.isFailure()) {
            if (typeof onFailure === 'function') {
                return onFailure(this);
            } else {
                throw Error(`Error: expected function instead got ${typeof onFailure}`);
            }
        } else {
            return null;
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


