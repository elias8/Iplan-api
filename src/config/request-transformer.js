const {response} = require("../../src/common/response");

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

        const result = await controller(request);
        if (result.hasNext) {
            req.body = result.body;
            req.path = result.path;
            req.query = result.query;
            req.params = result.params;
            req.method = result.method;
            return next();
        }

        response(res).fromResult(result).end();
    };
};
