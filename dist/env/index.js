var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function calRuntimeEnv(p) {
    const getAbsolute = (s) => path_1.default.resolve(process.cwd(), ...s);
    return Object.entries(p.relativePath).reduce((acc, [k, v]) => ({
        ...acc,
        [k]: getAbsolute(v),
    }), {});
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
const defaultEnv = {
    ...defaultPresetEnv,
    ...calRuntimeEnv(defaultPresetEnv),
};
let __env;
async function initEnv(args, overrideDefault) {
    Object.keys(args).forEach(key => args[key] === undefined ? delete args[key] : {});
    const tEnv = {
        ...{
            ...defaultPresetEnv,
            ...overrideDefault,
        },
        ...args,
    };
    __env = { ...tEnv, ...calRuntimeEnv(tEnv) };
}
exports.initEnv = initEnv;
function getEnv() {
    return __env === undefined ? defaultEnv : __env;
}
exports.getEnv = getEnv;
//# sourceMappingURL=index.js.map