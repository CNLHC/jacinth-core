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
const NextSSR = fastify_plugin_1.default(async function (app, _opts, done) {
    if (!__devCacheFlag)
        await nextApp.prepare();
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
exports.default = NextSSR;
//# sourceMappingURL=next.js.map