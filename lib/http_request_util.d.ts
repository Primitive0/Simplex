import { StringToStringMap } from '.';


export function parse_query(raw_query: string): StringToStringMap;
export function parse_headers(req: any): StringToStringMap;
export function get_request_data_async(res: any): string;
export function parse_request_data_auto(body: string, headers: StringToStringMap): any;
export function serialize_data_for_http(data: any): string;


export type RequestDataType = 'json' | 'urlencoded';

export class HttpRequest {
    constructor(nat_req: any, nat_res: any);

    method: string;
    path: string;
    headers: StringToStringMap;
    query: StringToStringMap;

    get_raw_data(): Promise<string>;
    get_data(type: RequestDataType | undefined): Promise<StringToStringMap>;
}

export class HttpResponse {
    constructor(nat_res: any);

    abort(): void;
    cork(func: () => void): void;
    status(status: number | string): void;
    header(key: string, value: string | undefined): void;
    end(): void;
    write_all(data: any): void;
}
