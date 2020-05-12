const {Success, Failure} = require('./result');

class Response {
    constructor(req) {
        this.req  = req;
        this.sent = false;
    }

    fromResult(result) {
        if (this.sent) throw 'You are trying to write after header is sent.';
        if (!(result instanceof Success) && !(result instanceof Failure)) {
            throw `${result} is not instance of Success of Failure.`;
        }

        if (result.isSuccess()) this.data = result.getData();
        this.type       = result.getType();
        this.message    = result.getMessage();
        this.statusCode = result.getCode();
        return this;
    }

    getRequest() {
        return this.req;
    }

    getData() {
        return this.data;
    }

    getMessage() {
        return this.message;
    }

    getStatusCode() {
        return this.statusCode;
    }

    getType() {
        return this.type;
    }

    hasNext() {
        return this.shouldNext;
    }

    next() {
        this.sent       = true;
        this.shouldNext = true;
        return this;
    }
}

const response = (res) => new Response(res);
module.exports = {response, Response};
