import { bold, yellow } from "https://deno.land/std/fmt/colors.ts";

export function logServerStart(
  hostname: string | undefined,
  port: number | undefined,
) {
  console.log(
    bold("Start listening on ") + yellow(`http://${hostname}:${port}`),
  );
}
