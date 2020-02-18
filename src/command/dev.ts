import chokidar from "chokidar";
import debounce from "debounce";
import preCheck from "../util/check";
import { initEnv, getEnv } from "../env";
import { transformDir, transformFile } from "../util/build";
import { logger } from "../util/logging";
import server from "../server";
import del from "del";
import fs from "fs";

type IArgs = any;
export default async (args: IArgs) => {
  await preCheck({ command: "dev" });
  await initEnv(args);
  const env = getEnv();
  const loadBFF = debounce(
    async () => {
      return await server();
    },
    200,
    true
  );
  const transformAll = debounce(
    async () => {
      await transformDir(env.serverDir, env.cacheDir);
    },
    200,
    true
  );

  const transformSingle = debounce(
    async (_path: string) => {
      logger.debug(`transform single file (${_path})`);
      await transformFile(env.serverDir, _path, env.cacheDir);
    },
    200,
    true
  );

  const removeCompiledPath = debounce(async (_path: string) => {
    logger.debug(`remove file ${_path}`);
    if (fs.lstatSync(_path).isFile) {
      const ingredients = _path.split(".");
      if (ingredients.length > 1)
        await del([...ingredients.slice(0, ingredients.length), ".*"].join(""));
    }
    await del(_path);
  });

  logger.debug("first build");
  await transformAll();
  await loadBFF();

  try {
    chokidar.watch(env.cacheDir).on("change", loadBFF);
    chokidar
      .watch(env.serverDir)
      .on("change", transformSingle)
      .on("add", transformSingle)
      .on("unlink", removeCompiledPath)
      .on("unlinkDir", removeCompiledPath);
  } catch (e) {
    console.error("Some error occur", (e as Error).stack);
  }
};
