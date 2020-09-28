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

function parse_headers(req) {
    const headers = {};

    req.forEach((key, value) => headers[key.toLowerCase()] = value);

    return headers;
}

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

function parse_request_data_auto(body, headers) {
    const content_type_header = headers['content-type'].split(';');
    const content_type = content_type_header[0].toLowerCase();

    switch (content_type) {
        case 'application/json':
            return JSON.parse(body);;

        case 'application/x-www-form-urlencoded':
            return parse_query(body);
    }
}

function serialize_data_for_http(data) {
    if (data == undefined) {
        return data + '';
    } else if (typeof data == 'object') {
        return JSON.stringify(data);
    } else {
        return data.toString();
    }
}

class HttpRequest {
    constructor(nat_req, nat_res) {
        this.nat_res = nat_res;

        this.method = nat_req.getMethod();
        this.path = nat_req.getUrl();
        this.headers = parse_headers(nat_req);
        this.query = parse_query(nat_req.getQuery());
    }

    get_raw_data() {
        return get_request_data_async(this.nat_res);
    }

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

class HttpResponse {
    constructor(nat_res) {
        this.nat_res = nat_res;
        this._headers = {};
    }

    abort() {
        this.nat_res.close();
    }

    cork(func) {
        this.nat_res.cork(func);
    }

    status(status) {
        if (typeof status == 'number')
            this.nat_res.writeStatus(get_status_from_code(status));
        else
            this.nat_res.writeStatus(status);
    }

    header(key, value) {
        if (typeof value == 'string') {
            this._headers[key] = value;
        } else {
            delete this._headers[key];
        }
    }

    end() {
        this.nat_res.end();
    }

    write_all(data) {
        const serialized = serialize_data_for_http(data);

        this.cork(() => {
            for (const key in this._headers)
                this.nat_res.writeHeader(key, this._headers[key]);

            this.nat_res.end(serialized);
        });
    }
}


module.exports = { parse_query, parse_headers, HttpRequest, HttpResponse };
