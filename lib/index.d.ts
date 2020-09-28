export type StringToStringMap = { [key: string]: string; };
export type RequestDataType = 'json' | 'urlencoded' | undefined;
export type UndefinedLike = undefined | null;

export interface LoggerLike {
    info(data: any): void;
    warn(data: any): void;
    error(data: any): void;
}

export interface CorsHandlerObject {
    response_cors_req(req: any, res: any): void;
    response_cors_req(req: any, res: any): Promise<void>;
    add_cors_info(req: any, res: any): void;
    add_cors_info(req: any, res: any): Promise<void>;
}


export class HttpRequest {
    constructor(nat_req: any, nat_res: any);

    method: string;
    path: string;
    headers: StringToStringMap;
    query: StringToStringMap;

    get_raw_data(): Promise<string>;
    get_data(type: RequestDataType): Promise<StringToStringMap>;
}

export class HttpResponse {
    constructor(nat_res: any);

    abort(): void;
    cork(func: () => void): void;
    status(status: number | string): void;
    header(key: string, value: string): void;
    end(): void;
    write_all(data: any): void;
}

export type RequestHandler = (req: HttpRequest, res: HttpResponse) => void;


export interface Router {
    get(path: string, handler: RequestHandler): void;
    post(path: string, handler: RequestHandler): void;
    put(path: string, handler: RequestHandler): void;
    delete(path: string, handler: RequestHandler): void;
    head(path: string, handler: RequestHandler): void;
    options(path: string, handler: RequestHandler): void;
    patch(path: string, handler: RequestHandler): void;
    trace(path: string, handler: RequestHandler): void;
    any(path: string, handler: RequestHandler): void;
}

export const router: Router;


export type InitFunction = () => Promise<void> | void;

export interface ServerParams {
    port: number;
    logging: LoggerLike | UndefinedLike;
    cors: CorsHandlerObject | UndefinedLike;
    init: InitFunction | UndefinedLike;
}

export function Serv(params: ServerParams): void


export interface SimplexUtil {
    default_cors_handler(allowed_methods: string, allowed_headers: string): CorsHandlerObject;
}

export const util: SimplexUtil
