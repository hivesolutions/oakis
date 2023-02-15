import { bold, cyan, red, yellow } from "https://deno.land/std/fmt/colors.ts";

import { Context } from "https://deno.land/x/oak/mod.ts";

/**
 * The logger method that can be used to display information about
 * the HTTP request that has been received.
 *
 * ```ts
 * const app = new Application();
 * app.use(logger);
 * ```
 *
 * @param ctx The context of the current execution.
 * @param next The next element to be used in the middleware.
 */
export async function logger(
  // deno-lint-ignore no-explicit-any
  ctx: Context<Record<string, any>>,
  next: () => Promise<unknown>,
) {
  // waits for the complete execution of the request
  await next();

  // gets the response time of the current request, by gathering
  // the response time header (quick hack)
  const responseTime = ctx.response.headers.get("x-response-time");

  // logs the request using the current information, notice that colors
  // are used to better illustrate the request
  console.log(
    `${red(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${
      yellow(bold(
        String(responseTime),
      ))
    }`,
  );
}

export async function responseTime(
  // deno-lint-ignore no-explicit-any
  ctx: Context<Record<string, any>>,
  next: () => Promise<unknown>,
) {
  const start = Date.now();
  try {
    await next();
  } finally {
    const duration = Date.now() - start;
    ctx.response.headers.set("x-response-time", `${duration}ms`);
  }
}

export function handleError(code = 500, message = "Server Error") {
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

export function handleNotFound(code = 404, message = "Not found") {
  // deno-lint-ignore no-explicit-any
  return (ctx: Context<Record<string, any>>) => {
    ctx.response.status = code;
    ctx.response.body = { code: code, error: message };
    ctx.response.type = "json";
  };
}
