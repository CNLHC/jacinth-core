"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("../../util/path");
const logging_1 = require("../../util/logging");
const RESTFulLoader = async (app, opt, done) => {
    const gatherRESTRoutes = async () => await path_1.gatherFile(opt.cacheDir, ["*.js"]);
    const plugins = await gatherRESTRoutes();
    plugins.forEach(e => {
        delete require.cache[require.resolve(e)];
        const mod = require(e);
        const opt = {
            prefix: "/api"
        };
        logging_1.logger.debug(`register custom REST api  in ${e}`);
        if (typeof mod === "function")
            app.register(mod, opt);
        else if (typeof mod.default === "function")
            app.register(mod.default, opt);
        else {
            const errMsg = `unknown REST api file in ${e}`;
            logging_1.logger.error(errMsg);
            done(new Error(errMsg));
        }
    });
    done();
};
exports.default = RESTFulLoader;
//# sourceMappingURL=index.js.map