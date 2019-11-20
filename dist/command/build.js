"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = __importDefault(require("../util/check"));
const build_1 = __importDefault(require("next/dist/build"));
const env_1 = require("../env");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logging_1 = require("../util/logging");
const build_2 = require("../util/build");
const util_1 = require("util");
const del_1 = __importDefault(require("del"));
const mv = util_1.promisify(fs_1.default.rename);
exports.default = async (args) => {
    check_1.default();
    env_1.initEnv(args);
    const env = env_1.getEnv();
    fs_1.default.mkdirSync(env.distDir, {
        recursive: true,
    });
    build_2.transformDir(env.serverDir, env.distDir).then(() => logging_1.logger.info("Server Build Complete"));
    const nextDistDir = path_1.default.resolve(env.distDir, ".next");
    await del_1.default(nextDistDir);
    await build_1.default(env.rootDir);
    await mv(env.nextPath, nextDistDir);
    logging_1.logger.info("Client Build Complete");
};
//# sourceMappingURL=build.js.map