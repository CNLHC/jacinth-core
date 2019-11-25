import { TPlugin } from "../types/plugin";
import { gatherFile } from "../../util/path";
import { logger } from "../../util/logging";

type TOpt = {
  cacheDir: string;
  prefix: string;
};

const RESTFulLoader: TPlugin<TOpt> = async (app, opt, done) => {
  const gatherRESTRoutes = async () =>
    await gatherFile(opt.cacheDir, ["**", "!(_)*.js"], ["_*/**/*"]);
  const plugins = await gatherRESTRoutes();

  plugins.forEach(async e => {
    delete require.cache[require.resolve(e)];
    const mod = await import(e);
    logger.debug(`register custom REST api  in ${e}`);
    if (typeof mod === "function") app.register(mod);
    else if (typeof mod.default === "function") app.register(mod.default);
    else {
      const errMsg = `unknown REST api file in ${e}`;
      logger.error(errMsg);
      done(new Error(errMsg));
    }
  });
  done();
};

export default RESTFulLoader;
