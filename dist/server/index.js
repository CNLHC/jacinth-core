#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../env/index");
const logging_1 = require("../util/logging");
const plugin_1 = __importDefault(require("./loader/plugin"));
const rest_1 = __importDefault(require("./loader/rest"));
let serverRunning = false;
let server = fastify_1.default({});
const dev = process.env.NODE_ENV !== "production";
exports.default = async () => {
    logging_1.logger.debug(`reload bff under ${dev ? "dev" : "production"} mode`);
    const env = index_1.getEnv();
    // if there already have one instance running, kill it and get a new one
    if (serverRunning) {
        server.close();
        server = fastify_1.default({});
    }
    server.register(require("fastify-multipart"));
    server.register(require("fastify-cookie"));
    server.register(require("fastify-session"), {
        cookieName: "sessionId",
        secret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        cookie: { secure: false },
        expires: 1800000,
    });
    server.register(plugin_1.default, { cacheDir: env.pluginCacheDir });
    server.after(() => {
        server.register(rest_1.default, { cacheDir: env.RESTCacheDir });
        server.register(require("./plugins/next"));
    });
    const address = await server.listen(env.port, env.host);
    logging_1.logger.info(chalk_1.default.green(`server available at ${address}`));
    serverRunning = true;
    return serverRunning;
};
//# sourceMappingURL=index.js.map