import webpack from "webpack";
import path from "path";
import { getJacinthRoot } from "../util/path";
const withCSS = require("@zeit/next-css");
const localDep = (loader: string) =>
  path.join(getJacinthRoot(), "node_modules", loader);

const localLoaderList: string[] = [];
const localRuntimeList: string[] = [];

export default withCSS({
  // @ts-ignore
  webpack(config: webpack.Configuration, ctx: any) {
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
        ...localLoaderList.reduce(
          (acc, cur) => ({ ...acc, [cur]: localDep(cur) }),
          {}
        ),
      },
    };
    return config;
  },
});
