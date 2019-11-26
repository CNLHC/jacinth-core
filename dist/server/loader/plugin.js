"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const logging_1 = require("../../util/logging");
const common_1 = require("./common");
const RESTFulLoader = async (app, opt, done) => {
    const plugins = await common_1.gatherRESTRoutes(opt.cacheDir);
    plugins.forEach(async (e) => {
        delete require.cache[require.resolve(e)];
        const getMod = async () => {
            try {
                return await Promise.resolve().then(() => __importStar(require(e)));
            }
            catch (e) {
                logging_1.logger.error(`plugin in ${e} can not be load, cb:`, e);
                return undefined;
            }
        };
        const mod = await getMod();
        if (!mod) {
            const errMsg = `can not load plugin due to plugin import error: ${e}`;
            logging_1.logger.error(errMsg);
            done(new Error(errMsg));
            return;
        }
        logging_1.logger.debug(`register custom plugin  in ${e}`);
        try {
            if (typeof mod === "function")
                app.register(fastify_plugin_1.default(mod), opt);
            else if (typeof mod.default === "function")
                app.register(fastify_plugin_1.default(mod.default), opt);
            else {
                const errMsg = `unknown plugin file in ${e}`;
                logging_1.logger.error(errMsg);
                done(new Error(errMsg));
            }
        }
        catch (e) {
            const errMsg = `can not load plugin due to register error: ${e}`;
            logging_1.logger.error(errMsg);
            done(new Error(errMsg));
            return;
        }
    });
    done();
    return app;
};
exports.default = fastify_plugin_1.default(RESTFulLoader);
//# sourceMappingURL=plugin.js.map