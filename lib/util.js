const default_cors_handler = (allowed_methods, allowed_headers) => ({  //TODO: some optimizations
    response_cors_req(req, res) {
        res.cork(() => {
            res.writeStatus('200 OK');

            res.writeHeader('Access-Control-Allow-Methods', allowed_methods);
            res.writeHeader('Access-Control-Allow-Headers', allowed_headers);
            res.writeHeader('Access-Control-Max-Age', '86400');
            res.writeHeader('Access-Control-Allow-Origin', req.getHeader('origin'));

            res.end();
        });
    },

    add_cors_info(req, res) {
        res.writeHeader('Access-Control-Allow-Origin', req.getHeader('origin'));
        res.writeHeader('Access-Control-Expose-Headers', allowed_headers);
    }
});


module.exports = { default_cors_handler };
