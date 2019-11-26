"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("../../util/logging");
const common_1 = require("./common");
const RESTFulLoader = async (app, opt, done) => {
    const plugins = await common_1.gatherRESTRoutes(opt.cacheDir);
    plugins.forEach(async (e) => {
        delete require.cache[require.resolve(e)];
        const mod = await Promise.resolve().then(() => __importStar(require(e)));
        logging_1.logger.debug(`register custom REST api  in ${e}`);
        if (typeof mod === "function")
            app.register(mod);
        else if (typeof mod.default === "function")
            app.register(mod.default);
        else {
            const errMsg = `unknown REST api file in ${e}`;
            logging_1.logger.error(errMsg);
            done(new Error(errMsg));
        }
    });
    done();
};
exports.default = RESTFulLoader;
//# sourceMappingURL=rest.js.map