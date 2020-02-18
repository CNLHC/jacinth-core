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
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = __importDefault(require("chokidar"));
const debounce_1 = __importDefault(require("debounce"));
const check_1 = __importDefault(require("../util/check"));
const env_1 = require("../env");
const build_1 = require("../util/build");
const logging_1 = require("../util/logging");
const server_1 = __importDefault(require("../server"));
const util_1 = require("util");
const del_1 = __importDefault(require("del"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const lstat = util_1.promisify(fs_1.default.lstat);
exports.default = (args) => __awaiter(this, void 0, void 0, function* () {
    yield check_1.default({ command: "dev" });
    yield env_1.initEnv(args);
    const env = env_1.getEnv();
    const loadBFF = debounce_1.default(() => __awaiter(this, void 0, void 0, function* () {
        return yield server_1.default();
    }), 200, true);
    const transformAll = debounce_1.default(() => __awaiter(this, void 0, void 0, function* () {
        yield build_1.transformDir(env.serverDir, env.cacheDir);
    }), 200, true);
    const transformSingle = debounce_1.default((_path) => __awaiter(this, void 0, void 0, function* () {
        yield build_1.transformFile(env.serverDir, _path, env.cacheDir);
    }), 200, true);
    const removeCompiledPath = debounce_1.default((fp) => __awaiter(this, void 0, void 0, function* () {
        logging_1.logger.debug(`remove detected on ${fp}`);
        const relFP = path_1.default.relative(env.serverDir, fp);
        logging_1.logger.debug(`relative fp ${relFP}`);
        const expiredFP = path_1.default.resolve(env.cacheDir, relFP);
        const fileStat = yield lstat(expiredFP);
        if (fileStat.isFile()) {
            logging_1.logger.debug(`remove expired file ${expiredFP}`);
            const ingredients = expiredFP.split(".");
            if (ingredients.length > 1)
                yield del_1.default([...ingredients.slice(0, ingredients.length), ".*"].join(""));
        }
        else {
            // to del a directory ,append a slash behind the fp
            logging_1.logger.debug(`remove expired directory ${expiredFP}`);
            yield del_1.default(`${expiredFP}/`, {});
        }
    }));
    logging_1.logger.debug("Initially build the server side file");
    yield transformAll();
    yield loadBFF();
    try {
        chokidar_1.default.watch(env.cacheDir).on("change", loadBFF);
        chokidar_1.default
            .watch(env.serverDir)
            .on("change", transformSingle)
            .on("add", transformSingle)
            .on("unlink", removeCompiledPath)
            .on("unlinkDir", removeCompiledPath);
    }
    catch (e) {
        console.error("Some error occur", e.stack);
    }
});
//# sourceMappingURL=dev.js.map