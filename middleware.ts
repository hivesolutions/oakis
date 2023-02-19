import {
    bold,
    cyan,
    green,
    red,
    white,
    yellow,
} from "https://deno.land/std/fmt/colors.ts";

import { Context } from "https://deno.land/x/oak/mod.ts";

/**
 * The logger middleware function that can be used to display
 * information about the HTTP request that has been received.
 *
 * ```ts
 * const app = new Application();
 * app.use(logger());
 * ```
 *
 * @param options The options to be used in the parametrization
 * of the logger middleware.
 * @returns The middleware function to be used in the logging process.
 */
export function logger(
    { responseHeader = "x-response-time" } = {
        responseHeader: "x-response-time",
    },
) {
    return async (
        // deno-lint-ignore no-explicit-any
        ctx: Context<Record<string, any>>,
        next: () => Promise<unknown>,
    ) => {
        // waits for the complete execution of the request
        await next();

        // gets the response time of the current request, by gathering
        // the response time header (quick hack)
        const responseTime = ctx.response.headers.get(responseHeader);

        // obtains the status code from the status of the response,
        // converting it into a string value (for normalization purposes)
        const statusCode = ctx.response.status.toString();

        // obtains the proper color for logging of the type of
        // response that is going to be returned
        let statusColor;
        switch (Math.floor(Number(statusCode) / 100)) {
            case 2:
                statusColor = green;
                break;
            case 3:
                statusColor = yellow;
                break;
            case 4:
            case 5:
                statusColor = red;
                break;
            default:
                statusColor = white;
                break;
        }

        // logs the request using the current information, notice that colors
        // are used to better illustrate the request
        console.log(
            `${red(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${
                yellow(bold(
                    String(responseTime),
                ))
            } - ${statusColor(statusCode)}`,
        );
    };
}

export function responseTime(
    { header = "x-response-time" } = { header: "x-response-time" },
) {
    return async (
        // deno-lint-ignore no-explicit-any
        ctx: Context<Record<string, any>>,
        next: () => Promise<unknown>,
    ) => {
        const start = Date.now();
        try {
            await next();
        } finally {
            const duration = Date.now() - start;
            ctx.response.headers.set(header, `${duration}ms`);
        }
    };
}

export function handleError(
    { code = 500, message = "Server Error" } = {
        code: 500,
        message: "Server Error",
    },
) {
    return async (
        // deno-lint-ignore no-explicit-any
        ctx: Context<Record<string, any>>,
        next: () => Promise<unknown>,
    ) => {
        try {
            await next();
        } catch (err) {
            if (err.code && typeof err.code === "number") {
                code = err.code;
            }
            if (err.message && typeof err.message === "string") {
                message = err.message;
            }
            ctx.response.status = code;
            ctx.response.body = { code: code, error: message };
            ctx.response.type = "json";
        }
    };
}

export function handleNotFound(
    { code = 404, message = "Not Found" } = { code: 404, message: "Not Found" },
) {
    // deno-lint-ignore no-explicit-any
    return (ctx: Context<Record<string, any>>) => {
        ctx.response.status = code;
        ctx.response.body = { code: code, error: message };
        ctx.response.type = "json";
    };
}
