const logger = require('./logging-util').get_logger();
const http_request_util = require('./http_request_util');


const router = {
    _route_list: [],

    // this copy-paste should work faster than other solutions

    get(path, handler) {
        this._route_list.push({ method: 'get', path, handler });
    },

    post(path, handler) {
        this._route_list.push({ method: 'post', path, handler });
    },

    put(path, handler) {
        this._route_list.push({ method: 'put', path, handler });
    },

    delete(path, handler) {
        this._route_list.push({ method: 'del', path, handler });
    },

    head(path, handler) {
        this._route_list.push({ method: 'head', path, handler });
    },

    options(path, handler) {
        this._route_list.push({ method: 'options', path, handler });
    },

    patch(path, handler) {
        this._route_list.push({ method: 'patch', path, handler });
    },

    trace(path, handler) {
        this._route_list.push({ method: 'trace', path, handler });
    },

    any(path, handler) {
        this._route_list.push({ method: 'any', path, handler });
    }
};

function load_router(uws_app, params) {
    logger.info('Loading routes...');

    if (params.cors != undefined)
        load_cors_handler(uws_app, params);

    load_routes(uws_app, params);
}

function load_cors_handler(uws_app, params) {
    logger.info('Loading cors handler...');

    uws_app.options('/*', async (res, req) => {
        await params.cors.response_cors_req(req, res);
    });
}

function load_routes(uws_app, params) {
    for (const route of router._route_list) {
        logger.info(`Loading route "${route.path}"`);  //TODO: optimize functions

        eval(`
        uws_app[route.method](route.path, async (res, req) => {
            res.onAborted(() => {});  //TODO: abort handler

            ${params.cors ? 'await params.cors.add_cors_info(req, res);' : ''}

            let request = new http_request_util.HttpRequest(req, res);
            let response = new http_request_util.HttpResponse(res);

            await route.handler(request, response);
        });
        `);
    }
}


module.exports = { router, load_router };
