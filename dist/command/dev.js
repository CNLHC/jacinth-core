"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const debounce_1 = __importDefault(require("debounce"));
const check_1 = __importDefault(require("../util/check"));
const env_1 = require("../env");
const build_1 = require("../util/build");
const logging_1 = require("../util/logging");
const server_1 = __importDefault(require("../server"));
exports.default = async (args) => {
    await check_1.default({ command: "dev" });
    await env_1.initEnv(args);
    const env = env_1.getEnv();
    const loadBFF = debounce_1.default(async () => {
        return await server_1.default();
    }, 200, true);
    const transform = debounce_1.default(async (_evt, _path) => {
        logging_1.logger.debug(`transform server file due to Event(${_evt})-${_path}`);
        await build_1.transformDir(env.serverDir, env.cacheDir);
    }, 200, true);
    logging_1.logger.debug("first build");
    await transform(env.serverDir, env.cacheDir);
    await loadBFF();
    try {
        chokidar_1.default.watch(env.cacheDir).on("change", loadBFF);
        chokidar_1.default.watch(env.serverDir).on("all", transform);
    }
    catch (e) {
        console.error("Some error occur", e.stack);
    }
};
//# sourceMappingURL=dev.js.map