import { StringToStringMap, StringToObjectMap, UndefinedLike } from '.';


/**
 * Parse URL encoded string into key-value (map) object.
 * @param raw_query - Raw query.
 * @returns String-to-string map.
 */
export function parse_query(raw_query: string): StringToStringMap;

/**
 * Parse headers from HTTP request into key-value (map) object.
 * Headers keys are saved in lowercase.
 * @param req - uWebSockets HTTP request.
 * @returns String-to-string map.
 */
export function parse_headers(req: any): StringToStringMap;

/**
 * Gets HTTP request data asynchronously using uWebSockets HTTP response.
 * If there is no data, this function returns null.
 * @param res - uWebSockets HTTP response object.
 * @returns Body.
 */
export function get_request_data_async(res: any): Promise<string | null>;

/**
 * Detects data type and translates HTTP request raw data (string) into key-value (map) object.
 * If function cannot detect data type, it returns null.
 * @param body - HTTP request data body.
 * @param headers - HTTP request headers. It's necessary for autodetect.
 * @returns Data map.
 */
export function parse_request_data_auto(body: string, headers: StringToStringMap): StringToObjectMap | null;

/**
 * Serializes any JS object (string, number, object, etc).
 * @param data - Any JS object for serialization.
 * @returns Serialized string.
 */
export function serialize_data_for_http(data: any): string;

/**
 * Translates HTTP status code to its string presence.
 * If cannot find the code, function converts it to string and returns.
 * @param code - HTTP status code number.
 * @returns HTTP status code string.
*/
export function get_status_from_code(code: number): string;


export type RequestDataType = 'json' | 'urlencoded';

/**
 * This is a simple wrapper of uWebSockets object.
 * @class
 */
export class HttpRequest {
    /**
     * Constructs wrapper using uWebSockets objects.
     * @param nat_req - uWebSockets HTTP request.
     * @param nat_res - uWebSockets HTTP response.
     */
    constructor(nat_req: any, nat_res: any);


    /**
     * HTTP method (GET, POST, etc) of request.
     */
    method: string;

    /** 
     * Path of HTTP request.
     * For example "/foo/bar", "/abc".
    */
    path: string;

    /**
     * HTTP request headers.
     */
    headers: StringToStringMap;

    /**
     * HTTP request query.
     */
    query: StringToStringMap;


    /**
     * @returns Raw HTTP request data. Can return null.
     * @see get_request_data_async
     */
    get_raw_data(): Promise<string>;

    /**
     * Returns HTTP request data.
     * In any case, when data is wrong, returns null.
     * Has 2 working modes.
     * If type is undefined, function autodetects type of data and parse this data.
     * But when type is specified, it tries to parse data according the type,
     * and if data type is different from specified, the function returns null. (or even wrong result)
     * @param type - Parsing type.
     */
    get_data(type: RequestDataType | UndefinedLike): Promise<StringToObjectMap | null>;
}


/**
 * This is a simple wrapper of uWebSockets object.
 * @class
 */
export class HttpResponse {
    /**
     * Constructs wrapper using uWebSockets objects.
     * @param nat_res - uWebSockets HTTP response.
     */
    constructor(nat_res: any);


    /**
     * Aborts request.
     * You must not try to response after calling this function.
     */
    abort(): void;

    /**
     * @param func - Cork function.
     * @see {@link https://unetworking.github.io/uWebSockets.js/generated/interfaces/httpresponse.html#cork}
     */
    cork(func: () => void): void;

    /**
     * Writes HTTP response status.
     * You can use HTTP status code or string for custom status.
     */
    status(status: number | string): void;

    /**
     * Writes HTTP headers.
     * If value type isn't string, it removes header by key.
     * @param key - Header key.
     * @param value - Header value.
     */
    header(key: string, value: string | undefined): void;

    /**
     * Sends written response to server.
     * You must not try to write something into response after calling this function.
     */
    end(): void;

    /**
     * A simpler way to send data.
     * Serializes data into string and sends it.
     * @param data 
     * @see HttpResponse#end
     */
    write_all(data: any): void;
}
