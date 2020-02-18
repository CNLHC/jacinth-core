var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const path_2 = require("../util/path");
const withCSS = require("@zeit/next-css");
const localDep = (loader) => path_1.default.join(path_2.getJacinthRoot(), "node_modules", loader);
const localLoaderList = [];
const localRuntimeList = [];
exports.default = withCSS({
    // @ts-ignore
    webpack(config, ctx) {
        // @ts-ignore
        const { buildId, dev, isServer, defaultLoaders, webpack } = ctx;
        config?.module?.rules &&
            config.module.rules.push({
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 32768,
                        },
                    },
                ],
            });
        config.resolve = {
            ...config.resolve,
            alias: {
                ...config.resolve?.alias,
                ...localRuntimeList.reduce((a, c) => ({ ...a, [c]: localDep(c) }), {}),
            },
        };
        config.resolveLoader = {
            ...config.resolveLoader,
            alias: {
                ...config.resolveLoader?.alias,
                ...localLoaderList.reduce((acc, cur) => ({ ...acc, [cur]: localDep(cur) }), {}),
            },
        };
        return config;
    },
});
//# sourceMappingURL=next.config.js.map