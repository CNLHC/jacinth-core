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
const path_1 = __importDefault(require("path"));
function calRuntimeEnv(p) {
    const getAbsolute = (s) => path_1.default.resolve(process.cwd(), ...s);
    return Object.entries(p.relativePath).reduce((acc, [k, v]) => (Object.assign(Object.assign({}, acc), { [k]: getAbsolute(v) })), {});
}
const defaultPresetEnv = {
    port: 3002,
    host: "localhost",
    relativePath: {
        cacheDir: [".jacinth"],
        RESTCacheDir: [".jacinth", "rest"],
        pluginCacheDir: [".jacinth", "plugin"],
        serverDir: ["server"],
        serverTsConfPath: ["server", "tsconfig.json"],
        distDir: ["public"],
        rootDir: [],
        nextPath: [".next"],
    },
};
const defaultEnv = Object.assign(Object.assign({}, defaultPresetEnv), calRuntimeEnv(defaultPresetEnv));
let __env;
function initEnv(args, overrideDefault) {
    return __awaiter(this, void 0, void 0, function* () {
        Object.keys(args).forEach(key => args[key] === undefined ? delete args[key] : {});
        const tEnv = Object.assign(Object.assign({}, Object.assign(Object.assign({}, defaultPresetEnv), overrideDefault)), args);
        __env = Object.assign(Object.assign({}, tEnv), calRuntimeEnv(tEnv));
    });
}
exports.initEnv = initEnv;
function getEnv() {
    return __env === undefined ? defaultEnv : __env;
}
exports.getEnv = getEnv;
//# sourceMappingURL=index.js.map