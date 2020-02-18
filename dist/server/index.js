#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fastify_1 = __importDefault(require("fastify"));
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../env/index");
const logging_1 = require("../util/logging");
const plugin_1 = __importDefault(require("./loader/plugin"));
const rest_1 = __importDefault(require("./loader/rest"));
const path_1 = __importDefault(require("path"));
let serverRunning = false;
let server = fastify_1.default({
    pluginTimeout: 100000,
});
const dev = process.env.NODE_ENV !== "production";
exports.default = () => __awaiter(this, void 0, void 0, function* () {
    logging_1.logger.debug(`reload bff under ${dev ? "dev" : "production"} mode`);
    const env = index_1.getEnv();
    // if there already have one instance running, kill it and get a new one
    if (serverRunning) {
        server.close();
        server = fastify_1.default({});
    }
    server.register((yield Promise.resolve().then(() => __importStar(require("fastify-multipart")))).default);
    const pluginCacheDir = dev
        ? env.pluginCacheDir
        : path_1.default.resolve(env.distDir, "plugin");
    server.register(plugin_1.default, { cacheDir: pluginCacheDir });
    server.after(() => __awaiter(this, void 0, void 0, function* () {
        const RESTCacheDir = dev
            ? env.RESTCacheDir
            : path_1.default.resolve(env.distDir, "rest");
        server.register(rest_1.default, { cacheDir: RESTCacheDir, prefix: "/api" });
        server.register((yield Promise.resolve().then(() => __importStar(require("./plugins/next")))).default);
    }));
    const address = yield server.listen(env.port, env.host);
    logging_1.logger.info(chalk_1.default.green(`server available at ${address}`));
    serverRunning = true;
    return serverRunning;
});
//# sourceMappingURL=index.js.map