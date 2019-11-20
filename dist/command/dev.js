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
    check_1.default({ command: "dev" });
    env_1.initEnv(args);
    const env = env_1.getEnv();
    const loadBFF = () => server_1.default();
    await loadBFF();
    try {
        chokidar_1.default.watch(env.cacheDir).on("change", debounce_1.default(_evt => {
            loadBFF();
        }, 200, true));
        chokidar_1.default.watch(env.serverDir).on("all", debounce_1.default((_evt, _path) => {
            logging_1.logger.debug(`reprocess server file due to Event(${_evt})-${_path}`);
            build_1.transformDir(env.serverDir, env.cacheDir);
        }, 200, true));
    }
    catch (e) {
        console.error("Some error occur", e.stack);
    }
};
//# sourceMappingURL=dev.js.map