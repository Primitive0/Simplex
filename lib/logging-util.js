// WARNING! This util is internal api. Don't use this functions to log your events.

const STUB_FUNCTION = () => { };

let _logger = {};

function set_logger(logger_obj) {
    if (logger_obj == undefined) {
        _logger = {
            info: STUB_FUNCTION,
            warn: STUB_FUNCTION,
            error: STUB_FUNCTION
        };
    }

    _logger.info = logger_obj.info == undefined ? STUB_FUNCTION : logger_obj.info.bind(logger_obj);
    _logger.warn = logger_obj.warn == undefined ? STUB_FUNCTION : logger_obj.warn.bind(logger_obj);
    _logger.error = logger_obj.error == undefined ? STUB_FUNCTION : logger_obj.error.bind(logger_obj);
}

function get_logger() {
    return _logger;
}


module.exports = { set_logger, get_logger };
