import { bold, yellow } from "./deps.ts";

export function logServerStart(
    hostname: string | undefined,
    port: number | undefined,
) {
    console.log(
        bold("Start listening on ") + yellow(`http://${hostname}:${port}`),
    );
}
