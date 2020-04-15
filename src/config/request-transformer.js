const {send} = require('../util/sender');
const {Response} = require('../common/response');

module.exports = function requestTransformer(controller) {
    return async (req, res, next) => {
        const request = {
            body: req.body,
            path: req.path,
            query: req.query,
            params: req.params,
            method: req.method,
            headers: {
                'User-Agent': req.get('User-Agent'),
                'Content-Type': req.get('Content-Type'),
            }
        };

        const response = await controller(request);

        if (response instanceof Response) {
            if (response.hasNext()) {
                const request = response.getRequest();
                req.body = request.body;
                req.path = request.path;
                req.query = request.query;
                req.params = request.params;
                req.method = request.method;
                return next();
            }
        } else {
            if (response.hasNext) {
                req.body = response.body;
                req.path = response.path;
                req.query = response.query;
                req.params = response.params;
                req.method = response.method;
                return next();
            }
        }

        send(res, {data: response.data, type: response.type, status: response.status, message: response.message});
    };
};
