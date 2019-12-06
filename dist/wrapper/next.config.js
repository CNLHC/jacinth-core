"use strict";
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
        var _a, _b, _c, _d;
        // @ts-ignore
        const { buildId, dev, isServer, defaultLoaders, webpack } = ctx;
        ((_b = (_a = config) === null || _a === void 0 ? void 0 : _a.module) === null || _b === void 0 ? void 0 : _b.rules) &&
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
        config.resolve = Object.assign(Object.assign({}, config.resolve), { alias: Object.assign(Object.assign({}, (_c = config.resolve) === null || _c === void 0 ? void 0 : _c.alias), localRuntimeList.reduce((a, c) => (Object.assign(Object.assign({}, a), { [c]: localDep(c) })), {})) });
        config.resolveLoader = Object.assign(Object.assign({}, config.resolveLoader), { alias: Object.assign(Object.assign({}, (_d = config.resolveLoader) === null || _d === void 0 ? void 0 : _d.alias), localLoaderList.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: localDep(cur) })), {})) });
        return config;
    },
});
//# sourceMappingURL=next.config.js.map