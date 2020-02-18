var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const chalk_1 = __importDefault(require("chalk"));
const NextFormat = winston_1.format((info, opts) => {
    if (opts.yell) {
        info.message = info.message.toUpperCase();
    }
    else if (opts.whisper) {
        info.message = info.message.toLowerCase();
    }
    switch (info.level) {
        case "error":
            info.level = chalk_1.default `[ {red ${info.level}} ]`;
            break;
        case "info":
            info.level = chalk_1.default `[ {blue ${info.level}} ]`;
            break;
        default:
            info.level = chalk_1.default `[ {dim ${info.level}} ]`;
            break;
    }
    return info;
});
exports.logger = winston_1.default.createLogger({
    level: "debug",
    format: NextFormat(),
    //   defaultMeta: { service: 'user-service' },
    transports: [],
});
if (process.env.NODE_ENV !== "production") {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
else {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
    exports.logger.add(new winston_1.default.transports.File({ filename: "error.log", level: "error" }));
    exports.logger.add(new winston_1.default.transports.File({ filename: "combined.log" }));
}
//# sourceMappingURL=index.js.map