const {ErrorResult} = require("./result");
const {SuccessResult} = require("./result");
const {send, type} = require("../util/sender");

class Response {
    constructor(res) {
        this.res = res;
        this.sent = false;
    }

    fromResult(result) {
        if (this.sent) {
            throw 'You are trying to write after header is sent.';
        }
        if (!(result instanceof SuccessResult) && !(result instanceof ErrorResult)) {
            throw `${result} is not instance of SuccessResult of ErrorResult.`;
        }

        this.isSuccess = true;
        this.status = result.status;
        this.message = result.message;

        if (result instanceof SuccessResult) {
            this.data = result.data;
            this.type = result.type;
        } else {
            this.isSuccess = false;
        }

        return this;
    }

    withType(type) {
        this.type = type;
        return this;
    }

    withSuccessStatus(status) {
        if (this.isSuccess && !this.status) {
            this.status = status;
        }
        return this;
    }

    withErrorStatus(status) {
        if (!this.isSuccess && !this.status) {
            this.status = status;
        }
        return this;
    }

    end() {
        this.sent = true;

        if (this.isSuccess) {
            send(this.res, {data: this.data, message: this.message, type: this.type, status: this.status});
        } else {
            send(this.res, {type: type.ERROR, message: this.message, status: this.status});
        }
    }
}

exports.response = (res) => new Response(res);


