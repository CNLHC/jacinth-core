import fp from "fastify-plugin";
import { TPlugin } from "../types/plugin";
import { gatherFile } from "../../util/path";
import { logger } from "../../util/logging";

type TOpt = {
  cacheDir: string;
};

const RESTFulLoader: TPlugin<TOpt> = async (app, opt, done) => {
  const gatherRESTRoutes = async () =>
    await gatherFile(opt.cacheDir, ["**", "!(_)*.js"], ["_*/**/*"]);
  const plugins = await gatherRESTRoutes();

  plugins.forEach(async e => {
    delete require.cache[require.resolve(e)];
    const getMod = async () => {
      try {
        return await import(e);
      } catch (e) {
        logger.error(`plugin in ${e} can not be load, cb:`, e);
        return undefined;
      }
    };
    const mod = await getMod();
    if (!mod) {
      const errMsg = `can not load plugin due to plugin import error: ${e}`;
      logger.error(errMsg);
      done(new Error(errMsg));
      return;
    }

    logger.debug(`register custom plugin  in ${e}`);

    try {
      if (typeof mod === "function") app.register(fp(mod), opt);
      else if (typeof mod.default === "function")
        app.register(fp(mod.default), opt);
      else {
        const errMsg = `unknown plugin file in ${e}`;
        logger.error(errMsg);
        done(new Error(errMsg));
      }
    } catch (e) {
      const errMsg = `can not load plugin due to register error: ${e}`;
      logger.error(errMsg);
      done(new Error(errMsg));
      return;
    }
  });
  done();
  return app;
};

export default fp(RESTFulLoader);
