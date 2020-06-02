import { bold, yellow } from "https://deno.land/std/fmt/colors.ts";

export async function logServerStart(hostname: string, port: number) {
  console.log(
    bold("Start listening on ") + yellow(`http://${hostname}:${port}`),
  );
}
