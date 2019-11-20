"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("./path");
const chalk_1 = __importDefault(require("chalk"));
const del_1 = __importDefault(require("del"));
const env_1 = require("../env");
const logging_1 = require("./logging");
function preCheck(ctx) {
    var _a;
    const cwd = process.cwd();
    const env = env_1.getEnv();
    if (((_a = ctx) === null || _a === void 0 ? void 0 : _a.command) === "dev") {
        logging_1.logger.debug("clean the cache dir");
        del_1.default(env.cacheDir);
    }
    path_1.getPagesDir(cwd).then(e => {
        if (!e) {
            console.error(chalk_1.default.red("can not find pages dir"));
            process.exit(1);
        }
    });
    path_1.getServerDir(cwd).then(e => {
        if (!e) {
            console.error(chalk_1.default.red("can not find server dir"));
            process.exit(1);
        }
    });
}
exports.default = preCheck;
//# sourceMappingURL=check.js.map