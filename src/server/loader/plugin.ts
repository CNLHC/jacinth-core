import fp from "fastify-plugin";
import { TPlugin } from "../types/plugin";
import { gatherFile } from "../../util/path";
import { logger } from "../../util/logging";

type TOpt = {
  cacheDir: string;
};

const RESTFulLoader: TPlugin<TOpt> = async (app, opt, done) => {
  const gatherRESTRoutes = async () =>
    await gatherFile(opt.cacheDir, ["**", "!(_)*.js"]);
  const plugins = await gatherRESTRoutes();

  plugins.forEach(e => {
    delete require.cache[require.resolve(e)];
    const mod = require(e);
    logger.debug(`register custom plugin  in ${e}`);
    if (typeof mod === "function") app.register(fp(mod), opt);
    else if (typeof mod.default === "function")
      app.register(fp(mod.default), opt);
    else {
      const errMsg = `unknown REST plugin file in ${e}`;
      logger.error(errMsg);
      done(new Error(errMsg));
    }
  });
  done();
  return app;
};

export default fp(RESTFulLoader);
