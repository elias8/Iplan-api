const {Success, Failure} = require('./result');

class Response {
    constructor(req) {
        this.req = req;
        this.sent = false;
    }

    fromResult(result) {
        if (this.sent) {
            throw 'You are trying to write after header is sent.';
        }
        if (!(result instanceof Success) && !(result instanceof Failure)) {
            throw `${result} is not instance of Success of Failure.`;
        }

        this.isSuccess = true;
        this.message = result.getMessage();

        if (result instanceof Success) {
            this.data = result.data;
        } else {
            this.isSuccess = false;
        }

        return this;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setStatusOnSuccess(status) {
        if (this.isSuccess) this.status = status;
        return this;
    }

    setStatusOnFailure(status) {
        if (!this.isSuccess) this.status = status;
        return this;
    }

    getRequest() {
        return this.req;
    }

    hasNext() {
        return this.shouldNext;
    }

    next() {
        this.sent = true;
        this.shouldNext = true;
        return this;
    }
}

const response = (res) => new Response(res);
module.exports = {response, Response};
