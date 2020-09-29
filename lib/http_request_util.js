/**
 * Parse URL encoded string into key-value (map) object.
 * @param {string} raw_query - Raw query.
 * @returns {{ [key: string]: string }} String-to-string map.
 */
function parse_query(raw_query) {
    const query = {};

    for (const pair of raw_query.split('&')) {
        if (!pair) continue;

        const eqPos = pair.indexOf('=');

        const key = decodeURIComponent(pair.slice(0, eqPos));

        if (~eqPos) {  // eqPos != -1
            const value = decodeURIComponent(pair.slice(eqPos + 1));
            query[key] = value;
        } else {
            query[key] = true;
        }
    }

    return query;
}

/**
 * Parse headers from HTTP request into key-value (map) object.
 * Headers keys are saved in lowercase.
 * @param {any} req - uWebSockets HTTP request.
 * @returns {{ [key: string]: string }} String-to-string map.
 */
function parse_headers(req) {
    const headers = {};

    req.forEach((key, value) => headers[key.toLowerCase()] = value);

    return headers;
}

/**
 * Gets HTTP request data asynchronously using uWebSockets HTTP response.
 * If there is no data, this function returns null.
 * @async
 * @param {any} res - uWebSockets HTTP response object.
 * @returns {string | null} Body.
 */
function get_request_data_async(res) {
    let body_buf = Buffer.alloc(0);

    return new Promise((resolve) => {
        res.onData((chunk, is_last) => {
            body_buf = Buffer.concat([body_buf, Buffer.from(chunk)]);

            if (is_last) {
                if (body_buf.length == 0)
                    return resolve(null);

                resolve(body_buf.toString());
            }
        });
    });
}

/**
 * Detects data type and translates HTTP request raw data (string) into key-value (map) object.
 * If function cannot detect data type, it returns null.
 * @param {string} body - HTTP request data body.
 * @param {{ [key: string]: string }} headers - HTTP request headers. It's necessary for autodetect.
 * @returns {any} Data map.
 */
function parse_request_data_auto(body, headers) {  //TODO: optimize
    const content_type_header = headers['content-type'].split(';');
    const content_type = content_type_header[0].toLowerCase();

    switch (content_type) {
        case 'application/json':
            return JSON.parse(body);;

        case 'application/x-www-form-urlencoded':
            return parse_query(body);

        //multipart parsing
    }

    return null;
}

/**
 * Serializes any JS object (string, number, object, etc).
 * @param {any} data - Any JS object for serialization.
 * @returns {string} Serialized string.
 */
function serialize_data_for_http(data) {
    if (data == undefined) {
        return data + '';
    } else if (typeof data == 'object') {
        return JSON.stringify(data);
    } else {
        return data.toString();
    }
}

/**
 * This is a simple wrapper of uWebSockets object.
 * @class
 */
class HttpRequest {
    /**
     * Constructs wrapper using uWebSockets objects.
     * @param {any} nat_req - uWebSockets HTTP request.
     * @param {any} nat_res - uWebSockets HTTP response.
     */
    constructor(nat_req, nat_res) {
        this.nat_res = nat_res;

        this.method = nat_req.getMethod();
        this.path = nat_req.getUrl();
        this.headers = parse_headers(nat_req);
        this.query = parse_query(nat_req.getQuery());
    }

    /**
     * @async
     * @returns {string} Raw HTTP request data. Can return null.
     * @see get_request_data_async
     */
    get_raw_data() {
        return get_request_data_async(this.nat_res);
    }

    /**
     * Returns HTTP request data.
     * In any case, when data is wrong, returns null.
     * Has 2 working modes.
     * If type is undefined, function autodetects type of data and parse this data.
     * But when type is specified, it tries to parse data according the type,
     * and if data type is different from specified, the function returns null. (or even wrong result)
     * @async
     * @param {import('.').RequestDataType} type - Parsing type.
     * @returns {{ [key: string]: any }}
     */
    async get_data(type) {
        const raw_data = await get_request_data_async(this.nat_res);

        if (raw_data == null)
            return raw_data;

        try {
            switch (type) {
                case 'json':
                    return JSON.parse(raw_data);

                case 'urlencoded':
                    return parse_query(raw_data);

                default:
                    return parse_request_data_auto(raw_data, this.headers);
            }
        } catch {
            return null;
        }
    }
};

/**
 * This is a simple wrapper of uWebSockets object.
 * @class
 */
class HttpResponse {
    /**
     * Constructs wrapper using uWebSockets objects.
     * @param {any} nat_res - uWebSockets HTTP response.
     */
    constructor(nat_res) {
        this.nat_res = nat_res;
        this._headers = {};
    }

    /**
     * Aborts request.
     * You must not try to response after calling this function.
     */
    abort() {
        this.nat_res.close();
    }

    /**
     * @param {() => void} func - Cork function.
     * @see {@link https://unetworking.github.io/uWebSockets.js/generated/interfaces/httpresponse.html#cork}
     */
    cork(func) {
        this.nat_res.cork(func);
    }

    /**
     * Writes HTTP response status.
     * You can use HTTP status code or string for custom status.
     * @param {number | string} status
     */
    status(status) {
        if (typeof status == 'number')
            this.nat_res.writeStatus(get_status_from_code(status));
        else
            this.nat_res.writeStatus(status);
    }

    /**
     * Writes HTTP headers.
     * If value type isn't string, it removes header by key.
     * @param {string} key - Header key.
     * @param {string} value - Header value.
     */
    header(key, value) {
        if (typeof value == 'string') {
            this._headers[key] = value;
        } else {
            delete this._headers[key];
        }
    }

    /**
     * Sends written response to server.
     * You must not try to write something into response after calling this function.
     */
    end() {
        this.nat_res.end();
    }
    
    /**
     * A simpler way to send data.
     * Serializes data into string and sends it.
     * @see HttpResponse#end
     * @param {any} data 
     */
    write_all(data) {
        const serialized = serialize_data_for_http(data);

        this.nat_res.cork(() => {
            for (const key in this._headers)
                this.nat_res.writeHeader(key, this._headers[key]);

            this.nat_res.end(serialized);
        });
    }
}


module.exports = { parse_query, parse_headers, HttpRequest, HttpResponse };
