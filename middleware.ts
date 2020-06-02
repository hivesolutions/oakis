import {
    cyan,
    bold,
    yellow,
    red,
  } from "https://deno.land/std/fmt/colors.ts";
  
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
    ctx: Context<Record<string, any>>,
    next: () => Promise<void>,
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
    ctx: Context<Record<string, any>>,
    next: () => Promise<void>,
  ) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("x-response-time", `${ms}ms`);
  }
  