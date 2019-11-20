"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const path_1 = require("../../util/path");
const logging_1 = require("../../util/logging");
const RESTFulLoader = async (app, opt, done) => {
    const gatherRESTRoutes = async () => await path_1.gatherFile(opt.cacheDir, ["**", "!(_)*.js"]);
    const plugins = await gatherRESTRoutes();
    plugins.forEach(e => {
        delete require.cache[require.resolve(e)];
        const mod = require(e);
        logging_1.logger.debug(`register custom plugin  in ${e}`);
        if (typeof mod === "function")
            app.register(fastify_plugin_1.default(mod), opt);
        else if (typeof mod.default === "function")
            app.register(fastify_plugin_1.default(mod.default), opt);
        else {
            const errMsg = `unknown REST plugin file in ${e}`;
            logging_1.logger.error(errMsg);
            done(new Error(errMsg));
        }
    });
    done();
    return app;
};
exports.default = fastify_plugin_1.default(RESTFulLoader);
//# sourceMappingURL=plugin.js.map