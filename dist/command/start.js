"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = __importDefault(require("../util/check"));
const env_1 = require("../env");
const server_1 = __importDefault(require("../server"));
const logging_1 = require("../util/logging");
exports.default = async (args) => {
    check_1.default();
    env_1.initEnv(args, { port: 3000, host: "0.0.0.0" });
    process.env.NODE_ENV = "production";
    server_1.default()
        .then(() => logging_1.logger.info("Server Start"))
        .catch(err => {
        logging_1.logger.error("Server exit unexpectedly", err);
        process.exit(-1);
    });
};
//# sourceMappingURL=start.js.map