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
const next_1 = __importDefault(require("next"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const next_config_1 = __importDefault(require("../../wrapper/next.config"));
const env_1 = require("../../env");
const env = env_1.getEnv();
const dev = process.env.NODE_ENV !== "production";
const nextApp = next_1.default({
    dev,
    conf: next_config_1.default,
    dir: dev ? process.cwd() : env.distDir,
});
let __devCacheFlag = false;
const NextSSR = fastify_plugin_1.default(function (app, _opts, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!__devCacheFlag)
            yield nextApp.prepare();
        const nextHandler = nextApp.getRequestHandler();
        if (dev) {
            app.get("/_next/*", (req, reply) => {
                return nextHandler(req.req, reply.res).then(() => {
                    reply.sent = true;
                });
            });
        }
        app.all("/*", (req, reply) => {
            req.req.session = req.session;
            return nextHandler(req.req, reply.res).then(() => {
                reply.sent = true;
            });
        });
        if (dev)
            __devCacheFlag = true;
        done();
    });
});
exports.default = NextSSR;
//# sourceMappingURL=next.js.map