import { CorsHandlerObject } from '.';


/**
 * Returns simple implementation of CORS.
 * @param allowed_methods - Allowed HTTP methods in CORS.
 * @param allowed_headers - Allowed HTTP headers in CORS.
 * @returns CORS handler object.
 */
export function default_cors_handler(
    allowed_methods: string,
    allowed_headers: string
): CorsHandlerObject;
