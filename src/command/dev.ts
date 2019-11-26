import chokidar from "chokidar";
import debounce from "debounce";
import preCheck from "../util/check";
import { initEnv, getEnv } from "../env";
import { transformDir } from "../util/build";
import { logger } from "../util/logging";
import server from "../server";

type IArgs = any;
export default async (args: IArgs) => {
  await preCheck({ command: "dev" });
  await initEnv(args);
  const env = getEnv();
  const loadBFF = debounce(async () => {
    return await server();
  }, 200, true);
  const transform = debounce(
    async (_evt: string, _path: string) => {
      logger.debug(`transform server file due to Event(${_evt})-${_path}`);
      await transformDir(env.serverDir, env.cacheDir);
    },
    200,
    true
  );

  logger.debug("first build");
  await transform(env.serverDir, env.cacheDir);
  await loadBFF();

  try {
    chokidar.watch(env.cacheDir).on("change", loadBFF);
    chokidar.watch(env.serverDir).on("all", transform);
  } catch (e) {
    console.error("Some error occur", (e as Error).stack);
  }
};
