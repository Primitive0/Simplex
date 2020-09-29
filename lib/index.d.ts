import { HttpRequest, HttpResponse } from './http_request_util';


export type StringToStringMap = { [key: string]: string; };
export type StringToObjectMap = { [key: string]: any; };
export type UndefinedLike = undefined | null;


export interface CorsHandlerObject {
    response_cors_req(req: any, res: any): void;
    response_cors_req(req: any, res: any): Promise<void>;
    add_cors_info(req: any, res: any): void;
    add_cors_info(req: any, res: any): Promise<void>;
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

/**
 * This is the way you can add routes in your API.
 * @example
 * //adds route on "/foo"
 * router.get('/foo', (req, res) => {
 *     res.write_all('Hello, world!');
 * });
 */
export const router: Router;


export type InitFunction = () => Promise<void> | void;

export interface LoggerLike {
    info(data: any): void;
    warn(data: any): void;
    error(data: any): void;
}

export interface ServerParams {
    port: number;
    logging: LoggerLike | UndefinedLike;
    cors: CorsHandlerObject | UndefinedLike;
    init: InitFunction | UndefinedLike;
}

/**
 * Initializes and launches API server via params.
 * @param params - Configuration of the server.
 */
export function Serv(params: ServerParams): void;


export * as util from './util';
