import chokidar from "chokidar";
import debounce from "debounce";
import preCheck from "../util/check";
import { initEnv, getEnv } from "../env";
import { transformDir } from "../util/build";
import { logger } from "../util/logging";
import server from "../server";

type IArgs = any;
export default async (args: IArgs) => {
  preCheck({ command: "dev" });
  initEnv(args);
  const env = getEnv();
  const loadBFF: () => void = () => server();

  await loadBFF();

  try {
    chokidar.watch(env.cacheDir).on(
      "change",
      debounce(
        _evt => {
          loadBFF();
        },
        200,
        true
      )
    );

    chokidar.watch(env.serverDir).on(
      "all",
      debounce(
        (_evt, _path) => {
          logger.debug(`reprocess server file due to Event(${_evt})-${_path}`);
          transformDir(env.serverDir, env.cacheDir);
        },
        200,
        true
      )
    );
  } catch (e) {
    console.error("Some error occur", (e as Error).stack);
  }
};
