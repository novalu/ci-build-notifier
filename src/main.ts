import "reflect-metadata";
import container from "./di/container";
import TYPES from "./di/types";
import PrettyError from "pretty-error";

import { App } from "./App";

async function start(): Promise<App> {
    const app = container.get<App>(TYPES.App);
    const started = await app.start();
    return started ? app : undefined;
}

(async () => {
    let app;
    try {
        app = await start();
    } catch (err) {
        const msg = "Cannot start application";
        if (app) {
            app.logger.fatal(msg, err);
        } else {
            const pe = new PrettyError();
            // tslint:disable-next-line:no-console
            console.error(`${msg}, error: ${pe.render(err)}`);
        }
    }
})();