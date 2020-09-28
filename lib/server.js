const uWS = require('uWebSockets.js');

const routing = require('./routing');
const logging = require('./logging-util');


let logger;

function Serv(obj) {
    check_server_params(obj);

    logging.set_logger(obj.logger);
    logger = logging.get_logger();

    run_server(obj);
}

function check_server_params(obj) {
    if (typeof obj.port != 'number')
        throw new Error('"port" member must be number');

    if (obj.logging != undefined && typeof obj.logging != 'object')
        throw new Error('"logging" member must be object');

    if (obj.cors != undefined && typeof obj.cors != 'object')
        throw new Error('"cors" member must be object');

    if (obj.init != undefined && typeof obj.init != 'function')
        throw new Error('"init" member must be function');
}

async function run_server(params) {
    const uws_app = uWS.App();

    logger.info('Initializing...');

    const task = params.init != undefined ? params.init() : undefined;

    routing.load_router(uws_app, params);

    await task;

    logger.info('Initialization successful!');


    logger.info('Starting server...');

    uws_app.listen(params.port, (socket) => {
        if (socket) {
            logger.info(`Server has started at port ${params.port}`);
        } else {
            logger.error(`Unexpected error happend!`);
        }
    });
}


module.exports = { Serv };
