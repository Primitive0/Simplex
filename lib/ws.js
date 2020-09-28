/*const logger = require('./logging-util').get_logger();
const http_request_util = require('./http_request_util');


function ws(handler_obj) {

}

function load_websockets(uws_app, params) {
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
    for (const route of Router._route_list) {
        logger.info(`Loading route "${route.path}"`);

        eval(`
        uws_app[route.method](route.path, async (res, req) => {
            ${params.cors ? 'await params.cors.send_cors_info(req, res);' : ''}

            let request = new http_request_util.HttpRequest(req);
            let response = new http_request_util.HttpResponse(res);

            await route.handler(request, response);
        });
        `);
    }
}


module.exports = { ws, load_websockets };*/
