import { TPlugin } from "../types/plugin";
import { gatherFile } from "../../util/path";
import { logger } from "../../util/logging";

type TOpt = {
  cacheDir: string;
};

const RESTFulLoader: TPlugin<TOpt> = async (app, opt, done) => {
  const gatherRESTRoutes = async () => await gatherFile(opt.cacheDir, ["*.js"]);
  const plugins = await gatherRESTRoutes();

  plugins.forEach(async e => {
    delete require.cache[require.resolve(e)];
    const mod = await import(e);
    const opt = {
      prefix: "/api",
    };
    logger.debug(`register custom REST api  in ${e}`);
    if (typeof mod === "function") app.register(mod, opt);
    else if (typeof mod.default === "function") app.register(mod.default, opt);
    else {
      const errMsg = `unknown REST api file in ${e}`;
      logger.error(errMsg);
      done(new Error(errMsg));
    }
  });
  done();
};

export default RESTFulLoader;
